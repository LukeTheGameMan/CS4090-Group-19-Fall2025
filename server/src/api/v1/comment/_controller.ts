import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*
    function: createComment
    creates a Comment with user_id from token, post_id of post, and content
*/
export async function createComment(req: Request, res: Response) {
    try {
        const { post_id, content } = req.body;

        const userID = (req as any).user.user_id;

        // check if post_id exists
        const post = await prisma.post.findFirst({
            where: { post_id: post_id }
        });
        // if the post doesnt exist
        if (!post) {
            return res.status(404).json({
                success: false,
                error: "Post not found"
            });
        }

        // create comment
        const comment = await prisma.comment.create({
            data: {
                content: content,
                user: {
                    connect: { user_id: userID }
                },
                post: {
                    connect: { post_id: post_id }
                },
            }
        });

        res.status(201).json({
            success: true,
            message: "Successfully created comment!",
            comment_id: comment.comment_id
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
    function: findManyComments
    returns a json list of comments from a post_id
*/
export async function findManyComments(req: Request, res: Response) {
    try {
        // get params from GET passed in browser url
        const postID = parseInt(req.query.post_id as string) || -1; // -1 to trigger failsafe
        const filter = (req.query.filter) as string || "recent"; // could be recent or liked
        const pageNum = parseInt(req.query.page as string) || 1; // default to page 1
        
        const commentsPerPage = 20; // could maybe let the user set this but oh well

        // construct order obj for orderby condition
        let order: any[] = [];
        if (filter === "liked") {
            order.push({ commentLikes: { _count: 'desc' } });
        }
            order.push({ comment_id: 'desc' }); // always sort by comment_id for ties
        

        const comments = await prisma.comment.findMany({
            where: { post_id: postID },
            orderBy: order,
            skip: (pageNum - 1) * commentsPerPage,
            take: commentsPerPage,
            include: { 
                user: { select: { username: true } },
                _count: { // get the counts for commentlikes, and commentdislikes
                    select: {
                        commentLikes: true,
                        commentDislikes: true
                    }
                }
            }
        });

        const commentlist = comments.map(comment => ({
            comment_id: comment.comment_id,
            username: comment.user?.username || "Unknown User", // fallback in case for some reason the user cant be found
            content: comment.content,
            likes_count: comment._count.commentLikes,
            dislikes_count: comment._count.commentDislikes,
            creation: comment.creation_date
        }));

        res.status(200).json({
            success: true,
            comments: commentlist
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
    function: voteComment
    likes a specified comment_id given user_id from token
*/
export async function voteComment(req: Request, res: Response) {
    try {
        const { comment_id, like } = req.body;

        const userID = (req as any).user.user_id;
        const commentID = Number(comment_id);
        const likeT = Number(like);

        if (!Number.isInteger(commentID) || (likeT !== 0 && likeT !== 1)) {
            return res.status(400).json({
                success: false,
                error: "Invalid input"
            });
        }

        // check if comment_id exists
        const comment = await prisma.comment.findFirst({
            where: { comment_id: commentID }
        });
        // if the post doesnt exist
        if (!comment) {
            return res.status(404).json({
                success: false,
                error: "Comment not found"
            });
        }
        
        // check if like or dislike already exists
        const likedcommentcheck = await prisma.commentLike.findFirst({
            where: { 
                comment_id: commentID,
                user_id: userID
            }
        });

        const dislikecommentcheck = await prisma.commentDislike.findFirst({
            where: {
                comment_id: commentID,
                user_id: userID
            }
        });

        if (likedcommentcheck || dislikecommentcheck) {
            return res.status(409).json({
                success: false,
                error: "Already liked/disliked this comment"
            });
        }

        // create like or dislike
        if (likeT == 1) {
            const commentlike = await prisma.commentLike.create({
                data: {
                    comment_id: commentID,
                    user_id: userID
                }
            });
        } else if (likeT == 0) {
            const commentdislike = await prisma.commentDislike.create({
                data: {
                    comment_id: commentID,
                    user_id: userID
                }
            });
        } else {
            return res.status(400).json({
                success: false,
                error: "Error liking/disliking comment"
            });
        }
        
        res.status(201).json({
            success: true,
            message: "Successfully liked/disliked comment!",
            comment_id: commentID
        });
    
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}