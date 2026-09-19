import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function HealthDashboard() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName");

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const reports = JSON.parse(localStorage.getItem("medicalReports")) || [];
  const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
  const consultations = JSON.parse(localStorage.getItem("consultationHistory")) || [];
  const referrals = JSON.parse(localStorage.getItem("referrals")) || [];
  const vitals = JSON.parse(localStorage.getItem("healthVitals")) || [];
  const medicationLogs = JSON.parse(localStorage.getItem("medicationLogs")) || [];

  const myVitals = vitals.filter(v => v.patientName === patientName);
  const latestVitals = myVitals[myVitals.length - 1];
  const myAppointments = appointments.filter(a => a.patientName === patientName);
  const myReports = reports.filter(r => r.patientName === patientName);
  const myPrescriptions = prescriptions.filter(p => p.patient === patientName);
  const myConsultations = consultations.filter(c => c.patient === patientName);
  const myReferrals = referrals.filter(r => r.patientName === patientName);
  const patientLogs = medicationLogs.filter(l => l.patient === patientName);

  const latestSugar = Number(latestVitals?.sugar || 0);
  const latestWeight = Number(latestVitals?.weight || 0);
  const latestSpo2 = Number(latestVitals?.spo2 || 100);
  const sleepHours = Number(latestVitals?.sleepHours || 0);
  const exerciseMinutes = Number(latestVitals?.exerciseMinutes || 0);
  const waterIntake = Number(latestVitals?.waterIntake || 0);
  const currentSteps = Number(latestVitals?.steps || 0);
  const systolicBP = Number(latestVitals?.bp?.split("/")?.[0] || 0);

  let diabetesRisk = 10;
  let hypertensionRisk = 10;
  let lifestyleRisk = 10;
  let fallRisk = 5;

  if (latestSugar > 140) diabetesRisk += 40;
  if (latestWeight > 80) lifestyleRisk += 25;
  if (latestSpo2 < 95) lifestyleRisk += 20;
  if (sleepHours < 6) lifestyleRisk += 15;
  if (exerciseMinutes < 20) lifestyleRisk += 15;
  if (waterIntake < 2) lifestyleRisk += 10;
  if (systolicBP >= 140) hypertensionRisk += 40;
  if (latestWeight > 90) fallRisk += 20;
  if (exerciseMinutes < 10) fallRisk += 20;
  if (latestSpo2 < 92) fallRisk += 15;

  diabetesRisk = Math.min(diabetesRisk, 100);
  hypertensionRisk = Math.min(hypertensionRisk, 100);
  lifestyleRisk = Math.min(lifestyleRisk, 100);
  fallRisk = Math.min(fallRisk, 100);

  const healthScore = Math.max(0, Math.round(100 - (diabetesRisk + hypertensionRisk + lifestyleRisk + fallRisk) / 4));

  const completedAppointments = myAppointments.filter(a => a.status === "Completed").length;
  const adherenceScore = myPrescriptions.length === 0 ? 0 :
    Math.round((patientLogs.length / myPrescriptions.length) * 100);
  const recoveryScore = Math.min(100, Math.round((adherenceScore * 0.6) + (completedAppointments * 10)));

  const dailyStepsGoal = 5000;
  const stepsRemaining = Math.max(0, dailyStepsGoal - currentSteps);
  const goalCompletion = Math.round((currentSteps / dailyStepsGoal) * 100);

  const recommendations = [];
  if (currentSteps < 3000) recommendations.push({ icon: "🚶", text: "Increase daily walking activity" });
  if (latestSugar > 140) recommendations.push({ icon: "🍬", text: "Reduce sugar intake today" });
  if (latestWeight > 80) recommendations.push({ icon: "⚖️", text: "Maintain calorie deficit" });
  if (sleepHours < 6) recommendations.push({ icon: "😴", text: "Increase sleep duration to 7+ hours" });
  if (exerciseMinutes < 20) recommendations.push({ icon: "🏃", text: "Increase daily exercise" });
  if (waterIntake < 2) recommendations.push({ icon: "💧", text: "Drink more water — aim for 2L" });
  if (latestSpo2 < 95) recommendations.push({ icon: "🫁", text: "Monitor oxygen levels closely" });
  if (adherenceScore < 70) recommendations.push({ icon: "💊", text: "Medication adherence needs improvement" });
  if (sleepHours >= 8) recommendations.push({ icon: "✅", text: "Excellent sleep consistency" });
  if (waterIntake >= 2.5) recommendations.push({ icon: "✅", text: "Hydration goals achieved" });

  const dailyGuidance = latestSugar > 140
    ? "Focus on reducing sugar intake and increasing physical activity today."
    : latestWeight > 80 ? "Focus on weight management and balanced meals today."
    : adherenceScore < 70 ? "Prioritize medication adherence today."
    : "Your health metrics look good. Maintain your current routine!";

  const riskItems = [
    { label: "Diabetes Risk", value: diabetesRisk, color: diabetesRisk > 50 ? "#ef4444" : diabetesRisk > 30 ? "#f59e0b" : "#22c55e" },
    { label: "Hypertension Risk", value: hypertensionRisk, color: hypertensionRisk > 50 ? "#ef4444" : hypertensionRisk > 30 ? "#f59e0b" : "#22c55e" },
    { label: "Lifestyle Risk", value: lifestyleRisk, color: lifestyleRisk > 50 ? "#ef4444" : lifestyleRisk > 30 ? "#f59e0b" : "#22c55e" },
    { label: "Fall Risk", value: fallRisk, color: fallRisk > 50 ? "#ef4444" : fallRisk > 30 ? "#f59e0b" : "#22c55e" },
  ];

  const scoreColor = healthScore >= 80 ? "#22c55e" : healthScore >= 60 ? "#f59e0b" : "#ef4444";
  const scoreLabel = healthScore >= 80 ? "Excellent Health" : healthScore >= 60 ? "Moderate Health" : "Needs Attention";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Patient" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          🏥 Personal Health Dashboard
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "28px" }}>
          Your complete health overview and AI-powered insights.
        </p>

        {/* Daily Guidance Banner */}
        <div style={{
          background: "linear-gradient(90deg,rgba(37,99,235,0.15),rgba(124,58,237,0.15))",
          border: "1px solid rgba(59,130,246,0.2)", borderRadius: "16px",
          padding: "18px 22px", marginBottom: "24px",
          display: "flex", alignItems: "center", gap: "14px"
        }}>
          <div style={{ fontSize: "28px" }}>💡</div>
          <div>
            <div style={{ color: "#93c5fd", fontSize: "12px", fontWeight: "700", marginBottom: "3px" }}>TODAY'S GUIDANCE</div>
            <div style={{ color: "white", fontSize: "15px", fontWeight: "600" }}>{dailyGuidance}</div>
          </div>
        </div>

        {/* Top Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Appointments", value: myAppointments.length, icon: "📅", color: "#3b82f6" },
            { label: "Consultations", value: myConsultations.length, icon: "📋", color: "#22c55e" },
            { label: "Reports", value: myReports.length, icon: "📄", color: "#a855f7" },
            { label: "Prescriptions", value: myPrescriptions.length, icon: "💊", color: "#f59e0b" },
            { label: "Referrals", value: myReferrals.length, icon: "🔗", color: "#06b6d4" },
            { label: "Upcoming", value: myAppointments.filter(a => a.status !== "Completed").length, icon: "⏳", color: "#f97316" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "#0f172a", borderRadius: "14px", padding: "16px",
              border: "1px solid rgba(255,255,255,0.05)", textAlign: "center"
            }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ color: item.color, fontSize: "24px", fontWeight: "800" }}>{item.value}</div>
              <div style={{ color: "#64748b", fontSize: "11px", marginTop: "3px" }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* Health Score */}
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "24px"
          }}>
            <h2 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "20px" }}>
              📊 Health Score
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "20px" }}>
              <div style={{
                width: "90px", height: "90px", borderRadius: "50%",
                background: `conic-gradient(${scoreColor} ${healthScore}%, #1e293b 0%)`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <div style={{
                  width: "72px", height: "72px", borderRadius: "50%", background: "#0f172a",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                }}>
                  <div style={{ color: scoreColor, fontSize: "22px", fontWeight: "800" }}>{healthScore}</div>
                  <div style={{ color: "#475569", fontSize: "10px" }}>/100</div>
                </div>
              </div>
              <div>
                <div style={{ color: scoreColor, fontSize: "18px", fontWeight: "700", marginBottom: "6px" }}>{scoreLabel}</div>
                <div style={{ color: "#64748b", fontSize: "13px", lineHeight: "20px" }}>
                  Based on your vitals, medication adherence, and lifestyle data.
                </div>
              </div>
            </div>
            {riskItems.map((item, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ color: "#94a3b8", fontSize: "13px" }}>{item.label}</span>
                  <span style={{ color: item.color, fontSize: "13px", fontWeight: "700" }}>{item.value}%</span>
                </div>
                <div style={{ background: "#1e293b", borderRadius: "99px", height: "5px" }}>
                  <div style={{ width: `${item.value}%`, background: item.color, borderRadius: "99px", height: "5px" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recovery + Wellness */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px", padding: "20px"
            }}>
              <h2 style={{ color: "white", fontSize: "15px", fontWeight: "700", marginBottom: "14px" }}>
                🔄 Recovery Overview
              </h2>
              {[
                { label: "Recovery Score", value: recoveryScore, color: recoveryScore >= 80 ? "#22c55e" : "#f59e0b" },
                { label: "Medication Adherence", value: adherenceScore, color: adherenceScore >= 70 ? "#22c55e" : "#ef4444" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ color: "#94a3b8", fontSize: "13px" }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: "700", fontSize: "13px" }}>{item.value}%</span>
                  </div>
                  <div style={{ background: "#1e293b", borderRadius: "99px", height: "6px" }}>
                    <div style={{ width: `${item.value}%`, background: item.color, borderRadius: "99px", height: "6px" }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px", padding: "20px"
            }}>
              <h2 style={{ color: "white", fontSize: "15px", fontWeight: "700", marginBottom: "14px" }}>
                🚶 Daily Steps Goal
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                {[
                  { label: "Current", value: currentSteps, color: "#3b82f6" },
                  { label: "Remaining", value: stepsRemaining, color: "#f59e0b" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#0f172a", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                    <div style={{ color: item.color, fontSize: "20px", fontWeight: "800" }}>{item.value}</div>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#1e293b", borderRadius: "99px", height: "7px", marginBottom: "6px" }}>
                <div style={{
                  width: `${Math.min(goalCompletion, 100)}%`, height: "7px",
                  borderRadius: "99px", background: "linear-gradient(90deg,#3b82f6,#22c55e)"
                }} />
              </div>
              <div style={{ color: "#64748b", fontSize: "12px", textAlign: "right" }}>
                {goalCompletion}% of {dailyStepsGoal} steps goal
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px", padding: "22px",
            marginBottom: "20px"
          }}>
            <h2 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "16px" }}>
              💡 Personalized Recommendations
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {recommendations.map((rec, i) => (
                <div key={i} style={{
                  background: "#0f172a", borderRadius: "12px", padding: "12px 16px",
                  display: "flex", alignItems: "center", gap: "10px"
                }}>
                  <span style={{ fontSize: "18px" }}>{rec.icon}</span>
                  <span style={{ color: "#cbd5e1", fontSize: "13px" }}>{rec.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Vitals */}
        {latestVitals && (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px", padding: "22px",
            marginBottom: "20px"
          }}>
            <h2 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "16px" }}>
              📊 Latest Vitals
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "10px" }}>
              {[
                { label: "❤️ BP", value: latestVitals.bp },
                { label: "💓 Pulse", value: `${latestVitals.pulse} bpm` },
                { label: "🫁 SpO₂", value: `${latestVitals.spo2}%` },
                { label: "🍬 Sugar", value: `${latestVitals.sugar} mg/dL` },
                { label: "⚖️ Weight", value: `${latestVitals.weight} kg` },
              ].map((item, i) => (
                <div key={i} style={{ background: "#0f172a", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
                  <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "6px" }}>{item.label}</div>
                  <div style={{ color: "white", fontWeight: "700", fontSize: "16px" }}>{item.value || "--"}</div>
                </div>
              ))}
            </div>
            <div style={{ color: "#475569", fontSize: "12px", marginTop: "10px" }}>
              Recorded: {latestVitals.recordedAt}
            </div>
          </div>
        )}

        {/* Current Treatment */}
        {myPrescriptions.length > 0 && (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            border: "1px solid rgba(255,255,255,0.05)", borderRadius: "18px", padding: "22px"
          }}>
            <h2 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "16px" }}>
              💊 Current Treatment Plan
            </h2>
            {myPrescriptions.slice(-1).map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>Medicines</div>
                  <div style={{ color: "#4ade80", fontWeight: "700" }}>{p.medicines}</div>
                </div>
                <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>Follow-Up</div>
                  <div style={{ color: "#fbbf24", fontWeight: "700" }}>{p.followUp || "Not required"}</div>
                </div>
                {p.instructions && (
                  <div style={{ gridColumn: "1/-1", background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                    <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>Instructions</div>
                    <div style={{ color: "#cbd5e1", fontSize: "14px" }}>{p.instructions}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HealthDashboard;