"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const _routes_1 = __importDefault(require("./api/v1/auth/_routes"));
const _routes_2 = __importDefault(require("./api/v1/user/_routes"));
// create express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true })); // parse data from html <form> submissions 
app.use(express_1.default.static(path_1.default.join(__dirname, "../../web_dir"))); // know where to serve the .html files from
// register routes
app.use("/api/v1/auth", _routes_1.default);
app.use("/api/v1/user", _routes_2.default);
exports.default = app;
//# sourceMappingURL=app.js.map