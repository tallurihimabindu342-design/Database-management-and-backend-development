import { Router } from "express";
import { registerPatient, registerDoctor, login } from "../controllers/authController.js";

const router = Router();

router.post("/register", registerPatient);
router.post("/register-doctor", registerDoctor);
router.post("/login", login);

export default router;