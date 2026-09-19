import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import doctors from "../data/doctors";

function PatientReferrals() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName");
  const referrals = JSON.parse(localStorage.getItem("referrals")) || [];
  const myReferrals = referrals.filter((r) => r.patientName === patientName);

  const urgencyStyle = (urgency) => ({
    padding: "6px 16px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "13px",
    background:
      urgency === "High" ? "rgba(239,68,68,0.15)" :
      urgency === "Medium" ? "rgba(245,158,11,0.15)" :
      "rgba(34,197,94,0.15)",
    color:
      urgency === "High" ? "#ef4444" :
      urgency === "Medium" ? "#f59e0b" :
      "#22c55e",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          📋 Specialist Referrals
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "30px" }}>
          View referrals and book appointments with recommended specialists.
        </p>

        {myReferrals.length === 0 ? (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            borderRadius: "20px", padding: "48px", textAlign: "center",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              No Referrals Yet
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px" }}>
              Your doctor hasn't created any referrals yet.
            </div>
          </div>
        ) : (
          myReferrals.map((referral, index) => {
            const matchingDoctors = doctors.filter((d) =>
              d.specialization?.toLowerCase().includes(referral.specialization.toLowerCase())
            );

            return (
              <div key={index} style={{
                background: "linear-gradient(180deg,#0f172a,#111827)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "20px", padding: "28px", marginBottom: "24px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.3)"
              }}>
                {/* Referral Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <div style={{ color: "white", fontSize: "20px", fontWeight: "700", marginBottom: "6px" }}>
                      📋 Specialist Referral
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "13px" }}>Created: {referral.createdAt}</div>
                  </div>
                  <span style={urgencyStyle(referral.urgency)}>{referral.urgency} Priority</span>
                </div>

                {/* Referral Details */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "24px" }}>
                  <div style={{ background: "#0f172a", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>REFERRED BY</div>
                    <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{referral.doctor}</div>
                  </div>
                  <div style={{ background: "#0f172a", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>SPECIALIZATION</div>
                    <div style={{ color: "#60a5fa", fontSize: "14px", fontWeight: "600" }}>{referral.specialization}</div>
                  </div>
                  <div style={{ background: "#0f172a", borderRadius: "12px", padding: "14px" }}>
                    <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>REASON</div>
                    <div style={{ color: "white", fontSize: "14px", fontWeight: "600" }}>{referral.reason}</div>
                  </div>
                </div>

                {/* Available Specialists */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "20px" }}>
                  <div style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "14px" }}>
                    👨‍⚕️ Available Specialists
                  </div>
                  {matchingDoctors.length === 0 ? (
                    <div style={{
                      background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: "12px", padding: "16px",
                      color: "#f59e0b", fontSize: "14px"
                    }}>
                      ⚠️ No specialists in this field are currently available on our platform.
                    </div>
                  ) : (
                    matchingDoctors.map((doctor, di) => (
                      <div key={di} style={{
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: "14px", padding: "18px", marginBottom: "12px",
                        display: "flex", justifyContent: "space-between", alignItems: "center"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <img src={doctor.image} alt={doctor.name} style={{
                            width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover"
                          }} />
                          <div>
                            <div style={{ color: "white", fontWeight: "700", fontSize: "15px", marginBottom: "3px" }}>
                              {doctor.name}
                            </div>
                            <div style={{ color: "#60a5fa", fontSize: "13px" }}>{doctor.specialization}</div>
                            <div style={{ color: "#64748b", fontSize: "12px" }}>🏥 {doctor.hospital}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            onClick={() => {
                              localStorage.setItem("referredDoctorId", doctor.doctorId);
                              localStorage.setItem("referredDoctorName", doctor.name);
                              navigate("/book-appointment");
                            }}
                            style={{
                              background: "linear-gradient(90deg,#2563eb,#4f46e5)",
                              color: "white", border: "none", padding: "10px 18px",
                              borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px"
                            }}
                          >
                            📅 Book
                          </button>
                          <button
                            onClick={() => navigate(`/doctor-profile/${doctor.doctorId}`)}
                            style={{
                              background: "transparent", color: "white",
                              border: "1px solid rgba(255,255,255,0.15)",
                              padding: "10px 18px", borderRadius: "10px",
                              cursor: "pointer", fontWeight: "600", fontSize: "13px"
                            }}
                          >
                            👤 Profile
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default PatientReferrals;