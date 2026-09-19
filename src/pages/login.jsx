import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function Login() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!role || !username || !password) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed. Please try again.");
        return;
      }

      // Save auth data to localStorage for the rest of the app to use
      localStorage.setItem("role", data.role);
      localStorage.setItem("token", data.token);

      if (data.role === "Patient") {
        localStorage.setItem("patientName", data.fullName);
        localStorage.setItem("patientEmail", data.email);
        localStorage.setItem("patientId", data.patientId);
      }

      if (data.role === "Doctor") {
        localStorage.setItem("currentDoctor", data.currentDoctor);
        localStorage.setItem("doctorId", data.doctorId);
      }

      if (data.role === "Administrator") {
        localStorage.setItem("adminName", data.fullName);
        localStorage.setItem("adminId", data.adminId);
      }

      setSuccess("Login successful!");

      setTimeout(() => {
        if (data.role === "Patient") navigate("/patient");
        else if (data.role === "Doctor") navigate("/doctor");
        else if (data.role === "Administrator") navigate("/admin");
      }, 1000);

    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", margin: 0,
      display: "flex", justifyContent: "center", alignItems: "center",
      backgroundImage: "url('https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1974&auto=format&fit=crop')",
      backgroundSize: "cover", backgroundPosition: "center",
      fontFamily: "Arial", position: "relative", padding: "30px 0",
    }}>
      <div style={{
        position: "absolute", width: "100%", height: "100%",
        background: "rgba(0,0,0,0.35)",
      }} />

      <div style={{
        width: "90%", maxWidth: "500px", padding: "40px",
        borderRadius: "30px", background: "rgba(255,255,255,0.18)",
        backdropFilter: "blur(30px)", border: "1px solid rgba(255,255,255,0.35)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)", zIndex: 1, textAlign: "center",
      }}>
        <div style={{
          width: "100px", height: "100px", borderRadius: "50%",
          background: "white", margin: "0 auto 20px auto",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "40px", boxShadow: "0 10px 30px rgba(37,99,235,0.25)",
        }}>
          🩺
        </div>

        <h1 style={{ color: "#2563eb", fontSize: "42px", fontWeight: "700", letterSpacing: "-1px", marginBottom: "10px" }}>
          Digital Healthcare
        </h1>
        <h2 style={{ color: "#334155", fontSize: "18px", fontWeight: "600", marginBottom: "12px" }}>
          Secure Telemedicine Platform
        </h2>
        <p style={{ color: "#475569", fontSize: "15px", marginBottom: "30px" }}>
          Consult • Diagnose • Prescribe • Monitor
        </p>

        <form onSubmit={handleSubmit}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%", padding: "16px", marginBottom: "18px",
              borderRadius: "14px", border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.15)", color: "#0f172a",
              fontSize: "16px", fontWeight: "500", outline: "none",
              boxSizing: "border-box", cursor: "pointer",
            }}
          >
            <option value="">Select Role</option>
            <option value="Doctor">Doctor</option>
            <option value="Patient">Patient</option>
            <option value="Administrator">Administrator</option>
          </select>

          <input
            placeholder={
              role === "Patient" ? "Email Address" :
              role === "Doctor" ? "Doctor ID" :
              role === "Administrator" ? "Administrator ID" : "Username"
            }
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box", padding: "16px",
              marginBottom: "18px", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.18)", color: "#0f172a",
              fontSize: "16px", outline: "none", fontWeight: "500",
            }}
          />

          <input
            type="password" placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box", padding: "16px",
              marginBottom: "18px", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.18)", color: "#0f172a",
              fontSize: "16px", outline: "none", fontWeight: "500",
            }}
          />

          {error && (
            <div style={{ marginBottom: "14px" }}>
              <p style={{ color: "#e81e1e", fontWeight: "bold", marginBottom: "6px" }}>
                {error}
              </p>
              {error.includes("register") && (
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  style={{
                    padding: "10px 20px", border: "none", borderRadius: "10px",
                    background: "#2563eb", color: "white", cursor: "pointer",
                  }}
                >
                  REGISTER
                </button>
              )}
              {error.includes("password") && (
                <Link to="/forgot-password" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "600" }}>
                  Forgot Password?
                </Link>
              )}
            </div>
          )}

          {success && (
            <p style={{ color: "#22c55e", marginBottom: "15px" }}>{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              width: "100%", padding: "18px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              color: "white", fontSize: "18px", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: isHovered ? "0 12px 35px rgba(99,102,241,0.55)" : "0 8px 25px rgba(99,102,241,0.35)",
              transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "Signing in..." : "Proceed"}
          </button>

          {role === "Patient" && (
            <p style={{ marginTop: "16px", color: "#334155", fontSize: "14px" }}>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
              >
                Register
              </span>
            </p>
          )}

          {role === "Doctor" && (
            <p style={{ marginTop: "16px", color: "#334155", fontSize: "14px" }}>
              New doctor?{" "}
              <span
                onClick={() => navigate("/doctor-register")}
                style={{ color: "#2563eb", cursor: "pointer", fontWeight: "600" }}
              >
                Apply for Access
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;