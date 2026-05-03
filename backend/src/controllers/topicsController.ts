import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getTopics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, difficulty, search } = req.query;

    const whereClause: any = {};

    if (category) whereClause.category = category;
    if (difficulty) whereClause.difficulty = difficulty;
    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const topics = await prisma.topic.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        category: true,
        difficulty: true,
        keywords: true,
      },
      orderBy: { title: 'asc' }
    });

    res.status(200).json({
      status: 'success',
      data: { topics }
    });
  } catch (error) {
    next(error);
  }
};

export const getTopicDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    });

    if (!topic) {
      throw new AppError('Topic not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { topic }
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmark = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topicId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_topicId: { userId, topicId }
      }
    });

    if (existingBookmark) {
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id }
      });
      res.status(200).json({ status: 'success', message: 'Bookmark removed' });
    } else {
      await prisma.bookmark.create({
        data: { userId, topicId }
      });
      res.status(201).json({ status: 'success', message: 'Bookmark added' });
    }
  } catch (error) {
    next(error);
  }
};
