"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controller_1 = require("./_controller");
const router = (0, express_1.Router)();
// register endpoints
router.post("/register", _controller_1.registerUser);
exports.default = router;
//# sourceMappingURL=_routes.js.map