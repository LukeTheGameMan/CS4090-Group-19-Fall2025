import { Router } from 'express';
import { createComment, findManyComments, voteComment } from './_controller';
import { requireAuth } from '../auth/requireAuth';
import { checkDB } from '../_checkDB/check_db';

const router = Router();

// register endpoints
router.post("/createcomment", checkDB, requireAuth, createComment);
router.post("/votecomment", checkDB, requireAuth, voteComment)
router.get("/viewcomments", checkDB, findManyComments);

export default router;