import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function registerUser(req: Request, res: Response) {
    try {
        const { username, email, password } = req.body;

        // lots of checks
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                error: "Missing username or password"
            });
        }
        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({
                success: false,
                error: "Missing username, email, or password"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid email format"
            });
        }
        if (typeof password != "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 8 characters"
            });
        }
        if (typeof username != "string" || username.length < 3) {
            return res.status(400).json({
                success: false,
                error: "Username must be at least 3 characters"
            });
        }

        // check if username already exists
        const alreadyExistingUser = await prisma.user.findUnique({
            where: { username: username }
        });
        if (alreadyExistingUser) return res.status(400).json({ 
            success: false,
            error: "A user with that username already exists"
        });

        // check if email already exists
        const alreadyExistingEmail = await prisma.user.findUnique({
            where: { email: email }
        });
        if (alreadyExistingEmail) return res.status(400).json({ 
            success: false,
            error: "A user with that email already exists"
        });

        // hash the password with 8 salt rounds before adding it to the database
        // surprisingly, storing raw passwords in the database is probably not a good idea! :O
        const passwordHash = await bcrypt.hash(password, 8);

        // create User
        const newUser = await prisma.user.create({
            data: { 
                username: username,
                email: email,
                password_hash: passwordHash
            }
        });

        // create UserPermission
        await prisma.userPermission.create({
            data: {
                user_id: newUser.user_id
            }
        });

        // // create UserPosts
        // await prisma.userPosts.create({
        //     data: {
        //         user_id: newUser.user_id,
        //         username: newUser.username
        //     }
        // });

        // create UserComments
        // await prisma.userComments.create({
        //     data: {
        //         user_id: newUser.user_id,
        //         username: newUser.username
        //     }
        // });

        res.status(201).json({
            success: true,
            message: "Successfully created user!",
            user_id: newUser.user_id
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}