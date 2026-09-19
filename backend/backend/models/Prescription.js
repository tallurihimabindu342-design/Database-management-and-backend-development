import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    appointmentId: String,
    doctor: String,
    patient: { type: String, required: true },
    diagnosis: String,
    medicines: String,
    medicationTime: String,
    duration: String,
    instructions: String,
    followUp: String,
    createdAt: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);