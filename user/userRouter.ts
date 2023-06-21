import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import dotenv from 'dotenv'
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { userMiddleware } from "./userMiddleware";

const prisma = new PrismaClient();
const app: Router = Router();
const cookieParser = require('cookie-parser');

dotenv.config();
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
app.use(cookieParser())

const generateAccessToken = (id: any, username: any) => {
    const payload = {
        id,
        username
    }

    return jwt.sign(payload, "HELLO", {expiresIn:24})
}

app.post('/api/register', async (req, res) => {
    console.log(req.body)
    const used = await prisma.user.findUnique({
       where: {
            username: req.body.username
        }});
    console.log(used)
    if (used) {
        res.send("Имя уже занято.")
        return res.redirect('/register')
    } 
    const user = await prisma.user.create({
        data: {
            username: req.body.username,
            password: req.body.password
        },
    })
    return res.redirect('/login')
})

app.post('/api/login', async (req, res) => {
    console.log(req.body)
    const foundUser = await prisma.user.findUnique({where: {username: req.body.username}})
    if(!foundUser) {
        return res.send('Username is not correct')
    }
    if(foundUser?.password != req.body.password) {
       return res.send('Invalid password')
    }
    const token = generateAccessToken(foundUser?.id, foundUser?.username);
    res.cookie("token", token, {
        httpOnly: true
    })
    return res.redirect('/notes')
})

app.post('/api/note', async (req, res) => {
    console.log(req.body)
    const note = await prisma.user.update({
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
    })
    return res.redirect('/notes')
})

app.post('/api/getnotes', async (req, res) => {
    const gotNotes = await prisma.user.findUnique({
        where: {
            id: parseInt(req.body.id)
        },
        include: {
            notes: true
        }
    })
    return res.send(gotNotes?.notes)
})

app.get('/users', async (req, res) => {
    res.send(await prisma.user.findMany());
})

module.exports = app;