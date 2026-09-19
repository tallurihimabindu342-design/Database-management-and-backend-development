/**
 * Renders real WHO Disease Outbreak News entries fetched server-side.
 * Never shows fabricated data — if the array is empty it honestly says so.
 */
function WHOOutbreaksCard({ loadingWHO, relevantOutbreaks, countryFull }) {
  const cardStyle = {
    background: "#0f172a",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "18px",
    padding: "22px",
    marginBottom: "16px",
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h2 style={{ color: "white", fontSize: "16px", fontWeight: "700", margin: 0 }}>
          📰 WHO Disease Outbreak News
        </h2>
        <span style={{
          background: "rgba(239,68,68,0.12)", color: "#f87171",
          fontSize: "10px", fontWeight: "700", padding: "3px 9px",
          borderRadius: "999px", letterSpacing: "0.5px"
        }}>
          WHO LIVE FEED
        </span>
      </div>

      {loadingWHO ? (
        <p style={{ color: "#94a3b8", fontSize: "13px" }}>Checking WHO outbreak bulletins...</p>
      ) : relevantOutbreaks.length === 0 ? (
        <div style={{
          background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: "12px", padding: "16px",
          display: "flex", alignItems: "center", gap: "12px"
        }}>
          <span style={{ fontSize: "20px" }}>✅</span>
          <div>
            <div
  style={{
    color: "#22c55e",
    fontWeight: "700",
    fontSize: "14px",
  }}
>
  No WHO outbreak bulletins matched your region
</div>
            <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: "2px" }}>
              No WHO-reported outbreaks for {countryFull || "your country"} in the current feed.
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {relevantOutbreaks.map((outbreak, i) => (
  <a
    key={i}
    href={outbreak.link}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "block",
      background: "#111827",
      borderRadius: "12px",
      padding: "14px 16px",
      textDecoration: "none",
      color: "inherit",
      border: "1px solid rgba(239,68,68,0.15)",
      transition: "border-color 0.2s",
    }}
  >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "white", fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>
                    🦠 {outbreak.title}
                  </div>
                  {outbreak.summary && (
                    <div style={{ color: "#94a3b8", fontSize: "12px", lineHeight: "18px", marginBottom: "6px" }}>
                      {outbreak.summary}
                    </div>
                  )}
                  <div style={{ color: "#475569", fontSize: "11px" }}>{outbreak.pubDate}</div>
                </div>
                <span style={{ color: "#60a5fa", fontSize: "12px", flexShrink: 0 }}>↗</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default WHOOutbreaksCard;