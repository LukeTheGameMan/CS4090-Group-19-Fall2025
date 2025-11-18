import { Router } from 'express';
import { registerUser } from './_controller'

const router = Router();

// register endpoints
router.post("/register", registerUser);

export default router;