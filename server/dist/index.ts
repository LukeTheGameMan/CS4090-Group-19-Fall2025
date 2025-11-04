import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 5432;

app.use(express.json()); // Enable JSON body parsing

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from the Prisma server!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});