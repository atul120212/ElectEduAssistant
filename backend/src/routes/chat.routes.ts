import { Router } from 'express';
import { handleMessage, getConversations, getConversationDetails, deleteConversation } from '../controllers/chatController';
import { optionalAuth, requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validator';
import { chatMessageSchema } from '../utils/validators';
import { chatLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/message', optionalAuth, chatLimiter, validateRequest(chatMessageSchema), handleMessage);
router.get('/conversations/:userId', requireAuth, getConversations);
router.get('/conversation/:conversationId', requireAuth, getConversationDetails);
router.delete('/conversation/:conversationId', requireAuth, deleteConversation);

export default router;
