import { Router } from 'express';
import { createPost, findManyPosts, getPost, votePost } from './_controller';
import { requireAuth } from '../auth/requireAuth';

const router = Router();

// register endpoints
router.post("/createpost", requireAuth, createPost);
router.post("/votepost", requireAuth, votePost);
router.get("/viewposts", findManyPosts);
router.get("/getpost", getPost)

export default router;