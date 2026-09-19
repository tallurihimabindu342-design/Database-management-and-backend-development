import Vital from "../models/Vital.js";

/**
 * POST /api/vitals
 * Saves a new vitals entry for a patient.
 */
export async function saveVitals(req, res) {
  try {
    const {
      patientName, bp, pulse, spo2, temperature,
      sugar, weight, sleepHours, waterIntake,
      exerciseMinutes, steps,
    } = req.body;

    if (!patientName) {
      return res.status(400).json({ error: "patientName is required." });
    }

    const vital = await Vital.create({
      patientName,
      bp: bp || "",
      pulse: pulse || "",
      spo2: spo2 || "",
      temperature: temperature || "",
      sugar: sugar || "",
      weight: weight || "",
      sleepHours: sleepHours || "",
      waterIntake: waterIntake || "",
      exerciseMinutes: exerciseMinutes || "",
      steps: steps || "",
      recordedAt: new Date().toLocaleString(),
    });

    return res.status(201).json(vital);
  } catch (err) {
    console.error("Save vitals error:", err.message);
    return res.status(500).json({ error: "Failed to save vitals." });
  }
}

/**
 * GET /api/vitals/:patientName
 * Returns all vitals for a patient, newest first.
 */
export async function getVitals(req, res) {
  try {
    const { patientName } = req.params;
    const vitals = await Vital.find({ patientName })
      .sort({ createdAt: -1 })
      .limit(100);
    return res.json(vitals);
  } catch (err) {
    console.error("Get vitals error:", err.message);
    return res.status(500).json({ error: "Failed to fetch vitals." });
  }
}

/**
 * GET /api/vitals/:patientName/latest
 * Returns only the most recent vitals entry.
 */
export async function getLatestVitals(req, res) {
  try {
    const { patientName } = req.params;
    const vital = await Vital.findOne({ patientName })
      .sort({ createdAt: -1 });

    if (!vital) {
      return res.status(404).json({ error: "No vitals found for this patient." });
    }

    return res.json(vital);
  } catch (err) {
    console.error("Get latest vitals error:", err.message);
    return res.status(500).json({ error: "Failed to fetch vitals." });
  }
}