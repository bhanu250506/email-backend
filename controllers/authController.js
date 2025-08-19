import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (!user) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    const token = user.generateAuthToken();
    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
    };

    res.status(201).json(new ApiResponse(201, userResponse, "User registered successfully"));
});


/**
 * @desc    Authenticate user & get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = user.generateAuthToken();
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            token,
        };
        res.status(200).json(new ApiResponse(200, userResponse, "User logged in successfully"));
    } else {
        throw new ApiError(401, "Invalid email or password");
    }
});

export { registerUser, loginUser };