import { getWeather } from "../services/weatherService.js";
import { getAirQuality } from "../services/aqiService.js";
import { reverseGeocode } from "../services/geoService.js";
import { getWHOOutbreaks, filterOutbreaksByCountry } from "../services/whoService.js";
import { getHealthNews, getGovernmentAdvisories } from "../services/newsService.js";
import { synthesizeDashboard } from "../services/geminiService.js";
import { getCached, setCached } from "../cache/dashboardCache.js";

const CACHE_TTL_MS = 1000 * 60 * 30;

/**
 * POST /api/dashboard
 * Body: { lat, lon, vitals: { bp, sugar, heartRate, sleep, water, exercise, steps } }
 *
 * Orchestrates every real data source, then hands the combined result to
 * Gemini for synthesis. Each source failure is handled independently so
 * one API being down doesn't take down the whole dashboard.
 */
export async function getDashboard(req, res) {
  try {
    const { lat, lon, vitals = {} } = req.body;

    if (lat == null || lon == null) {
      return res.status(400).json({ error: "lat and lon are required." });
    }

    const cacheKey = `${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json({ ...cached, cached: true });
    }

    const [weatherResult, aqiResult, geoResult] = await Promise.allSettled([
      getWeather(lat, lon),
      getAirQuality(lat, lon),
      reverseGeocode(lat, lon),
    ]);

    if (weatherResult.status === "rejected") {
      return res.status(502).json({ error: "Weather data unavailable: " + weatherResult.reason.message });
    }
    if (aqiResult.status === "rejected") {
      return res.status(502).json({ error: "Air quality data unavailable: " + aqiResult.reason.message });
    }

    const weather = weatherResult.value;
    const aqi = aqiResult.value;
    const geo = geoResult.status === "fulfilled" ? geoResult.value : null;

    const [whoAll, news, govAdvisories] = await Promise.all([
      getWHOOutbreaks(),
      getHealthNews(geo?.city, geo?.state),
      getGovernmentAdvisories(geo?.city, geo?.state, geo?.countryCode),
    ]);

    const relevantOutbreaks = geo?.countryFull
      ? filterOutbreaksByCountry(whoAll, geo.countryFull)
      : [];

    let aiSynthesis = null;
try {
  aiSynthesis = await synthesizeDashboard({
    location: weather.city,
    countryFull: geo?.countryFull,
    weather,
    aqi,
    whoOutbreaks: relevantOutbreaks,
    news,
    govAdvisories,
    vitals,
  });
} catch (geminiError) {
  console.warn("Gemini synthesis failed (quota/network):", geminiError.message);
  aiSynthesis = {
    summary: "AI synthesis temporarily unavailable due to API quota limits. All other health data below is real and current.",
    communityRisk: "Unknown",
    officialOutbreaks: [],
    environmentalRisks: [],
    governmentAdvisories: [],
    recommendations: [],
  };
}

    const dashboard = {
      location: { city: weather.city, ...geo },
      weather,
      aqi,
      whoOutbreaks: relevantOutbreaks,
      news,
      govAdvisories,
      aiSynthesis,
      generatedAt: new Date().toISOString(),
      cached: false,
    };

    setCached(cacheKey, dashboard, CACHE_TTL_MS);

    return res.json(dashboard);
  } catch (error) {
    console.error("Dashboard controller error:", error);
    return res.status(500).json({ error: "Failed to build dashboard: " + error.message });
  }
}