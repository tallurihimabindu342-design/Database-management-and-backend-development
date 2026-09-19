import { useState } from "react";
import Sidebar from "../components/Sidebar";

function EmergencyAssessment() {

  const [chestPain, setChestPain] =
    useState(false);

  const [
    breathingDifficulty,
    setBreathingDifficulty,
  ] = useState(false);

  const [
    unconsciousness,
    setUnconsciousness,
  ] = useState(false);

  const [
    severeBleeding,
    setSevereBleeding,
  ] = useState(false);

  const [
    strokeSymptoms,
    setStrokeSymptoms,
  ] = useState(false);

  const analyzeEmergency = () => {

    let urgencyScore = 0;

    if (chestPain)
      urgencyScore += 30;

    if (breathingDifficulty)
      urgencyScore += 30;

    if (unconsciousness)
      urgencyScore += 40;

    if (severeBleeding)
      urgencyScore += 40;

    if (strokeSymptoms)
      urgencyScore += 50;

    localStorage.setItem(
      "urgencyScore",
      urgencyScore
    );

    if (urgencyScore >= 50) {

      alert(
        "Possible Medical Emergency. Please contact emergency services immediately."
      );

      return;
    }

    alert(
      "Urgent consultation recommended."
    );
  };

  let currentScore = 0;

if (chestPain)
  currentScore += 30;

if (breathingDifficulty)
  currentScore += 30;

if (unconsciousness)
  currentScore += 40;

if (severeBleeding)
  currentScore += 40;

if (strokeSymptoms)
  currentScore += 50;

let riskLevel = "Low";
let riskColor = "#22c55e";

if (currentScore >= 50) {
  riskLevel = "High";
  riskColor = "#ef4444";
}
else if (currentScore >= 30) {
  riskLevel = "Medium";
  riskColor = "#f59e0b";
}

  return (
  <div
    style={{
      display: "flex",
      minHeight: "100vh",
      background:
        "linear-gradient(135deg,#020617,#071938,#10214f)",
    }}
  >
    <Sidebar role="Patient" />

    <div
      style={{
        flex: 1,
        padding: "32px",
      }}
    >
      <div
  style={{
    marginBottom: "30px",
  }}
>
  <h1
    style={{
      color: "white",
      fontSize: "42px",
      fontWeight: "800",
      marginBottom: "12px",
      lineHeight: "1.2",
    }}
  >
    🚨 Emergency Assessment
  </h1>

  <p
    style={{
      color: "#94a3b8",
      fontSize: "16px",
    }}
  >
    Check critical symptoms and assess emergency risk instantly.
  </p>
  <h2
  style={{
    color: "white",
    marginBottom: "20px",
    fontSize: "24px",
  }}
>
  Select Symptoms
</h2>
  <div
  style={{
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    marginTop: "20px",
    marginBottom: "25px",
    width: "900px"
  }}
/>
</div>

<div
  style={{
    background:
      "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "24px",
    padding: "32px",
    maxWidth: "900px",
    marginTop: "30px",
    border:
      "1px solid rgba(255,255,255,0.05)",
    boxShadow:
      "0 20px 40px rgba(0,0,0,0.35)",
  }}
>

      <label
  style={{
    display: "block",
    background:
  chestPain
    ? "rgba(239,68,68,0.15)"
    : "rgba(255,255,255,0.03)",
    padding: "14px 18px",
    borderRadius: "16px",
    color: "white",
    marginBottom: "10px",
    cursor: "pointer",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <input
    type="checkbox"
    checked={chestPain}
    onChange={() =>
      setChestPain(!chestPain)
    }
    style={{
      marginRight: "12px",
    }}
  />

  ❤️ Chest Pain
</label>

      

      <label
  style={{
    display: "block",
background:
  breathingDifficulty
    ? "rgba(245,158,11,0.15)"
    : "rgba(255,255,255,0.03)",
    padding: "14px 18px",
    borderRadius: "16px",
    color: "white",
    marginBottom: "10px",
    cursor: "pointer",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <input
    type="checkbox"
    checked={breathingDifficulty}
    onChange={() =>
      setBreathingDifficulty(
        !breathingDifficulty
      )
    }
    style={{
      marginRight: "12px",
    }}
  />

  😮‍💨 Breathing Difficulty
</label>

      
      <label
  style={{
    display: "block",
background:
  unconsciousness
    ? "rgba(168,85,247,0.15)"
    : "rgba(255,255,255,0.03)",
    padding: "14px 18px",
    borderRadius: "16px",
    color: "white",
    marginBottom: "10px",
    cursor: "pointer",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <input
    type="checkbox"
    checked={unconsciousness}
    onChange={() =>
      setUnconsciousness(
        !unconsciousness
      )
    }
    style={{
      marginRight: "12px",
    }}
  />

  🧠 Unconsciousness
</label>

      
      <label
  style={{
    display: "block",
background:
  severeBleeding
    ? "rgba(220,38,38,0.15)"
    : "rgba(255,255,255,0.03)",
    padding: "14px 18px",
    borderRadius: "16px",
    color: "white",
    marginBottom: "10px",
    cursor: "pointer",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <input
    type="checkbox"
    checked={severeBleeding}
    onChange={() =>
      setSevereBleeding(
        !severeBleeding
      )
    }
    style={{
      marginRight: "12px",
    }}
  />

  🩸 Severe Bleeding
</label>

      

      <label
  style={{
    display: "block",
background:
  strokeSymptoms
    ? "rgba(249,115,22,0.15)"
    : "rgba(255,255,255,0.03)",
    padding: "14px 18px",
    borderRadius: "16px",
    color: "white",
    marginBottom: "10px",
    cursor: "pointer",
    border:
      "1px solid rgba(255,255,255,0.05)",
  }}
>
  <input
    type="checkbox"
    checked={strokeSymptoms}
    onChange={() =>
      setStrokeSymptoms(
        !strokeSymptoms
      )
    }
    style={{
      marginRight: "12px",
    }}
  />

  ⚠️ Stroke Symptoms
</label>

      
      <div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "25px",
    marginBottom: "25px",
  }}
>
  <div
  style={{
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  }}
>
  <div
    style={{
      background:
        riskLevel === "Low"
          ? "#052e16"
          : "#111827",
      color: "#22c55e",
      padding: "10px 18px",
      borderRadius: "12px",
      border:
        riskLevel === "Low"
          ? "1px solid #22c55e"
          : "none",
    }}
  >
    🟢 Low
  </div>

  <div
    style={{
      background:
        riskLevel === "Medium"
          ? "#422006"
          : "#111827",
      color: "#f59e0b",
      padding: "10px 18px",
      borderRadius: "12px",
      border:
        riskLevel === "Medium"
          ? "1px solid #f59e0b"
          : "none",
    }}
  >
    🟡 Medium
  </div>

  <div
    style={{
      background:
        riskLevel === "High"
          ? "#450a0a"
          : "#111827",
      color: "#ef4444",
      padding: "10px 18px",
      borderRadius: "12px",
      border:
        riskLevel === "High"
          ? "1px solid #ef4444"
          : "none",
    }}
  >
    🔴 High
  </div>
</div>
<div
  style={{
    color: riskColor,
    fontWeight: "700",
    fontSize: "18px",
    marginLeft: "15px",
  }}
>
  Current Risk Level: {riskLevel}
</div>
</div>

      <button
  onClick={analyzeEmergency}
  style={{
    width: "100%",
    padding: "20px",
    fontSize: "18px",
    boxShadow:
  "0 10px 30px rgba(239,68,68,0.45)",
    background:
      "linear-gradient(90deg,#ef4444,#dc2626)",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
  }}
>
  🚑 Assess Emergency Risk
</button>
    </div>
    </div>
    </div>
  );
}

export default EmergencyAssessment;