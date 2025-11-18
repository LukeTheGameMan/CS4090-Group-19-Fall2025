"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createToken_1 = require("./createToken");
const prisma = new client_1.PrismaClient();
/*
    function: loginUser
    checks the username, password (hashed). if matching, then create a token for them.
*/
async function loginUser(req, res) {
    const { username, password } = req.body;
    // compare usernames
    const user = await prisma.user.findUnique({
        where: { username: username }
    });
    if (!user)
        return res.status(404).json({
            success: false,
            error: "User not found"
        });
    // compare passwords
    const validPassword = await bcrypt_1.default.compare(password, user.password_hash);
    if (!validPassword)
        return res.status(401).json({
            success: false,
            error: "Invalid password. Try again."
        });
    // create jwt token
    const token = (0, createToken_1.createToken)(user.user_id);
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
async function getCurrentUser(req, res) {
    if (!req.user)
        return res.status(401).json({
            success: false,
            error: "Not authenticated"
        });
    const userID = req.user.user_id;
    const user = await prisma.user.findUnique({
        where: { user_id: userID }
    });
    res.json({ user });
}
//# sourceMappingURL=_controller.js.map