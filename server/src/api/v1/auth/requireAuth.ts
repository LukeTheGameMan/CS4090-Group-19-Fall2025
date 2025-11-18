import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/*
    function: validateUser
    checks to see if the user is authenticated by getting their JWT
    if authenticated, then call next_function()
*/
export function requireAuth(req: Request, res: Response, next_function: NextFunction) {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({
        success: false,
        error: "Unauthorized"
    });

    try { // req is authenticated
        const payload = jwt.verify(token, process.env.JWT_SECRET!); // verify token against secret
        (req as any).user = payload;
        next_function();
    } catch { // req is not authenticated :(
        return res.status(403).json({
            success: false,
            error: "Invalid token"
        });
    }
}