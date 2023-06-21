import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {CustomRequest, userMiddleware} from './user/userMiddleware'

dotenv.config()

const app: Express = express();
const port = process.env.DEV_PORT;

app.use('/', require('./user/userRouter'))
app.set('view engine', 'pug');

app.get('/', (req: Request, res: Response) => {
    res.render('index.pug')
})

app.get('/register', (req: Request, res: Response) => {
    res.render('register.pug')
})
app.get('/login', (req: Request, res: Response) => {
    res.render('login.pug')
})
app.get('/notes', userMiddleware, (req: Request, res: Response) => {
    res.render('notes.pug', {user: (req as CustomRequest).token})
})

app.listen(port, () => {
    console.log(`Listen on ${port}`)
})


//