import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const navigate = useNavigate();

  const patients = JSON.parse(localStorage.getItem("patients")) || [];
  const approvedDoctors = JSON.parse(localStorage.getItem("approvedDoctors")) || [];
  const doctorRequests = JSON.parse(localStorage.getItem("doctorRequests")) || [];
  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const consultations = JSON.parse(localStorage.getItem("consultationHistory")) || [];
  const vitals = JSON.parse(localStorage.getItem("healthVitals")) || [];

  const pendingRequests = doctorRequests.filter(r => r.status === "Pending").length;
  const confirmedAppointments = appointments.filter(a => a.status === "Confirmed").length;
  const cancelledAppointments = appointments.filter(a => a.status === "Cancelled").length;
  const completedAppointments = appointments.filter(a => a.status === "Completed").length;
  const highRiskPatients = vitals.filter(v => Number(v.sugar) > 140 || Number(v.spo2) < 95).length;

  const stats = [
    { icon: "👥", label: "Total Patients", value: patients.length, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    { icon: "👨‍⚕️", label: "Approved Doctors", value: approvedDoctors.length, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    { icon: "⏳", label: "Pending Requests", value: pendingRequests, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { icon: "📅", label: "Total Appointments", value: appointments.length, color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
    { icon: "✅", label: "Confirmed", value: confirmedAppointments, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
    { icon: "❌", label: "Cancelled", value: cancelledAppointments, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    { icon: "📋", label: "Completed", value: completedAppointments, color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
    { icon: "⚠️", label: "High Risk Patients", value: highRiskPatients, color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  ];

  const quickActions = [
    { icon: "👨‍⚕️", label: "Doctor Requests", path: "/doctor-requests", color: "#3b82f6" },
    { icon: "🌍", label: "Population Insights", path: "/population-insights", color: "#22c55e" },
  ];

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Administrator" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          🛡️ Administrator Dashboard
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Monitor healthcare operations and manage platform activity.
        </p>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "30px" }}>
          {stats.map((stat, i) => (
            <div key={i} style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "18px", padding: "20px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
            }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: stat.bg, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "22px", marginBottom: "12px"
              }}>
                {stat.icon}
              </div>
              <div style={{ color: stat.color, fontSize: "30px", fontWeight: "800", marginBottom: "4px" }}>
                {stat.value}
              </div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
          ⚡ Quick Actions
        </h2>
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {quickActions.map((action, i) => (
            <button key={i} onClick={() => navigate(action.path)} style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              border: "1px solid rgba(255,255,255,0.05)",
              color: "white", padding: "16px 24px", borderRadius: "14px",
              cursor: "pointer", fontWeight: "600", fontSize: "15px",
              display: "flex", alignItems: "center", gap: "10px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.2)"
            }}>
              <span>{action.icon}</span> {action.label}
            </button>
          ))}
        </div>

        {/* Recent Appointments */}
        <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", margin: "30px 0 16px" }}>
          📅 Recent Appointments
        </h2>
        {appointments.length === 0 ? (
          <div style={{
            background: "#0f172a", borderRadius: "16px", padding: "30px",
            border: "1px solid rgba(255,255,255,0.05)", color: "#64748b", textAlign: "center"
          }}>
            No appointments yet.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {appointments.slice(-5).reverse().map((a, i) => (
              <div key={i} style={{
                background: "linear-gradient(180deg,#0f172a,#111827)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "14px", padding: "16px 20px",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ display: "flex", gap: "20px" }}>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>Patient</div>
                    <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{a.patientName}</div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>Doctor</div>
                    <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{a.doctorName}</div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>Date</div>
                    <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{a.date}</div>
                  </div>
                </div>
                <span style={{
                  padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
                  background: a.status === "Confirmed" ? "rgba(34,197,94,0.15)" : a.status === "Completed" ? "rgba(168,85,247,0.15)" : a.status === "Cancelled" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                  color: a.status === "Confirmed" ? "#22c55e" : a.status === "Completed" ? "#a855f7" : a.status === "Cancelled" ? "#ef4444" : "#f59e0b",
                }}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;