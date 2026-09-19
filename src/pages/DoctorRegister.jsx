import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function DoctorRegister() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)", background: "#111827",
    color: "white", fontSize: "15px", outline: "none",
    boxSizing: "border-box", marginBottom: "14px",
  };

  const handleSubmit = async () => {
    setError("");
    if (!fullName || !email || !phone || !doctorId || !specialization || !password) {
      setError("Please fill all fields."); return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/auth/register-doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, doctorId, specialization, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      alert("Registration Request Sent To Administrator");
      navigate("/");
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const specializations = [
    "General Medicine", "Cardiology", "Neurology", "Orthopedics",
    "Dermatology", "Pediatrics", "Gynecology", "Psychiatry",
    "Oncology", "Endocrinology", "Nephrology", "Pulmonology", "Other"
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)",
      display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px"
    }}>
      <div style={{
        width: "100%", maxWidth: "600px",
        background: "linear-gradient(180deg,#0f172a,#111827)",
        padding: "40px", borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ fontSize: "52px", marginBottom: "12px" }}>👨‍⚕️</div>
          <h1 style={{ color: "white", fontSize: "28px", fontWeight: "800", marginBottom: "6px" }}>
            Doctor Registration
          </h1>
          <p style={{ color: "#64748b", fontSize: "14px" }}>
            Submit your application for administrator review and approval.
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
            color: "#f87171", fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>Full Name</label>
            <input placeholder="Dr. John Smith" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>Email Address</label>
            <input type="email" placeholder="doctor@hospital.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>Phone Number</label>
            <input placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>Doctor Registration ID</label>
            <input placeholder="DOC001" value={doctorId} onChange={e => setDoctorId(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>Specialization</label>
            <select value={specialization} onChange={e => setSpecialization(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select Specialization</option>
              {specializations.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>Password</label>
            <input type="password" placeholder="Create a secure password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{
          background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)",
          borderRadius: "12px", padding: "14px", marginBottom: "20px"
        }}>
          <p style={{ color: "#93c5fd", fontSize: "13px", margin: 0 }}>
            ℹ️ Your registration request will be reviewed by the administrator. You will be able to log in once approved.
          </p>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "16px", border: "none", borderRadius: "14px",
          background: loading ? "#334155" : "linear-gradient(90deg,#2563eb,#7c3aed)",
          color: "white", fontSize: "16px", fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 8px 25px rgba(37,99,235,0.3)", marginBottom: "14px"
        }}>
          {loading ? "Submitting..." : "📋 Submit Registration Request"}
        </button>

        <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px" }}>
          Already approved?{" "}
          <span onClick={() => navigate("/")} style={{ color: "#60a5fa", cursor: "pointer", fontWeight: "600" }}>
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default DoctorRegister;