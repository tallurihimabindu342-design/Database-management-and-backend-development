import Sidebar from "../components/Sidebar";

function ConsultationHistory() {
  const role = localStorage.getItem("role");
  const isDoctor = role === "Doctor";
  const doctorName = localStorage.getItem("currentDoctor");

  const allConsultations = JSON.parse(localStorage.getItem("consultationHistory")) || [];
  const consultations = isDoctor
    ? allConsultations.filter(c => c.doctor === doctorName)
    : allConsultations;

  const formatDuration = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role={isDoctor ? "Doctor" : "Patient"} />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          📋 Consultation History
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Review completed consultations and patient interactions.
        </p>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "30px", maxWidth: "600px" }}>
          {[
            { label: "Total Consultations", value: consultations.length, color: "#3b82f6" },
            { label: "Avg Duration", value: consultations.length === 0 ? "--" : formatDuration(Math.round(consultations.reduce((t, c) => t + c.duration, 0) / consultations.length)), color: "#22c55e" },
            { label: "Unique Patients", value: new Set(consultations.map(c => c.patient)).size, color: "#a855f7" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#0f172a", borderRadius: "14px", padding: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>{item.label}</div>
              <div style={{ color: item.color, fontSize: "24px", fontWeight: "800" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {consultations.length === 0 ? (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            borderRadius: "20px", padding: "48px", textAlign: "center",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <h2 style={{ color: "white", marginBottom: "8px" }}>No Consultation Records</h2>
            <p style={{ color: "#94a3b8" }}>Completed consultations will appear here.</p>
          </div>
        ) : (
          consultations.slice().reverse().map((c, i) => (
            <div key={i} style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderLeft: "3px solid #2563eb",
              borderRadius: "18px", padding: "22px", marginBottom: "16px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                <div>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>🧑 Patient</div>
                  <div style={{ color: "white", fontWeight: "700" }}>{c.patient || "--"}</div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>👨‍⚕️ Doctor</div>
                  <div style={{ color: "white", fontWeight: "700" }}>{c.doctor || "--"}</div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>🕒 Duration</div>
                  <div style={{ color: "#22c55e", fontWeight: "700" }}>{formatDuration(c.duration)}</div>
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>📅 Date</div>
                  <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{c.date}</div>
                </div>
              </div>

              {(c.symptomType || c.bodyPart || c.severity) && (
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px", marginBottom: "10px" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "8px", fontWeight: "600" }}>🩺 Symptoms</div>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {c.symptomType && <span style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", padding: "3px 10px", borderRadius: "999px", fontSize: "12px" }}>{c.symptomType}</span>}
                    {c.bodyPart && <span style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", padding: "3px 10px", borderRadius: "999px", fontSize: "12px" }}>{c.bodyPart}</span>}
                    {c.severity && <span style={{ background: c.severity === "High" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)", color: c.severity === "High" ? "#ef4444" : "#f59e0b", padding: "3px 10px", borderRadius: "999px", fontSize: "12px" }}>{c.severity} Severity</span>}
                  </div>
                  {c.symptomDescription && <div style={{ color: "#94a3b8", fontSize: "13px", marginTop: "8px" }}>{c.symptomDescription}</div>}
                </div>
              )}

              {c.notes && (
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px", fontWeight: "600" }}>📝 Doctor Notes</div>
                  <div style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "20px" }}>{c.notes}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConsultationHistory;