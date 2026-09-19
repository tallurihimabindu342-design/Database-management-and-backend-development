import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function ConsultationSummary() {
  const navigate = useNavigate();
  const summary = JSON.parse(localStorage.getItem("consultationSummary"));
  const role = localStorage.getItem("role");
  const isDoctor = role === "Doctor";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role={isDoctor ? "Doctor" : "Patient"} />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          📋 Consultation Summary
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          {isDoctor ? "Consultation completed successfully." : "Your consultation has been completed."}
        </p>

        {!summary ? (
          <div style={{
            background: "#0f172a", borderRadius: "18px", padding: "30px",
            border: "1px solid rgba(255,255,255,0.05)", color: "#94a3b8", textAlign: "center"
          }}>
            No consultation summary available.
          </div>
        ) : (
          <>
            <div style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "20px", padding: "28px", marginBottom: "20px"
            }}>
              <h2 style={{ color: "white", marginBottom: "20px", fontSize: "20px" }}>🩺 Consultation Details</h2>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>👨‍⚕️ Doctor</div>
                  <div style={{ color: "white", fontSize: "16px", fontWeight: "700" }}>{summary.doctor || "--"}</div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>🧑 Patient</div>
                  <div style={{ color: "white", fontSize: "16px", fontWeight: "700" }}>{summary.patient || "--"}</div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>🕒 Duration</div>
                  <div style={{ color: "#22c55e", fontSize: "16px", fontWeight: "700" }}>{summary.duration}s</div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>📅 Date</div>
                  <div style={{ color: "white", fontSize: "16px", fontWeight: "700" }}>{summary.date || "--"}</div>
                </div>
              </div>

              <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px", marginTop: "14px" }}>
                <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>📝 Doctor Notes</div>
                <div style={{ color: "white", fontSize: "14px", lineHeight: "22px" }}>{summary.notes || "No notes recorded."}</div>
              </div>

              <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px", marginTop: "14px" }}>
                <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>🔁 Follow-Up</div>
                <div style={{ color: "#fbbf24", fontSize: "14px" }}>{summary.followUp || "No follow-up required."}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {isDoctor ? (
                <>
                  <button
                    onClick={() => navigate("/doctor")}
                    style={{
                      background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                      color: "white", border: "none", padding: "14px 28px",
                      borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                    }}
                  >
                    🏠 Back to Dashboard
                  </button>
                  <button
                    onClick={() => navigate("/consultation-history")}
                    style={{
                      background: "#1e293b", color: "white", border: "none",
                      padding: "14px 28px", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                    }}
                  >
                    📂 View History
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/patient")}
                    style={{
                      background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                      color: "white", border: "none", padding: "14px 28px",
                      borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                    }}
                  >
                    🏠 Back to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      const summary = JSON.parse(localStorage.getItem("consultationSummary"));
                      const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
                      const appt = appointments.find(a => a.patientName === summary?.patient && a.status === "Completed");
                      if (appt) {
                        localStorage.setItem("reviewDoctorId", appt.doctorId);
                        localStorage.setItem("reviewDoctorName", appt.doctorName);
                      }
                      navigate("/add-review");
                    }}
                    style={{
                      background: "linear-gradient(90deg,#f59e0b,#d97706)",
                      color: "white", border: "none", padding: "14px 28px",
                      borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                    }}
                  >
                    ⭐ Leave a Review
                  </button>
                  <button
                    onClick={() => navigate("/my-prescriptions")}
                    style={{
                      background: "#1e293b", color: "white", border: "none",
                      padding: "14px 28px", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                    }}
                  >
                    💊 View Prescriptions
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ConsultationSummary;