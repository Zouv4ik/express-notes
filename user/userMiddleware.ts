import { NextFunction, Request, Response } from 'express'
import jwt, {JwtPayload} from 'jsonwebtoken'

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, "HELLO");
        (req as CustomRequest).token = decoded;
        next(); 
    } catch(err) {
        res.clearCookie("token");
        res.redirect("/")
    }
}