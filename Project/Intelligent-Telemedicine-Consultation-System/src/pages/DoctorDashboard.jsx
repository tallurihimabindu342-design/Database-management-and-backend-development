import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function DoctorDashboard() {
  const navigate = useNavigate();
  const doctorName = localStorage.getItem("currentDoctor");
  const doctorId = localStorage.getItem("doctorId");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    fetchAppointments();
  }, [doctorId]);

  async function fetchAppointments() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${API_BASE}/api/appointments/doctor/${encodeURIComponent(doctorId)}`
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch appointments.");
      // Sort by urgency score descending
      const sorted = data.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));
      setAppointments(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(appointmentId, status) {
    try {
      setUpdatingId(appointmentId);
      const response = await fetch(
        `${API_BASE}/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update status.");

      setAppointments((prev) =>
        prev.map((a) =>
          a.appointmentId === appointmentId ? { ...a, status } : a
        )
      );
    } catch (err) {
      alert("Failed to update: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  // Stats derived from appointments
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter((a) => a.status === "Confirmed").length,
    pending: appointments.filter((a) => a.status === "Pending").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length,
    completed: appointments.filter((a) => a.status === "Completed").length,
    uniquePatients: new Set(appointments.map((a) => a.patientName)).size,
  };

  const statusStyle = (status) => {
    const map = {
      Confirmed: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" },
      "In Progress": { bg: "rgba(59,130,246,0.15)", color: "#3b82f6" },
      Completed: { bg: "rgba(168,85,247,0.15)", color: "#a855f7" },
      Cancelled: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" },
      Pending: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" },
    };
    return map[status] || map.Pending;
  };

  const cardStyle = {
    background: "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "20px", padding: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
    marginBottom: "18px",
  };

  const btnStyle = (bg) => ({
    padding: "10px 18px", border: "none", borderRadius: "10px",
    background: bg, color: "white", cursor: "pointer",
    fontWeight: "600", fontSize: "13px",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Doctor" />

      <div style={{ flex: 1, padding: "32px" }}>

        {/* Header */}
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          Welcome, {doctorName}
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
          Manage your appointments and patient consultations.
        </p>

        <button
          onClick={() => navigate("/doctor-availability")}
          style={{
            ...btnStyle("linear-gradient(90deg,#2563eb,#7c3aed)"),
            marginBottom: "28px", padding: "12px 22px", fontSize: "14px",
          }}
        >
          Manage Availability
        </button>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "14px", marginBottom: "28px" }}>
          {[
            { label: "Total", value: stats.total, color: "white" },
            { label: "Pending", value: stats.pending, color: "#f59e0b" },
            { label: "Confirmed", value: stats.confirmed, color: "#22c55e" },
            { label: "Completed", value: stats.completed, color: "#a855f7" },
            { label: "Cancelled", value: stats.cancelled, color: "#ef4444" },
            { label: "Patients", value: stats.uniquePatients, color: "#60a5fa" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "#111827", borderRadius: "16px", padding: "18px",
              border: "1px solid rgba(255,255,255,0.05)", textAlign: "center",
            }}>
              <div style={{ color: stat.color, fontSize: "28px", fontWeight: "800" }}>
                {stat.value}
              </div>
              <div style={{ color: "#64748b", fontSize: "11px", marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Appointments */}
        <h2 style={{ color: "white", fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
          Appointment Requests
        </h2>

        {loading && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Loading appointments...
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
            color: "#f87171", fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        {!loading && !error && appointments.length === 0 && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📅</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700" }}>
              No appointments yet
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginTop: "8px" }}>
              Patient appointments will appear here once booked.
            </div>
          </div>
        )}

        {appointments.map((appt) => {
          const s = statusStyle(appt.status);
          const isUpdating = updatingId === appt.appointmentId;

          return (
            <div key={appt.appointmentId} style={cardStyle}>

              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
                <div>
                  <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>
                    {appt.patientName}
                  </div>
                  <div style={{ color: "#60a5fa", fontSize: "13px" }}>
                    {appt.appointmentId}
                  </div>
                </div>
                <span style={{
                  padding: "6px 14px", borderRadius: "999px", fontWeight: "700",
                  fontSize: "12px", background: s.bg, color: s.color,
                }}>
                  {appt.status}
                </span>
              </div>

              {/* Details */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "16px" }}>
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "3px" }}>DATE</div>
                  <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>
                    {new Date(appt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "3px" }}>TIME</div>
                  <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{appt.time}</div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "3px" }}>LANGUAGE</div>
                  <div style={{ color: "#60a5fa", fontSize: "14px", fontWeight: "600" }}>
                    {appt.language || "English"}
                  </div>
                </div>
              </div>

              {/* Urgency */}
              {appt.urgencyScore != null && (
                <div style={{ marginBottom: "14px" }}>
                  <span style={{
                    padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700",
                    background: appt.urgencyScore >= 70 ? "rgba(239,68,68,0.15)" :
                      appt.urgencyScore >= 40 ? "rgba(245,158,11,0.15)" : "rgba(34,197,94,0.15)",
                    color: appt.urgencyScore >= 70 ? "#ef4444" :
                      appt.urgencyScore >= 40 ? "#f59e0b" : "#22c55e",
                  }}>
                    Urgency: {appt.urgencyScore}
                  </span>
                </div>
              )}

              {/* Symptoms */}
              {appt.symptoms && (
                <div style={{
                  background: "#0f172a", borderRadius: "12px", padding: "14px",
                  marginBottom: "14px", border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "6px", fontWeight: "700" }}>
                    PATIENT SYMPTOMS
                  </div>
                  <div style={{ color: "white", fontSize: "13px", lineHeight: "22px" }}>
                    {appt.symptoms}
                  </div>
                </div>
              )}

              {/* Translation */}
              {appt.language !== "English" && appt.translatedSymptoms && (
                <div style={{
                  background: "#1e293b", borderRadius: "12px", padding: "14px",
                  marginBottom: "14px", border: "1px solid rgba(255,255,255,0.05)",
                }}>
                  <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "6px", fontWeight: "700" }}>
                    ENGLISH TRANSLATION
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "22px" }}>
                    {appt.translatedSymptoms}
                  </div>
                </div>
              )}

              <div style={{ color: "#475569", fontSize: "12px", marginBottom: "16px" }}>
                Booked: {appt.bookedAt}
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>

                {appt.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(appt.appointmentId, "Confirmed")}
                      disabled={isUpdating}
                      style={btnStyle("linear-gradient(90deg,#22c55e,#16a34a)")}
                    >
                      {isUpdating ? "Updating..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => updateStatus(appt.appointmentId, "Cancelled")}
                      disabled={isUpdating}
                      style={btnStyle("linear-gradient(90deg,#ef4444,#dc2626)")}
                    >
                      {isUpdating ? "Updating..." : "Cancel"}
                    </button>
                  </>
                )}

                {appt.status === "Confirmed" && (
                  <>
                    <button
                      onClick={() => {
                        localStorage.setItem("currentConsultation", JSON.stringify(appt));
                        localStorage.setItem("selectedAppointment", appt.appointmentId);
                        localStorage.setItem("selectedPatient", appt.patientName);
                        updateStatus(appt.appointmentId, "In Progress");
                        navigate("/consultation-room");
                      }}
                      style={btnStyle("linear-gradient(90deg,#2563eb,#7c3aed)")}
                    >
                      Start Consultation
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem("selectedAppointment", appt.appointmentId);
                        localStorage.setItem("selectedPatient", appt.patientName);
                        navigate("/prescription");
                      }}
                      style={btnStyle("linear-gradient(90deg,#0ea5e9,#0284c7)")}
                    >
                      Write Prescription
                    </button>
                    <button
                      onClick={() => navigate("/referral")}
                      style={btnStyle("#1e293b")}
                    >
                      Create Referral
                    </button>
                  </>
                )}

                {appt.status === "In Progress" && (
                  <button
                    onClick={() => {
                      localStorage.setItem("currentConsultation", JSON.stringify(appt));
                      navigate("/consultation-room");
                    }}
                    style={btnStyle("linear-gradient(90deg,#2563eb,#7c3aed)")}
                  >
                    Rejoin Consultation
                  </button>
                )}

                {appt.status === "Completed" && (
                  <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: "600" }}>
                    Consultation completed
                  </span>
                )}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default DoctorDashboard;