import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function PatientHistory() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName");

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const reports = JSON.parse(localStorage.getItem("medicalReports")) || [];
  const consultations = JSON.parse(localStorage.getItem("consultationHistory")) || [];
  const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
  const referrals = JSON.parse(localStorage.getItem("referrals")) || [];
  const vitals = JSON.parse(localStorage.getItem("healthVitals")) || [];

  const myAppointments = appointments.filter(a => a.patientName === patientName);
  const myReports = reports.filter(r => r.patientName === patientName);
  const myConsultations = consultations.filter(c => c.patient === patientName);
  const myPrescriptions = prescriptions.filter(p => p.patient === patientName);
  const myReferrals = referrals.filter(r => r.patientName === patientName);
  const myVitals = vitals.filter(v => v.patientName === patientName);

  const cardStyle = {
    background: "linear-gradient(180deg,#0f172a,#111827)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "18px", padding: "20px", marginBottom: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)", color: "white",
  };

  const labelStyle = { color: "#64748b", fontSize: "12px", marginBottom: "3px" };
  const valueStyle = { color: "white", fontSize: "15px", fontWeight: "600" };

  const SectionHeader = ({ icon, title, count }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", marginTop: "32px" }}>
      <h2 style={{ color: "white", fontSize: "20px", fontWeight: "700", margin: 0 }}>{icon} {title}</h2>
      <span style={{ background: "#1e293b", color: "#94a3b8", padding: "4px 12px", borderRadius: "999px", fontSize: "13px" }}>
        {count} records
      </span>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div style={{ ...cardStyle, textAlign: "center", color: "#475569", padding: "30px" }}>
      {message}
    </div>
  );

  const statusColor = (status) =>
    status === "Completed" ? "#22c55e" : status === "Cancelled" ? "#ef4444" : status === "Confirmed" ? "#3b82f6" : "#f59e0b";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Patient" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          🗂 Health History
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Complete record of your appointments, prescriptions, referrals and vitals.
        </p>

        {/* Summary Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "12px", marginBottom: "10px" }}>
          {[
            { icon: "📅", label: "Appointments", count: myAppointments.length, color: "#3b82f6" },
            { icon: "📋", label: "Consultations", count: myConsultations.length, color: "#22c55e" },
            { icon: "💊", label: "Prescriptions", count: myPrescriptions.length, color: "#f59e0b" },
            { icon: "📄", label: "Reports", count: myReports.length, color: "#a855f7" },
            { icon: "🔗", label: "Referrals", count: myReferrals.length, color: "#06b6d4" },
            { icon: "❤️", label: "Vitals", count: myVitals.length, color: "#ef4444" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "#0f172a", borderRadius: "14px", padding: "16px",
              border: "1px solid rgba(255,255,255,0.05)", textAlign: "center"
            }}>
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ color: item.color, fontSize: "22px", fontWeight: "800" }}>{item.count}</div>
              <div style={{ color: "#64748b", fontSize: "11px", marginTop: "4px" }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Appointments */}
        <SectionHeader icon="📅" title="Appointment History" count={myAppointments.length} />
        {myAppointments.length === 0 ? <EmptyState message="No appointments found." /> :
          myAppointments.map((a, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
                <div><div style={labelStyle}>Doctor</div><div style={valueStyle}>{a.doctorName}</div></div>
                <div><div style={labelStyle}>Specialization</div><div style={{ ...valueStyle, color: "#60a5fa" }}>{a.specialization}</div></div>
                <div><div style={labelStyle}>Date & Time</div><div style={valueStyle}>{a.date} • {a.time}</div></div>
                <div>
                  <div style={labelStyle}>Status</div>
                  <span style={{ color: statusColor(a.status), fontWeight: "700", fontSize: "14px" }}>● {a.status}</span>
                </div>
              </div>
            </div>
          ))}

        {/* Consultations */}
        <SectionHeader icon="📋" title="Consultation Timeline" count={myConsultations.length} />
        {myConsultations.length === 0 ? <EmptyState message="No consultations found." /> :
          myConsultations.map((c, i) => (
            <div key={i} style={{ ...cardStyle, borderLeft: "3px solid #2563eb" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div><div style={labelStyle}>Doctor</div><div style={valueStyle}>{c.doctor}</div></div>
                <div><div style={labelStyle}>Date</div><div style={valueStyle}>{c.date}</div></div>
                <div><div style={labelStyle}>Duration</div><div style={{ ...valueStyle, color: "#22c55e" }}>{c.duration}s</div></div>
              </div>
              {c.notes && (
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={labelStyle}>Doctor Notes</div>
                  <div style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "20px", marginTop: "4px" }}>{c.notes}</div>
                </div>
              )}
            </div>
          ))}

        {/* Prescriptions */}
        <SectionHeader icon="💊" title="Prescription History" count={myPrescriptions.length} />
        {myPrescriptions.length === 0 ? <EmptyState message="No prescriptions found." /> :
          myPrescriptions.map((p, i) => (
            <div key={i} style={{ ...cardStyle, borderLeft: "3px solid #22c55e" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div><div style={labelStyle}>Doctor</div><div style={valueStyle}>{p.doctor}</div></div>
                <div><div style={labelStyle}>Follow-Up</div><div style={{ ...valueStyle, color: "#f59e0b" }}>{p.followUp || "—"}</div></div>
                <div><div style={labelStyle}>Date</div><div style={valueStyle}>{p.createdAt}</div></div>
              </div>
              <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                <div style={labelStyle}>Medicines</div>
                <div style={{ color: "#4ade80", fontSize: "14px", marginTop: "4px" }}>{p.medicines}</div>
              </div>
              {p.instructions && (
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px", marginTop: "8px" }}>
                  <div style={labelStyle}>Instructions</div>
                  <div style={{ color: "#cbd5e1", fontSize: "14px", marginTop: "4px" }}>{p.instructions}</div>
                </div>
              )}
            </div>
          ))}

        {/* Reports */}
        <SectionHeader icon="📄" title="Medical Reports" count={myReports.length} />
        {myReports.length === 0 ? <EmptyState message="No reports uploaded." /> :
          myReports.map((r, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ color: "white", fontWeight: "700", marginBottom: "4px" }}>📄 {r.reportName}</div>
                  <div style={{ color: "#64748b", fontSize: "13px" }}>{r.uploadedAt}</div>
                </div>
                <span style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" }}>
                  {r.fileType?.includes("pdf") ? "PDF" : "Image"}
                </span>
              </div>
            </div>
          ))}

        {/* Referrals */}
        <SectionHeader icon="🔗" title="Referral History" count={myReferrals.length} />
        {myReferrals.length === 0 ? <EmptyState message="No referrals found." /> :
          myReferrals.map((r, i) => (
            <div key={i} style={{ ...cardStyle, borderLeft: "3px solid #a855f7" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div><div style={labelStyle}>Specialist</div><div style={valueStyle}>{r.specialization}</div></div>
                <div><div style={labelStyle}>Referred By</div><div style={valueStyle}>{r.doctor}</div></div>
                <div>
                  <div style={labelStyle}>Urgency</div>
                  <span style={{
                    color: r.urgency === "High" ? "#ef4444" : r.urgency === "Medium" ? "#f59e0b" : "#22c55e",
                    fontWeight: "700", fontSize: "14px"
                  }}>{r.urgency}</span>
                </div>
              </div>
              {r.reason && (
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px", marginTop: "12px" }}>
                  <div style={labelStyle}>Reason</div>
                  <div style={{ color: "#cbd5e1", fontSize: "14px", marginTop: "4px" }}>{r.reason}</div>
                </div>
              )}
            </div>
          ))}

        {/* Vitals */}
        <SectionHeader icon="❤️" title="Vitals History" count={myVitals.length} />
        {myVitals.length === 0 ? <EmptyState message="No vitals recorded." /> :
          myVitals.map((v, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "10px" }}>
                {[
                  { label: "🩸 Sugar", value: `${v.sugar} mg/dL` },
                  { label: "❤️ Pulse", value: `${v.pulse} bpm` },
                  { label: "🫁 SpO₂", value: `${v.spo2}%` },
                  { label: "💧 Water", value: `${v.waterIntake}L` },
                  { label: "⚖️ Weight", value: `${v.weight} kg` },
                  { label: "📊 BP", value: v.bp },
                ].map((item, j) => (
                  <div key={j} style={{ background: "#0f172a", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                    <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>{item.label}</div>
                    <div style={{ color: "white", fontSize: "15px", fontWeight: "700" }}>{item.value || "--"}</div>
                  </div>
                ))}
              </div>
              <div style={{ color: "#475569", fontSize: "12px", marginTop: "10px" }}>Recorded: {v.recordedAt}</div>
            </div>
          ))}

        <div style={{ height: "40px" }} />
      </div>
    </div>
  );
}

export default PatientHistory;