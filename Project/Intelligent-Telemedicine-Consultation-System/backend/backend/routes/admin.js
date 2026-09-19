import { Router } from "express";
import { getDoctorRequests, updateDoctorStatus } from "../controllers/adminController.js";

const router = Router();

router.get("/doctor-requests", getDoctorRequests);
router.patch("/doctor-requests/:id", updateDoctorStatus);

export default router;