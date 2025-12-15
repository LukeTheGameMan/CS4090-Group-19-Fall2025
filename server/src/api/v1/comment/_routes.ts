import { Router } from 'express';
import { createComment, findManyComments, voteComment } from './_controller';
import { requireAuth } from '../auth/requireAuth';

const router = Router();

// register endpoints
router.post("/createcomment", requireAuth, createComment);
router.post("/votecomment", requireAuth, voteComment)
router.get("/viewcomments", findManyComments);

export default router;