import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function ConsultationRoom() {
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const isDoctor = role === "Doctor";

  const consultation = JSON.parse(localStorage.getItem("currentConsultation"));
  const patientName = consultation?.patientName || "Patient";
  const doctorName = consultation?.doctorName || "Doctor";
  const appointmentId = consultation?.appointmentId;

  const reports = JSON.parse(localStorage.getItem("medicalReports")) || [];
  const symptoms = JSON.parse(localStorage.getItem("bodySymptoms")) || [];
  const patientSymptoms = symptoms.filter(s => s.patientName === patientName);
  const latestSymptom = patientSymptoms[patientSymptoms.length - 1];

  useEffect(() => {
    const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const formatTime = (s) => new Date(s * 1000).toISOString().substr(11, 8);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat([...chat, {
      sender: isDoctor ? doctorName : patientName,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);
    setMessage("");
  };

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const endConsultation = () => {
    const consultationHistory = JSON.parse(localStorage.getItem("consultationHistory")) || [];
    consultationHistory.push({
      patient: patientName, doctor: doctorName, notes, duration: seconds,
      date: new Date().toLocaleString(),
      appointmentId: localStorage.getItem("selectedAppointment"),
      symptomType: latestSymptom?.symptomType,
      bodyPart: latestSymptom?.bodyPart,
      severity: latestSymptom?.severity,
      symptomDescription: latestSymptom?.description,
    });
    localStorage.setItem("consultationHistory", JSON.stringify(consultationHistory));
    localStorage.setItem("consultationSummary", JSON.stringify({
      patient: patientName, doctor: doctorName, notes, duration: seconds,
      followUp: "Follow-up if symptoms persist", date: new Date().toLocaleString(),
    }));

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    localStorage.setItem("appointments", JSON.stringify(
      appointments.map(a => a.appointmentId === localStorage.getItem("selectedAppointment")
        ? { ...a, status: "Completed" } : a)
    ));

    const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push({
      patientName, type: "Consultation", title: "Consultation Completed",
      message: "Your consultation has been completed. Summary is now available.",
      createdAt: new Date().toLocaleString(),
    });
    localStorage.setItem("notifications", JSON.stringify(notifications));

    const statuses = JSON.parse(localStorage.getItem("doctorStatuses")) || {};
    statuses[localStorage.getItem("doctorId")] = "Online";
    localStorage.setItem("doctorStatuses", JSON.stringify(statuses));

    navigate("/consultation-summary");
  };

  return (
    <div style={{ display: "flex" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ripple { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.4)} 100%{box-shadow:0 0 0 20px rgba(34,197,94,0)} }
      `}</style>

      <Sidebar role={isDoctor ? "Doctor" : "Patient"} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, background: "#060d1a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ── TOP BAR ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 24px", background: "#0a1628",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
              <span style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>Live Consultation</span>
            </div>
            <div style={{ background: "#111827", padding: "4px 12px", borderRadius: "6px", color: "#64748b", fontSize: "12px" }}>
              ID: {appointmentId}
            </div>
            <div style={{ background: "#111827", padding: "4px 12px", borderRadius: "6px", color: "#64748b", fontSize: "12px" }}>
              {isDoctor ? "Doctor View" : "Patient View"}
            </div>
          </div>
          <div style={{
            background: "#111827", padding: "6px 16px", borderRadius: "8px",
            color: "#f59e0b", fontWeight: "700", fontSize: "15px", fontFamily: "monospace"
          }}>
            🕒 {formatTime(seconds)}
          </div>
        </div>

        {/* ── MAIN AREA ── */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Video Grid */}
          <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Large tile — other person */}
            <div style={{ flex: 1, position: "relative", background: "linear-gradient(135deg,#0d1b3e,#060d1a)", borderRadius: "18px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: "110px", height: "110px", borderRadius: "50%",
                  background: isDoctor ? "linear-gradient(135deg,#7c3aed,#4f46e5)" : "linear-gradient(135deg,#1d4ed8,#2563eb)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "40px", fontWeight: "800", color: "white",
                  boxShadow: "0 0 0 16px rgba(255,255,255,0.04), 0 0 0 32px rgba(255,255,255,0.02)",
                  marginBottom: "16px"
                }}>
                  {getInitials(isDoctor ? patientName : doctorName)}
                </div>
                <div style={{ color: "white", fontSize: "20px", fontWeight: "700" }}>
                  {isDoctor ? patientName : doctorName}
                </div>
                <div style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>
                  {isDoctor ? "Patient" : "Doctor"}
                </div>
              </div>

              {/* Live badge */}
              <div style={{
                position: "absolute", top: "14px", right: "14px",
                background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
                padding: "5px 12px", borderRadius: "20px",
                display: "flex", alignItems: "center", gap: "6px"
              }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
                <span style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>LIVE</span>
              </div>

              {/* Name tag bottom left */}
              <div style={{
                position: "absolute", bottom: "14px", left: "14px",
                background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
                padding: "5px 12px", borderRadius: "8px", color: "white", fontSize: "13px", fontWeight: "600"
              }}>
                {isDoctor ? patientName : `Dr. ${doctorName}`}
              </div>
            </div>

            {/* Bottom row — self tile + stats */}
            <div style={{ display: "flex", gap: "12px", height: "150px" }}>

              {/* Self tile */}
              <div style={{
                width: "230px", flexShrink: 0,
                background: cameraOn ? "linear-gradient(135deg,#1e3a5f,#060d1a)" : "#0a1628",
                borderRadius: "14px", border: "2px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", overflow: "hidden"
              }}>
                {cameraOn ? (
                  <div style={{
                    width: "60px", height: "60px", borderRadius: "50%",
                    background: isDoctor ? "linear-gradient(135deg,#1d4ed8,#2563eb)" : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "22px", fontWeight: "800", color: "white"
                  }}>
                    {getInitials(isDoctor ? doctorName : patientName)}
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "30px" }}>📵</div>
                    <div style={{ color: "#475569", fontSize: "12px", marginTop: "6px" }}>Camera Off</div>
                  </div>
                )}
                <div style={{
                  position: "absolute", bottom: "8px", left: "8px",
                  background: "rgba(0,0,0,0.7)", padding: "3px 8px",
                  borderRadius: "6px", color: "white", fontSize: "11px", fontWeight: "600"
                }}>
                  {isDoctor ? doctorName : patientName} (You)
                </div>
                {isMuted && (
                  <div style={{
                    position: "absolute", top: "8px", right: "8px",
                    background: "#ef4444", borderRadius: "50%", width: "24px", height: "24px",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px"
                  }}>🔇</div>
                )}
                {handRaised && (
                  <div style={{
                    position: "absolute", top: "8px", left: "8px",
                    background: "#f59e0b", borderRadius: "50%", width: "24px", height: "24px",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px"
                  }}>✋</div>
                )}
              </div>

              {/* Stats bar */}
              <div style={{
                flex: 1, background: "#0a1628", borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: "14px 24px", display: "flex", alignItems: "center",
                justifyContent: "space-around"
              }}>
                {[
                  { label: "🎤 Audio", value: isMuted ? "Muted" : "Clear", color: isMuted ? "#ef4444" : "#22c55e" },
                  { label: "📷 Camera", value: cameraOn ? "On" : "Off", color: cameraOn ? "#22c55e" : "#ef4444" },
                  { label: "📡 Network", value: "Excellent", color: "#22c55e" },
                  { label: "🔒 Encrypted", value: "Yes", color: "#22c55e" },
                  { label: "👥 Connected", value: "2 / 2", color: "white" },
                ].map((item, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ color: "#475569", fontSize: "11px", marginBottom: "5px" }}>{item.label}</div>
                    <div style={{ color: item.color, fontSize: "15px", fontWeight: "700" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANELS ── */}

          {/* Chat Panel */}
          {showChat && (
            <div style={{
              width: "320px", background: "#0a1628",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column", animation: "fadeIn 0.2s ease"
            }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>💬 In-Call Chat</span>
                <span onClick={() => setShowChat(false)} style={{ color: "#64748b", cursor: "pointer", fontSize: "18px" }}>✕</span>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {chat.length === 0 ? (
                  <div style={{ color: "#334155", textAlign: "center", marginTop: "40px", fontSize: "14px" }}>No messages yet.</div>
                ) : chat.map((msg, i) => (
                  <div key={i} style={{ animation: "fadeIn 0.2s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#60a5fa", fontSize: "12px", fontWeight: "700" }}>{msg.sender}</span>
                      <span style={{ color: "#334155", fontSize: "11px" }}>{msg.time}</span>
                    </div>
                    <div style={{ background: "#1e293b", color: "#e2e8f0", padding: "10px 12px", borderRadius: "10px", fontSize: "14px", lineHeight: "20px" }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: "12px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "8px" }}>
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Send a message..."
                  style={{ flex: 1, background: "#1e293b", color: "white", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", outline: "none", fontSize: "14px" }}
                />
                <button onClick={sendMessage} style={{ background: "#2563eb", color: "white", border: "none", borderRadius: "10px", padding: "10px 14px", cursor: "pointer", fontWeight: "700" }}>➤</button>
              </div>
            </div>
          )}

          {/* Notes Panel (Doctor only) */}
          {showNotes && isDoctor && (
            <div style={{
              width: "340px", background: "#0a1628",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column", animation: "fadeIn 0.2s ease"
            }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>📝 Doctor Notes</span>
                <span onClick={() => setShowNotes(false)} style={{ color: "#64748b", cursor: "pointer", fontSize: "18px" }}>✕</span>
              </div>
              <div style={{ flex: 1, padding: "16px" }}>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Write consultation notes here..."
                  style={{
                    width: "100%", height: "100%", minHeight: "300px",
                    background: "#111827", color: "white",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px", padding: "14px",
                    fontSize: "14px", resize: "none", outline: "none",
                    lineHeight: "22px", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>
          )}

          {/* Reports Panel (Doctor only) */}
          {showReports && isDoctor && (
            <div style={{
              width: "340px", background: "#0a1628",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column", animation: "fadeIn 0.2s ease", overflowY: "auto"
            }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>📁 Patient Reports</span>
                <span onClick={() => setShowReports(false)} style={{ color: "#64748b", cursor: "pointer", fontSize: "18px" }}>✕</span>
              </div>
              <div style={{ padding: "14px", flex: 1 }}>
                {reports.length === 0 ? (
                  <div style={{ color: "#475569", textAlign: "center", marginTop: "40px" }}>No reports uploaded.</div>
                ) : reports.map((report, i) => (
                  <div key={i} style={{
                    background: "#111827", borderRadius: "12px", padding: "14px",
                    marginBottom: "10px", border: "1px solid rgba(255,255,255,0.05)"
                  }}>
                    <div style={{ color: "white", fontWeight: "600", marginBottom: "6px" }}>📄 {report.reportName}</div>
                    <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "10px" }}>{report.uploadedAt}</div>
                    <button
                      onClick={() => setSelectedReport(report)}
                      style={{ background: "linear-gradient(90deg,#7c3aed,#4f46e5)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
                    >👁 Preview</button>
                    {selectedReport === report && (
                      <div style={{ marginTop: "10px" }}>
                        {report.fileType?.includes("image") && <img src={report.fileData} alt="report" style={{ width: "100%", borderRadius: "8px" }} />}
                        {report.fileType?.includes("pdf") && <a href={report.fileData} target="_blank" style={{ color: "#60a5fa" }}>Open PDF</a>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participants Panel */}
          {showParticipants && (
            <div style={{
              width: "260px", background: "#0a1628",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              padding: "20px", animation: "fadeIn 0.2s ease"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>👥 Participants (2)</span>
                <span onClick={() => setShowParticipants(false)} style={{ color: "#64748b", cursor: "pointer", fontSize: "18px" }}>✕</span>
              </div>
              {[
                { name: doctorName, role: "Doctor", color: "#1d4ed8" },
                { name: patientName, role: "Patient", color: "#7c3aed" },
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px", background: "#111827", borderRadius: "10px", marginBottom: "8px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "800", color: "white" }}>
                    {getInitials(p.name)}
                  </div>
                  <div>
                    <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{p.name}</div>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>{p.role} • Connected</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── BOTTOM CONTROLS BAR ── */}
        <div style={{
          background: "#0a1628", borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "14px 24px", display: "flex", alignItems: "center",
          justifyContent: "center", gap: "10px", flexWrap: "wrap"
        }}>

          {/* Control button helper */}
          {[
            { icon: isMuted ? "🔇" : "🎤", label: isMuted ? "Unmute" : "Mute", action: () => setIsMuted(!isMuted), active: isMuted, activeColor: "#ef4444" },
            { icon: cameraOn ? "📷" : "📵", label: cameraOn ? "Cam Off" : "Cam On", action: () => setCameraOn(!cameraOn), active: !cameraOn, activeColor: "#ef4444" },
            { icon: "✋", label: handRaised ? "Lower Hand" : "Raise Hand", action: () => setHandRaised(!handRaised), active: handRaised, activeColor: "#f59e0b" },
            { icon: "💬", label: "Chat", action: () => { setShowChat(!showChat); setShowNotes(false); setShowReports(false); setShowParticipants(false); }, active: showChat, activeColor: "#2563eb", badge: !showChat && chat.length > 0 ? chat.length : null },
            { icon: "👥", label: "People", action: () => { setShowParticipants(!showParticipants); setShowChat(false); setShowNotes(false); setShowReports(false); }, active: showParticipants, activeColor: "#2563eb" },
            ...(isDoctor ? [
              { icon: "📝", label: "Notes", action: () => { setShowNotes(!showNotes); setShowChat(false); setShowReports(false); setShowParticipants(false); }, active: showNotes, activeColor: "#2563eb" },
              { icon: "📁", label: "Reports", action: () => { setShowReports(!showReports); setShowChat(false); setShowNotes(false); setShowParticipants(false); }, active: showReports, activeColor: "#2563eb" },
            ] : []),
          ].map((btn, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <button
                onClick={btn.action}
                style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  background: btn.active ? btn.activeColor : "#1e293b",
                  border: `2px solid ${btn.active ? btn.activeColor : "rgba(255,255,255,0.08)"}`,
                  color: "white", fontSize: "20px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", position: "relative"
                }}
              >
                {btn.icon}
                {btn.badge && (
                  <div style={{
                    position: "absolute", top: "-2px", right: "-2px",
                    background: "#ef4444", borderRadius: "50%", width: "18px", height: "18px",
                    fontSize: "10px", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "white", fontWeight: "700"
                  }}>{btn.badge}</div>
                )}
              </button>
              <span style={{ color: "#475569", fontSize: "10px" }}>{btn.label}</span>
            </div>
          ))}

          <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.08)", margin: "0 6px" }} />

          {/* End / Leave button */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={isDoctor ? endConsultation : () => navigate("/my-appointments")}
              style={{
                height: "52px", padding: "0 28px", borderRadius: "30px",
                background: "linear-gradient(90deg,#ef4444,#dc2626)",
                border: "none", color: "white", fontSize: "14px", fontWeight: "700",
                cursor: "pointer", boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
                transition: "all 0.2s"
              }}
            >
              {isDoctor ? "⛔ End Consultation" : "🚪 Leave Call"}
            </button>
            <span style={{ color: "#475569", fontSize: "10px" }}>{isDoctor ? "End for all" : "Leave"}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ConsultationRoom;