import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
    resumeUrl: {
        type: String,
        trim: true,
        default: ""
    },
    linkedinProfile: {
        type: String,
        trim: true,
        default: ""
    },
    portfolioUrl: {
        type: String,
        trim: true,
        default: ""
    },
        githubUrl: { type: String, trim: true, default: "" }, 

    defaultCoverLetter: {
        type: String,
        default: "Dear {company_name} team,\n\nI am writing to express my interest in a position at your company. Please find my resume attached for your review. \n\nThank you for your time and consideration.\n\nSincerely,\n{user_name}"
    }
}, { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT
userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};


export const User = mongoose.model("User", userSchema);