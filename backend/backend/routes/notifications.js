import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
} from "../controllers/notificationController.js";

const router = Router();

router.get("/:patientName", getNotifications);
router.post("/", createNotification);
router.patch("/:id/read", markAsRead);
router.patch("/:patientName/read-all", markAllAsRead);

export default router;