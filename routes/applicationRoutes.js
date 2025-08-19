import {Router} from 'express';
import { getApplicationHistory, sendBatchApplication } from '../controllers/applicationController.js';
import {protect} from '../middleware/auth.middleware.js'
import { emailRateLimiter }  from '../middleware/rateLimiter.middleware.js';

const router = Router();

// All routes below are protected
router.use(protect);

router.route("/")
    .get(getApplicationHistory);

router.route("/send")
    .post(emailRateLimiter, sendBatchApplication);

export default router;
