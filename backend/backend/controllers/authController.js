import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Patient from "../models/Patient.js";
import Doctor from "../models/Doctor.js";

const JWT_SECRET = process.env.JWT_SECRET || "healthcare_jwt_secret_2024";

export async function registerPatient(req, res) {
  try {
    const { fullName, email, phone, password } = req.body;
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const existing = await Patient.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const patient = await Patient.create({
      patientId: "PAT" + Date.now(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: "Patient",
    });
    return res.status(201).json({
      message: "Registration successful.",
      patientId: patient.patientId,
      fullName: patient.fullName,
      email: patient.email,
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

export async function registerDoctor(req, res) {
  try {
    const { fullName, email, phone, doctorId, specialization, qualification, hospital, experience, password } = req.body;

    if (!fullName || !email || !phone || !doctorId || !specialization || !password) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const existingById = await Doctor.findOne({ doctorId });
    if (existingById) {
      return res.status(409).json({ error: "A request with this Doctor ID already exists." });
    }

    const existingByEmail = await Doctor.findOne({ email: email.toLowerCase() });
    if (existingByEmail) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const doctor = await Doctor.create({
      doctorId: doctorId.trim(),
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      specialization: specialization.trim(),
      qualification: qualification?.trim() || "",
      hospital: hospital?.trim() || "",
      experience: experience?.trim() || "",
      password: hashedPassword,
      status: "Pending",
      role: "Doctor",
    });

    return res.status(201).json({
      message: "Registration request sent to administrator.",
      doctorId: doctor.doctorId,
      fullName: doctor.fullName,
      status: doctor.status,
    });
  } catch (err) {
    console.error("Doctor registration error:", err.message);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
}

export async function login(req, res) {
  try {
    const { role, username, password } = req.body;
    if (!role || !username || !password) {
      return res.status(400).json({ error: "Role, username and password are required." });
    }

    if (role === "Patient") {
      const patient = await Patient.findOne({ email: username.toLowerCase() });
      if (!patient) return res.status(404).json({ error: "No account found with this email. Please register first." });
      const passwordMatch = await bcrypt.compare(password, patient.password);
      if (!passwordMatch) return res.status(401).json({ error: "Incorrect password. Please try again." });
      const token = jwt.sign({ id: patient._id, role: "Patient", patientId: patient.patientId }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, role: "Patient", patientId: patient.patientId, fullName: patient.fullName, email: patient.email });
    }

    if (role === "Doctor") {
      const doctor = await Doctor.findOne({ doctorId: username });
      if (!doctor) return res.status(404).json({ error: "No doctor account found with this ID." });
      if (doctor.status === "Pending") return res.status(403).json({ error: "Your registration is pending admin approval." });
      if (doctor.status === "Rejected") return res.status(403).json({ error: "Your registration request was rejected." });
      const passwordMatch = await bcrypt.compare(password, doctor.password);
      if (!passwordMatch) return res.status(401).json({ error: "Incorrect password. Please try again." });
      const token = jwt.sign({ id: doctor._id, role: "Doctor", doctorId: doctor.doctorId }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, role: "Doctor", doctorId: doctor.doctorId, fullName: doctor.fullName, currentDoctor: doctor.fullName });
    }

    if (role === "Administrator") {
      const adminId = process.env.ADMIN_ID || "ADMIN001";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      if (username !== adminId) return res.status(404).json({ error: "No administrator account found with this ID." });
      if (password !== adminPassword) return res.status(401).json({ error: "Incorrect password. Please try again." });
      const token = jwt.sign({ role: "Administrator", adminId }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, role: "Administrator", adminId, fullName: "Administrator" });
    }

    return res.status(400).json({ error: "Invalid role selected." });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
}