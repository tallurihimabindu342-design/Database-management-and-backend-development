import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    doctorId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

availabilitySchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

export default mongoose.model("Availability", availabilitySchema);