import { Router } from "express";
import {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAllAppointments,
  rescheduleAppointment,
} from "../controllers/appointmentController.js";

const router = Router();

router.post("/book", bookAppointment);
router.get("/patient/:patientName", getPatientAppointments);
router.get("/doctor/:doctorId", getDoctorAppointments);
router.get("/all", getAllAppointments);
router.patch("/:appointmentId/status", updateAppointmentStatus);
router.patch("/:appointmentId/reschedule", rescheduleAppointment);

export default router;