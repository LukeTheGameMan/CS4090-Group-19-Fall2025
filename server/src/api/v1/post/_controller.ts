import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*
    function: createPost
    creates a Post with user_id from token, title, and content
*/
export async function createPost(req: Request, res: Response) {
    try {
        const { title, content } = req.body;

        const userID = (req as any).user.user_id;

        // create post
        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                user_id: userID
            }
        });

        // // create PostLikes
        // await prisma.postLikes.create({
        //     data: {
        //         post_id: post.post_id
        //     }
        // });

        // // create PostDislikes
        // await prisma.postDislikes.create({
        //     data: {
        //         post_id: post.post_id
        //     }
        // });

        // // create PostComments
        // await prisma.postComments.create({
        //     data: {
        //         post_id: post.post_id
        //     }
        // });

        // // update UserPosts
        // await prisma.userPosts.update({
        //     where: { user_id: userID },
        //     data: {
        //         posts_created: { push: post.post_id }
        //     }
        // })
    
        res.status(201).json({
            success: true,
            message: "Successfully created post!",
            post_id: post.post_id
        });
    
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }

}

/*
    function: findManyPosts
    returns a json list of posts
*/
export async function findManyPosts(req: Request, res: Response) {
    try {
        // get params from GET passed in browser url
        const queryRaw = req.query.query as string | undefined;
        const filter = (req.query.filter) as string || "recent"; // could be recent or liked
        const pageNum = parseInt(req.query.page as string) || 1; // default to page 1
        
        const postsPerPage = 10; // could maybe let the user set this but oh well

        let search = {}; // construct search obj for where condition
        if (queryRaw && queryRaw.trim() !== '') {
            const words = queryRaw.trim().split(/\s+/); // browsers use + for spaces
            
            // if theres a search term, construct a search obj
            // for posts with titles/content that contain the keywords
            search = {
                OR: [
                ...words.map(word => ({ title: { contains: word, mode: 'insensitive' } })),
                ...words.map(word => ({ content: { contains: word, mode: 'insensitive' } }))
                ]
            };
        }

        // construct order obj for orderby condition
        let order = {};
        if (filter === "liked") {
            order = { postLikes: { _count: 'desc' }};
        } else {
            order = { post_id: 'desc' };
        }

        const posts = await prisma.post.findMany({
            where: search,
            orderBy: order,
            skip: (pageNum - 1) * postsPerPage,
            take: postsPerPage,
            include: { // get the counts for postlikes, postdislikes, and comments
                user: { select: { username: true  } },
                _count: {
                    select: {
                        postLikes: true,
                        postDislikes: true,
                        comments: true
                    }
                }
            }
        });

        const postlist = posts.map(post => ({
            post_id: post.post_id,
            title: post.title,
            username: post.user?.username || "Unknown User",
            likes_count: post._count.postLikes,
            dislikes_count: post._count.postDislikes,
            comments: post._count.comments
        }));

        res.status(200).json({
            success: true,
            posts: postlist
        });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}