"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
// load env variables
dotenv_1.default.config();
const port = process.env.PORT;
app_1.default.get('/', (req, res) => {
    res.redirect('/index.html');
});
app_1.default.get('/login', (req, res) => {
    res.redirect('/main.html');
});
app_1.default.get('/guest', (req, res) => {
    res.redirect('/main.html');
});
app_1.default.get('/signup', (req, res) => {
    res.redirect('/signup.html');
});
app_1.default.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map