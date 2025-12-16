import { Router } from 'express';
import { registerUser } from './_controller';
import { checkDB } from '../_checkDB/check_db';

const router = Router();

// register endpoints
router.post("/register", checkDB, registerUser);

export default router;