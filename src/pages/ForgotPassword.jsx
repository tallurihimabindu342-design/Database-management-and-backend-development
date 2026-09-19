function ForgotPassword() {
  return (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background:
        "linear-gradient(135deg,#0F4C81,#1E3A5F)",
    }}
  >
    <div
      style={{
        width: "420px",
        background: "rgba(255,255,255,0.95)",
        padding: "40px",
        borderRadius: "24px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          color: "#0F4C81",
          marginBottom: "10px",
        }}
      >
        Reset Password
      </h1>

      <p
        style={{
          color: "#64748B",
          marginBottom: "25px",
        }}
      >
        Enter your registered email
      </p>

      <input
        type="email"
        placeholder="Email Address"
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
          marginBottom: "20px",
          boxSizing: "border-box",
        }}
      />

      <button
        style={{
          width: "100%",
          padding: "14px",
          border: "none",
          borderRadius: "12px",
          background:
            "linear-gradient(90deg,#0F4C81,#2563EB)",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Send OTP
      </button>
    </div>
  </div>
);
}
export default ForgotPassword;