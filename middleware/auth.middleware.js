import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import {ApiError} from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next)=> {
    let token;

    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith('Bearer')){

        try{
            // Get token from header
            token = authHeader.split(" ")[1];

            // verify token 
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select("-password");

            if(!req.user){
                throw new ApiError(401, "Not authorized , user not found ");
            }
            next();
        }catch(error){
            console.log(error);
            throw new ApiError(401, "Not authorized , token failed");
        }
    }
    if(!token){
        throw new ApiError(401, "Not authorized , no token");
    }
});