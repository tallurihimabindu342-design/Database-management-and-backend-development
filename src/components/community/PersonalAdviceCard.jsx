const RISK_COLOR = {
  Low: "#22c55e",
  Moderate: "#f59e0b",
  High: "#ef4444",
  Extreme: "#991b1b",
  Unknown: "#64748b",
};

/**
 * Safely converts a recommendation entry to displayable text.
 * The AI is instructed to return plain strings, but if it ever returns
 * an object (e.g. mixing up shapes with officialOutbreaks/environmentalRisks),
 * this extracts the most sensible text field instead of crashing React.
 */
function toDisplayText(item) {
  if (typeof item === "string") return item;
  if (item && typeof item === "object") {
    return item.reason || item.mechanism || item.name || item.summary || JSON.stringify(item);
  }
  return String(item);
}

function PersonalAdviceCard({ personalRisk, recommendations }) {
  const level = personalRisk?.level || "Unknown";
  const color = RISK_COLOR[level] || RISK_COLOR.Unknown;

  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];

  return (
    <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.05)", padding: "24px", borderRadius: "18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ fontSize: "17px", margin: 0 }}>❤️ Personalized Guidance</h2>
        <span style={{
          background: "rgba(96,165,250,0.15)", color: "#60a5fa", fontSize: "11px",
          fontWeight: "700", padding: "4px 10px", borderRadius: "999px"
        }}>
          BASED ON YOUR VITALS
        </span>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        background: "#111827", borderRadius: "12px", padding: "14px 16px", marginBottom: "16px"
      }}>
        <span style={{
          background: color, color: "white", padding: "6px 14px", borderRadius: "999px",
          fontWeight: "700", fontSize: "13px", flexShrink: 0
        }}>
          {level} Risk
        </span>
        <p style={{ color: "#cbd5e1", fontSize: "13px", margin: 0 }}>
          {personalRisk?.reasoning || "Record your vitals to receive a personalized risk assessment."}
        </p>
      </div>

      {safeRecommendations.length === 0 ? (
        <p style={{ color: "#64748b", fontSize: "14px" }}>No recommendations available yet.</p>
      ) : (
        <div style={{ background: "#111827", borderRadius: "14px", padding: "20px", border: "1px solid rgba(255,255,255,0.08)" }}>
          {safeRecommendations.map(function (item, i) {
            return (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                marginBottom: i === safeRecommendations.length - 1 ? 0 : "14px",
                color: "#e2e8f0", fontSize: "14px", lineHeight: "1.6"
              }}>
                <span
                  style={{
                    color: "#22c55e",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  ✓
                </span>
                <span>{toDisplayText(item)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PersonalAdviceCard;