import { Router } from 'express';
import { createComment, getComments } from './_controller';

const router = Router();

// register endpoints
router.post("/create", createComment);
router.get("/findmany?:post_id&:page", getComments);

export default router;