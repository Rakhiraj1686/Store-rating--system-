import { Router } from "express";
import { addRating, modifyRating } from "../controller/ratingController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authenticate, authorize("user"), addRating);
router.put("/:id", authenticate, authorize("user"), modifyRating);

export default router;
