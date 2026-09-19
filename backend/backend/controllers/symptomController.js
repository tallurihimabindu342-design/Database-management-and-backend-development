import { getMedicalAdvice } from "../services/geminiService.js";
import SymptomCheck from "../models/SymptomCheck.js";
import Notification from "../models/Notification.js";

/**
 * POST /api/symptom-check
 * Analyzes symptoms via Gemini, saves result to MongoDB.
 */
export async function checkSymptoms(req, res) {
  try {
    const { symptoms, patientName } = req.body;

    if (!symptoms || typeof symptoms !== "string" || !symptoms.trim()) {
      return res.status(400).json({ error: "symptoms text is required." });
    }

    const result = await getMedicalAdvice(symptoms);

    if (!result || !result.specialization) {
      return res.status(502).json({ error: "AI analysis unavailable. Please try again." });
    }

    // Save to MongoDB — builds permanent symptom history
    const saved = await SymptomCheck.create({
      patientName: patientName || null,
      symptoms: symptoms.trim(),
      specialization: result.specialization,
      risk: result.risk,
      emergency: result.emergency === true,
      advice: result.advice || "",
      analyzedAt: new Date(),
    });

    // Push notification for high risk or emergency
    if ((result.risk === "High" || result.emergency) && patientName) {
      await Notification.create({
        patientName,
        type: "Risk",
        title: "Clinical Attention Required",
        message:
          "Your recent symptom assessment indicates elevated clinical risk. Please seek medical consultation as soon as possible.",
      });
    }

    return res.json({
      specialization: result.specialization,
      risk: result.risk,
      emergency: result.emergency === true,
      advice: result.advice || "",
      analyzedAt: saved.analyzedAt,
      id: saved._id,
    });
  } catch (error) {
    console.error("Symptom check controller error:", error);
    return res.status(500).json({ error: "Failed to analyze symptoms: " + error.message });
  }
}

/**
 * GET /api/symptom-check/history/:patientName
 * Returns all past symptom checks for a patient, newest first.
 */
export async function getSymptomHistory(req, res) {
  try {
    const { patientName } = req.params;

    if (!patientName) {
      return res.status(400).json({ error: "patientName is required." });
    }

    const history = await SymptomCheck.find({ patientName })
      .sort({ analyzedAt: -1 })
      .limit(50);

    return res.json(history);
  } catch (error) {
    console.error("Symptom history error:", error);
    return res.status(500).json({ error: "Failed to fetch symptom history." });
  }
}