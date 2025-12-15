import jwt from 'jsonwebtoken';

/*
    function: createToken
    creates the signed token for the user
*/
export function createToken(user_id: number) {
    return jwt.sign({user_id}, process.env.JWT_SECRET!, {expiresIn: "24h"}); // Token expires in 24 hours.
}