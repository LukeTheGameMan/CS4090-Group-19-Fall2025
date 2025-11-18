"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _controller_1 = require("./_controller");
const requireAuth_1 = require("./requireAuth");
const router = (0, express_1.Router)();
// register endpoints
router.post("/login", _controller_1.loginUser);
router.get("/me", requireAuth_1.requireAuth, _controller_1.getCurrentUser);
exports.default = router;
//# sourceMappingURL=_routes.js.map