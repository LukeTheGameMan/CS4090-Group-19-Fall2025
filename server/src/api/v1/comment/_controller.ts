import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createComment(req: Request, res: Response) {
    return;
}

export async function getComments(req: Request, res: Response) {
    return;
}