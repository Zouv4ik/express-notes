"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.Router)();
const cookieParser = require('cookie-parser');
dotenv_1.default.config();
app.use(body_parser_1.default.urlencoded());
app.use(body_parser_1.default.json());
app.use(cookieParser());
const generateAccessToken = (id, username) => {
    const payload = {
        id,
        username
    };
    return jsonwebtoken_1.default.sign(payload, "HELLO", { expiresIn: 24 });
};
app.post('/api/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const used = yield prisma.user.findUnique({
        where: {
            username: req.body.username
        }
    });
    console.log(used);
    if (used) {
        res.send("Имя уже занято.");
        return res.redirect('/register');
    }
    const user = yield prisma.user.create({
        data: {
            username: req.body.username,
            password: req.body.password
        },
    });
    return res.redirect('/login');
}));
app.post('/api/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const foundUser = yield prisma.user.findUnique({ where: { username: req.body.username } });
    if (!foundUser) {
        return res.send('Username is not correct');
    }
    if ((foundUser === null || foundUser === void 0 ? void 0 : foundUser.password) != req.body.password) {
        return res.send('Invalid password');
    }
    const token = generateAccessToken(foundUser === null || foundUser === void 0 ? void 0 : foundUser.id, foundUser === null || foundUser === void 0 ? void 0 : foundUser.username);
    res.cookie("token", token, {
        httpOnly: true
    });
    return res.redirect('/notes');
}));
app.post('/api/note', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const note = yield prisma.user.update({
        where: {
            username: req.body.owner
        },
        data: {
            notes: {
                create: {
                    title: req.body.title,
                    content: req.body.content
                }
            }
        }
    });
    return res.redirect('/notes');
}));
app.post('/api/getnotes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gotNotes = yield prisma.user.findUnique({
        where: {
            id: parseInt(req.body.id)
        },
        include: {
            notes: true
        }
    });
    return res.send(gotNotes === null || gotNotes === void 0 ? void 0 : gotNotes.notes);
}));
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield prisma.user.findMany());
}));
module.exports = app;
