import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Prescription() {
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState("");
  const [instructions, setInstructions] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [medicationTime, setMedicationTime] = useState("");
  const [duration, setDuration] = useState("");

  const inputStyle = {
    width: "100%",
    padding: "14px",
    background: "#0f172a",
    color: "white",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: "600",
    display: "block",
    marginBottom: "8px",
  };

  const savePrescription = () => {
    const appointmentId = localStorage.getItem("selectedAppointment");
    const doctor = localStorage.getItem("currentDoctor");
    const patient = localStorage.getItem("selectedPatient");

    const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
    prescriptions.push({
      appointmentId, doctor, patient,
      diagnosis, medicines, medicationTime, duration, instructions, followUp,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("prescriptions", JSON.stringify(prescriptions));

    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      patientName: patient, type: "Prescription",
      title: "New Prescription Issued",
      message: `Medication prescribed: ${medicines}. Please follow your doctor's instructions.`,
      createdAt: new Date().toLocaleString(),
    });
    if (followUp) {
      notifications.push({
        patientName: patient, type: "FollowUp",
        title: "Follow-Up Consultation Due",
        message: `A follow-up consultation has been recommended on ${followUp}. Please schedule your appointment.`,
        createdAt: new Date().toLocaleString(),
      });
    }
    localStorage.setItem("notifications", JSON.stringify(notifications));

    alert("Prescription saved successfully.");
    setDiagnosis(""); setMedicines(""); setInstructions("");
    setFollowUp(""); setMedicationTime(""); setDuration("");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Doctor" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          💊 Create Prescription
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          Create digital prescriptions and medication plans for your patient.
        </p>

        <div style={{
          background: "linear-gradient(180deg,#0f172a,#111827)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "24px", padding: "32px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}>

          {/* Patient Info Banner */}
          <div style={{
            background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)",
            borderRadius: "14px", padding: "16px", marginBottom: "28px",
            display: "flex", alignItems: "center", gap: "14px"
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "50%",
              background: "linear-gradient(135deg,#2563eb,#7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px"
            }}>🧑</div>
            <div>
              <div style={{ color: "#64748b", fontSize: "12px" }}>Prescribing for</div>
              <div style={{ color: "white", fontSize: "16px", fontWeight: "700" }}>
                {localStorage.getItem("selectedPatient") || "Patient"}
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div style={{ marginBottom: "22px" }}>
            <label style={labelStyle}>🩺 Diagnosis</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              rows={3}
              placeholder="Enter diagnosis details..."
              style={{ ...inputStyle, resize: "none", lineHeight: "22px" }}
            />
          </div>

          {/* Medicines */}
          <div style={{ marginBottom: "22px" }}>
            <label style={labelStyle}>💊 Medicines</label>
            <textarea
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              rows={3}
              placeholder="List medicines, dosage and frequency..."
              style={{ ...inputStyle, resize: "none", lineHeight: "22px" }}
            />
          </div>

          {/* Instructions */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>📝 Instructions</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Special instructions for the patient..."
              style={{ ...inputStyle, resize: "none", lineHeight: "22px" }}
            />
          </div>

          {/* Date/Time/Duration Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", marginBottom: "28px" }}>
            <div>
              <label style={labelStyle}>📅 Follow-Up Date</label>
              <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>⏰ Medication Time</label>
              <input type="time" value={medicationTime} onChange={(e) => setMedicationTime(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>📆 Duration (Days)</label>
              <input
                type="number" value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 7"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={savePrescription}
              style={{
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "16px 40px",
                borderRadius: "14px", cursor: "pointer", fontSize: "16px",
                fontWeight: "700", boxShadow: "0 8px 20px rgba(37,99,235,0.3)"
              }}
            >
              💊 Save Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Prescription;