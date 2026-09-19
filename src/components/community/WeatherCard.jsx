/**
 * Renders real live weather data returned from the backend.
 * Props come directly from dashboard.weather — no local API calls.
 */
function WeatherCard({ city, countryFull, weather, weatherError }) {
  const temp = weather?.main?.temp;
  const humidity = weather?.main?.humidity;
  const condition = weather?.weather?.[0];

  const cardStyle = {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "18px",
    padding: "22px",
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div>
          <h2 style={{ color: "white", fontSize: "16px", fontWeight: "700", margin: 0, marginBottom: "4px" }}>
            🌤 Live Weather
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
            📍 {city || "Locating..."}{countryFull ? `, ${countryFull}` : ""}
          </p>
        </div>
        <span style={{
          background: "rgba(96,165,250,0.12)", color: "#60a5fa",
          fontSize: "10px", fontWeight: "700", padding: "3px 9px",
          borderRadius: "999px", letterSpacing: "0.5px"
        }}>
          LIVE
        </span>
      </div>

      {weatherError ? (
        <p style={{ color: "#f87171", fontSize: "13px" }}>{weatherError}</p>
      ) : !weather ? (
        <p style={{ color: "#64748b", fontSize: "13px" }}>Loading weather data...</p>
      ) : (
        <>
          {/* Temp + Humidity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div style={{ background: "#111827", borderRadius: "12px", padding: "14px" }}>
              <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}>TEMPERATURE</div>
              <div style={{ color: "white", fontSize: "26px", fontWeight: "800" }}>{temp}°C</div>
            </div>
            <div style={{ background: "#111827", borderRadius: "12px", padding: "14px" }}>
              <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "4px" }}>HUMIDITY</div>
              <div style={{ color: "#60a5fa", fontSize: "26px", fontWeight: "800" }}>{humidity}%</div>
            </div>
          </div>

          {/* Condition */}
          {condition && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={`https://openweathermap.org/img/wn/${condition.icon}@2x.png`}
                alt={condition.main}
                style={{ width: "52px", height: "52px" }}
              />
              <div>
                <div style={{ color: "white", fontSize: "15px", fontWeight: "700" }}>{condition.main}</div>
                <div style={{ color: "#94a3b8", fontSize: "12px", textTransform: "capitalize" }}>
                  {condition.description}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default WeatherCard;