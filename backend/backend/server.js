import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

import dashboardRoutes from "./routes/dashboard.js";
import symptomRoutes from "./routes/symptom.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import appointmentRoutes from "./routes/appointment.js";
import vitalRoutes from "./routes/vitals.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import notificationRoutes from "./routes/notifications.js";
import translationRoutes from "./routes/translation.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Community Healthcare Backend is Running Successfully");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", dashboardRoutes);
app.use("/api", symptomRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/translate", translationRoutes);

// Global error handler — must be last
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`🚀 Backend running on http://localhost:${PORT}`);
  });
}

start();