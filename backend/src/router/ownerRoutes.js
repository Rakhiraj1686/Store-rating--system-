import { Router } from "express";
import { getMyStore } from "../controller/ownerController.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/store", authenticate, authorize("store_owner"), getMyStore);

export default router;
