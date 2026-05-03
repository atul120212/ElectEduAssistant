import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { generateChatResponse } from '../services/geminiService';
import { AppError } from '../middleware/errorHandler';
import { Prisma } from '@prisma/client';

/**
 * Handles incoming chat messages, manages conversation history, and generates AI responses.
 * 
 * @param req - Express request object containing message and optional conversationId
 * @param res - Express response object
 * @param next - Express next function
 */
export const handleMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message, conversationId, country } = req.body;
    const userId = req.user?.userId;

    let conversation;

    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { timestamp: 'asc' } } }
      });

      if (!conversation) {
        throw new AppError('Conversation not found', 404);
      }
      
      // Ensure user owns conversation or it's an anonymous user's conversation 
      // (Simplified logic for now, should map session ids for anonymous users)
      if (conversation.userId && conversation.userId !== userId) {
         throw new AppError('Unauthorized access to conversation', 403);
      }
    } else {
      if (!userId) {
        throw new AppError('User must be logged in to save conversations', 401);
      }
      conversation = await prisma.conversation.create({
        data: {
          userId: userId,
          title: message.substring(0, 50) + '...',
          country: country || 'US',
        },
        include: { messages: true }
      });
    }

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
      }
    });

    const history = conversation.messages.map((msg: Prisma.MessageGetPayload<{}>) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Add current message to history for Claude
    // (We just saved it, but it's easier to append here)

    const assistantResponseText = await generateChatResponse(message, history);

    // Save assistant message
    const assistantMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: assistantResponseText,
      }
    });

    // We can extract sources here if we wanted to (simple regex check for [Source: ...])
    const sourcesMatch = assistantResponseText.match(/\[Source: (.*?)\]/g);
    const sources = sourcesMatch ? sourcesMatch.map(s => s.replace(/\[Source: |\]/g, '')) : [];

    res.status(200).json({
      status: 'success',
      data: {
        response: assistantResponseText,
        conversationId: conversation.id,
        sources,
        messageId: assistantMessage.id
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a list of chat conversations for the authenticated user.
 * 
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const getConversations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        summary: true,
        country: true,
        updatedAt: true,
      }
    });

    res.status(200).json({
      status: 'success',
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

export const getConversationDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { conversationId } = req.params;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!conversation || conversation.userId !== userId) {
      throw new AppError('Conversation not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: { conversation }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const { conversationId } = req.params;

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation || conversation.userId !== userId) {
      throw new AppError('Conversation not found', 404);
    }

    await prisma.conversation.delete({
      where: { id: conversationId }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
