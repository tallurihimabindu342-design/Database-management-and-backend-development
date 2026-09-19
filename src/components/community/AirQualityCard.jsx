/**
 * Renders real AQI data from backend.
 * Also shows the overall community risk derived from weather + AQI + WHO data.
 */
const AQI_COLOR = {
  Good: "#22c55e",
  Fair: "#84cc16",
  Moderate: "#f59e0b",
  Poor: "#f97316",
  "Very Poor": "#ef4444",
};

const RISK_COLOR = {
  Low: "#22c55e",
  Moderate: "#f59e0b",
  High: "#ef4444",
  Extreme: "#dc2626",
};

function AirQualityCard({ aqi, communityRisk, hasWHOData }) {
  const aqiColor = AQI_COLOR[aqi?.aqiLabel] || "#94a3b8";
  const riskColor = RISK_COLOR[communityRisk] || "#94a3b8";

  const cardStyle = {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "18px",
    padding: "22px",
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <h2 style={{ color: "white", fontSize: "16px", fontWeight: "700", margin: 0 }}>
          🌫 Air Quality & Risk
        </h2>
        <span style={{
          background: "rgba(96,165,250,0.12)", color: "#60a5fa",
          fontSize: "10px", fontWeight: "700", padding: "3px 9px",
          borderRadius: "999px", letterSpacing: "0.5px"
        }}>
          LIVE
        </span>
      </div>

      {!aqi ? (
        <p style={{ color: "#64748b", fontSize: "13px" }}>Loading air quality data...</p>
      ) : (
        <>
          {/* AQI */}
          <div style={{ background: "#111827", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
            <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "6px" }}>AIR QUALITY INDEX</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ color: aqiColor, fontSize: "32px", fontWeight: "800" }}>{aqi.aqiIndex}</span>
              <span style={{ color: aqiColor, fontSize: "16px", fontWeight: "700" }}>{aqi.aqiLabel}</span>
            </div>
          </div>

          {/* Pollutants */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "16px" }}>
            {[
              { label: "PM2.5", value: aqi.components?.pm2_5 },
              { label: "PM10", value: aqi.components?.pm10 },
              { label: "NO₂", value: aqi.components?.no2 },
            ].map((item) => (
              <div key={item.label} style={{ background: "#111827", borderRadius: "10px", padding: "10px", textAlign: "center" }}>
                <div style={{ color: "#64748b", fontSize: "9px", marginBottom: "3px" }}>{item.label}</div>
                <div style={{ color: "white", fontSize: "13px", fontWeight: "700" }}>
                  {item.value != null ? item.value.toFixed(1) : "--"}
                </div>
              </div>
            ))}
          </div>

          {/* Community Risk */}
          {communityRisk && (
            <div style={{
              background: `${riskColor}18`,
              border: `1px solid ${riskColor}40`,
              borderRadius: "12px", padding: "14px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "3px" }}>COMMUNITY RISK</div>
                <div style={{ color: riskColor, fontSize: "16px", fontWeight: "800" }}>{communityRisk}</div>
                <div style={{ color: "#64748b", fontSize: "10px", marginTop: "2px" }}>
                  {hasWHOData ? "Weather + AQI + WHO data" : "Weather + AQI data"}
                </div>
              </div>
              <div style={{ fontSize: "28px" }}>
                {communityRisk === "Low" ? "🟢" : communityRisk === "Moderate" ? "🟡" : communityRisk === "High" ? "🔴" : "🚨"}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AirQualityCard;