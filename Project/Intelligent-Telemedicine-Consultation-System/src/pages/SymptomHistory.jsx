import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function SymptomHistory() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/api/symptom-check/history/${encodeURIComponent(patientName)}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load history.");
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (patientName) fetchHistory();
  }, [patientName]);

  const riskColor = (risk) =>
    risk === "High" ? "#ef4444" :
    risk === "Medium" ? "#f59e0b" : "#22c55e";

  const riskBg = (risk) =>
    risk === "High" ? "rgba(239,68,68,0.12)" :
    risk === "Medium" ? "rgba(245,158,11,0.12)" : "rgba(34,197,94,0.12)";

  const cardStyle = {
    background: "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "20px", padding: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
    marginBottom: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  };

  // Group history by date
  const grouped = history.reduce((acc, item) => {
    const date = new Date(item.analyzedAt).toLocaleDateString("en-IN", {
      day: "numeric", month: "long", year: "numeric"
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <div>
            <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
              📋 Symptom History
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              All your past AI symptom analyses — newest first.
            </p>
          </div>
          <button
            onClick={() => navigate("/symptom-checker")}
            style={{
              background: "linear-gradient(90deg,#2563eb,#7c3aed)",
              color: "white", border: "none", padding: "12px 22px",
              borderRadius: "12px", cursor: "pointer",
              fontWeight: "700", fontSize: "14px", flexShrink: 0,
            }}
          >
            🧠 New Analysis
          </button>
        </div>

        {/* Stats Row */}
        {history.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px", marginBottom: "28px" }}>
            {[
              { label: "Total Checks", value: history.length, icon: "📋", color: "#60a5fa" },
              {
                label: "High Risk", icon: "🔴", color: "#ef4444",
                value: history.filter((h) => h.risk === "High").length,
              },
              {
                label: "Emergencies", icon: "🚨", color: "#dc2626",
                value: history.filter((h) => h.emergency).length,
              },
            ].map((stat, i) => (
              <div key={i} style={{
                background: "linear-gradient(180deg,#0f172a,#111827)",
                borderRadius: "16px", padding: "20px",
                border: "1px solid rgba(255,255,255,0.05)"
              }}>
                <div style={{ fontSize: "22px", marginBottom: "8px" }}>{stat.icon}</div>
                <div style={{ color: stat.color, fontSize: "28px", fontWeight: "800", marginBottom: "4px" }}>
                  {stat.value}
                </div>
                <div style={{ color: "#64748b", fontSize: "13px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px", color: "#94a3b8" }}>
            Loading your symptom history...
          </div>
        )}

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

        {/* Empty */}
        {!loading && !error && history.length === 0 && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "56px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              No Symptom Checks Yet
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>
              Use the AI Symptom Checker to analyze your symptoms.
              Every check is saved here automatically.
            </div>
            <button
              onClick={() => navigate("/symptom-checker")}
              style={{
                background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                color: "white", border: "none", padding: "14px 28px",
                borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "15px"
              }}
            >
              🧠 Start First Analysis
            </button>
          </div>
        )}

        {/* Grouped History */}
        {!loading && !error && Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            {/* Date Separator */}
            <div style={{
              color: "#475569", fontSize: "12px", fontWeight: "700",
              letterSpacing: "0.5px", marginBottom: "12px", marginTop: "8px",
              display: "flex", alignItems: "center", gap: "10px"
            }}>
              <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
              {date}
              <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            {items.map((item, i) => (
              <div key={i} style={cardStyle}>
                {/* Emergency Badge */}
                {item.emergency && (
                  <div style={{
                    background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "10px", padding: "8px 14px", marginBottom: "14px",
                    color: "#ef4444", fontSize: "13px", fontWeight: "700",
                    display: "inline-block"
                  }}>
                    🚨 Emergency Symptoms
                  </div>
                )}

                {/* Top Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                  <div>
                    <div style={{ color: "#60a5fa", fontSize: "15px", fontWeight: "700", marginBottom: "4px" }}>
                      {item.specialization}
                    </div>
                    <div style={{ color: "#475569", fontSize: "12px" }}>
                      {new Date(item.analyzedAt).toLocaleTimeString("en-IN", {
                        hour: "2-digit", minute: "2-digit"
                      })}
                    </div>
                  </div>
                  <span style={{
                    background: riskBg(item.risk),
                    color: riskColor(item.risk),
                    padding: "6px 14px", borderRadius: "999px",
                    fontSize: "12px", fontWeight: "700"
                  }}>
                    {item.risk === "High" ? "🔴" : item.risk === "Medium" ? "🟡" : "🟢"} {item.risk} Risk
                  </span>
                </div>

                {/* Symptoms */}
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "6px" }}>
                    SYMPTOMS DESCRIBED
                  </div>
                  <div style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "20px" }}>
                    {item.symptoms}
                  </div>
                </div>

                {/* Advice */}
                {item.advice && (
                  <div style={{ background: "#0f172a", borderRadius: "10px", padding: "14px" }}>
                    <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "6px" }}>
                      AI ADVICE
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "20px" }}>
                      {item.advice}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SymptomHistory;