import {User} from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

/**
 * @desc    Get user profile
 * @route   GET /api/v1/user/profile
 * @access  Private
 */

const getUserProfile = asyncHandler(async (req, res)=>{
    // req.user is attached by the 'protected' middleware

    const user = await User.findById(req.user._id).select("-password");
    if(!user){
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User profile fetched successfully"));
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/user/profile
 * @access  Private
 */

const updateUserProfile = asyncHandler(async(req, res)=> {
    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    // Whitelist fields that can be updated
    const allowedUpdates = ["name", "resumeUrl", "linkedinProfile", "portfolioUrl", "defaultCoverLetter"];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update=> allowedUpdates.includes(update));

    if(!isValidOperation){
        throw new ApiError(400, "Invalid updates");
    }

    updates.forEach(update => user[update] = req.body[update]);

    const updatedUser= await user.save();

    // Exclude password from the response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json(new ApiResponse(200, userResponse, "Profile updated successfully"));
});

export {getUserProfile, updateUserProfile};
