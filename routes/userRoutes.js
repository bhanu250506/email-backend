import { Router } from "express";
import { getUserProfile , updateUserProfile } from "../controllers/userController.js";
import {protect} from "../middleware/auth.middleware.js";

const router = Router();

// All routes below are protected
router.use(protect);

router.route("/profile")
    .get(getUserProfile)
    .put(updateUserProfile);

export default router;