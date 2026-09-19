import { useState } from "react";
import Sidebar from "../components/Sidebar";

function Referral() {
  const [patientName, setPatientName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [reason, setReason] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [submitted, setSubmitted] = useState(false);

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

  const urgencyOptions = [
    { value: "Low", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
    { value: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    { value: "High", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  ];

  const createReferral = () => {
    if (!patientName.trim() || !specialization.trim() || !reason.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const referrals = JSON.parse(localStorage.getItem("referrals")) || [];
    referrals.push({
      patientName,
      doctor: localStorage.getItem("currentDoctor"),
      specialization,
      reason,
      urgency,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("referrals", JSON.stringify(referrals));

    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      patientName,
      type: "Referral",
      title: "Specialist Referral",
      message: `A referral has been created for ${specialization}. Please schedule an appointment with a specialist.`,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    setSubmitted(true);
  };

  const reset = () => {
    setPatientName(""); setSpecialization(""); setReason("");
    setUrgency("Medium"); setSubmitted(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Doctor" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          📋 Create Referral
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          Refer patients to specialists for advanced care.
        </p>

        {submitted ? (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "24px", padding: "48px", textAlign: "center"
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
            <div style={{ color: "#22c55e", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>
              Referral Created
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
              {patientName} has been referred to a {specialization} specialist.
            </div>
            <button
              onClick={reset}
              style={{
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "14px 32px",
                borderRadius: "14px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
              }}
            >
              + Create Another Referral
            </button>
          </div>
        ) : (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "24px", padding: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "22px" }}>
              <div>
                <label style={labelStyle}>🧑 Patient Name</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>🩺 Specialization Required</label>
                <input
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. Cardiology, Neurology"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: "22px" }}>
              <label style={labelStyle}>📝 Reason for Referral</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Describe the clinical reason for referral..."
                style={{ ...inputStyle, resize: "none", lineHeight: "22px" }}
              />
            </div>

            {/* Urgency Selector */}
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>⚡ Urgency Level</label>
              <div style={{ display: "flex", gap: "12px" }}>
                {urgencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setUrgency(opt.value)}
                    style={{
                      flex: 1, padding: "12px",
                      background: urgency === opt.value ? opt.bg : "#0f172a",
                      color: urgency === opt.value ? opt.color : "#64748b",
                      border: urgency === opt.value
                        ? `1px solid ${opt.color}40`
                        : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px", cursor: "pointer",
                      fontWeight: "700", fontSize: "14px", transition: "all 0.2s"
                    }}
                  >
                    {opt.value === "Low" ? "🟢" : opt.value === "Medium" ? "🟡" : "🔴"} {opt.value}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={createReferral}
                style={{
                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "white", border: "none", padding: "16px 40px",
                  borderRadius: "14px", cursor: "pointer", fontSize: "16px",
                  fontWeight: "700", boxShadow: "0 8px 20px rgba(37,99,235,0.3)"
                }}
              >
                📋 Create Referral
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Referral;