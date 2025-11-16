import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../web_dir')));


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