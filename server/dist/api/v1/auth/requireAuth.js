"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/*
    function: validateUser
    checks to see if the user is authenticated by getting their JWT
    if authenticated, then call next_function()
*/
function requireAuth(req, res, next_function) {
    const token = req.cookies?.token;
    if (!token)
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    try { // req is authenticated
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // verify token against secret
        req.user = payload;
        next_function();
    }
    catch { // req is not authenticated :(
        return res.status(403).json({
            success: false,
            error: "Invalid token"
        });
    }
}
//# sourceMappingURL=requireAuth.js.map