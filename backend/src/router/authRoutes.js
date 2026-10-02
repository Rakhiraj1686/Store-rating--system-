import { Router } from "express";
import { changePassword, login, signup } from "../controller/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/password", authenticate, changePassword);

export default router;
