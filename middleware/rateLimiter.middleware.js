import {rateLimit} from 'express-rate-limit';

export const emailRateLimiter = rateLimit({
     windowMs: 24 * 60 * 60 * 1000, // 24 hours
    limit: 50, // Limit each IP to 50 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many application emails sent from this IP, please try again after 24 hours.'
    }
})