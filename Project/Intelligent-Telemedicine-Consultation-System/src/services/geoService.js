// Real reverse geocoding using OpenWeather's Geocoding API (same key you already have).
// Converts GPS coordinates into a real country/region name, used to correlate
// with WHO outbreak data and to give Gemini real location context.

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const CACHE_KEY = "geoLocationCache";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // location rarely changes — 24hr cache

export async function reverseGeocode(lat, lon) {
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  if (cached && cached.key === cacheKey && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);

    const data = await response.json();
    const place = data?.[0];
    if (!place) throw new Error("No geocoding result returned");

    const result = {
      city: place.name,
      state: place.state || null,
      country: place.country, // ISO code, e.g. "IN"
      countryFull: COUNTRY_NAMES[place.country] || place.country,
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({ key: cacheKey, timestamp: Date.now(), data: result }));
    return result;
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
}

// Minimal ISO code → full name map for WHO title matching (extend as needed)
const COUNTRY_NAMES = {
  IN: "India", US: "United States", GB: "United Kingdom", CA: "Canada",
  AU: "Australia", DE: "Germany", FR: "France", BR: "Brazil", CN: "China",
  JP: "Japan", ZA: "South Africa", NG: "Nigeria", PK: "Pakistan", BD: "Bangladesh",
  ID: "Indonesia", MX: "Mexico", PH: "Philippines", VN: "Vietnam", EG: "Egypt",
  KE: "Kenya", TH: "Thailand", NP: "Nepal", LK: "Sri Lanka",
};