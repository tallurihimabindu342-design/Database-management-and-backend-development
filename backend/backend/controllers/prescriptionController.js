import Prescription from "../models/Prescription.js";
import Notification from "../models/Notification.js";

/**
 * POST /api/prescriptions
 * Doctor creates a prescription for a patient.
 */
export async function createPrescription(req, res) {
  try {
    const {
      appointmentId, doctor, patient,
      diagnosis, medicines, medicationTime,
      duration, instructions, followUp,
    } = req.body;

    if (!patient || !medicines) {
      return res.status(400).json({ error: "patient and medicines are required." });
    }

    const prescription = await Prescription.create({
      appointmentId: appointmentId || null,
      doctor: doctor || "",
      patient,
      diagnosis: diagnosis || "",
      medicines,
      medicationTime: medicationTime || "",
      duration: duration || "",
      instructions: instructions || "",
      followUp: followUp || "",
      createdAt: new Date().toLocaleString(),
    });

    // Notify patient
    await Notification.create({
      patientName: patient,
      type: "Prescription",
      title: "New Prescription Issued",
      message: `Dr. ${doctor} has prescribed: ${medicines}. Please follow the instructions carefully.`,
    });

    if (followUp) {
      await Notification.create({
        patientName: patient,
        type: "FollowUp",
        title: "Follow-Up Consultation Scheduled",
        message: `A follow-up consultation has been recommended on ${followUp}. Please book your appointment.`,
      });
    }

    return res.status(201).json(prescription);
  } catch (err) {
    console.error("Create prescription error:", err.message);
    return res.status(500).json({ error: "Failed to create prescription." });
  }
}

/**
 * GET /api/prescriptions/patient/:patientName
 * Returns all prescriptions for a patient.
 */
export async function getPatientPrescriptions(req, res) {
  try {
    const { patientName } = req.params;
    const prescriptions = await Prescription.find({ patient: patientName })
      .sort({ createdAt: -1 });
    return res.json(prescriptions);
  } catch (err) {
    console.error("Get prescriptions error:", err.message);
    return res.status(500).json({ error: "Failed to fetch prescriptions." });
  }
}

/**
 * GET /api/prescriptions/doctor/:doctorName
 * Returns all prescriptions written by a doctor.
 */
export async function getDoctorPrescriptions(req, res) {
  try {
    const { doctorName } = req.params;
    const prescriptions = await Prescription.find({ doctor: doctorName })
      .sort({ createdAt: -1 });
    return res.json(prescriptions);
  } catch (err) {
    console.error("Get doctor prescriptions error:", err.message);
    return res.status(500).json({ error: "Failed to fetch prescriptions." });
  }
}