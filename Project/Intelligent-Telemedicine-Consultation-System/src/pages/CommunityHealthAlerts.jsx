import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { usePatientVitals } from "../hook/usePatientVitals";
import { useLanguage } from "../contexts/LanguageContext";

import WeatherCard from "../components/community/WeatherCard";
import AirQualityCard from "../components/community/AirQualityCard";
import WHOOutbreaksCard from "../components/community/WHOOutbreaksCard";
import AIAnalysisCard from "../components/community/AIAnalysisCard";
import PersonalAdviceCard from "../components/community/PersonalAdviceCard";
import LanguageSelector from "../components/LanguageSelector";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function CommunityHealthAlerts() {
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [locationError, setLocationError] = useState(null);

  const [dashboard, setDashboard] = useState(null);
  const [translatedDashboard, setTranslatedDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { language, translate } = useLanguage();

  const {
    sugar: latestSugar, bp: latestBP, pulse: latestHeartRate,
    sleepHours, waterIntake, exerciseMinutes, steps,
  } = usePatientVitals();

  // Step 1 — Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }),
      () => setLocationError("Please allow location access to see local health alerts.")
    );
  }, []);

  // Step 2 — Fetch dashboard from backend
  useEffect(() => {
    if (!coords.lat || !coords.lon) return;
    const controller = new AbortController();

    async function fetchDashboard() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/api/dashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            lat: coords.lat,
            lon: coords.lon,
            vitals: {
              bp: latestBP,
              sugar: latestSugar,
              heartRate: latestHeartRate,
              sleep: sleepHours,
              water: waterIntake,
              exercise: exerciseMinutes,
              steps,
            },
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Dashboard request failed.");

        setDashboard(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Dashboard fetch failed:", err);
          setError("Unable to load community health data right now.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords.lat, coords.lon]);

  // Step 3 — Translate dashboard when language changes
  useEffect(() => {
    if (!dashboard) return;

    async function translateDashboard() {
      if (language === "English") {
        setTranslatedDashboard(dashboard);
        return;
      }

      try {
        const [
          translatedSummary,
          translatedRecommendations,
        ] = await Promise.all([
          translate(dashboard.aiSynthesis?.summary || ""),
          translate(dashboard.aiSynthesis?.recommendations || []),
        ]);

        const translated = {
          ...dashboard,
          aiSynthesis: {
            ...dashboard.aiSynthesis,
            summary: translatedSummary,
            recommendations: translatedRecommendations,
          },
        };

        setTranslatedDashboard(translated);
      } catch (err) {
        console.error("Translation failed:", err);
        setTranslatedDashboard(dashboard);
      }
    }

    translateDashboard();
  }, [dashboard, language, translate]);

  // Step 4 — Use translated data if available, fallback to raw
  const display = translatedDashboard || dashboard;

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="Patient" />

      <div style={{
        flex: 1, padding: "30px",
        background: "linear-gradient(135deg,#020617,#071938,#10214f)",
        minHeight: "100vh", color: "white",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "20px", gap: "20px",
        }}>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "6px" }}>
              🌍 Community Health Alerts
            </h1>
            <p style={{ color: "#94a3b8" }}>
              Live weather, real WHO outbreak data, and AI-synthesized health guidance.
            </p>
          </div>
          <LanguageSelector />
        </div>

        {locationError && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
            color: "#f87171", fontSize: "14px",
          }}>
            ⚠ {locationError}
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
            color: "#f87171", fontSize: "14px",
          }}>
            ⚠ {error}
          </div>
        )}

        {loading && !display && (
          <div style={{
            background: "#0f172a", borderRadius: "18px", padding: "40px",
            border: "1px solid rgba(255,255,255,0.05)",
            textAlign: "center", color: "#94a3b8",
          }}>
            Loading your community health dashboard...
          </div>
        )}

        {display && (
          <>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(2,1fr)",
              gap: "16px", marginBottom: "20px",
            }}>
              <WeatherCard
                city={display.location?.city}
                countryFull={display.location?.countryFull}
                weather={{
                  main: {
                    temp: display.weather.temperature,
                    humidity: display.weather.humidity,
                  },
                  weather: [{
                    main: display.weather.condition,
                    description: display.weather.description,
                    icon: display.weather.icon,
                  }],
                }}
                weatherError={null}
              />
              <AirQualityCard
                aqi={display.aqi}
                communityRisk={display.aiSynthesis?.communityRisk}
                hasWHOData={display.whoOutbreaks?.length > 0}
              />
            </div>

            <WHOOutbreaksCard
              loadingWHO={false}
              relevantOutbreaks={display.whoOutbreaks || []}
              countryFull={display.location?.countryFull}
            />

            <AIAnalysisCard
              loadingAI={loading}
              aiError={error}
              aiSynthesis={display.aiSynthesis}
              govAdvisories={display.govAdvisories}
            />

            <PersonalAdviceCard
              personalRisk={display.aiSynthesis?.personalRisk}
              recommendations={display.aiSynthesis?.recommendations}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default CommunityHealthAlerts;