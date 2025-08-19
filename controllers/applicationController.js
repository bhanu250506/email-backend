import {Application} from '../models/application.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendEmail } from '../services/emailService.js';

/**
 * @desc    Send a batch of resume emails
 * @route   POST /api/v1/applications/send
 * @access  Private
 */
const sendBatchApplication = asyncHandler(async (req, res) => {
    const { recipients, subject } = req.body;
    const user = req.user;

    // --- Validation ---
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        throw new ApiError(400, "Recipients array is required and cannot be empty.");
    }
    if (!subject) {
        throw new ApiError(400, "Subject is required.");
    }
    if (!user.resumeUrl) {
        throw new ApiError(400, "Please update your profile with a resume URL before sending applications.");
    }
    if (!user.email) {
        throw new ApiError(400, "Please add your email address to your profile.");
    }

    const results = [];
    const applicationLogs = [];

    for (const recipient of recipients) {
        const { email, companyName } = recipient;
        if (!email || !companyName) {
            results.push({ email, companyName, status: "Failed", reason: "Missing email or company name" });
            continue;
        }

        // --- Personalize the cover letter ---
        let emailBody = user.defaultCoverLetter
            .replace(/{company_name}/g, companyName)
            .replace(/{user_name}/g, user.name);

        // --- Dynamically build the email signature ---
        let signatureHtml = `<p>You can view my resume here: <a href="${user.resumeUrl}">My Resume</a></p>`;
        if (user.linkedinProfile) {
            signatureHtml += `<p>LinkedIn Profile: <a href="${user.linkedinProfile}">${user.linkedinProfile}</a></p>`;
        }
        if (user.portfolioUrl) {
            signatureHtml += `<p>Portfolio: <a href="${user.portfolioUrl}">${user.portfolioUrl}</a></p>`;
        }
         if (user.githubUrl) {
            signatureHtml += `<p>GitHub: <a href="${user.githubUrl}">${user.githubUrl}</a></p>`;
        }


        const finalHtmlBody = `<div style="font-family: sans-serif; line-height: 1.6;">${emailBody.replace(/\n/g, '<br>')}</div><br>${signatureHtml}`;

        const emailSent = await sendEmail({
            to: email,
            subject: subject,
            html: finalHtmlBody,
            fromName: user.name,
            replyToEmail: user.email // Set the user's email for replies
        });

        const status = emailSent ? "Sent" : "Failed";
        results.push({ email, companyName, status });

        // --- Log the application details ---
        applicationLogs.push({
            userId: user._id,
            companyName,
            recipientEmail: email,
            emailSubject: subject,
            emailBody: finalHtmlBody, // Log the final HTML sent
            status
        });
    }

    // Save logs to the database
    if (applicationLogs.length > 0) {
        await Application.insertMany(applicationLogs);
    }
    
    res.status(200).json(new ApiResponse(200, results, "Batch application process completed."));
});

/**
 * @desc    Get application history for the logged-in user
 * @route   GET /api/v1/applications
 * @access  Private
 */
const getApplicationHistory = asyncHandler(async (req, res) => {
    const applications = await Application.find({ userId: req.user._id }).sort({ sentAt: -1 });
    res.status(200).json(new ApiResponse(200, applications, "Application history fetched successfully."));
});

export { sendBatchApplication, getApplicationHistory };