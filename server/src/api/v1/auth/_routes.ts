import { Router } from 'express';
import { loginUser, getCurrentUser } from './_controller';
import { requireAuth } from './requireAuth';

const router = Router();

// register endpoints
router.post("/login", loginUser);
router.get("/me", requireAuth, getCurrentUser);

export default router;