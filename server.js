import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/error.middleware.js';

// Import your routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Initialize environment variables 
dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "resumeSenderDB",
        });
        console.log("✅ MongoDB connected successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();

// --- Middlewares ---
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to log incoming requests (for debugging)
app.use((req, res, next) => {
    console.log("👉 Request path:", req.path);
    next();
});

// --- API Routes ---
app.get('/', (req, res) => {
    res.send("Email API is working");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/applications", applicationRoutes);
app.use("/api/v1/ai", aiRoutes);

// --- Centralized Error Handler ---
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running at Port ${PORT}`);
});