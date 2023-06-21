"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userMiddleware_1 = require("./user/userMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.DEV_PORT;
app.use('/', require('./user/userRouter'));
app.set('view engine', 'pug');
app.get('/', (req, res) => {
    res.render('index.pug');
});
app.get('/register', (req, res) => {
    res.render('register.pug');
});
app.get('/login', (req, res) => {
    res.render('login.pug');
});
app.get('/notes', userMiddleware_1.userMiddleware, (req, res) => {
    res.render('notes.pug', { user: req.token });
});
app.listen(port, () => {
    console.log(`Listen on ${port}`);
});
//
