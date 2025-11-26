import { Router } from 'express';
import { createPost } from './_controller';
import { requireAuth } from '../auth/requireAuth';

const router = Router();

// register endpoints
router.post("/createpost", requireAuth, createPost);

export default router;