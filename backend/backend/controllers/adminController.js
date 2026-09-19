import Doctor from "../models/Doctor.js";

export async function getDoctorRequests(req, res) {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    return res.json(doctors);
  } catch (err) {
    console.error("Fetch doctor requests error:", err.message);
    return res.status(500).json({ error: "Failed to fetch doctor requests." });
  }
}

export async function updateDoctorStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'Approved' or 'Rejected'." });
    }

    const doctor = await Doctor.findByIdAndUpdate(id, { status }, { new: true });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor request not found." });
    }

    return res.json({ message: `Doctor ${status.toLowerCase()}.`, doctor });
  } catch (err) {
    console.error("Update doctor status error:", err.message);
    return res.status(500).json({ error: "Failed to update doctor status." });
  }
}