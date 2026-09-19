import { useState } from "react";
import Sidebar from "../components/Sidebar";

function AdminAppointments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  const filtered = appointments.filter(a => {
    const matchSearch =
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (status) =>
    status === "Confirmed" ? "#22c55e" : status === "Completed" ? "#a855f7" :
    status === "Cancelled" ? "#ef4444" : status === "In Progress" ? "#3b82f6" : "#f59e0b";

  const statusBg = (status) =>
    status === "Confirmed" ? "rgba(34,197,94,0.12)" : status === "Completed" ? "rgba(168,85,247,0.12)" :
    status === "Cancelled" ? "rgba(239,68,68,0.12)" : status === "In Progress" ? "rgba(59,130,246,0.12)" : "rgba(245,158,11,0.12)";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Administrator" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          📅 All Appointments
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
          View and monitor all patient appointments across the platform.
        </p>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search patient or doctor..."
            style={{
              flex: 1, minWidth: "240px", maxWidth: "400px",
              padding: "12px 16px", background: "#0f172a", color: "white",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px",
              outline: "none", fontSize: "14px"
            }}
          />
          {["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: "10px 18px", borderRadius: "10px", border: "none",
              background: statusFilter === s ? "linear-gradient(90deg,#2563eb,#7c3aed)" : "#0f172a",
              color: statusFilter === s ? "white" : "#64748b",
              fontWeight: "600", fontSize: "13px", cursor: "pointer"
            }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "16px" }}>
          Showing {filtered.length} of {appointments.length} appointments
        </div>

        {filtered.length === 0 ? (
          <div style={{
            background: "#0f172a", borderRadius: "18px", padding: "40px",
            border: "1px solid rgba(255,255,255,0.05)", color: "#64748b", textAlign: "center"
          }}>
            No appointments match your filters.
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {filtered.slice().reverse().map((a, i) => (
              <div key={i} style={{
                background: "linear-gradient(180deg,#0f172a,#111827)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "16px", padding: "18px 22px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}>
                <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "rgba(59,130,246,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
                  }}>👤</div>
                  <div>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>{a.patientName}</div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>with {a.doctorName} • {a.specialization}</div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>Date & Time</div>
                    <div style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600" }}>{a.date} • {a.time}</div>
                  </div>
                  <div>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>Appointment ID</div>
                    <div style={{ color: "#475569", fontSize: "12px" }}>{a.appointmentId}</div>
                  </div>
                </div>
                <span style={{
                  padding: "5px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
                  background: statusBg(a.status), color: statusColor(a.status)
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

export default AdminAppointments;