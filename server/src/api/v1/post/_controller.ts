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
                user: {
                    connect: { user_id: userID }
                }
            }
        });

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
        let order: any[] = [];
        if (filter === "liked") {
            order.push({ postLikes: { _count: 'desc' } });
        }
            order.push({ post_id: 'desc' }); // always sort by post_id for ties
        

        const posts = await prisma.post.findMany({
            where: search,
            orderBy: order,
            skip: (pageNum - 1) * postsPerPage,
            take: postsPerPage,
            include: { 
                user: { select: { username: true } },
                _count: { // get the counts for postlikes, postdislikes, and comments
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
            username: post.user?.username || "Unknown User", // fallback in case for some reason the user cant be found
            likes_count: post._count.postLikes,
            dislikes_count: post._count.postDislikes,
            comments_count: post._count.comments,
            creation: post.creation_date
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

/*
    function: getPost
    returns a post with the specified post_id
*/
export async function getPost(req: Request, res: Response) {
    try {
        const postID = parseInt(req.query.post_id as string) || -1;

        if (postID == -1) {
            return res.status(400).json({
                success: false,
                error: "Invalid request"
            });
        }

        const post = await prisma.post.findFirst({
            where: { post_id: postID },
            include: { 
                user: { select: { username: true } },
                _count: { // get the counts for postlikes, postdislikes, and comments
                    select: {
                        postLikes: true,
                        postDislikes: true,
                        comments: true
                    }
                }
            }
        });

        // if the post doesnt exist
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found"
            });
        }

        const postjson = {
            post_id: post.post_id,
            user_id: post.user_id,
            username: post.user?.username || "Unknown User",
            title: post.title,
            content: post.content,
            likes_count: post._count.postLikes,
            dislikes_count: post._count.postDislikes,
            comments_count: post._count.comments
        };

        res.status(200).json({
            success: true,
            post: postjson
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
    
    
}

/*
    function: votePost
    likes a specified post_id given user_id from token
*/
export async function votePost(req: Request, res: Response) {
    try {
        const { post_id, like } = req.body;

        const userID = (req as any).user.user_id;
        const postID = Number(post_id);
        const likeT = Number(like);

        if (!Number.isInteger(postID) || (likeT !== 0 && likeT !== 1)) {
            return res.status(400).json({
                success: false,
                error: "Invalid input"
            });
        }

        // check if post_id exists
        const post = await prisma.post.findFirst({
            where: { post_id: postID }
        });
        // if the post doesnt exist
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found"
            });
        }
        
        // check if like or dislike already exists
        const likedpostcheck = await prisma.postLike.findFirst({
            where: { 
                post_id: postID,
                user_id: userID
            }
        });

        const dislikepostcheck = await prisma.postDislike.findFirst({
            where: {
                post_id: postID,
                user_id: userID
            }
        });

        if (likedpostcheck || dislikepostcheck) {
            return res.status(409).json({
                success: false,
                error: "Already liked/disliked this post"
            });
        }

        // create like or dislike
        if (likeT == 1) {
            const postlike = await prisma.postLike.create({
                data: {
                    post_id: postID,
                    user_id: userID
                }
            });
        } else if (likeT == 0) {
            const postdislike = await prisma.postDislike.create({
                data: {
                    post_id: postID,
                    user_id: userID
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                error: "Error liking/disliking post"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "Successfully liked/disliked post!",
            post_id: postID
        });
    
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}