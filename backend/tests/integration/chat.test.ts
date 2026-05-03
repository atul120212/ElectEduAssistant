import request from 'supertest';
import { prisma } from '../../src/config/database';
import { generateChatResponse } from '../../src/services/geminiService';
import { verifyAccessToken } from '../../src/utils/auth';
import express, { Express } from 'express';
import chatRoutes from '../../src/routes/chat.routes';
import { errorHandler } from '../../src/middleware/errorHandler';

// Mock the AI service and Auth
jest.mock('../../src/services/geminiService');
jest.mock('../../src/utils/auth');

const app: Express = express();
app.use(express.json());

// Mock auth middleware for testing
app.use((req: any, res, next) => {
  (verifyAccessToken as jest.Mock).mockReturnValue({ userId: 'test-user-id', sessionId: 'test-session-id' });
  next();
});

app.use('/api/v1/chat', chatRoutes);
app.use(errorHandler);

describe('Chat API Integration Tests', () => {
  let conversationId: string;

  beforeAll(async () => {
    // Basic cleanup - in real world use a separate test DB
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.user.create({
        data: {
            id: 'test-user-id',
            sessionId: 'test-session-id',
            email: 'test@example.com'
        }
    }).catch(() => {}); // Ignore if already exists
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new conversation and send a message', async () => {
    (generateChatResponse as jest.Mock).mockResolvedValue('This is an AI response about elections.');

    const res = await request(app)
      .post('/api/v1/chat/message')
      .set('Authorization', 'Bearer mock-token')
      .send({
        message: 'How do I register to vote?',
        country: 'US'
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.response).toBe('This is an AI response about elections.');
    expect(res.body.data.conversationId).toBeDefined();
    
    conversationId = res.body.data.conversationId;
  });

  it('should retrieve conversation history', async () => {
    const res = await request(app)
      .get(`/api/v1/chat/conversation/${conversationId}`)
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).toBe(200);
    expect(res.body.data.conversation.messages.length).toBe(2); // One user, one assistant
  });

  it('should list user conversations', async () => {
    const res = await request(app)
      .get('/api/v1/chat/conversations/test-user-id')
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).toBe(200);
    expect(res.body.data.conversations.length).toBeGreaterThan(0);
  });
});
