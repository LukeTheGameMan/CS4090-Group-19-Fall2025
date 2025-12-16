import { Router } from 'express';
import { loginUser, getCurrentUser } from './_controller';
import { requireAuth } from './requireAuth';
import { checkDB } from '../_checkDB/check_db';

const router = Router();

// register endpoints
router.post("/login", checkDB, loginUser);
router.get("/me", checkDB, requireAuth, getCurrentUser);

export default router;