import { Router } from "express";
import { saveVitals, getVitals, getLatestVitals } from "../controllers/vitalController.js";

const router = Router();

router.post("/", saveVitals);
router.get("/:patientName", getVitals);
router.get("/:patientName/latest", getLatestVitals);

export default router;