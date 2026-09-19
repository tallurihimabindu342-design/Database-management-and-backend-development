import Sidebar from "../components/Sidebar";

function MedicationTracker() {
  const patientName = localStorage.getItem("patientName");
  const prescriptions = JSON.parse(localStorage.getItem("prescriptions")) || [];
  const myPrescriptions = prescriptions.filter(p => p.patient === patientName);
  const medicationLogs = JSON.parse(localStorage.getItem("medicationLogs")) || [];
  const today = new Date().toISOString().split("T")[0];

  const markTaken = (medicine) => {
    const logs = JSON.parse(localStorage.getItem("medicationLogs")) || [];
    const alreadyTaken = logs.find(l => l.patient === patientName && l.medicine === medicine && l.date === today);
    if (alreadyTaken) { alert("Already marked today."); return; }
    logs.push({ patient: patientName, medicine, date: today, taken: true });
    localStorage.setItem("medicationLogs", JSON.stringify(logs));
    window.location.reload();
  };

  const isTakenToday = (medicine) =>
    medicationLogs.some(l => l.patient === patientName && l.medicine === medicine && l.date === today);

  const patientLogs = medicationLogs.filter(l => l.patient === patientName);
  const takenToday = myPrescriptions.filter(p => isTakenToday(p.medicines)).length;
  const totalMedicines = myPrescriptions.length;
  const adherenceScore = totalMedicines === 0 ? 0 : Math.round((takenToday / totalMedicines) * 100);
  const streak = patientLogs.length;
  const missedDoses = Math.max(0, totalMedicines * 7 - patientLogs.length);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Patient" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          💊 Medication Tracker
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
          Track your daily medications and stay on schedule.
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "28px" }}>
          {[
            { icon: "📊", label: "Adherence Today", value: `${adherenceScore}%`, color: adherenceScore >= 80 ? "#22c55e" : adherenceScore >= 50 ? "#f59e0b" : "#ef4444" },
            { icon: "✅", label: "Taken Today", value: `${takenToday}/${totalMedicines}`, color: "#22c55e" },
            { icon: "🔥", label: "Total Streak", value: streak, color: "#f59e0b" },
            { icon: "❌", label: "Missed (7 days)", value: missedDoses, color: "#ef4444" },
          ].map((item, i) => (
            <div key={i} style={{
              background: "linear-gradient(180deg,#0f172a,#111827)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "18px", padding: "20px"
            }}>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{item.icon}</div>
              <div style={{ color: item.color, fontSize: "28px", fontWeight: "800", marginBottom: "4px" }}>{item.value}</div>
              <div style={{ color: "#64748b", fontSize: "12px" }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Adherence bar */}
        <div style={{
          background: "#0f172a", borderRadius: "14px", padding: "18px",
          border: "1px solid rgba(255,255,255,0.05)", marginBottom: "28px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <span style={{ color: "white", fontWeight: "600" }}>Today's Progress</span>
            <span style={{ color: "#22c55e", fontWeight: "700" }}>{adherenceScore}%</span>
          </div>
          <div style={{ background: "#1e293b", borderRadius: "99px", height: "8px" }}>
            <div style={{
              width: `${adherenceScore}%`, height: "8px", borderRadius: "99px",
              background: adherenceScore >= 80 ? "linear-gradient(90deg,#22c55e,#16a34a)" :
                adherenceScore >= 50 ? "linear-gradient(90deg,#f59e0b,#d97706)" :
                "linear-gradient(90deg,#ef4444,#dc2626)",
              transition: "width 0.5s"
            }} />
          </div>
        </div>

        {/* Medications */}
        <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
          📋 Today's Medications
        </h2>

        {myPrescriptions.length === 0 ? (
          <div style={{
            background: "#0f172a", borderRadius: "18px", padding: "40px",
            border: "1px solid rgba(255,255,255,0.05)", color: "#64748b", textAlign: "center"
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>💊</div>
            <p>No active medications prescribed.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {myPrescriptions.map((p, i) => {
              const taken = isTakenToday(p.medicines);
              return (
                <div key={i} style={{
                  background: "linear-gradient(180deg,#0f172a,#111827)",
                  border: `1px solid ${taken ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)"}`,
                  borderRadius: "18px", padding: "22px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)"
                }}>
                  <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "14px",
                      background: taken ? "rgba(34,197,94,0.15)" : "rgba(59,130,246,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px"
                    }}>
                      {taken ? "✅" : "💊"}
                    </div>
                    <div>
                      <div style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
                        {p.medicines}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "13px" }}>
                        Dr. {p.doctor} • {p.medicationTime || "As prescribed"} • {p.duration || "--"} days
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{
                      padding: "5px 14px", borderRadius: "999px", fontSize: "13px", fontWeight: "700",
                      background: taken ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                      color: taken ? "#22c55e" : "#ef4444"
                    }}>
                      {taken ? "🟢 Taken" : "🔴 Pending"}
                    </span>
                    {!taken && (
                      <button onClick={() => markTaken(p.medicines)} style={{
                        background: "linear-gradient(90deg,#22c55e,#16a34a)",
                        color: "white", border: "none", padding: "10px 20px",
                        borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px"
                      }}>
                        ✓ Mark Taken
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicationTracker;