import { useState } from "react";
import Sidebar from "../components/Sidebar";

function DoctorConcernCenter() {
  // ← THIS was the bug — was using "currentDoctorId" which doesn't exist
  // Your app saves the doctor's ID as "doctorId" in localStorage
  const loggedInDoctorId = localStorage.getItem("doctorId");
  const loggedInDoctorName = localStorage.getItem("currentDoctor");

  const allConcerns = JSON.parse(localStorage.getItem("patientConcerns")) || [];

  // Only show concerns where doctorId matches the logged-in doctor
  const [concerns, setConcerns] = useState(
    allConcerns.filter((c) => c.doctorId === loggedInDoctorId)
  );
  const [responses, setResponses] = useState({});

  const severityStyle = (severity) => ({
    padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
    background:
      severity === "High" ? "rgba(239,68,68,0.15)" :
      severity === "Medium" ? "rgba(245,158,11,0.15)" :
      "rgba(34,197,94,0.15)",
    color:
      severity === "High" ? "#ef4444" :
      severity === "Medium" ? "#f59e0b" : "#22c55e",
  });

  const markReviewed = (concern, index) => {
    const responseText = responses[index] ?? concern.doctorResponse ?? "";
    if (!responseText.trim()) {
      alert("Please write a response before sending.");
      return;
    }

    // Update only the matching concern in the full list
    const allStored = JSON.parse(localStorage.getItem("patientConcerns")) || [];
    const updatedAll = allStored.map((c) =>
      c.patientName === concern.patientName &&
      c.createdAt === concern.createdAt &&
      c.doctorId === concern.doctorId
        ? {
            ...c,
            status: "Reviewed",
            doctorResponse: responseText,
            respondedAt: new Date().toLocaleString(),
          }
        : c
    );
    localStorage.setItem("patientConcerns", JSON.stringify(updatedAll));

    // Notify the patient
    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      patientName: concern.patientName,
      type: "ConcernResponse",
      title: "Doctor Responded to Your Concern",
      message: `Dr. ${loggedInDoctorName} has reviewed and responded to your concern regarding "${concern.concernType}".`,
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // Update local state without reload
    setConcerns((prev) =>
      prev.map((c, i) =>
        i === index
          ? { ...c, status: "Reviewed", doctorResponse: responseText, respondedAt: new Date().toLocaleString() }
          : c
      )
    );
  };

  const pending = concerns.filter((c) => c.status === "Pending").length;
  const reviewed = concerns.filter((c) => c.status === "Reviewed").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Doctor" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          💬 Patient Concerns
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          Concerns submitted directly to you by your patients.
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Concerns", value: concerns.length, icon: "💬", color: "#60a5fa" },
            { label: "Pending Response", value: pending, icon: "🕐", color: "#f59e0b" },
            { label: "Reviewed", value: reviewed, icon: "✅", color: "#22c55e" },
          ].map((stat, i) => (
            <div key={i} style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              borderRadius: "16px", padding: "20px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ fontSize: "22px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ color: stat.color, fontSize: "28px", fontWeight: "800", marginBottom: "4px" }}>
                {stat.value}
              </div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Debug helper — remove after confirming it works */}
        <div style={{
          background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)",
          borderRadius: "10px", padding: "10px 14px", marginBottom: "20px",
          color: "#60a5fa", fontSize: "12px"
        }}>
          Logged in as Doctor ID: <strong>{loggedInDoctorId || "NOT SET"}</strong> &bull; Name: <strong>{loggedInDoctorName || "NOT SET"}</strong>
        </div>

        {concerns.length === 0 ? (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            borderRadius: "20px", padding: "48px", textAlign: "center",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              No Concerns Yet
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px" }}>
              None of your patients have submitted concerns yet.
            </div>
          </div>
        ) : (
          concerns.map((concern, index) => (
            <div key={index} style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              border: concern.status === "Pending"
                ? "1px solid rgba(245,158,11,0.25)"
                : "1px solid rgba(255,255,255,0.05)",
              borderRadius: "20px", padding: "28px", marginBottom: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px"
                  }}>🧑</div>
                  <div>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "17px" }}>
                      {concern.patientName}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "12px" }}>
                      {concern.concernType} &bull; {concern.createdAt}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={severityStyle(concern.severity)}>{concern.severity} Severity</span>
                  <span style={{
                    padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
                    background: concern.status === "Reviewed" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                    color: concern.status === "Reviewed" ? "#22c55e" : "#f59e0b"
                  }}>
                    {concern.status === "Reviewed" ? "✅ Reviewed" : "🕐 Pending"}
                  </span>
                </div>
              </div>

              {/* Concern Description */}
              <div style={{
                background: "#0f172a", borderRadius: "12px", padding: "16px", marginBottom: "20px"
              }}>
                <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "6px" }}>PATIENT CONCERN</div>
                <div style={{ color: "white", fontSize: "14px", lineHeight: "22px" }}>
                  {concern.description}
                </div>
              </div>

              {/* Previous Response */}
              {concern.status === "Reviewed" && concern.doctorResponse && (
                <div style={{
                  background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)",
                  borderRadius: "12px", padding: "14px", marginBottom: "16px"
                }}>
                  <div style={{ color: "#22c55e", fontSize: "11px", fontWeight: "700", marginBottom: "6px" }}>
                    YOUR PREVIOUS RESPONSE
                  </div>
                  <div style={{ color: "white", fontSize: "14px", lineHeight: "22px" }}>
                    {concern.doctorResponse}
                  </div>
                  {concern.respondedAt && (
                    <div style={{ color: "#475569", fontSize: "11px", marginTop: "8px" }}>
                      Sent: {concern.respondedAt}
                    </div>
                  )}
                </div>
              )}

              {/* Response Input */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  color: "#94a3b8", fontSize: "13px", fontWeight: "600",
                  display: "block", marginBottom: "8px"
                }}>
                  {concern.status === "Reviewed" ? "Update Your Response" : "Write a Response"}
                </label>
                <textarea
                  placeholder="Write your medical response to this patient..."
                  value={responses[index] ?? concern.doctorResponse ?? ""}
                  onChange={(e) => setResponses((prev) => ({ ...prev, [index]: e.target.value }))}
                  rows={3}
                  style={{
                    width: "100%", padding: "14px",
                    background: "#0f172a", color: "white",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px", fontSize: "14px",
                    resize: "none", outline: "none",
                    boxSizing: "border-box", lineHeight: "22px"
                  }}
                />
              </div>

              <button
                onClick={() => markReviewed(concern, index)}
                style={{
                  background: concern.status === "Reviewed"
                    ? "linear-gradient(90deg,#0ea5e9,#0284c7)"
                    : "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "white", border: "none", padding: "12px 24px",
                  borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px"
                }}
              >
                {concern.status === "Reviewed" ? "🔄 Update Response" : "✅ Send Response"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorConcernCenter;