import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function MyConcerns() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName");
  const concerns = JSON.parse(localStorage.getItem("patientConcerns")) || [];
  const myConcerns = concerns.filter((c) => c.patientName === patientName);

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

  const totalConcerns = myConcerns.length;
  const highPriority = myConcerns.filter((c) => c.severity === "High").length;
  const reviewed = myConcerns.filter((c) => c.status === "Reviewed").length;
  const pending = myConcerns.filter((c) => c.status === "Pending").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          📝 My Concerns
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          Track all concerns you've submitted to your doctors.
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total", value: totalConcerns, icon: "📋", color: "#60a5fa" },
            { label: "Pending", value: pending, icon: "🕐", color: "#f59e0b" },
            { label: "Reviewed", value: reviewed, icon: "✅", color: "#22c55e" },
            { label: "High Priority", value: highPriority, icon: "🔴", color: "#ef4444" },
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

        {/* New Concern Button */}
        <div style={{ marginBottom: "24px" }}>
          <button
            onClick={() => navigate("/report-concern")}
            style={{
              background: "linear-gradient(90deg,#2563eb,#7c3aed)",
              color: "white", border: "none", padding: "12px 24px",
              borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px"
            }}
          >
            + Report New Concern
          </button>
        </div>

        {myConcerns.length === 0 ? (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            borderRadius: "20px", padding: "48px", textAlign: "center",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              No Concerns Submitted
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
              You haven't reported any health concerns yet.
            </div>
            <button
              onClick={() => navigate("/report-concern")}
              style={{
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "12px 24px",
                borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px"
              }}
            >
              Report Your First Concern
            </button>
          </div>
        ) : (
          myConcerns.map((concern, index) => (
            <div key={index} style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              borderRadius: "20px", padding: "24px", marginBottom: "18px",
              border: concern.status === "Reviewed"
                ? "1px solid rgba(34,197,94,0.15)"
                : "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <div style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
                    {concern.concernType}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "12px" }}>
                    Submitted: {concern.createdAt}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={severityStyle(concern.severity)}>{concern.severity}</span>
                  <span style={{
                    padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
                    background: concern.status === "Reviewed" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                    color: concern.status === "Reviewed" ? "#22c55e" : "#f59e0b"
                  }}>
                    {concern.status === "Reviewed" ? "✅ Reviewed" : "🕐 Pending"}
                  </span>
                </div>
              </div>

              {/* Sent To Doctor */}
              <div style={{
                background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)",
                borderRadius: "10px", padding: "10px 14px", marginBottom: "14px",
                display: "flex", alignItems: "center", gap: "10px"
              }}>
                <span style={{ fontSize: "16px" }}>👨‍⚕️</span>
                <div>
                  <span style={{ color: "#64748b", fontSize: "11px" }}>SENT TO</span>
                  <div style={{ color: "#60a5fa", fontWeight: "700", fontSize: "14px" }}>
                    {concern.doctorName || "Your Doctor"}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ background: "#0f172a", borderRadius: "12px", padding: "14px", marginBottom: "14px" }}>
                <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>YOUR CONCERN</div>
                <div style={{ color: "white", fontSize: "14px", lineHeight: "22px" }}>{concern.description}</div>
              </div>

              {/* Doctor Response */}
              {concern.doctorResponse ? (
                <div style={{
                  background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)",
                  borderRadius: "12px", padding: "14px"
                }}>
                  <div style={{ color: "#22c55e", fontSize: "11px", fontWeight: "700", marginBottom: "6px" }}>
                    👨‍⚕️ DOCTOR RESPONSE
                  </div>
                  <div style={{ color: "white", fontSize: "14px", lineHeight: "22px" }}>
                    {concern.doctorResponse}
                  </div>
                  {concern.respondedAt && (
                    <div style={{ color: "#475569", fontSize: "11px", marginTop: "8px" }}>
                      Responded: {concern.respondedAt}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)",
                  borderRadius: "12px", padding: "12px 14px",
                  color: "#f59e0b", fontSize: "13px"
                }}>
                  ⏳ Awaiting response from your doctor.
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyConcerns;