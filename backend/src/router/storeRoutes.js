import { Router } from "express";
import { listStores } from "../controller/storeController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authenticate, authorize("user"), listStores);

export default router;
