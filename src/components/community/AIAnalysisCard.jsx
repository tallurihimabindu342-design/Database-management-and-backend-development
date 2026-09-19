const RISK_COLOR = {
  Low: "#22c55e",
  Moderate: "#f59e0b",
  High: "#ef4444",
  Extreme: "#dc2626",
};

function SourceBadge({ source }) {
  const map = {
    WHO: { bg: "rgba(239,68,68,0.12)", color: "#f87171", label: "WHO" },
    News: { bg: "rgba(96,165,250,0.12)", color: "#60a5fa", label: "NEWS" },
    Government: { bg: "rgba(168,85,247,0.12)", color: "#c084fc", label: "GOV" },
    Environmental: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b", label: "CLIMATE" },
  };
  const style = map[source] || { bg: "rgba(255,255,255,0.06)", color: "#94a3b8", label: source };
  return (
    <span style={{ background: style.bg, color: style.color, fontSize: "9px", fontWeight: "800", padding: "2px 7px", borderRadius: "999px", letterSpacing: "0.5px", flexShrink: 0 }}>
      {style.label}
    </span>
  );
}

function RiskItem({ item, source }) {
  const riskColor = item.risk === "High" || item.risk === "Extreme" ? "#ef4444" : item.risk === "Moderate" ? "#f59e0b" : "#22c55e";
  const displayTitle = item.name || item.title || item.headline || item.disease || "";
  const displayDesc = item.reason || item.summary || item.description || item.detail || item.mechanism || "";
  const displayLink = item.link || null;
  return (
    <div style={{ background: "#111827", borderRadius: "12px", padding: "14px 16px", marginBottom: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, flexWrap: "wrap" }}>
          <span style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>{displayTitle || "Untitled"}</span>
          <SourceBadge source={source} />
        </div>
        {item.risk && (
          <span style={{ background: `${riskColor}20`, color: riskColor, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "999px", flexShrink: 0 }}>
            {item.risk}
          </span>
        )}
      </div>
      {displayDesc && (
        <p style={{ color: "#94a3b8", fontSize: "12px", margin: "6px 0 0 0", lineHeight: "18px" }}>
          {displayDesc}
        </p>
      )}
      {displayLink && (
        <a href={displayLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "8px", color: "#60a5fa", fontSize: "11px", textDecoration: "none" }}>
          Read more
        </a>
      )}
    </div>
  );
}

