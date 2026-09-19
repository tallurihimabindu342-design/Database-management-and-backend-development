import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { jsPDF } from "jspdf";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function MyPrescriptions() {
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName");

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE}/api/prescriptions/patient/${encodeURIComponent(patientName)}`
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to load prescriptions.");
        setPrescriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (patientName) fetchPrescriptions();
  }, [patientName]);

  const downloadPDF = (prescription) => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Digital Healthcare — Prescription", 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Doctor: ${prescription.doctor}`, 20, 40);
    pdf.text(`Patient: ${prescription.patient}`, 20, 52);
    pdf.text(`Diagnosis: ${prescription.diagnosis}`, 20, 64);
    pdf.text(`Medicines: ${prescription.medicines}`, 20, 76);
    pdf.text(`Medication Time: ${prescription.medicationTime || "N/A"}`, 20, 88);
    pdf.text(`Duration: ${prescription.duration || "N/A"} days`, 20, 100);
    pdf.text(`Instructions: ${prescription.instructions}`, 20, 112);
    pdf.text(`Follow Up: ${prescription.followUp || "None"}`, 20, 124);
    pdf.text(`Created: ${prescription.createdAt}`, 20, 136);
    pdf.save(`Prescription-${prescription.patient}-${prescription.createdAt}.pdf`);
  };

  const cardStyle = {
    background: "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "20px", padding: "24px",
    border: "1px solid rgba(255,255,255,0.05)",
    marginBottom: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#020617,#071938,#10214f)" }}>
      <Sidebar role="Patient" />

      <div style={{ flex: 1, padding: "32px" }}>
        <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", marginBottom: "6px" }}>
          💊 My Prescriptions
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "28px" }}>
          All prescriptions issued by your doctors.
        </p>

        {loading && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
            Loading prescriptions...
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

        {!loading && !error && prescriptions.length === 0 && (
          <div style={{ ...cardStyle, textAlign: "center", padding: "48px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>💊</div>
            <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "8px" }}>
              No Prescriptions Yet
            </div>
            <div style={{ color: "#94a3b8", fontSize: "14px" }}>
              Prescriptions from your doctors will appear here after consultations.
            </div>
          </div>
        )}

        {prescriptions.map((prescription, index) => (
          <div key={index} style={cardStyle}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div>
                <div style={{ color: "white", fontSize: "18px", fontWeight: "700", marginBottom: "4px" }}>
                  💊 {prescription.medicines}
                </div>
                <div style={{ color: "#64748b", fontSize: "12px" }}>
                  Prescribed by Dr. {prescription.doctor} • {prescription.createdAt}
                </div>
              </div>
              <button
                onClick={() => downloadPDF(prescription)}
                style={{
                  background: "linear-gradient(90deg,#2563eb,#7c3aed)",
                  color: "white", border: "none", padding: "10px 18px",
                  borderRadius: "10px", cursor: "pointer",
                  fontWeight: "600", fontSize: "13px", flexShrink: 0,
                }}
              >
                ⬇ Download PDF
              </button>
            </div>

            {/* Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              {[
                { label: "DIAGNOSIS", value: prescription.diagnosis },
                { label: "DURATION", value: prescription.duration ? `${prescription.duration} days` : "Not specified" },
                { label: "MEDICATION TIME", value: prescription.medicationTime || "Not specified" },
                { label: "FOLLOW UP", value: prescription.followUp || "Not required" },
              ].map((item) => (
                <div key={item.label} style={{ background: "#0f172a", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            {prescription.instructions && (
              <div style={{ background: "#0f172a", borderRadius: "10px", padding: "14px" }}>
                <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "6px" }}>INSTRUCTIONS</div>
                <div style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: "20px" }}>
                  {prescription.instructions}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPrescriptions;