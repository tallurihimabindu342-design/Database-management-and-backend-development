import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";

/**
 * POST /api/appointments/book
 * Books a new appointment and saves to MongoDB.
 */
export async function bookAppointment(req, res) {
  try {
    const {
      patientName, doctorName, doctorId, specialization,
      date, time, language, symptoms, translatedSymptoms,
    } = req.body;

    if (!patientName || !doctorId || !date || !time) {
      return res.status(400).json({ error: "patientName, doctorId, date and time are required." });
    }

    // Count existing appointments to calculate queue
    const existingCount = await Appointment.countDocuments({ doctorId, date });

    const appointment = await Appointment.create({
      appointmentId: `APT${Date.now()}`,
      patientName,
      doctorName,
      doctorId,
      specialization,
      date,
      time,
      language: language || "English",
      symptoms: symptoms || "",
      translatedSymptoms: translatedSymptoms || symptoms || "",
      status: "Pending",
      bookedAt: new Date().toLocaleString(),
      queueNumber: existingCount + 1,
      estimatedWait: (existingCount + 1) * 10,
    });

    // Notify patient
    await Notification.create({
      patientName,
      type: "Appointment",
      title: "Appointment Booked",
      message: `Your appointment with ${doctorName} on ${date} at ${time} has been booked successfully.`,
    });

    return res.status(201).json(appointment);
  } catch (err) {
    console.error("Book appointment error:", err.message);
    return res.status(500).json({ error: "Failed to book appointment. Please try again." });
  }
}

/**
 * GET /api/appointments/patient/:patientName
 * Returns all appointments for a specific patient.
 */
export async function getPatientAppointments(req, res) {
  try {
    const { patientName } = req.params;
    const appointments = await Appointment.find({ patientName })
      .sort({ createdAt: -1 });
    return res.json(appointments);
  } catch (err) {
    console.error("Get patient appointments error:", err.message);
    return res.status(500).json({ error: "Failed to fetch appointments." });
  }
}

/**
 * GET /api/appointments/doctor/:doctorId
 * Returns all appointments for a specific doctor.
 */
export async function getDoctorAppointments(req, res) {
  try {
    const { doctorId } = req.params;
    const appointments = await Appointment.find({ doctorId })
      .sort({ createdAt: -1 });
    return res.json(appointments);
  } catch (err) {
    console.error("Get doctor appointments error:", err.message);
    return res.status(500).json({ error: "Failed to fetch appointments." });
  }
}

/**
 * PATCH /api/appointments/:appointmentId/status
 * Updates appointment status — used by doctor and patient.
 */
export async function updateAppointmentStatus(req, res) {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Notify patient on status change
    const messages = {
      Confirmed: `Your appointment with ${appointment.doctorName} on ${appointment.date} has been confirmed.`,
      Cancelled: `Your appointment with ${appointment.doctorName} on ${appointment.date} has been cancelled.`,
      "In Progress": `Your consultation with ${appointment.doctorName} has started. Please join now.`,
      Completed: `Your consultation with ${appointment.doctorName} has been completed.`,
    };

    if (messages[status]) {
      await Notification.create({
        patientName: appointment.patientName,
        type: "Appointment",
        title: `Appointment ${status}`,
        message: messages[status],
      });
    }

    return res.json(appointment);
  } catch (err) {
    console.error("Update appointment status error:", err.message);
    return res.status(500).json({ error: "Failed to update appointment status." });
  }
}

/**
 * GET /api/appointments/all
 * Returns all appointments — admin only.
 */
export async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    return res.json(appointments);
  } catch (err) {
    console.error("Get all appointments error:", err.message);
    return res.status(500).json({ error: "Failed to fetch appointments." });
  }
}

/**
 * PATCH /api/appointments/:appointmentId/reschedule
 * Reschedules a cancelled appointment to a new date/time.
 */
export async function rescheduleAppointment(req, res) {
  try {
    const { appointmentId } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: "New date and time are required." });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { appointmentId },
      { date, time, status: "Pending" },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    await Notification.create({
      patientName: appointment.patientName,
      type: "Appointment",
      title: "Appointment Rescheduled",
      message: `Your appointment with ${appointment.doctorName} has been rescheduled to ${date} at ${time}.`,
    });

    return res.json(appointment);
  } catch (err) {
    console.error("Reschedule error:", err.message);
    return res.status(500).json({ error: "Failed to reschedule appointment." });
  }
}