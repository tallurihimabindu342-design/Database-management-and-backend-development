import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function AdminDoctorRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/admin/doctor-requests`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load requests.");
      setRequests(data);
      setError(null);
    } catch (err) {
      setError("Unable to load doctor requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const response = await fetch(`${API_BASE}/api/admin/doctor-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Update failed.");
      await fetchRequests();
    } catch (err) {
      alert("Failed to update doctor status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const pending = requests.filter(r => r.status === "Pending");
  const reviewed = requests.filter(r => r.status !== "Pending");

  const statusColor = (status) =>
    status === "Approved" ? "#22c55e" : status === "Rejected" ? "#ef4444" : "#f59e0b";

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Administrator" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          👨‍⚕️ Doctor Registration Requests
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>
          Review and approve doctor registration applications.
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "20px", color: "#f87171", fontSize: "14px"
          }}>
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Loading requests...</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", maxWidth: "500px", marginBottom: "30px" }}>
              {[
                { label: "Pending", value: pending.length, color: "#f59e0b" },
                { label: "Approved", value: requests.filter(r => r.status === "Approved").length, color: "#22c55e" },
                { label: "Rejected", value: requests.filter(r => r.status === "Rejected").length, color: "#ef4444" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "#0f172a", borderRadius: "14px", padding: "16px",
                  border: "1px solid rgba(255,255,255,0.05)", textAlign: "center"
                }}>
                  <div style={{ color: item.color, fontSize: "26px", fontWeight: "800" }}>{item.value}</div>
                  <div style={{ color: "#64748b", fontSize: "12px", marginTop: "4px" }}>{item.label}</div>
                </div>
              ))}
            </div>

            <h2 style={{ color: "white", fontSize: "17px", fontWeight: "700", marginBottom: "16px" }}>
              ⏳ Pending Requests ({pending.length})
            </h2>

            {pending.length === 0 ? (
              <div style={{
                background: "#0f172a", borderRadius: "16px", padding: "30px",
                border: "1px solid rgba(255,255,255,0.05)", color: "#64748b", textAlign: "center", marginBottom: "30px"
              }}>
                No pending requests.
              </div>
            ) : (
              pending.map((request) => (
                <div key={request._id} style={{
                  background: "linear-gradient(180deg,#0f172a,#111827)",
                  border: "1px solid rgba(245,158,11,0.15)",
                  borderRadius: "18px", padding: "24px", marginBottom: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
                }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    {[
                      { label: "Full Name", value: request.fullName },
                      { label: "Doctor ID", value: request.doctorId },
                      { label: "Specialization", value: request.specialization },
                      { label: "Email", value: request.email },
                      { label: "Phone", value: request.phone },
                    ].map((item, j) => (
                      <div key={j} style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                        <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>{item.label}</div>
                        <div style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>{item.value || "--"}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      onClick={() => updateStatus(request._id, "Approved")}
                      disabled={updatingId === request._id}
                      style={{
                        background: "linear-gradient(90deg,#22c55e,#16a34a)",
                        color: "white", border: "none", padding: "12px 24px",
                        borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px",
                        opacity: updatingId === request._id ? 0.6 : 1,
                      }}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => updateStatus(request._id, "Rejected")}
                      disabled={updatingId === request._id}
                      style={{
                        background: "linear-gradient(90deg,#ef4444,#dc2626)",
                        color: "white", border: "none", padding: "12px 24px",
                        borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px",
                        opacity: updatingId === request._id ? 0.6 : 1,
                      }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))
            )}

            {reviewed.length > 0 && (
              <>
                <h2 style={{ color: "white", fontSize: "17px", fontWeight: "700", margin: "30px 0 16px" }}>
                  📋 Reviewed Requests ({reviewed.length})
                </h2>
                {reviewed.map((request) => (
                  <div key={request._id} style={{
                    background: "linear-gradient(180deg,#0f172a,#111827)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "16px", padding: "20px", marginBottom: "12px",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <div style={{ display: "flex", gap: "24px" }}>
                      <div>
                        <div style={{ color: "#64748b", fontSize: "11px" }}>Name</div>
                        <div style={{ color: "white", fontWeight: "600" }}>{request.fullName}</div>
                      </div>
                      <div>
                        <div style={{ color: "#64748b", fontSize: "11px" }}>Specialization</div>
                        <div style={{ color: "white", fontWeight: "600" }}>{request.specialization}</div>
                      </div>
                      <div>
                        <div style={{ color: "#64748b", fontSize: "11px" }}>Doctor ID</div>
                        <div style={{ color: "white", fontWeight: "600" }}>{request.doctorId}</div>
                      </div>
                    </div>
                    <span style={{
                      color: statusColor(request.status), fontWeight: "700", fontSize: "14px",
                      background: request.status === "Approved" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      padding: "6px 14px", borderRadius: "999px"
                    }}>
                      {request.status === "Approved" ? "✅" : "❌"} {request.status}
                    </span>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDoctorRequests;