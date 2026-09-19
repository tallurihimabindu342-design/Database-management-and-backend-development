import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function AppointmentRescheduler() {
  const navigate = useNavigate();

  const cancelledAppointment = JSON.parse(localStorage.getItem("cancelledAppointment"));
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch availability from localStorage (will migrate to backend later)
    const stored = JSON.parse(localStorage.getItem("doctorAvailability")) || [];
    setAvailability(stored);
  }, []);

  const rebookAppointment = async (slot) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE}/api/appointments/${cancelledAppointment.appointmentId}/reschedule`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: slot.date, time: slot.time }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Reschedule failed.");

      // Remove rebooked slot from localStorage availability
      const updatedAvailability = availability.filter(
        (s) => !(s.doctorId === cancelledAppointment.doctorId && s.date === slot.date && s.time === slot.time)
      );
      localStorage.setItem("doctorAvailability", JSON.stringify(updatedAvailability));
      localStorage.removeItem("cancelledAppointment");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!cancelledAppointment) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar role="Patient" />
        <div style={{
          flex: 1, padding: "32px",
          background: "linear-gradient(135deg,#020617,#071938,#10214f)",
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ fontSize: "60px", marginBottom: "20px" }}>📅</div>
          <h2 style={{ color: "white", marginBottom: "10px" }}>No Cancelled Appointment Found</h2>
          <p style={{ color: "#94a3b8", marginBottom: "24px" }}>There is no appointment to reschedule.</p>
          <button onClick={() => navigate("/my-appointments")} style={{
            background: "linear-gradient(90deg,#2563eb,#7c3aed)", color: "white",
            border: "none", padding: "14px 28px", borderRadius: "12px",
            cursor: "pointer", fontWeight: "700"
          }}>
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ display: "flex" }}>
        <Sidebar role="Patient" />
        <div style={{
          flex: 1, padding: "32px",
          background: "linear-gradient(135deg,#020617,#071938,#10214f)",
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "24px", padding: "48px", textAlign: "center", maxWidth: "480px"
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
            <div style={{ color: "#22c55e", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>
              Appointment Rescheduled!
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
              Your appointment with {cancelledAppointment.doctorName} has been rescheduled successfully.
            </div>
            <button
              onClick={() => navigate("/my-appointments")}
              style={{
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "14px 28px",
                borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
              }}
            >
              View My Appointments
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableSlots = availability.filter(
    (s) => s.doctorId === cancelledAppointment.doctorId
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Patient" />
      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          Reschedule Appointment
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
          Choose a new available slot with your doctor.
        </p>

        {/* Cancelled appointment info */}
        <div style={{
          background: "linear-gradient(180deg,#0f172a,#111827)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: "18px", padding: "22px", marginBottom: "28px"
        }}>
          <div style={{ color: "#ef4444", fontSize: "13px", fontWeight: "700", marginBottom: "12px" }}>
            Cancelled Appointment
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
            <div>
              <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>Doctor</div>
              <div style={{ color: "white", fontWeight: "700" }}>{cancelledAppointment.doctorName}</div>
            </div>
            <div>
              <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>Original Date</div>
              <div style={{ color: "white", fontWeight: "700" }}>{cancelledAppointment.date}</div>
            </div>
            <div>
              <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>Specialization</div>
              <div style={{ color: "#60a5fa", fontWeight: "700" }}>{cancelledAppointment.specialization}</div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
            color: "#f87171", fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
          Available Slots
        </h2>

        {availableSlots.length === 0 ? (
          <div style={{
            background: "#0f172a", borderRadius: "16px", padding: "40px",
            border: "1px solid rgba(255,255,255,0.05)", color: "#64748b", textAlign: "center"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>😔</div>
            <p>No available slots for this doctor at the moment.</p>
            <button onClick={() => navigate("/doctors")} style={{
              marginTop: "16px", background: "linear-gradient(90deg,#2563eb,#7c3aed)",
              color: "white", border: "none", padding: "12px 24px",
              borderRadius: "12px", cursor: "pointer", fontWeight: "700"
            }}>
              Find Another Doctor
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "14px" }}>
            {availableSlots.map((slot, i) => (
              <div key={i} style={{
                background: "linear-gradient(180deg,#0f172a,#111827)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "16px", padding: "20px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)"
              }}>
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>Date</div>
                  <div style={{ color: "white", fontWeight: "700", fontSize: "16px" }}>{slot.date}</div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>Time</div>
                  <div style={{ color: "#60a5fa", fontWeight: "700", fontSize: "16px" }}>{slot.time}</div>
                </div>
                <button
                  onClick={() => rebookAppointment(slot)}
                  disabled={loading}
                  style={{
                    width: "100%", background: "linear-gradient(90deg,#22c55e,#16a34a)",
                    color: "white", border: "none", padding: "12px",
                    borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "700", fontSize: "14px", opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? "Rescheduling..." : "Book This Slot"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentRescheduler;