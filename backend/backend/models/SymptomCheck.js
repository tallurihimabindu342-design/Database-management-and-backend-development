import mongoose from "mongoose";

const symptomCheckSchema = new mongoose.Schema(
  {
    patientName: String,
    symptoms: { type: String, required: true },
    specialization: String,
    risk: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    emergency: { type: Boolean, default: false },
    advice: String,
    analyzedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("SymptomCheck", symptomCheckSchema);