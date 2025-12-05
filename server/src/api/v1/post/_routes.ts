import { Router } from 'express';
import { createPost, findManyPosts } from './_controller';
import { requireAuth } from '../auth/requireAuth';

const router = Router();

// register endpoints
router.post("/createpost", requireAuth, createPost);
router.get("/viewposts", findManyPosts);

export default router;