function AdvisoryItem({ advisory }) {
  return (
    <div style={{ background: "#111827", borderRadius: "12px", padding: "14px 16px", marginBottom: "10px", border: "1px solid rgba(168,85,247,0.15)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
        <span style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>
          {advisory.title || "Untitled Advisory"}
        </span>
        <SourceBadge source="Government" />
      </div>
      {advisory.summary && (
        <p style={{ color: "#94a3b8", fontSize: "12px", margin: "0 0 6px 0", lineHeight: "18px" }}>
          {advisory.summary}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
        {advisory.pubDate && (
          <span style={{ color: "#475569", fontSize: "11px" }}>
            {new Date(advisory.pubDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        )}
        {advisory.link && (
          <a href={advisory.link} target="_blank" rel="noopener noreferrer" style={{ color: "#c084fc", fontSize: "11px", textDecoration: "none" }}>
            Read more
          </a>
        )}
      </div>
    </div>
  );
}

function EmptySection({ label }) {
  return (
    <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "10px", padding: "12px 14px", color: "#64748b", fontSize: "12px", marginBottom: "10px" }}>
      {label}
    </div>
  );
}

function resolveRecommendationText(item) {
  if (typeof item === "string") return item;
  if (typeof item === "object" && item !== null) {
    return item.text || item.measure || item.recommendation || item.advice || item.action || item.name || item.description || Object.values(item).find((v) => typeof v === "string") || JSON.stringify(item);
  }
  return String(item);
}

function AIAnalysisCard({ loadingAI, aiError, aiSynthesis, govAdvisories }) {
  const riskColor = RISK_COLOR[aiSynthesis?.communityRisk?.trim()] || "#94a3b8";
  const rawAdvisories = govAdvisories?.advisories || [];
  const hasRawAdvisories = rawAdvisories.length > 0;
  const hasAIAdvisories = Array.isArray(aiSynthesis?.governmentAdvisories) && aiSynthesis.governmentAdvisories.length > 0;

  const cardStyle = {
    background: "linear-gradient(180deg,#0f172a,#111827)",
    borderRadius: "18px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 12px 25px rgba(0,0,0,0.3)",
    marginBottom: "16px",
  };

  return (
    <div style={cardStyle}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "white", fontSize: "18px", fontWeight: "700", margin: 0 }}>
          AI Health Risk Synthesis
        </h2>
        <span style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc", fontSize: "10px", fontWeight: "700", padding: "3px 9px", borderRadius: "999px", letterSpacing: "0.5px" }}>
          AI FROM REAL DATA
        </span>
      </div>

      {loadingAI ? (
        <p style={{ color: "#94a3b8", fontSize: "13px" }}>Analyzing live weather, AQI and WHO data...</p>
      ) : aiError ? (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "14px", color: "#f87171", fontSize: "13px" }}>
          {aiError}
        </div>
      ) : !aiSynthesis ? (
        <p style={{ color: "#64748b", fontSize: "13px" }}>Waiting for location and weather data...</p>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "14px", alignItems: "start", marginBottom: "20px" }}>
            <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px" }}>
              <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "6px" }}>OVERALL ASSESSMENT</div>
              <p style={{ color: "#e2e8f0", fontSize: "14px", lineHeight: "22px", margin: 0 }}>
                {typeof aiSynthesis.summary === "string" ? aiSynthesis.summary : "No summary available."}
              </p>
            </div>
            <div style={{ background: `${riskColor}18`, border: `1px solid ${riskColor}40`, borderRadius: "12px", padding: "16px", textAlign: "center", minWidth: "110px" }}>
              <div style={{ color: "#64748b", fontSize: "10px", marginBottom: "6px" }}>COMMUNITY RISK</div>
              <div style={{ color: riskColor, fontSize: "22px", fontWeight: "800" }}>
                {aiSynthesis.communityRisk || "Unknown"}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.5px" }}>
              OFFICIAL OUTBREAKS (WHO)
            </div>
            {Array.isArray(aiSynthesis.officialOutbreaks) && aiSynthesis.officialOutbreaks.length > 0
              ? aiSynthesis.officialOutbreaks.map((item, i) => <RiskItem key={i} item={item} source="WHO" />)
              : <EmptySection label="No WHO outbreak bulletins matched your region." />}
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.5px" }}>
              ENVIRONMENTAL RISKS (CLIMATE CORRELATION)
            </div>
            {Array.isArray(aiSynthesis.environmentalRisks) && aiSynthesis.environmentalRisks.length > 0
              ? aiSynthesis.environmentalRisks.map((item, i) => <RiskItem key={i} item={item} source="Environmental" />)
              : <EmptySection label="No significant environmental risk identified." />}
          </div>

          <div style={{ marginBottom: "18px" }}>
            <div style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.5px" }}>
              GOVERNMENT HEALTH ADVISORIES
            </div>
            {hasRawAdvisories ? (
              <>
                <div style={{ color: "#475569", fontSize: "10px", marginBottom: "10px" }}>
                  Source: {govAdvisories.source}
                  {govAdvisories.lastChecked && " · Updated " + new Date(govAdvisories.lastChecked).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
                {rawAdvisories.map((advisory, i) => <AdvisoryItem key={i} advisory={advisory} />)}
              </>
            ) : hasAIAdvisories ? (
              aiSynthesis.governmentAdvisories.map((item, i) => <RiskItem key={i} item={item} source="Government" />)
            ) : (
              <EmptySection label="No government health advisories available right now." />
            )}
          </div>

          {Array.isArray(aiSynthesis.recommendations) && aiSynthesis.recommendations.length > 0 && (
            <div>
              <div style={{ color: "#64748b", fontSize: "11px", fontWeight: "700", marginBottom: "8px", letterSpacing: "0.5px" }}>
                PREVENTIVE MEASURES
              </div>
              <div style={{ background: "#0f172a", borderRadius: "12px", padding: "16px" }}>
                {aiSynthesis.recommendations.map((item, i) => {
                  const text = resolveRecommendationText(item);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: i === aiSynthesis.recommendations.length - 1 ? 0 : "12px", color: "#e2e8f0", fontSize: "13px", lineHeight: "20px" }}>
                      <span style={{ color: "#22c55e", flexShrink: 0, marginTop: "1px" }}>✅</span>
                      <span>{text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AIAnalysisCard;