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

        // create PostLikes
        await prisma.postLikes.create({
            data: {
                post_id: post.post_id
            }
        });

        // create PostDislikes
        await prisma.postDislikes.create({
            data: {
                post_id: post.post_id
            }
        });

        // create PostComments
        await prisma.postComments.create({
            data: {
                post_id: post.post_id
            }
        });

        // update UserPosts
        await prisma.userPosts.update({
            where: { user_id: userID },
            data: {
                posts_created: { push: post.post_id }
            }
        })
    
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