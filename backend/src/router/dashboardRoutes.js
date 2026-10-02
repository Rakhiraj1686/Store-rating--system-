import { Router } from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/user", authenticate, authorize("user"), (req, res) => {
  res.json({ message: "Welcome to User Dashboard" });
});

router.get("/store-owner", authenticate, authorize("store_owner"), (req, res) => {
  res.json({ message: "Welcome to Store Owner Dashboard" });
});

export default router;
