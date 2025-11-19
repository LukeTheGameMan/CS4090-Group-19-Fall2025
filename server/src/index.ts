import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import app from './app';

// load env variables
dotenv.config();

const port = process.env.PORT;

// theres a better way to do all of this im just lazy lol
app.get('/', (req: Request, res: Response) => {
    res.redirect('/index.html');
});

app.get('/login', (req: Request, res: Response) => {
    res.redirect('/main.html');
});

app.get('/guest', (req: Request, res: Response) => { 
    res.redirect('/main.html');
});

app.get('/signup', (req: Request, res: Response) => { 
    res.redirect('/signup.html');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});