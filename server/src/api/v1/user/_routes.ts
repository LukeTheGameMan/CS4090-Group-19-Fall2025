import { Router } from 'express';
import { registerUser, loginUser } from './_controller';

const router = Router();

// register endpoints
router.post("/register", registerUser);
router.post("/login", loginUser)
export default router;