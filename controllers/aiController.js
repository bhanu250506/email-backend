import {GoogleGenerativeAI} from '@google/generative-ai'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError} from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc    Generate a personalized cover letter using Gemini
 * @route   POST /api/v1/ai/personalize-letter
 * @access  Private
 */

const personalizeCoverLetter = asyncHandler(async (req, res)=>{
    const {jobDescription, baseLetter} = req.body;
    const user = req.user;

    if(!jobDescription || !baseLetter){

        throw new ApiError('Please provide both job description and base letter', 400);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
        You are an expert career coach. Your task is to rewrite a base cover letter to be highly tailored for a specific job description.
        
        **My Information:**
        - Name: ${user.name}
        - LinkedIn: ${user.linkedinProfile || 'Not provided'}
        - Portfolio: ${user.portfolioUrl || 'Not provided'}

        **Base Cover Letter:**
        ---
        ${baseLetter}
        ---

        **Job Description to Target:**
        ---
        ${jobDescription}
        ---

        **Instructions:**
        1. Analyze the job description for key skills, responsibilities, and company values.
        2. Rewrite the base cover letter to highlight my relevant experience and skills that match the job description.
        3. Maintain a professional and enthusiastic tone.
        4. Keep the placeholders like {company_name} if they exist in the base letter.
        5. The final output should be ONLY the rewritten cover letter text, without any introductory phrases like "Here is the rewritten letter:".
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const personalizedText = response.text();

    res.status(200).json(new ApiResponse(200, { personalizedLetter: personalizedText }, "Cover letter personalized successfully."));

});

export {personalizeCoverLetter}