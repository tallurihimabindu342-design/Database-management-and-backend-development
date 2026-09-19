import { useState } from "react";
import Sidebar from "../components/Sidebar";
import doctors from "../data/doctors";
import { useLanguage } from "../contexts/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [translating, setTranslating] = useState(false);

  const { translate, language } = useLanguage();

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      setError("Please describe your symptoms first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/symptom-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      const aiResult = await response.json();

      if (!response.ok || !aiResult.specialization) {
        setError(aiResult.error || "AI analysis unavailable. Please try again.");
        return;
      }

      const approvedDoctors = JSON.parse(localStorage.getItem("approvedDoctors")) || [];
      const allDoctors = [...doctors, ...approvedDoctors];

      const matchingDoctors = allDoctors.filter(
        (doctor) =>
          doctor.specialization &&
          aiResult.specialization &&
          doctor.specialization.toLowerCase().includes(aiResult.specialization.toLowerCase())
      );

      // Set English result immediately so UI isn't blank while translating
      const baseResult = {
        specialization: aiResult.specialization,
        risk: aiResult.risk,
        emergency: aiResult.emergency,
        recommendation: aiResult.advice,
        doctors: matchingDoctors,
      };
      setResult(baseResult);

      // Translate AI-generated fields if not English
      if (language !== "English") {
        setTranslating(true);
        try {
          const [translatedSpecialization, translatedRecommendation] = await Promise.all([
            translate(aiResult.specialization),
            translate(aiResult.advice),
          ]);

          setResult((prev) => ({
            ...prev,
            specialization: translatedSpecialization,
            recommendation: translatedRecommendation,
          }));
        } catch (translateErr) {
          console.warn("Translation failed — showing English result.");
        } finally {
          setTranslating(false);
        }
      }

      if (aiResult.emergency) {
        const alerts = JSON.parse(localStorage.getItem("emergencyAlerts")) || [];
        alerts.push({
          patientName: localStorage.getItem("patientName"),
          createdAt: new Date().toLocaleString(),
          status: "Active",
        });
        localStorage.setItem("emergencyAlerts", JSON.stringify(alerts));
      }

      if (aiResult.risk === "High" || aiResult.emergency) {
        const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        notifications.push({
          patientName: localStorage.getItem("patientName"),
          type: "Risk",
          title: "Clinical Attention Required",
          message: "Your recent symptom assessment indicates elevated clinical risk. Please seek medical consultation as soon as possible.",
          createdAt: new Date().toLocaleString(),
        });
        localStorage.setItem("notifications", JSON.stringify(notifications));
      }

      localStorage.setItem("patientRisk", aiResult.risk);
      localStorage.setItem("riskRecommendation", aiResult.advice);
      localStorage.setItem("riskDate", new Date().toLocaleString());
    } catch (err) {
      console.error("Symptom check failed:", err);
      setError("Unable to reach the analysis service right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "30px", overflowX: "hidden" }}>
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ color: "white", fontSize: "42px", fontWeight: "800", marginBottom: "15px", lineHeight: "1.2" }}>
            🤖 AI Symptom Checker
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "16px" }}>
            Describe your symptoms and receive AI-powered health insights.
          </p>
        </div>

        <textarea
          rows="6"
          placeholder="Describe your symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{
            background: "#0f172a", borderRadius: "24px", padding: "25px",
            width: "100%", boxSizing: "border-box",
            border: "1px solid rgba(255,255,255,0.05)", color: "white",
            maxWidth: "1200px", fontSize: "15px", outline: "none",
          }}
        />

        {error && (
          <div style={{
            marginTop: "16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", color: "#f87171", fontSize: "14px", maxWidth: "1200px"
          }}>
            ⚠ {error}
          </div>
        )}

        <br />

        <button
          onClick={analyzeSymptoms}
          disabled={loading}
          style={{
            padding: "16px 30px",
            background: loading ? "#334155" : "linear-gradient(90deg,#2563eb,#7c3aed)",
            color: "white", border: "none", borderRadius: "14px",
            fontWeight: "700", fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer", marginTop: "10px",
          }}
        >
          {loading ? "🧠 Analyzing..." : "🧠 Analyze Symptoms"}
        </button>

        {result && (
          <div style={{
            marginTop: "30px", background: "#0f172a", borderRadius: "24px", padding: "30px",
            border: "1px solid rgba(255,255,255,0.05)", boxSizing: "border-box",
            width: "100%", color: "white",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ color: "white", margin: 0 }}>🩺 Assessment Result</h2>
              {translating && (
                <span style={{ color: "#94a3b8", fontSize: "13px" }}>
                  🌐 Translating to {language}...
                </span>
              )}
            </div>

            {result.emergency && (
              <div style={{
                background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171", padding: "15px", borderRadius: "10px",
                marginBottom: "20px", fontWeight: "bold"
              }}>
                🚨 Emergency Symptoms Detected. Seek immediate medical attention.
              </div>
            )}

            <div style={{ background: "#111827", borderRadius: "14px", padding: "20px", marginBottom: "16px" }}>
              <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>Recommended Specialization</div>
              <div style={{ color: "#60a5fa", fontSize: "18px", fontWeight: "700" }}>
                {result.specialization}
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <span style={{
                display: "inline-block", padding: "8px 16px", borderRadius: "999px",
                background: result.risk === "High" ? "rgba(239,68,68,0.2)" : result.risk === "Medium" ? "rgba(245,158,11,0.2)" : "rgba(34,197,94,0.2)",
                color: result.risk === "High" ? "#ef4444" : result.risk === "Medium" ? "#f59e0b" : "#22c55e",
                fontWeight: "700", fontSize: "14px"
              }}>
                Risk Level: {result.risk}
              </span>
            </div>

            <div style={{ background: "#111827", borderRadius: "14px", padding: "20px", marginBottom: "24px" }}>
              <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>Recommendation</div>
              <div style={{ color: "#e2e8f0", fontSize: "15px", lineHeight: "1.6" }}>
                {result.recommendation}
              </div>
            </div>

            <h3 style={{ color: "white", marginBottom: "16px" }}>Recommended Doctors</h3>

            {result.doctors.length === 0 ? (
              <div style={{
                padding: "20px", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "14px",
                background: "rgba(245,158,11,0.08)", color: "#fbbf24"
              }}>
                We currently do not have any specialists in <strong>{result.specialization}</strong> available.
                Please consider consulting a qualified healthcare provider.
              </div>
            ) : (
              result.doctors.map((doctor, index) => (
                <div key={index} style={{
                  background: "#111827", padding: "20px", borderRadius: "18px",
                  marginBottom: "15px", border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <div style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>{doctor.name}</div>
                  <div style={{ color: "#60a5fa", fontSize: "14px", marginBottom: "4px" }}>{doctor.specialization}</div>
                  <div style={{ color: "#64748b", fontSize: "13px", marginBottom: "14px" }}>ID: {doctor.doctorId}</div>
                  <button
                    onClick={() => { window.location.href = `/doctor-profile/${doctor.doctorId}`; }}
                    style={{
                      padding: "10px 18px",
                      background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                      color: "white", border: "none", borderRadius: "12px",
                      cursor: "pointer", fontWeight: "600"
                    }}
                  >
                    View Profile
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SymptomChecker;