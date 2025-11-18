import express, { Request, Response } from 'express';
import dotenv from 'dotenv'
import app from './app';

// load env variables
dotenv.config();

const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send('this is so poggers');
});

app.get('/login', (req: Request, res: Response) => {
    res.redirect('main.html');
});

app.get('/guest', (req: Request, res: Response) => { 
    res.redirect('main.html');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});