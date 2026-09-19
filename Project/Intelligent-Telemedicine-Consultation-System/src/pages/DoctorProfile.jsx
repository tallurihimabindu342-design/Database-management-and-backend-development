import { useParams, useNavigate } from "react-router-dom";
import doctors from "../data/doctors";
import Sidebar from "../components/Sidebar";

function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const doctor = doctors.find((d) => d.doctorId === doctorId);
  if (!doctor) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#020617", color: "white", fontSize: "20px" }}>
        Doctor not found.
      </div>
    );
  }

  const reviews = JSON.parse(localStorage.getItem("doctorReviews")) || [];
  const doctorReviews = reviews.filter((r) => r.doctorId === doctor.doctorId);
  const statuses = JSON.parse(localStorage.getItem("doctorStatuses")) || {};
  const doctorStatus = statuses[doctor.doctorId] || "Online";

  const averageRating = doctorReviews.length === 0
    ? 0
    : (doctorReviews.reduce((sum, r) => sum + r.rating, 0) / doctorReviews.length).toFixed(1);

  const infoRow = (label, value, color = "white") => (
    <div style={{ background: "#0f172a", borderRadius: "12px", padding: "14px 18px" }}>
      <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>{label}</div>
      <div style={{ color, fontSize: "15px", fontWeight: "600" }}>{value}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          👨‍⚕️ Doctor Profile
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          View doctor information, qualifications and patient reviews.
        </p>

        {/* Profile Card */}
        <div style={{
          background: "linear-gradient(180deg,#0f172a,#111827)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "24px", padding: "30px", marginBottom: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", gap: "28px", alignItems: "center", marginBottom: "28px" }}>
            <img src={doctor.image} alt={doctor.name} style={{
              width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover",
              border: "4px solid rgba(59,130,246,0.4)"
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ color: "white", fontSize: "28px", fontWeight: "800", marginBottom: "8px" }}>
                {doctor.name}
              </div>
              <div style={{ color: "#60a5fa", fontSize: "15px", marginBottom: "10px" }}>
                {doctor.specialization}
              </div>
              <span style={{
                display: "inline-block",
                background: doctorStatus === "In Consultation" ? "rgba(250,204,21,0.15)" : "rgba(34,197,94,0.15)",
                color: doctorStatus === "In Consultation" ? "#facc15" : "#22c55e",
                padding: "6px 14px", borderRadius: "999px", fontWeight: "600", fontSize: "13px"
              }}>
                {doctorStatus === "In Consultation" ? "🟡 In Consultation" : "🟢 Online"}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: "flex", gap: "14px", marginBottom: "28px" }}>
            <div style={{
              flex: 1, background: "#0f172a", borderRadius: "14px", padding: "16px",
              border: "1px solid rgba(255,255,255,0.05)", textAlign: "center"
            }}>
              <div style={{ color: "#fbbf24", fontSize: "24px", fontWeight: "800" }}>⭐ {averageRating}</div>
              <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>Avg Rating</div>
            </div>
            <div style={{
              flex: 1, background: "#0f172a", borderRadius: "14px", padding: "16px",
              border: "1px solid rgba(255,255,255,0.05)", textAlign: "center"
            }}>
              <div style={{ color: "white", fontSize: "24px", fontWeight: "800" }}>{doctorReviews.length}</div>
              <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>Reviews</div>
            </div>
            <div style={{
              flex: 1, background: "#0f172a", borderRadius: "14px", padding: "16px",
              border: "1px solid rgba(255,255,255,0.05)", textAlign: "center"
            }}>
              <div style={{ color: "white", fontSize: "24px", fontWeight: "800" }}>{doctor.experience}</div>
              <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>Years Exp.</div>
            </div>
          </div>

          {/* Info Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            {infoRow("🩺 SPECIALIZATION", doctor.specialization, "#60a5fa")}
            {infoRow("🎓 QUALIFICATION", doctor.qualification)}
            {infoRow("🏥 HOSPITAL", doctor.hospital)}
            {infoRow("📹 CONSULTATION MODE", doctor.consultationMode)}
          </div>

          {/* Bio */}
          <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px 18px" }}>
            <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "8px" }}>ABOUT</div>
            <div style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: "24px" }}>{doctor.bio}</div>
          </div>

          {/* Book Button */}
          <div style={{ marginTop: "24px" }}>
            <button
              onClick={() => navigate("/book-appointment", { state: { doctor } })}
              style={{
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "14px 32px",
                borderRadius: "14px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
              }}
            >
              📅 Book Appointment
            </button>
          </div>
        </div>

        {/* Reviews */}
        <div style={{
          background: "linear-gradient(180deg,#0f172a,#111827)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "24px", padding: "28px"
        }}>
          <div style={{ color: "white", fontWeight: "700", fontSize: "20px", marginBottom: "20px" }}>
            ⭐ Patient Reviews
          </div>
          {doctorReviews.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: "14px", textAlign: "center", padding: "24px 0" }}>
              No reviews yet for this doctor.
            </div>
          ) : (
            doctorReviews.map((review, index) => (
              <div key={index} style={{
                background: "#0f172a", borderRadius: "14px", padding: "18px",
                marginBottom: "14px", border: "1px solid rgba(255,255,255,0.05)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} style={{ fontSize: "16px", opacity: star <= review.rating ? 1 : 0.2 }}>⭐</span>
                    ))}
                  </div>
                  <div style={{ color: "#475569", fontSize: "12px" }}>{review.createdAt}</div>
                </div>
                <div style={{ color: "white", fontSize: "14px", lineHeight: "22px", marginBottom: "8px" }}>
                  {review.review}
                </div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>— {review.patient}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;