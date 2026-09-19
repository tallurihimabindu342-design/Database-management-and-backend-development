import { useState } from "react";
import Sidebar from "../components/Sidebar";

function PatientReports() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");

  const reports = JSON.parse(localStorage.getItem("medicalReports")) || [];
  const filtered = reports.filter(r =>
    r.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    r.reportName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Doctor" />

      <div style={{
        flex: 1, padding: "32px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh",
      }}>
        <h1 style={{ color: "white", fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
          📄 Patient Reports
        </h1>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
          Review uploaded reports and patient medical records.
        </p>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by patient or report name..."
          style={{
            width: "100%", maxWidth: "500px", padding: "12px 16px",
            background: "#0f172a", color: "white",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", outline: "none", fontSize: "14px", marginBottom: "24px"
          }}
        />

        {filtered.length === 0 ? (
          <div style={{
            background: "linear-gradient(180deg,#0f172a,#111827)",
            borderRadius: "20px", padding: "48px", textAlign: "center",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📄</div>
            <h2 style={{ color: "white", marginBottom: "8px" }}>No Reports Found</h2>
            <p style={{ color: "#94a3b8" }}>No patient reports match your search.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {filtered.map((report, i) => (
              <div key={i} style={{
                background: "linear-gradient(180deg,#0f172a,#111827)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "18px", padding: "20px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: report.fileType?.includes("pdf")
                      ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px"
                  }}>
                    {report.fileType?.includes("pdf") ? "📕" : "🖼️"}
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>
                      {report.reportName}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "13px" }}>
                      👤 {report.patientName} • {report.uploadedAt}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <span style={{
                    background: report.fileType?.includes("pdf")
                      ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
                    color: report.fileType?.includes("pdf") ? "#f87171" : "#60a5fa",
                    padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700"
                  }}>
                    {report.fileType?.includes("pdf") ? "PDF" : "Image"}
                  </span>
                  <button
                    onClick={() => setSelectedReport(selectedReport === report ? null : report)}
                    style={{
                      background: "linear-gradient(90deg,#7c3aed,#4f46e5)",
                      color: "white", border: "none", padding: "10px 18px",
                      borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px"
                    }}
                  >
                    {selectedReport === report ? "✕ Close" : "👁 Preview"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Panel */}
        {selectedReport && (
          <div style={{
            background: "#0f172a", borderRadius: "18px", padding: "24px",
            border: "1px solid rgba(255,255,255,0.05)", marginTop: "20px"
          }}>
            <h3 style={{ color: "white", marginBottom: "16px" }}>📄 {selectedReport.reportName}</h3>
            {selectedReport.fileType?.includes("image") && (
              <img src={selectedReport.fileData} alt="report" style={{ maxWidth: "100%", borderRadius: "12px" }} />
            )}
            {selectedReport.fileType?.includes("pdf") && (
              <a href={selectedReport.fileData} target="_blank" rel="noreferrer"
                style={{ color: "#60a5fa", fontSize: "15px", fontWeight: "600" }}>
                🔗 Open PDF in new tab
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientReports;