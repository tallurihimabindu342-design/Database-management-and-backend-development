import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const TYPE_CONFIG = {
  Appointment: { icon: "📅", label: "Appointment Update", color: "#60a5fa" },
  Prescription: { icon: "💊", label: "New Prescription", color: "#22c55e" },
  FollowUp: { icon: "🔄", label: "Follow-Up Due", color: "#f59e0b" },
  Consultation: { icon: "📋", label: "Consultation Completed", color: "#a855f7" },
  Report: { icon: "📄", label: "Medical Report", color: "#60a5fa" },
  Refill: { icon: "💊", label: "Medication Refill", color: "#f59e0b" },
  Risk: { icon: "⚠️", label: "Clinical Attention Required", color: "#ef4444" },
  ConcernResponse: { icon: "💬", label: "Doctor Responded", color: "#22c55e" },
  Referral: { icon: "🔗", label: "Specialist Referral", color: "#60a5fa" },
};

function Notifications() {
  const patientName = localStorage.getItem("patientName");

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/api/notifications/${encodeURIComponent(patientName)}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load notifications.");
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (patientName) fetchNotifications();
  }, [patientName]);

  const markAllRead = async () => {
    try {
      await fetch(
        `${API_BASE}/api/notifications/${encodeURIComponent(patientName)}/read-all`,
        { method: "PATCH" }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Mark all read failed:", err.message);
    }
  };

  const markRead = async (id) => {
    try {
      await fetch(`${API_BASE}/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => n._id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Mark read failed:", err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const cardStyle = {
    background: "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "18px", padding: "20px",
    border: "1px solid rgba(255,255,255,0.05)",
    marginBottom: "14px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px", maxWidth: "860px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
          <div>
            <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
              🔔 Notifications
              {unreadCount > 0 && (
                <span style={{
                  background: "#ef4444", color: "white",
                  fontSize: "14px", fontWeight: "700",
                  padding: "2px 10px", borderRadius: "999px",
                  marginLeft: "12px", verticalAlign: "middle"
                }}>
                  {unreadCount}
                </span>
              )}
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "14px" }}>
              Stay updated on appointments, prescriptions and health alerts.
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                background: "#1e293b", color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "10px 18px", borderRadius: "12px",
                cursor: "pointer", fontWeight: "600", fontSize: "13px", flexShrink: 0,
              }}
            >
              ✓ Mark All Read
            </button>
          )}
        </div>

        {loading && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Loading notifications...
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
            color: "#f87171", fontSize: "14px"
          }}>
            ⚠ {error}
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "56px", cursor: "default" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔔</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              No Notifications
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px" }}>
              You're all caught up. Notifications will appear here automatically.
            </div>
          </div>
        )}

        {notifications.map((notification) => {
          const config = TYPE_CONFIG[notification.type] || {
            icon: "🔔", label: "Notification", color: "#94a3b8"
          };

          return (
            <div
              key={notification._id}
              onClick={() => !notification.read && markRead(notification._id)}
              style={{
                ...cardStyle,
                border: notification.read
                  ? "1px solid rgba(255,255,255,0.05)"
                  : `1px solid ${config.color}30`,
                background: notification.read
                  ? "linear-gradient(180deg,#0f172a,#111827)"
                  : `linear-gradient(180deg,#0f172a,#111827)`,
                opacity: notification.read ? 0.75 : 1,
              }}
            >
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "12px", flexShrink: 0,
                  background: `${config.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px"
                }}>
                  {config.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <div style={{ color: config.color, fontSize: "13px", fontWeight: "700" }}>
                      {config.label}
                    </div>
                    {!notification.read && (
                      <div style={{
                        width: "8px", height: "8px", borderRadius: "50%",
                        background: config.color, flexShrink: 0
                      }} />
                    )}
                  </div>
                  <div style={{ color: "white", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                    {notification.title}
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: "20px", marginBottom: "8px" }}>
                    {notification.message}
                  </div>
                  <div style={{ color: "#475569", fontSize: "11px" }}>
                    {notification.createdAt}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notifications;