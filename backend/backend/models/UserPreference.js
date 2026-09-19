import mongoose from "mongoose";

const userPreferenceSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    role: { type: String, enum: ["Patient", "Doctor", "Administrator"], required: true },
    preferredLanguage: {
      type: String,
      enum: ["English", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"],
      default: "English",
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserPreference", userPreferenceSchema);