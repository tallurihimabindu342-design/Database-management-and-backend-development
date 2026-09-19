import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function AddReview() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const doctorId = localStorage.getItem("reviewDoctorId");
  const doctorName = localStorage.getItem("reviewDoctorName");
  const patientName = localStorage.getItem("patientName");

  const saveReview = () => {
    if (!review.trim()) {
      alert("Please write a review before submitting.");
      return;
    }
    const reviews = JSON.parse(localStorage.getItem("doctorReviews")) || [];
    const alreadyReviewed = reviews.find(
      (item) => item.doctorId === doctorId && item.patient === patientName
    );
    if (alreadyReviewed) {
      alert("You have already reviewed this doctor.");
      return;
    }
    reviews.push({ doctorId, patient: patientName, rating, review, createdAt: new Date().toLocaleString() });
    localStorage.setItem("doctorReviews", JSON.stringify(reviews));
    setSubmitted(true);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Patient" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          ⭐ Rate Your Consultation
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          Share your experience to help other patients.
        </p>

        {submitted ? (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: "20px", padding: "48px", textAlign: "center"
          }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ color: "#22c55e", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>Review Submitted!</h2>
            <p style={{ color: "#94a3b8", marginBottom: "28px" }}>Thank you for your feedback. It helps the community.</p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
              <button
                onClick={() => navigate("/patient")}
                style={{
                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "white", border: "none", padding: "14px 28px",
                  borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                }}
              >
                🏠 Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/my-appointments")}
                style={{
                  background: "#1e293b", color: "white", border: "none",
                  padding: "14px 28px", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                }}
              >
                📅 My Appointments
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "20px", padding: "32px", maxWidth: "600px"
          }}>
            {/* Doctor Info */}
            {doctorName && (
              <div style={{
                background: "#0f172a", borderRadius: "12px", padding: "16px",
                marginBottom: "28px", display: "flex", alignItems: "center", gap: "14px"
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px"
                }}>👨‍⚕️</div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "12px" }}>Reviewing</div>
                  <div style={{ color: "white", fontSize: "17px", fontWeight: "700" }}>{doctorName}</div>
                </div>
              </div>
            )}

            {/* Star Rating */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Your Rating</div>
              <div style={{ display: "flex", gap: "10px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      fontSize: "36px", cursor: "pointer",
                      opacity: star <= rating ? 1 : 0.25,
                      transform: star <= rating ? "scale(1.1)" : "scale(1)",
                      transition: "all 0.15s"
                    }}
                  >⭐</div>
                ))}
              </div>
              <div style={{ color: "#fbbf24", fontSize: "14px", marginTop: "8px", fontWeight: "600" }}>
                {rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Good" : rating === 2 ? "Fair" : "Poor"}
              </div>
            </div>

            {/* Review Text */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ color: "#94a3b8", fontSize: "14px", fontWeight: "600", marginBottom: "10px" }}>Write Your Review</div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Describe your experience with this doctor..."
                style={{
                  width: "100%", height: "140px",
                  background: "#111827", color: "white",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px", padding: "14px",
                  fontSize: "14px", resize: "none", outline: "none",
                  lineHeight: "22px", boxSizing: "border-box"
                }}
              />
              <div style={{ color: "#475569", fontSize: "12px", marginTop: "6px" }}>{review.length} characters</div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={saveReview}
                style={{
                  flex: 1,
                  background: "linear-gradient(90deg,#f59e0b,#d97706)",
                  color: "white", border: "none", padding: "14px",
                  borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
                }}
              >
                ⭐ Submit Review
              </button>
              <button
                onClick={() => navigate("/patient")}
                style={{
                  background: "#1e293b", color: "#94a3b8", border: "none",
                  padding: "14px 20px", borderRadius: "12px", cursor: "pointer",
                  fontWeight: "600", fontSize: "14px"
                }}
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddReview;