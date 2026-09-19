import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    bp: String,
    pulse: String,
    spo2: String,
    temperature: String,
    sugar: String,
    weight: String,
    sleepHours: String,
    waterIntake: String,
    exerciseMinutes: String,
    steps: String,
    recordedAt: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vital", vitalSchema);