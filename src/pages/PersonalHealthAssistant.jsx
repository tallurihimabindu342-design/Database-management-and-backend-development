import { useState } from "react";
import { usePatientVitals } from "../hook/usePatientVitals";

function PersonalHealthAssistant() {
  const {
    patientName, latest: latestVital, recent: recentVitals,
    sugarHigh, hydrated, pulseNormal, spo2Good, sleepGood, weightStable,
    systolic, steps: stepsVal,
  } = usePatientVitals();

  const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];

  const myAppointments = appointments.filter((a) => a.patientName === patientName);
  const myPrescriptions = prescriptions.filter((p) => p.patientName === patientName);

  const healthScore = (() => {
    if (!latestVital) return 0;
    let score = 100;
    if (Number(latestVital.sugar) > 140) score -= 10;
    if (Number(latestVital.pulse) < 60 || Number(latestVital.pulse) > 100) score -= 8;
    if (Number(latestVital.spo2) < 95) score -= 10;
    if (Number(latestVital.sleepHours) < 7) score -= 8;
    if (Number(latestVital.waterIntake) < 2) score -= 5;
    if (Number(latestVital.exerciseMinutes) < 30) score -= 8;
    if (Number(latestVital.steps) < 5000) score -= 8;
    return Math.max(score, 0);
  })();

  const scoreLabel = healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : "Needs Attention";
  const scoreColor = healthScore >= 80 ? "#22c55e" : healthScore >= 60 ? "#f59e0b" : "#ef4444";
  const scoreMsg1 = healthScore >= 80 ? "You're doing great!" : healthScore >= 60 ? "You're doing well!" : "Please focus on your health.";
  const scoreMsg2 = healthScore >= 80 ? "Keep it up." : healthScore >= 60 ? "Small improvements will help." : "Consult your physician.";

  const bpStatus = systolic >= 180 ? "Crisis" : systolic >= 140 ? "High" : systolic >= 120 ? "Elevated" : "Normal";
  const bpColor = systolic >= 180 ? "#ef4444" : systolic >= 140 ? "#f97316" : systolic >= 120 ? "#fbbf24" : "#22c55e";
  const bpAdvice = systolic >= 180 ? "⚠ Seek immediate medical help." : systolic >= 140 ? "⚠ Monitor BP regularly." : systolic >= 120 ? "⚠ Watch your diet and stress." : "✓ BP is stable.";

  const goals = [];
  if (!hydrated) goals.push({ icon: "💧", label: "Drink 2L Water", reason: "Water intake is low" });
  if (Number(latestVital?.steps) < 6000) goals.push({ icon: "🚶", label: "Walk 6000 Steps", reason: "Steps goal not met" });
  if (!sleepGood) goals.push({ icon: "🌙", label: "Sleep 8 Hours", reason: "Sleep is below 7 hrs" });
  if (Number(latestVital?.exerciseMinutes) < 30) goals.push({ icon: "🏃", label: "Exercise 30 mins", reason: "Exercise goal not met" });
  if (sugarHigh) goals.push({ icon: "🩸", label: "Monitor Blood Sugar", reason: "Sugar level is high" });
  if (myPrescriptions.length > 0) goals.push({ icon: "💊", label: "Take Medication", reason: "Daily medication due" });
  if (goals.length === 0) goals.push({ icon: "✅", label: "All goals met!", reason: "Great job today" });

  const [goalChecks, setGoalChecks] = useState({});
  const goalsCompleted = Object.values(goalChecks).filter(Boolean).length;
  const goalProgress = goals.length > 0 ? Math.round((goalsCompleted / goals.length) * 100) : 0;

  const sugarReadings = recentVitals.map((v) => Number(v.sugar));
  const sugarTrend = sugarReadings.length >= 2
    ? sugarReadings[sugarReadings.length - 1] > sugarReadings[0] ? "increasing" : "decreasing"
    : "stable";

  const sleepTrend = recentVitals.length >= 2
    ? Number(recentVitals[recentVitals.length - 1].sleepHours) > Number(recentVitals[0].sleepHours) ? "increasing" : "decreasing"
    : "stable";

  const riskLevel = healthScore >= 80 ? "Low" : healthScore >= 60 ? "Moderate" : "High";
  const riskColor = healthScore >= 80 ? "#22c55e" : healthScore >= 60 ? "#f59e0b" : "#ef4444";
  const riskEmoji = healthScore >= 80 ? "🟢" : healthScore >= 60 ? "🟡" : "🔴";

  const riskReason = sugarTrend === "increasing" && sugarHigh
    ? { icon: "🩸", text: "Blood sugar has been increasing over recent readings." }
    : !sleepGood
    ? { icon: "🌙", text: "Sleep hours are below the recommended 7 hours." }
    : !hydrated
    ? { icon: "💧", text: "Water intake is below the recommended 2L daily." }
    : { icon: "✅", text: "Your vitals are looking stable. Keep it up!" };

  const riskRec = riskLevel === "High"
    ? { icon: "🏥", text: "Schedule a consultation soon." }
    : riskLevel === "Moderate"
    ? { icon: "📋", text: "Monitor your vitals daily and stay consistent." }
    : { icon: "✅", text: "Maintain your current healthy habits." };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (healthScore / 100) * circumference;

  return (
    <div style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(12px)", borderRadius: "24px", padding: "30px", marginBottom: "30px", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}>

      <h2 style={{ color: "white", marginBottom: "6px", fontSize: "34px", fontWeight: "800" }}>
        🧠 AI-Powered Personal Health Assistant
      </h2>
      <p style={{ color: "#94a3b8", fontSize: "16px", marginTop: 0, marginBottom: "24px" }}>
        Your daily health overview and insights
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "230px 1fr 360px", gap: "22px", alignItems: "start" }}>

        <div style={{ background: "#111827", borderRadius: "20px", padding: "28px", border: "1px solid rgba(255,255,255,.05)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "16px" }}>Health Score</div>

          <div style={{ position: "relative", width: "150px", height: "150px" }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <defs>
                <linearGradient id="circleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <circle cx="75" cy="75" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
              <circle cx="75" cy="75" r={radius} fill="none" stroke="url(#circleGrad)" strokeWidth="10"
                strokeDasharray={`${strokeDash} ${circumference}`} strokeLinecap="round" transform="rotate(-90 75 75)" />
            </svg>
            <div style={{ position: "absolute", top: 0, left: 0, width: "150px", height: "150px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "20px" }}>❤️</div>
              <div style={{ color: "white", fontSize: "48px", fontWeight: "800", lineHeight: 1.1 }}>{healthScore}</div>
              <div style={{ color: "#94a3b8", fontSize: "13px" }}>/100</div>
            </div>
          </div>

          <div style={{ color: scoreColor, fontSize: "19px", fontWeight: "700", marginTop: "16px", textAlign: "center" }}>{scoreLabel}</div>
          <div style={{ color: "#94a3b8", marginTop: "8px", textAlign: "center", lineHeight: "22px", fontSize: "15px" }}>
            {scoreMsg1}<br />{scoreMsg2}
          </div>
          <div style={{ marginTop: "14px", color: "#94a3b8", fontSize: "13px", textAlign: "center" }}>
            🕒 Last updated:<br />{latestVital?.recordedAt || "--"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

          <h3 style={{ color: "white", margin: 0, fontSize: "26px", fontWeight: "800" }}>🎯 Today's Priorities</h3>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px" }}>

            <div style={{ background: "#2a212c", borderRadius: "16px", padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>🩸</span>
                <span style={{ color: "white", fontWeight: "700", fontSize: "18px" }}>Blood Sugar</span>
              </div>
              <div style={{ color: "#fb923c", fontSize: "36px", fontWeight: "700" }}>{latestVital?.sugar || "--"}</div>
              <div style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "12px" }}>mg/dL</div>
              <div style={{ display: "inline-block", padding: "5px 12px", borderRadius: "20px", background: sugarHigh ? "rgba(239,68,68,.15)" : "rgba(34,197,94,.15)", color: sugarHigh ? "#ef4444" : "#22c55e", fontSize: "14px", fontWeight: "700" }}>
                {sugarHigh ? "High" : "Normal"}
              </div>
              <div style={{ marginTop: "10px", color: "#94a3b8", fontSize: "15px" }}>
                {sugarHigh ? "⚠ Reduce sugar intake." : "✓ Great control. Keep it up."}
              </div>
            </div>

            <div style={{ background: "#1b2741", borderRadius: "16px", padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>💧</span>
                <span style={{ color: "white", fontWeight: "700", fontSize: "18px" }}>Hydration</span>
              </div>
              <div style={{ color: "#38bdf8", fontSize: "36px", fontWeight: "700" }}>{latestVital?.waterIntake || "--"}</div>
              <div style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "12px" }}>/2 L</div>
              <div style={{ display: "inline-block", padding: "5px 12px", borderRadius: "20px", background: hydrated ? "rgba(34,197,94,.15)" : "rgba(251,146,60,.15)", color: hydrated ? "#22c55e" : "#fb923c", fontSize: "14px", fontWeight: "700" }}>
                {hydrated ? "Normal" : "Needs More"}
              </div>
              <div style={{ marginTop: "10px", color: "#94a3b8", fontSize: "15px" }}>
                {hydrated ? "✓ Well hydrated." : "💧 Drink more water."}
              </div>
            </div>

            <div style={{ background: "#18312f", borderRadius: "16px", padding: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ fontSize: "20px" }}>❤️</span>
                <span style={{ color: "white", fontWeight: "700", fontSize: "18px" }}>Blood Pressure</span>
              </div>
              <div style={{ color: "#4ade80", fontSize: "36px", fontWeight: "700" }}>{latestVital?.bp || "--"}</div>
              <div style={{ color: "#94a3b8", fontSize: "15px", marginBottom: "12px" }}>mmHg</div>
              <div style={{ display: "inline-block", padding: "5px 12px", borderRadius: "20px", background: `${bpColor}26`, color: bpColor, fontSize: "14px", fontWeight: "700" }}>
                {bpStatus}
              </div>
              <div style={{ marginTop: "10px", color: "#94a3b8", fontSize: "15px" }}>{bpAdvice}</div>
            </div>
          </div>

          <div style={{ background: "#111827", borderRadius: "18px", padding: "20px", border: "1px solid rgba(255,255,255,.05)" }}>
            <div style={{ color: "white", fontWeight: "700", fontSize: "24px", marginBottom: "16px" }}>✨ Health Snapshot</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px" }}>
              <div style={{ background: "#0f172a", padding: "18px", borderRadius: "14px" }}>
                <div style={{ color: "#94a3b8", fontSize: "15px" }}>❤️ Heart Rate</div>
                <div style={{ color: "white", fontSize: "30px", fontWeight: "700", marginTop: "8px" }}>{latestVital?.pulse || "--"}</div>
                <div style={{ color: pulseNormal ? "#22c55e" : "#ef4444", fontSize: "15px", fontWeight: "700", marginTop: "5px" }}>{pulseNormal ? "Normal" : "Abnormal"}</div>
              </div>
              <div style={{ background: "#0f172a", padding: "18px", borderRadius: "14px" }}>
                <div style={{ color: "#94a3b8", fontSize: "15px" }}>🫁 SpO₂</div>
                <div style={{ color: "white", fontSize: "30px", fontWeight: "700", marginTop: "8px" }}>{latestVital?.spo2 || "--"}%</div>
                <div style={{ color: spo2Good ? "#22c55e" : "#ef4444", fontSize: "15px", fontWeight: "700", marginTop: "5px" }}>{spo2Good ? "Excellent" : "Low"}</div>
              </div>
              <div style={{ background: "#0f172a", padding: "18px", borderRadius: "14px" }}>
                <div style={{ color: "#94a3b8", fontSize: "15px" }}>🌙 Sleep</div>
                <div style={{ color: "white", fontSize: "30px", fontWeight: "700", marginTop: "8px" }}>{latestVital?.sleepHours || "--"} hrs</div>
                <div style={{ color: sleepGood ? "#22c55e" : "#fbbf24", fontSize: "15px", fontWeight: "700", marginTop: "5px" }}>{sleepGood ? "Good" : "Needs Improvement"}</div>
              </div>
              <div style={{ background: "#0f172a", padding: "18px", borderRadius: "14px" }}>
                <div style={{ color: "#94a3b8", fontSize: "15px" }}>🚶 Steps</div>
                <div style={{ color: "white", fontSize: "30px", fontWeight: "700", marginTop: "8px" }}>{latestVital?.steps || "--"}</div>
                <div style={{ color: stepsVal >= 10000 ? "#22c55e" : stepsVal >= 5000 ? "#fbbf24" : "#ef4444", fontSize: "15px", fontWeight: "700", marginTop: "5px" }}>
                  {stepsVal >= 10000 ? "Excellent" : stepsVal >= 5000 ? "Moderate" : "Low"}
                </div>
              </div>
              <div style={{ background: "#0f172a", padding: "18px", borderRadius: "14px" }}>
                <div style={{ color: "#94a3b8", fontSize: "15px" }}>⚖️ Weight</div>
                <div style={{ color: "white", fontSize: "30px", fontWeight: "700", marginTop: "8px" }}>{latestVital?.weight || "--"} kg</div>
                <div style={{ color: weightStable ? "#22c55e" : "#f59e0b", fontSize: "15px", fontWeight: "700", marginTop: "5px" }}>{weightStable ? "Stable" : "Monitor"}</div>
              </div>
            </div>
          </div>

        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div style={{ background: "#111827", borderRadius: "18px", padding: "24px", border: "1px solid rgba(255,255,255,.05)" }}>
            <div style={{ color: "white", fontWeight: "700", fontSize: "26px", marginBottom: "16px" }}>🎯 Today's Goals</div>
            {goals.map((goal, index) => (
              <div key={index}
                onClick={() => setGoalChecks((prev) => ({ ...prev, [index]: !prev[index] }))}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${goalChecks[index] ? "#22c55e" : "#374151"}`, background: goalChecks[index] ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "white", flexShrink: 0 }}>
                  {goalChecks[index] ? "✓" : ""}
                </div>
                <div style={{ fontSize: "24px" }}>{goal.icon}</div>
                <div>
                  <div style={{ color: goalChecks[index] ? "#94a3b8" : "white", fontSize: "18px", fontWeight: "600", textDecoration: goalChecks[index] ? "line-through" : "none" }}>{goal.label}</div>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>{goal.reason}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ color: "#94a3b8", fontSize: "15px" }}>Progress</div>
                <div style={{ color: "white", fontSize: "15px", fontWeight: "700" }}>{goalProgress}%</div>
              </div>
              <div style={{ background: "#1e293b", borderRadius: "99px", height: "10px" }}>
                <div style={{ width: `${goalProgress}%`, background: "linear-gradient(90deg, #6366f1, #22c55e)", borderRadius: "99px", height: "10px", transition: "width 0.3s" }} />
              </div>
            </div>
          </div>

          <div style={{ background: "#1d2242", borderRadius: "16px", padding: "22px" }}>
            <div style={{ color: "#c084fc", fontWeight: "600", fontSize: "18px", marginBottom: "10px" }}>📅 Next Appointment</div>
            {myAppointments.length > 0 ? (
              <>
                <div style={{ color: "white", fontWeight: "700", fontSize: "20px" }}>{myAppointments[0].doctorName}</div>
                <div style={{ color: "#94a3b8", fontSize: "15px", marginTop: "5px" }}>{myAppointments[0].date}{myAppointments[0].time ? ` • ${myAppointments[0].time}` : ""}</div>
                <div style={{ color: "#94a3b8", fontSize: "15px", marginTop: "4px" }}>{myAppointments[0].specialization || "General Physician"}</div>
              </>
            ) : (
              <>
                <div style={{ color: "white", fontWeight: "700", fontSize: "20px" }}>No Appointment</div>
                <div style={{ color: "#94a3b8", fontSize: "15px", marginTop: "5px" }}>General Physician</div>
              </>
            )}
          </div>

          <div style={{ background: "#1d2242", borderRadius: "16px", padding: "22px" }}>
            <div style={{ color: "#60a5fa", fontWeight: "600", fontSize: "18px", marginBottom: "10px" }}>💊 Medication</div>
            {myPrescriptions.length > 0 ? (
              <>
                <div style={{ color: "white", fontWeight: "700", fontSize: "20px" }}>{myPrescriptions[0].medicine}</div>
                {myPrescriptions[0].dosage && <div style={{ color: "#94a3b8", fontSize: "15px", marginTop: "5px" }}>{myPrescriptions[0].dosage}</div>}
                {myPrescriptions[0].timing && <div style={{ color: "#94a3b8", fontSize: "15px", marginTop: "4px" }}>{myPrescriptions[0].timing}</div>}
              </>
            ) : (
              <div style={{ color: "white", fontWeight: "700", fontSize: "20px" }}>No medicine</div>
            )}
            <div style={{ color: "#f59e0b", marginTop: "8px", fontSize: "15px" }}>Pending</div>
          </div>

        </div>
      </div>

      <div style={{ marginTop: "22px", display: "grid", gridTemplateColumns: "1.4fr 0.8fr", gap: "18px" }}>

        <div style={{ background: "#111827", borderRadius: "18px", padding: "22px", minHeight: "470px", border: "1px solid rgba(255,255,255,.05)" }}>
          <div style={{ color: "white", fontWeight: "700", fontSize: "28px", marginBottom: "22px" }}>📈 Weekly Trends</div>

          {recentVitals.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "16px" }}>No trend data available yet.</div>
          ) : (
            <>
              <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                <div style={{ color: "white", fontSize: "19px", fontWeight: "700", marginBottom: "16px" }}>🩸 Blood Sugar (mg/dL)</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", flex: 1 }}>
                    {recentVitals.map((v, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <div style={{ color: "white", fontSize: "15px", fontWeight: "700" }}>{v.sugar}</div>
                        <div style={{ width: "36px", height: `${Math.min(Number(v.sugar) / 2, 60)}px`, background: Number(v.sugar) > 140 ? "#ef4444" : "#22c55e", borderRadius: "6px" }} />
                        <div style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600" }}>{days[i]}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "20px", minWidth: "90px" }}>
                    <div style={{ fontSize: "30px", color: sugarTrend === "increasing" ? "#ef4444" : "#22c55e" }}>
                      {sugarTrend === "increasing" ? "↑" : "↓"}
                    </div>
                    <div style={{ color: sugarTrend === "increasing" ? "#ef4444" : "#22c55e", fontSize: "15px", fontWeight: "700" }}>
                      {sugarTrend === "increasing" ? "Increasing" : "Improving"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ color: "white", fontSize: "19px", fontWeight: "700", marginBottom: "16px" }}>🌙 Sleep Hours</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", flex: 1 }}>
                    {recentVitals.map((v, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <div style={{ color: "white", fontSize: "15px", fontWeight: "700" }}>{v.sleepHours}</div>
                        <div style={{ width: "36px", height: `${Math.min(Number(v.sleepHours) * 8, 60)}px`, background: Number(v.sleepHours) >= 7 ? "#22c55e" : "#f59e0b", borderRadius: "6px" }} />
                        <div style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600" }}>{days[i]}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "20px", minWidth: "90px" }}>
                    <div style={{ fontSize: "30px", color: sleepTrend === "increasing" ? "#22c55e" : "#ef4444" }}>
                      {sleepTrend === "increasing" ? "↑" : "↓"}
                    </div>
                    <div style={{ color: sleepTrend === "increasing" ? "#22c55e" : "#ef4444", fontSize: "15px", fontWeight: "700" }}>
                      {sleepTrend === "increasing" ? "Improving" : "Declining"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ background: "#111827", borderRadius: "18px", padding: "22px", minHeight: "470px", border: "1px solid rgba(255,255,255,.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ color: "white", fontWeight: "700", fontSize: "20px", marginBottom: "28px" }}>🔮 Risk Prediction</div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "35px" }}>
            <div style={{ fontSize: "50px" }}>{riskEmoji}</div>
            <div style={{ fontSize: "30px", fontWeight: "800", color: riskColor }}>{riskLevel} Risk</div>
          </div>

          <div style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600", marginBottom: "14px" }}>Reason</div>
          <div style={{ background: "#162235", padding: "16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ fontSize: "28px" }}>{riskReason.icon}</div>
            <div style={{ color: "white", fontSize: "15px", fontWeight: "600", lineHeight: "24px" }}>{riskReason.text}</div>
          </div>

          <div style={{ color: "#94a3b8", fontSize: "15px", fontWeight: "600", marginTop: "24px", marginBottom: "14px" }}>Recommendation</div>
          <div style={{ background: "#162235", padding: "16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ fontSize: "28px" }}>{riskRec.icon}</div>
            <div style={{ color: "white", fontSize: "15px", fontWeight: "600", lineHeight: "24px" }}>{riskRec.text}</div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default PersonalHealthAssistant;