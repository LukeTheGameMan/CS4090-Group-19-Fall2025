"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/*
    function: createToken
    creates the signed token for the user
*/
function createToken(user_id) {
    return jsonwebtoken_1.default.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: "59s" }); // change expiresIn for testing lol!
}
//# sourceMappingURL=createToken.js.map