import logger from "../utils/logger.js";
import { retryFetch } from "../utils/retryFetch.js";
import { getCached, setCached } from "../utils/apiCache.js";

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 minutes

export async function getWeather(lat, lon) {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) throw new Error("OPENWEATHER_API_KEY is not configured.");

  const cacheKey = `weather:${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

  logger.info(`[Weather] Fetching for (${lat}, ${lon})`);
  const response = await retryFetch(url);

  if (!response.ok) {
    throw new Error(`OpenWeather returned ${response.status}`);
  }

  const data = await response.json();

  if (data.cod && Number(data.cod) !== 200) {
    throw new Error(data.message || "Weather API request failed");
  }

  const result = {
    city: data.name,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    condition: data.weather?.[0]?.main || "Unknown",
    description: data.weather?.[0]?.description || "",
    icon: data.weather?.[0]?.icon || null,
    windSpeed: data.wind?.speed ?? null,
    countryCode: data.sys?.country || null,
  };

  setCached(cacheKey, result, CACHE_TTL_MS);
  logger.info(`[Weather] Success — ${result.city}, ${result.temperature}°C`);
  return result;
}