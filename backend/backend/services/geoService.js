/**
 * Real reverse geocoding via OpenWeather's Geocoding API.
 * Converts GPS coordinates to a real city/state/country — used to filter
 * WHO outbreak data and give the AI accurate location context.
 */

const API_KEY = process.env.OPENWEATHER_API_KEY;

const COUNTRY_NAMES = {
  IN: "India", US: "United States", GB: "United Kingdom", CA: "Canada",
  AU: "Australia", DE: "Germany", FR: "France", BR: "Brazil", CN: "China",
  JP: "Japan", ZA: "South Africa", NG: "Nigeria", PK: "Pakistan", BD: "Bangladesh",
  ID: "Indonesia", MX: "Mexico", PH: "Philippines", VN: "Vietnam", EG: "Egypt",
  KE: "Kenya", TH: "Thailand", NP: "Nepal", LK: "Sri Lanka",
};

export async function reverseGeocode(lat, lon) {
  if (!API_KEY) {
    throw new Error("OPENWEATHER_API_KEY is not configured on the server.");
  }

  const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  const place = data?.[0];
  if (!place) {
    throw new Error("Reverse geocoding returned no results for these coordinates.");
  }

  return {
    city: place.name,
    state: place.state || null,
    countryCode: place.country,
    countryFull: COUNTRY_NAMES[place.country] || place.country,
  };
}
