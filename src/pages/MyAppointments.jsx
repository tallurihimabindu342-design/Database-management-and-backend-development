import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function MyAppointments() {
  const patientName = localStorage.getItem("patientName");
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/api/appointments/patient/${encodeURIComponent(patientName)}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load appointments.");
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (patientName) fetchAppointments();
  }, [patientName]);

  const updateStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setAppointments((prev) =>
        prev.map((a) => a.appointmentId === appointmentId ? { ...a, status } : a)
      );
    } catch (err) {
      alert("Failed to update: " + err.message);
    }
  };

  const statusStyle = (status) => {
    const map = {
      Confirmed: { bg: "rgba(34,197,94,0.15)", color: "#22c55e", label: "🟢 Confirmed" },
      "In Progress": { bg: "rgba(59,130,246,0.15)", color: "#3b82f6", label: "🔵 Consultation Live" },
      Completed: { bg: "rgba(168,85,247,0.15)", color: "#a855f7", label: "🟣 Completed" },
      Cancelled: { bg: "rgba(239,68,68,0.15)", color: "#ef4444", label: "🔴 Cancelled" },
      Pending: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b", label: "🟡 Pending" },
    };
    return map[status] || map.Pending;
  };

  const cardStyle = {
    background: "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "20px", padding: "24px",
    marginBottom: "18px",
    border: "1px solid rgba(255,255,255,0.05)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    color: "white",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          📅 My Appointments
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
          View and manage your consultations.
        </p>

        {loading && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Loading your appointments...
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
            color: "#f87171", fontSize: "14px"
          }}>
            ⚠ {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              No Appointments Yet
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
              Book your first appointment with a specialist.
            </div>
            <button
              onClick={() => navigate("/book-appointment")}
              style={{
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "12px 28px",
                borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px"
              }}
            >
              📅 Book Appointment
            </button>
          </div>
        )}

        {appointments.map((appt) => {
          const s = statusStyle(appt.status);
          return (
            <div key={appt.appointmentId} style={cardStyle}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                <div>
                  <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>
                    {appt.doctorName}
                  </div>
                  <div style={{ color: "#60a5fa", fontSize: "13px" }}>{appt.specialization}</div>
                </div>
                <span style={{
                  padding: "6px 14px", borderRadius: "999px", fontWeight: "700",
                  fontSize: "12px", background: s.bg, color: s.color
                }}>
                  {s.label}
                </span>
              </div>

              {/* Details Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "18px" }}>
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "3px" }}>DATE</div>
                  <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{appt.date}</div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "3px" }}>TIME</div>
                  <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{appt.time}</div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "3px" }}>APPOINTMENT ID</div>
                  <div style={{ color: "#60a5fa", fontSize: "12px", fontWeight: "600" }}>{appt.appointmentId}</div>
                </div>
              </div>

              <div style={{ color: "#475569", fontSize: "12px", marginBottom: "16px" }}>
                Booked: {appt.bookedAt}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {appt.status === "Pending" && (
                  <button
                    onClick={() => updateStatus(appt.appointmentId, "Cancelled")}
                    style={{
                      padding: "10px 18px",
                      background: "linear-gradient(90deg,#ef4444,#dc2626)",
                      color: "white", border: "none", borderRadius: "10px",
                      cursor: "pointer", fontWeight: "600", fontSize: "13px"
                    }}
                  >
                    ❌ Cancel
                  </button>
                )}

                {appt.status === "In Progress" && (
                  <button
                    onClick={() => {
                      localStorage.setItem("currentConsultation", JSON.stringify(appt));
                      navigate("/patient-consultation-room");
                    }}
                    style={{
                      padding: "10px 20px",
                      background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                      color: "white", border: "none", borderRadius: "10px",
                      cursor: "pointer", fontWeight: "700", fontSize: "13px"
                    }}
                  >
                    🎥 Join Consultation
                  </button>
                )}

                {appt.status === "Completed" && (
                  <>
                    <button
                      onClick={() => {
                        localStorage.setItem("reviewDoctorId", appt.doctorId);
                        localStorage.setItem("reviewDoctorName", appt.doctorName);
                        navigate("/add-review");
                      }}
                      style={{
                        padding: "10px 18px",
                        background: "linear-gradient(90deg,#f59e0b,#d97706)",
                        color: "white", border: "none", borderRadius: "10px",
                        cursor: "pointer", fontWeight: "600", fontSize: "13px"
                      }}
                    >
                      ⭐ Leave Review
                    </button>
                    <button
                      onClick={() => navigate("/consultation-summary")}
                      style={{
                        padding: "10px 18px",
                        background: "linear-gradient(90deg,#7c3aed,#6d28d9)",
                        color: "white", border: "none", borderRadius: "10px",
                        cursor: "pointer", fontWeight: "600", fontSize: "13px"
                      }}
                    >
                      📋 View Summary
                    </button>
                  </>
                )}

                {appt.status === "Cancelled" && (
  <button
    onClick={() => {
      localStorage.setItem("cancelledAppointment", JSON.stringify(appt));
      navigate("/reschedule");
    }}
                    style={{
                      padding: "10px 18px",
                      background: "linear-gradient(90deg,#0ea5e9,#0284c7)",
                      color: "white", border: "none", borderRadius: "10px",
                      cursor: "pointer", fontWeight: "600", fontSize: "13px"
                    }}
                  >
                    🔄 Reschedule
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyAppointments;