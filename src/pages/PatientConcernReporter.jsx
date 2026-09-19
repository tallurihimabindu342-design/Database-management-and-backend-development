import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function PatientConcernReporter() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName");

  // Build unique doctor list from this patient's appointment history
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const myDoctors = appointments
    .filter((a) => a.patientName === patientName)
    .reduce((unique, a) => {
      if (!unique.find((d) => d.doctorId === a.doctorId)) {
        unique.push({
          doctorId: a.doctorId,
          doctorName: a.doctorName,
          specialization: a.specialization,
        });
      }
      return unique;
    }, []);

  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctorName, setSelectedDoctorName] = useState("");
  const [concernType, setConcernType] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    width: "100%", padding: "14px",
    background: "#0f172a", color: "white",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px", fontSize: "15px",
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    color: "#94a3b8", fontSize: "13px",
    fontWeight: "600", display: "block", marginBottom: "8px",
  };

  const severityOptions = [
    { value: "Low", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
    { value: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
    { value: "High", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
  ];

  const concernTypes = [
    "Side Effect", "Medication Issue", "Follow-Up Needed",
    "Worsening Symptoms", "General Query", "Second Opinion",
  ];

  const handleSubmit = () => {
    if (!selectedDoctorId) { alert("Please select a doctor."); return; }
    if (!concernType) { alert("Please select a concern type."); return; }
    if (!description.trim()) { alert("Please describe your concern."); return; }

    const concerns = JSON.parse(localStorage.getItem("patientConcerns")) || [];
    concerns.push({
      patientName,
      doctorId: selectedDoctorId,       // ← stored so doctor can filter by this
      doctorName: selectedDoctorName,
      concernType,
      severity,
      description,
      status: "Pending",
      doctorResponse: "",
      respondedAt: null,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("patientConcerns", JSON.stringify(concerns));
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setDescription("");
    setConcernType("");
    setSelectedDoctorId("");
    setSelectedDoctorName("");
    setSeverity("Medium");
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
        <Sidebar role="Patient" />
        <div style={{ flex: 1, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "24px", padding: "48px", textAlign: "center", maxWidth: "500px", width: "100%"
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
            <div style={{ color: "#22c55e", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>
              Concern Submitted
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "6px" }}>
              Your concern has been sent to
            </div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "28px" }}>
              {selectedDoctorName}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => navigate("/my-concerns")}
                style={{
                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "white", border: "none", padding: "14px 28px",
                  borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                }}
              >
                📝 View My Concerns
              </button>
              <button
                onClick={resetForm}
                style={{
                  background: "#1e293b", color: "#94a3b8", border: "none",
                  padding: "14px 28px", borderRadius: "12px", cursor: "pointer",
                  fontWeight: "600", fontSize: "14px"
                }}
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          📝 Report a Concern
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          Send a concern directly to one of your doctors.
        </p>

        <div style={{
          background: "linear-gradient(180deg,#0f172a,#111827)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "24px", padding: "32px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)", maxWidth: "720px"
        }}>

          {/* Select Doctor */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>👨‍⚕️ Select Doctor</label>
            {myDoctors.length === 0 ? (
              <div style={{
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "12px", padding: "16px", color: "#f59e0b", fontSize: "14px"
              }}>
                ⚠️ You have no appointment history. Book an appointment first before reporting a concern.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {myDoctors.map((doctor) => (
                  <div
                    key={doctor.doctorId}
                    onClick={() => {
                      setSelectedDoctorId(doctor.doctorId);
                      setSelectedDoctorName(doctor.doctorName);
                    }}
                    style={{
                      padding: "16px 20px", borderRadius: "14px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "14px",
                      background: selectedDoctorId === doctor.doctorId ? "rgba(37,99,235,0.12)" : "#0f172a",
                      border: selectedDoctorId === doctor.doctorId
                        ? "1px solid rgba(59,130,246,0.5)"
                        : "1px solid rgba(255,255,255,0.06)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{
                      width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
                    }}>👨‍⚕️</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>
                        {doctor.doctorName}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "13px" }}>
                        {doctor.specialization} &bull; ID: {doctor.doctorId}
                      </div>
                    </div>
                    {selectedDoctorId === doctor.doctorId && (
                      <div style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        background: "#2563eb", display: "flex", alignItems: "center",
                        justifyContent: "center", color: "white", fontSize: "13px", fontWeight: "700"
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Concern Type */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>🏷️ Concern Type</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {concernTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setConcernType(type)}
                  style={{
                    padding: "10px 16px", borderRadius: "10px", cursor: "pointer",
                    fontSize: "13px", fontWeight: "600", transition: "all 0.2s",
                    background: concernType === type ? "rgba(37,99,235,0.15)" : "#0f172a",
                    color: concernType === type ? "#60a5fa" : "#64748b",
                    border: concernType === type
                      ? "1px solid rgba(59,130,246,0.4)"
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div style={{ marginBottom: "24px" }}>
            <label style={labelStyle}>⚡ Severity</label>
            <div style={{ display: "flex", gap: "12px" }}>
              {severityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSeverity(opt.value)}
                  style={{
                    flex: 1, padding: "12px", borderRadius: "12px",
                    cursor: "pointer", fontWeight: "700", fontSize: "14px", transition: "all 0.2s",
                    background: severity === opt.value ? opt.bg : "#0f172a",
                    color: severity === opt.value ? opt.color : "#64748b",
                    border: severity === opt.value
                      ? `1px solid ${opt.color}40`
                      : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {opt.value === "Low" ? "🟢" : opt.value === "Medium" ? "🟡" : "🔴"} {opt.value}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "28px" }}>
            <label style={labelStyle}>📝 Describe Your Concern</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Describe your concern in detail so your doctor can help you better..."
              style={{ ...inputStyle, resize: "none", lineHeight: "22px" }}
            />
            <div style={{ color: "#475569", fontSize: "12px", marginTop: "6px" }}>
              {description.length} characters
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleSubmit}
              disabled={myDoctors.length === 0}
              style={{
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "16px 40px",
                borderRadius: "14px", fontSize: "16px", fontWeight: "700",
                cursor: myDoctors.length === 0 ? "not-allowed" : "pointer",
                opacity: myDoctors.length === 0 ? 0.5 : 1,
                boxShadow: "0 8px 20px rgba(37,99,235,0.3)"
              }}
            >
              📤 Submit Concern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientConcernReporter;