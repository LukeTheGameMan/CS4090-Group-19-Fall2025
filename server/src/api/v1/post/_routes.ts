import { Router } from 'express';
import { createPost, findManyPosts, getPost } from './_controller';
import { requireAuth } from '../auth/requireAuth';

const router = Router();

// register endpoints
router.post("/createpost", requireAuth, createPost);
router.get("/viewposts", findManyPosts);
router.get("/getpost", getPost)

export default router;