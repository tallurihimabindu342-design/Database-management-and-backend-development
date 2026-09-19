import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function PatientConsultationRoom() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const chatEndRef = useRef(null);

  const consultation = JSON.parse(localStorage.getItem("currentConsultation"));
  const patientName = consultation?.patientName || "Patient";
  const doctorName = consultation?.doctorName || "Doctor";
  const appointmentId = consultation?.appointmentId;

  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const formatTime = (s) => new Date(s * 1000).toISOString().substr(11, 8);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat([...chat, { sender: patientName, text: message, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    setMessage("");
  };

  const getInitials = (name) => name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarBox = (name, color, label) => (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{
        width: "100%", aspectRatio: "16/9", background: `linear-gradient(135deg, ${color}, #0f172a)`,
        borderRadius: "16px", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.08)"
      }}>
        {/* Animated pulse ring */}
        <div style={{
          width: "90px", height: "90px", borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 0 12px rgba(255,255,255,0.04)"
        }}>
          <div style={{
            width: "70px", height: "70px", borderRadius: "50%",
            background: color, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "28px", fontWeight: "800", color: "white"
          }}>
            {getInitials(name)}
          </div>
        </div>
        {/* Name tag */}
        <div style={{
          position: "absolute", bottom: "10px", left: "10px",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: "6px",
          color: "white", fontSize: "13px", fontWeight: "600"
        }}>
          {name} {label && <span style={{ color: "#94a3b8", fontSize: "11px" }}>({label})</span>}
        </div>
        {/* Live indicator */}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          display: "flex", alignItems: "center", gap: "5px",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
          padding: "4px 10px", borderRadius: "6px"
        }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", animation: "pulse 1.5s infinite" }} />
          <span style={{ color: "white", fontSize: "12px", fontWeight: "600" }}>LIVE</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      <Sidebar role="Patient" collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ flex: 1, background: "#0a0f1e", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* Top Bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 24px", background: "#0f172a",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>Live Consultation</span>
            <span style={{ color: "#64748b", fontSize: "13px" }}>• ID: {appointmentId}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{
              background: "#1e293b", padding: "6px 14px", borderRadius: "8px",
              color: "#f59e0b", fontWeight: "700", fontSize: "14px", fontFamily: "monospace"
            }}>
              🕒 {formatTime(seconds)}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", gap: "0", overflow: "hidden" }}>

          {/* Video Grid */}
          <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Main large video — doctor */}
            <div style={{ flex: 1, position: "relative" }}>
              {avatarBox(doctorName, "#1d4ed8", "Doctor")}
            </div>

            {/* Bottom row — patient (small) */}
            <div style={{ display: "flex", gap: "12px", height: "140px" }}>
              <div style={{ width: "220px", flexShrink: 0, position: "relative" }}>
                <div style={{
                  width: "100%", height: "100%", background: cameraOn
                    ? "linear-gradient(135deg,#7c3aed,#0f172a)"
                    : "#0f172a",
                  borderRadius: "12px", display: "flex", alignItems: "center",
                  justifyContent: "center", border: "2px solid rgba(255,255,255,0.1)",
                  position: "relative", overflow: "hidden"
                }}>
                  {cameraOn ? (
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "50%",
                      background: "#7c3aed", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "20px", fontWeight: "800", color: "white"
                    }}>
                      {getInitials(patientName)}
                    </div>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "28px" }}>📷</div>
                      <div style={{ color: "#64748b", fontSize: "12px" }}>Camera Off</div>
                    </div>
                  )}
                  <div style={{
                    position: "absolute", bottom: "6px", left: "8px",
                    background: "rgba(0,0,0,0.7)", padding: "3px 8px",
                    borderRadius: "5px", color: "white", fontSize: "11px", fontWeight: "600"
                  }}>
                    {patientName} (You)
                  </div>
                  {isMuted && (
                    <div style={{
                      position: "absolute", top: "6px", right: "6px",
                      background: "#ef4444", borderRadius: "50%",
                      width: "22px", height: "22px", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: "11px"
                    }}>🔇</div>
                  )}
                  {handRaised && (
                    <div style={{
                      position: "absolute", top: "6px", left: "6px",
                      background: "#f59e0b", borderRadius: "50%",
                      width: "22px", height: "22px", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: "11px"
                    }}>✋</div>
                  )}
                </div>
              </div>

              {/* Connection quality bar */}
              <div style={{
                flex: 1, background: "#0f172a", borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.05)",
                padding: "14px 18px", display: "flex", alignItems: "center", gap: "24px"
              }}>
                {[
                  { label: "🔊 Audio", value: isMuted ? "Muted" : "Clear", color: isMuted ? "#ef4444" : "#22c55e" },
                  { label: "📡 Network", value: "Excellent", color: "#22c55e" },
                  { label: "🔒 Encrypted", value: "Yes", color: "#22c55e" },
                  { label: "👥 Participants", value: "2", color: "white" },
                ].map((item, i) => (
                  <div key={i}>
                    <div style={{ color: "#475569", fontSize: "11px", marginBottom: "3px" }}>{item.label}</div>
                    <div style={{ color: item.color, fontSize: "14px", fontWeight: "700" }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          {showChat && (
            <div style={{
              width: "320px", background: "#0f172a",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              display: "flex", flexDirection: "column", animation: "fadeIn 0.2s ease"
            }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ color: "white", fontWeight: "700", fontSize: "15px" }}>💬 In-Call Chat</div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {chat.length === 0 ? (
                  <div style={{ color: "#334155", textAlign: "center", marginTop: "40px", fontSize: "14px" }}>
                    No messages yet.<br />Start the conversation.
                  </div>
                ) : (
                  chat.map((msg, i) => (
                    <div key={i} style={{ animation: "fadeIn 0.2s ease" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ color: "#60a5fa", fontSize: "12px", fontWeight: "700" }}>{msg.sender}</span>
                        <span style={{ color: "#334155", fontSize: "11px" }}>{msg.time}</span>
                      </div>
                      <div style={{
                        background: "#1e293b", color: "#e2e8f0", padding: "10px 12px",
                        borderRadius: "10px", fontSize: "14px", lineHeight: "20px"
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "8px" }}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Send a message..."
                  style={{
                    flex: 1, background: "#1e293b", color: "white",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px", padding: "10px 14px",
                    outline: "none", fontSize: "14px"
                  }}
                />
                <button onClick={sendMessage} style={{
                  background: "#2563eb", color: "white", border: "none",
                  borderRadius: "10px", padding: "10px 14px", cursor: "pointer", fontWeight: "700"
                }}>➤</button>
              </div>
            </div>
          )}

          {/* Participants Panel */}
          {showParticipants && (
            <div style={{
              width: "260px", background: "#0f172a",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
              padding: "20px", animation: "fadeIn 0.2s ease"
            }}>
              <div style={{ color: "white", fontWeight: "700", fontSize: "15px", marginBottom: "16px" }}>
                👥 Participants (2)
              </div>
              {[
                { name: doctorName, role: "Doctor", color: "#1d4ed8", status: "Speaking" },
                { name: patientName, role: "Patient (You)", color: "#7c3aed", status: isMuted ? "Muted" : "Active" },
              ].map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px", background: "#111827", borderRadius: "10px", marginBottom: "8px"
                }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    background: p.color, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "14px", fontWeight: "800", color: "white"
                  }}>
                    {getInitials(p.name)}
                  </div>
                  <div>
                    <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{p.name}</div>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>{p.role} • {p.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Controls Bar */}
        <div style={{
          background: "#0f172a", borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px"
        }}>
          {/* Mute */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: isMuted ? "#ef4444" : "#1e293b",
                border: `2px solid ${isMuted ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                color: "white", fontSize: "20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              {isMuted ? "🔇" : "🎤"}
            </button>
            <span style={{ color: "#64748b", fontSize: "10px" }}>{isMuted ? "Unmute" : "Mute"}</span>
          </div>

          {/* Camera */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setCameraOn(!cameraOn)}
              style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: cameraOn ? "#1e293b" : "#ef4444",
                border: `2px solid ${cameraOn ? "rgba(255,255,255,0.1)" : "#ef4444"}`,
                color: "white", fontSize: "20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
            >
              {cameraOn ? "📷" : "📵"}
            </button>
            <span style={{ color: "#64748b", fontSize: "10px" }}>{cameraOn ? "Cam Off" : "Cam On"}</span>
          </div>

          {/* Raise Hand */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => setHandRaised(!handRaised)}
              style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: handRaised ? "#f59e0b" : "#1e293b",
                border: `2px solid ${handRaised ? "#f59e0b" : "rgba(255,255,255,0.1)"}`,
                color: "white", fontSize: "20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
            >✋</button>
            <span style={{ color: "#64748b", fontSize: "10px" }}>Raise Hand</span>
          </div>

          {/* Chat */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
              style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: showChat ? "#2563eb" : "#1e293b",
                border: `2px solid ${showChat ? "#2563eb" : "rgba(255,255,255,0.1)"}`,
                color: "white", fontSize: "20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s", position: "relative"
              }}
            >
              💬
              {chat.length > 0 && !showChat && (
                <div style={{
                  position: "absolute", top: "-2px", right: "-2px",
                  background: "#ef4444", borderRadius: "50%",
                  width: "18px", height: "18px", fontSize: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontWeight: "700"
                }}>{chat.length}</div>
              )}
            </button>
            <span style={{ color: "#64748b", fontSize: "10px" }}>Chat</span>
          </div>

          {/* Participants */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
              style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: showParticipants ? "#2563eb" : "#1e293b",
                border: `2px solid ${showParticipants ? "#2563eb" : "rgba(255,255,255,0.1)"}`,
                color: "white", fontSize: "20px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}
            >👥</button>
            <span style={{ color: "#64748b", fontSize: "10px" }}>People</span>
          </div>

          {/* Divider */}
          <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.08)", margin: "0 8px" }} />

          {/* Leave */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => navigate("/my-appointments")}
              style={{
                height: "52px", padding: "0 24px", borderRadius: "30px",
                background: "linear-gradient(90deg,#ef4444,#dc2626)",
                border: "none", color: "white", fontSize: "14px",
                fontWeight: "700", cursor: "pointer",
                boxShadow: "0 4px 20px rgba(239,68,68,0.4)",
                transition: "all 0.2s"
              }}
            >
              🚪 Leave Call
            </button>
            <span style={{ color: "#64748b", fontSize: "10px" }}>Leave</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientConsultationRoom;