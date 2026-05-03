import { Router } from 'express';
import { getTimeline, getUserReminders, createReminder } from '../controllers/timelineController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/reminders/:userId', requireAuth, getUserReminders);
router.post('/reminder', requireAuth, createReminder);
router.get('/:country', getTimeline);

export default router;
