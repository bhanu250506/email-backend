import { Router } from "express";
import { personalizeCoverLetter } from "../controllers/aiController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// All routes below are protected
router.use(protect);

router.post("/personalize-letter", personalizeCoverLetter);

export default router;



