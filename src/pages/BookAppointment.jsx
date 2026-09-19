import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import doctors from "../data/doctors";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedDoctorFromState = location.state?.doctor;
  const referredDoctorId = localStorage.getItem("referredDoctorId");

  const [doctorId, setDoctorId] = useState(
    selectedDoctorFromState?.doctorId || referredDoctorId || ""
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [language, setLanguage] = useState("English");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Doctor availability still comes from localStorage
  // (will migrate to backend in a later phase)
  const availability = JSON.parse(localStorage.getItem("doctorAvailability")) || [];
  const selectedDoctor = doctors.find((d) => d.doctorId === doctorId);
  const availableSlots = availability.filter((s) => s.doctorId === doctorId);

  const patientName = localStorage.getItem("patientName");

  const inputStyle = {
    width: "100%", padding: "14px",
    background: "#0f172a", color: "white",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px", fontSize: "15px",
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle = {
    color: "#94a3b8", fontSize: "13px",
    fontWeight: "600", display: "block", marginBottom: "8px",
  };

  const cardStyle = {
    background: "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "20px", padding: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
    marginBottom: "20px",
  };

  const handleBooking = async () => {
    if (!selectedDoctor) { setError("Please select a doctor."); return; }
    if (!date || !time) { setError("Please select an available slot."); return; }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName,
          doctorName: selectedDoctor.name,
          doctorId: selectedDoctor.doctorId,
          specialization: selectedDoctor.specialization,
          date,
          time,
          language,
          symptoms,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed.");

      // Remove booked slot from localStorage availability
      const updatedAvailability = availability.filter(
        (s) => !(s.doctorId === doctorId && s.date === date && s.time === time)
      );
      localStorage.setItem("doctorAvailability", JSON.stringify(updatedAvailability));

      // Clear referral if present
      localStorage.removeItem("referredDoctorId");
      localStorage.removeItem("referredDoctorName");

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
        <Sidebar role="Patient" />
        <div style={{ flex: 1, padding: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "24px", padding: "48px", textAlign: "center", maxWidth: "480px"
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
            <div style={{ color: "#22c55e", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>
              Appointment Booked!
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
              Your appointment with {selectedDoctor?.name} on {date} at {time} is confirmed.
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => navigate("/my-appointments")}
                style={{
                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "white", border: "none", padding: "14px 28px",
                  borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                }}
              >
                📅 View My Appointments
              </button>
              <button
                onClick={() => navigate("/patient")}
                style={{
                  background: "#1e293b", color: "#94a3b8", border: "none",
                  padding: "14px 24px", borderRadius: "12px",
                  cursor: "pointer", fontWeight: "600", fontSize: "14px"
                }}
              >
                🏠 Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          📅 Book Appointment
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
          Schedule a consultation with a healthcare specialist.
        </p>

        {/* Referral Banner */}
        {referredDoctorId && (
          <div style={{
            background: "rgba(37,99,235,0.1)", border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: "14px", padding: "14px 18px", marginBottom: "20px",
            display: "flex", alignItems: "center", gap: "12px"
          }}>
            <span style={{ fontSize: "20px" }}>🔗</span>
            <div>
              <div style={{ color: "#60a5fa", fontWeight: "700", fontSize: "14px" }}>Specialist Referral</div>
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                Recommended: {localStorage.getItem("referredDoctorName")}
              </div>
            </div>
          </div>
        )}

        {/* Doctor Selection */}
        <div style={cardStyle}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
            👨‍⚕️ Select Doctor
          </h3>
          <label style={labelStyle}>Choose a doctor</label>
          <select
            value={doctorId}
            onChange={(e) => { setDoctorId(e.target.value); setDate(""); setTime(""); }}
            style={inputStyle}
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((d) => (
              <option key={d.doctorId} value={d.doctorId}>
                {d.name} ({d.specialization})
              </option>
            ))}
          </select>
        </div>

        {/* Doctor Info Card */}
        {selectedDoctor && (
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
              <img
                src={selectedDoctor.image} alt={selectedDoctor.name}
                style={{ width: "68px", height: "68px", borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(37,99,235,0.4)" }}
              />
              <div>
                <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>
                  {selectedDoctor.name}
                </div>
                <div style={{ color: "#60a5fa", fontSize: "14px", marginBottom: "3px" }}>
                  {selectedDoctor.specialization}
                </div>
                <div style={{ color: "#94a3b8", fontSize: "13px" }}>
                  🏥 {selectedDoctor.hospital}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Available Slots */}
        <div style={cardStyle}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "700", marginBottom: "16px" }}>
            🕒 Available Slots
          </h3>
          {!doctorId ? (
            <p style={{ color: "#64748b", fontSize: "14px" }}>Select a doctor to view available slots.</p>
          ) : availableSlots.length === 0 ? (
            <p style={{ color: "#64748b", fontSize: "14px" }}>No available slots for this doctor.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {availableSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => { setDate(slot.date); setTime(slot.time); }}
                  style={{
                    padding: "10px 18px",
                    background: date === slot.date && time === slot.time
                      ? "linear-gradient(90deg,#2563eb,#7c3aed)" : "#1e293b",
                    color: "white",
                    border: date === slot.date && time === slot.time
                      ? "1px solid #3b82f6" : "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px", cursor: "pointer",
                    fontSize: "14px", fontWeight: "600", transition: "all 0.2s",
                  }}
                >
                  📅 {slot.date} &nbsp;|&nbsp; 🕒 {slot.time}
                </button>
              ))}
            </div>
          )}

          {date && time && (
            <div style={{
              marginTop: "14px", padding: "12px 16px",
              background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px"
            }}>
              <span style={{ fontSize: "16px" }}>✅</span>
              <div>
                <div style={{ color: "#22c55e", fontWeight: "700", fontSize: "13px" }}>Selected Slot</div>
                <div style={{ color: "#94a3b8", fontSize: "12px" }}>{date} at {time}</div>
              </div>
            </div>
          )}
        </div>

        {/* Consultation Preferences */}
        <div style={cardStyle}>
          <h3 style={{ color: "white", fontSize: "16px", fontWeight: "700", marginBottom: "18px" }}>
            🌐 Consultation Preferences
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginBottom: "18px" }}>
            <div>
              <label style={labelStyle}>Preferred Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
                <option>English</option>
                <option>తెలుగు (Telugu)</option>
                <option>हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>
          <label style={labelStyle}>Describe Your Symptoms (Optional)</label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={4}
            placeholder="Describe your symptoms in detail..."
            style={{ ...inputStyle, resize: "vertical", lineHeight: "22px" }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
            color: "#f87171", fontSize: "14px"
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleBooking}
          disabled={loading || !date || !time}
          style={{
            background: "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white", border: "none", padding: "16px 36px",
            borderRadius: "14px", fontSize: "16px", fontWeight: "700",
            cursor: loading || !date || !time ? "not-allowed" : "pointer",
            opacity: loading || !date || !time ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "Booking..." : "📅 Confirm Appointment"}
        </button>
      </div>
    </div>
  );
}

export default BookAppointment;