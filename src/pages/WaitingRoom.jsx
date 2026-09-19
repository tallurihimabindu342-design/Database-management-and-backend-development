import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function WaitingRoom() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName");
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const statuses = JSON.parse(localStorage.getItem("doctorStatuses")) || {};

  const myAppointment = appointments.find(
    a => a.patientName === patientName && (a.status === "Confirmed" || a.status === "In Progress")
  );

  const doctorStatus = myAppointment
    ? statuses[myAppointment.doctorId] || "Online"
    : "Online";

  const isLive = myAppointment?.status === "In Progress";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Patient" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          ⏳ Virtual Waiting Room
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Your doctor will be with you shortly. Please stay connected.
        </p>

        {!myAppointment ? (
          <div style={{
            background: "#0f172a", borderRadius: "18px", padding: "40px",
            border: "1px solid rgba(255,255,255,0.05)", color: "#94a3b8", textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
            <h2 style={{ color: "white", marginBottom: "8px" }}>No Confirmed Appointment</h2>
            <p>You don't have an active appointment to join.</p>
            <button
              onClick={() => navigate("/my-appointments")}
              style={{
                marginTop: "20px", background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "12px 24px",
                borderRadius: "12px", cursor: "pointer", fontWeight: "700"
              }}
            >
              📅 View My Appointments
            </button>
          </div>
        ) : (
          <div style={{ maxWidth: "640px" }}>

            {/* Status Card */}
            <div style={{
              background: "#0f172a", borderRadius: "20px", padding: "28px",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)", marginBottom: "20px"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ color: "white", margin: 0, fontSize: "20px" }}>🏥 Queue Status</h2>
                <div style={{
                  background: isLive ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
                  color: isLive ? "#22c55e" : "#f59e0b",
                  padding: "6px 14px", borderRadius: "999px", fontWeight: "700", fontSize: "13px"
                }}>
                  {isLive ? "🟢 Consultation Live" : "🟡 Waiting"}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
                {[
                  { label: "🔢 Queue Number", value: myAppointment.queueNumber || 1, color: "white" },
                  { label: "👥 Patients Ahead", value: Math.max(0, (myAppointment.queueNumber || 1) - 1), color: "white" },
                  { label: "⏱ Estimated Wait", value: `${myAppointment.estimatedWait || 10} mins`, color: "#f59e0b" },
                  {
                    label: "👨‍⚕️ Doctor Status",
                    value: doctorStatus === "In Consultation" ? "🟡 Busy" : "🟢 Online",
                    color: doctorStatus === "In Consultation" ? "#f59e0b" : "#22c55e"
                  },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#111827", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>{item.label}</div>
                    <div style={{ color: item.color, fontSize: "20px", fontWeight: "700" }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div style={{
                background: "#111827", borderRadius: "12px", padding: "16px", marginBottom: "20px"
              }}>
                <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>👨‍⚕️ Doctor</div>
                <div style={{ color: "white", fontWeight: "700" }}>{myAppointment.doctorName}</div>
                <div style={{ color: "#64748b", fontSize: "12px", marginTop: "8px", marginBottom: "4px" }}>📅 Appointment</div>
                <div style={{ color: "#94a3b8" }}>{myAppointment.date} • {myAppointment.time}</div>
              </div>

              <div style={{
                background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
                borderRadius: "12px", padding: "14px", marginBottom: "20px", color: "#93c5fd", fontSize: "14px"
              }}>
                💡 Please keep your internet connection active and stay available. Your consultation will begin shortly.
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("currentConsultation", JSON.stringify(myAppointment));
                  navigate("/patient-consultation-room");
                }}
                disabled={!isLive}
                style={{
                  width: "100%", padding: "16px",
                  background: isLive
                    ? "linear-gradient(90deg,#22c55e,#16a34a)"
                    : "#1e293b",
                  color: "white", border: "none", borderRadius: "14px",
                  cursor: isLive ? "pointer" : "not-allowed",
                  fontWeight: "700", fontSize: "16px",
                  opacity: isLive ? 1 : 0.5,
                  boxShadow: isLive ? "0 8px 24px rgba(34,197,94,0.3)" : "none",
                }}
              >
                {isLive ? "🎥 Join Consultation Now" : "⏳ Waiting for Doctor to Start..."}
              </button>
            </div>

            <button
              onClick={() => navigate("/my-appointments")}
              style={{
                background: "transparent", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)",
                padding: "12px 20px", borderRadius: "12px", cursor: "pointer", fontSize: "14px"
              }}
            >
              ← Back to Appointments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WaitingRoom;