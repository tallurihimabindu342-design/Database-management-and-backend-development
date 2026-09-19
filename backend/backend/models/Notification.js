import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "Appointment", "Prescription", "FollowUp",
        "Consultation", "Report", "Refill", "Risk",
        "ConcernResponse", "Referral",
      ],
      required: true,
    },
    title: String,
    message: String,
    read: { type: Boolean, default: false },
    createdAt: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);