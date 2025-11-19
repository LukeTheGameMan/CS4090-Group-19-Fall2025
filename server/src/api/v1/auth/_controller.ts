import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createToken } from './createToken';

const prisma = new PrismaClient();

/*
    function: loginUser
    checks the username, password (hashed). if matching, then create a token for them.
*/
export async function loginUser(req: Request, res: Response) {
    const { username, password } = req.body;

    // compare usernames
    const user = await prisma.user.findUnique({
        where: { username: username }
    });
    if (!user) return res.status(404).json({
        success: false,
        error: "User not found"
    });

    // compare passwords
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({
        success: false,
        error: "Invalid password. Try again."
    });

    // create jwt token
    const token = createToken(user.user_id);

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({ 
        success: true,
        message: "Successfully logged in!"
    });
}

/*
    function: getCurrentUser
    created to test if the token works lol
*/
export async function getCurrentUser(req: Request, res: Response) {
    if (!(req as any).user) return res.status(401).json({
        success: false,
        error: "Not authenticated"
    });

    const userID = (req as any).user.user_id;
    const user = await prisma.user.findUnique({
        where: { user_id: userID },
        select: { 
            user_id: true,
            username: true,
            email: true,
            permission_level: true
        }
    });
    res.json({ user });
}