import { Router } from 'express';
import { createPost, findManyPosts, getPost, votePost } from './_controller';
import { requireAuth } from '../auth/requireAuth';
import { checkDB } from '../_checkDB/check_db';

const router = Router();

// register endpoints
router.post("/createpost", checkDB, requireAuth, createPost);
router.post("/votepost", checkDB, requireAuth, votePost);
router.get("/viewposts", checkDB, findManyPosts);
router.get("/getpost", checkDB, getPost)

export default router;