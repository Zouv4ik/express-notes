"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "HELLO");
        req.token = decoded;
        next();
    }
    catch (err) {
        res.clearCookie("token");
        res.redirect("/");
    }
};
exports.userMiddleware = userMiddleware;
