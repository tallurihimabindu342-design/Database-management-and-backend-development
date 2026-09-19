import { Router } from "express";
import {
  createPrescription,
  getPatientPrescriptions,
  getDoctorPrescriptions,
} from "../controllers/prescriptionController.js";

const router = Router();

router.post("/", createPrescription);
router.get("/patient/:patientName", getPatientPrescriptions);
router.get("/doctor/:doctorName", getDoctorPrescriptions);

export default router;