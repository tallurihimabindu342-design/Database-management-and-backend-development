import logger from "../utils/logger.js";
import { retryFetch } from "../utils/retryFetch.js";
import { getCached, setCached } from "../utils/apiCache.js";

const AQI_LABELS = { 1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor" };
const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export async function getAirQuality(lat, lon) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) throw new Error("OPENWEATHER_API_KEY is not configured.");

  const cacheKey = `aqi:${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  logger.info(`[AQI] Fetching for (${lat}, ${lon})`);
  const response = await retryFetch(url);

  if (!response.ok) throw new Error(`OpenWeather AQI returned ${response.status}`);

  const data = await response.json();
  const entry = data?.list?.[0];
  if (!entry) throw new Error("AQI API returned no data.");

  const aqiIndex = entry.main.aqi;
  const result = {
    aqiIndex,
    aqiLabel: AQI_LABELS[aqiIndex] || "Unknown",
    components: {
      pm2_5: entry.components.pm2_5,
      pm10: entry.components.pm10,
      co: entry.components.co,
      no2: entry.components.no2,
      so2: entry.components.so2,
      o3: entry.components.o3,
    },
  };

  setCached(cacheKey, result, CACHE_TTL_MS);
  logger.info(`[AQI] Success — Index: ${aqiIndex} (${result.aqiLabel})`);
  return result;
}