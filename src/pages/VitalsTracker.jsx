import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function VitalsTracker() {
  const patientName = localStorage.getItem("patientName");

  const [bp, setBp] = useState("");
  const [pulse, setPulse] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temperature, setTemperature] = useState("");
  const [sugar, setSugar] = useState("");
  const [weight, setWeight] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [exerciseMinutes, setExerciseMinutes] = useState("");
  const [steps, setSteps] = useState("");

  const [latestVital, setLatestVital] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Load latest vitals on mount
  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch(
          `${API_BASE}/api/vitals/${encodeURIComponent(patientName)}/latest`
        );
        if (res.ok) {
          const data = await res.json();
          setLatestVital(data);
          // Also keep localStorage in sync for other pages
          const all = JSON.parse(localStorage.getItem("healthVitals")) || [];
          const exists = all.find((v) => v.recordedAt === data.recordedAt);
          if (!exists) {
            all.push({ ...data, patientName });
            localStorage.setItem("healthVitals", JSON.stringify(all));
          }
        }
      } catch (err) {
        console.error("Failed to fetch latest vitals:", err.message);
      }
    }
    if (patientName) fetchLatest();
  }, [patientName]);

  const inputStyle = {
    width: "100%", height: "54px", padding: "0 18px",
    background: "#111827", color: "white",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", fontSize: "15px",
    outline: "none", boxSizing: "border-box",
  };

  const summaryCard = {
    background: "#0f172a", padding: "14px", borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.05)", color: "white",
  };

  const saveVitals = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(`${API_BASE}/api/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientName, bp, pulse, spo2, temperature,
          sugar, weight, sleepHours, waterIntake,
          exerciseMinutes, steps,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save vitals.");

      setLatestVital(data);

      // Keep localStorage in sync for pages that still read from it
      const all = JSON.parse(localStorage.getItem("healthVitals")) || [];
      all.push({ ...data, patientName });
      localStorage.setItem("healthVitals", JSON.stringify(all));

      setSuccess(true);
      setBp(""); setPulse(""); setSpo2(""); setTemperature("");
      setSugar(""); setWeight(""); setSleepHours("");
      setWaterIntake(""); setExerciseMinutes(""); setSteps("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          ❤️ Health Vitals
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
          Track and monitor your daily health metrics.
        </p>

        {/* Latest Vitals Summary */}
        {latestVital && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "28px" }}>
            <div style={summaryCard}>
              ❤️ Heart Rate
              <h3 style={{ margin: "6px 0 0 0" }}>{latestVital.pulse || "--"} bpm</h3>
            </div>
            <div style={summaryCard}>
              🩸 BP
              <h3 style={{ margin: "6px 0 0 0" }}>{latestVital.bp || "--"}</h3>
            </div>
            <div style={summaryCard}>
              🫁 SpO₂
              <h3 style={{ margin: "6px 0 0 0" }}>{latestVital.spo2 || "--"}%</h3>
            </div>
            <div style={summaryCard}>
              ⚖️ Weight
              <h3 style={{ margin: "6px 0 0 0" }}>{latestVital.weight || "--"} kg</h3>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div style={{
          background: "linear-gradient(180deg,#0f172a,#111827)",
          borderRadius: "24px", padding: "32px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          maxWidth: "1100px",
        }}>
          <h2 style={{ color: "white", marginBottom: "24px", fontSize: "18px" }}>
            📊 Enter Today's Health Metrics
          </h2>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "24px" }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "18px", rowGap: "16px" }}>
            {[
              { label: "🩸 Blood Pressure", placeholder: "120/80", value: bp, set: setBp },
              { label: "💓 Pulse", placeholder: "72 bpm", value: pulse, set: setPulse },
              { label: "🫁 SpO₂", placeholder: "98%", value: spo2, set: setSpo2 },
              { label: "🌡️ Temperature", placeholder: "36.5 °C", value: temperature, set: setTemperature },
              { label: "🍬 Blood Sugar", placeholder: "90 mg/dL", value: sugar, set: setSugar },
              { label: "⚖️ Weight", placeholder: "65 kg", value: weight, set: setWeight },
              { label: "😴 Sleep Hours", placeholder: "8 hours", value: sleepHours, set: setSleepHours },
              { label: "💧 Water Intake", placeholder: "2.5 litres", value: waterIntake, set: setWaterIntake },
              { label: "🏃 Exercise Minutes", placeholder: "30 mins", value: exerciseMinutes, set: setExerciseMinutes },
              { label: "👣 Daily Steps", placeholder: "10000", value: steps, set: setSteps },
            ].map((field) => (
              <div key={field.label}>
                <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>
                  {field.label}
                </label>
                <input
                  style={inputStyle}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                />
              </div>
            ))}
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "12px", padding: "12px 16px", marginTop: "20px",
              color: "#f87171", fontSize: "14px"
            }}>
              ⚠ {error}
            </div>
          )}

          {success && (
            <div style={{
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
              borderRadius: "12px", padding: "12px 16px", marginTop: "20px",
              color: "#22c55e", fontSize: "14px"
            }}>
              ✅ Vitals saved successfully!
            </div>
          )}

          <button
            onClick={saveVitals}
            disabled={saving}
            style={{
              marginTop: "24px", width: "100%", padding: "18px",
              background: "linear-gradient(90deg,#2563eb,#7c3aed)",
              color: "white", border: "none", borderRadius: "14px",
              fontSize: "16px", fontWeight: "700",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving..." : "💾 Save Vitals"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VitalsTracker;