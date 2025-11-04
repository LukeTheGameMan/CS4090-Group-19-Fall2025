import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('this is so poggers');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});