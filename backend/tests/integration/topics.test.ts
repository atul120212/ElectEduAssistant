import request from 'supertest';
import { prisma } from '../../src/config/database';
import express, { Express } from 'express';
import topicRoutes from '../../src/routes/topics.routes';
import { errorHandler } from '../../src/middleware/errorHandler';

const app: Express = express();
app.use(express.json());
app.use('/api/v1/topics', topicRoutes);
app.use(errorHandler);

describe('Topics API Integration Tests', () => {
  beforeAll(async () => {
    await prisma.topic.deleteMany();
    await prisma.topic.create({
      data: {
        title: 'Voter Registration Basics',
        category: 'Voter Registration',
        difficulty: 'beginner',
        content: 'This is a guide on how to register to vote...',
        country: 'US',
        keywords: ['register', 'vote', 'basics']
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should list all topics', async () => {
    const res = await request(app).get('/api/v1/topics');
    expect(res.status).toBe(200);
    expect(res.body.data.topics.length).toBeGreaterThan(0);
  });

  it('should filter topics by category', async () => {
    const res = await request(app).get('/api/v1/topics?category=Voter Registration');
    expect(res.status).toBe(200);
    expect(res.body.data.topics[0].category).toBe('Voter Registration');
  });

  it('should return 404 for non-existent topic', async () => {
    const res = await request(app).get('/api/v1/topics/non-existent-id');
    expect(res.status).toBe(404);
  });
});
