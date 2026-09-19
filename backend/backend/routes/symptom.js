import express from "express";
import { checkSymptoms, getSymptomHistory } from "../controllers/symptomController.js";

const router = express.Router();

router.post("/symptom-check", checkSymptoms);
router.get("/symptom-check/history/:patientName", getSymptomHistory);

export default router;