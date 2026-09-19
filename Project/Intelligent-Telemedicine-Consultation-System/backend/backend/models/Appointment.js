import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
    },
    patientName: { type: String, required: true },
    doctorName: String,
    doctorId: String,
    specialization: String,
    date: String,
    time: String,
    language: { type: String, default: "English" },
    symptoms: String,
    translatedSymptoms: String,
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    bookedAt: String,
    queueNumber: Number,
    estimatedWait: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);