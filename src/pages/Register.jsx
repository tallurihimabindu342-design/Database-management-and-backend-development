import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%", padding: "14px", borderRadius: "12px",
    border: "1px solid #CBD5E1", fontSize: "15px",
    boxSizing: "border-box", marginBottom: "14px",
    outline: "none", background: "white", color: "#0f172a",
  };

  const handleRegister = async () => {
    setError("");

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      // Registration successful — go to login
      alert("Registration successful! Please log in.");
      navigate("/");
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      justifyContent: "center", alignItems: "center",
      background: "linear-gradient(135deg,#0F4C81,#1E3A5F)"
    }}>
      <div style={{
        width: "450px", background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.4)",
        padding: "36px", borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
      }}>
        <h1 style={{ textAlign: "center", color: "#0F4C81", fontSize: "30px", marginBottom: "6px" }}>
          Create Account
        </h1>
        <p style={{ textAlign: "center", color: "#64748B", marginBottom: "24px", fontSize: "14px" }}>
          Join Smart Digital Healthcare
        </p>

        <input
          type="text" placeholder="Full Name"
          value={fullName} onChange={(e) => setFullName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email" placeholder="Email Address"
          value={email} onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text" placeholder="Phone Number"
          value={phone} onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password" placeholder="Password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password" placeholder="Confirm Password"
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "10px", padding: "10px 14px",
            color: "#dc2626", fontSize: "13px", marginBottom: "14px"
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%", padding: "14px", border: "none",
            borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer",
            background: "linear-gradient(90deg,#0F4C81,#2563EB)",
            color: "white", fontWeight: "700", fontSize: "16px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#475569" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;