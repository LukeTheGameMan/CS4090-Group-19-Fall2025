import { Request, Response, NextFunction } from 'express';
import prisma from '../../../prisma';

export function checkDB(req: Request, res: Response, next_function: NextFunction) {
  if (!prisma) {
    return res.status(503).json({
      success: false,
      error: "Database disabled in test mode"
    });
  }
  next_function();
}