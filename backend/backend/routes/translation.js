import { Router } from "express";
import {
  translate,
  getLanguagePreference,
  setLanguagePreference,
} from "../controllers/translationController.js";

const router = Router();

router.post("/", translate);
router.get("/language", getLanguagePreference);
router.put("/language", setLanguagePreference);

export default router;