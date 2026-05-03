import { Router } from 'express';
import { getTopics, getTopicDetails, toggleBookmark } from '../controllers/topicsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', getTopics);
router.get('/:topicId', getTopicDetails);
router.post('/:topicId/bookmark', requireAuth, toggleBookmark);

export default router;
