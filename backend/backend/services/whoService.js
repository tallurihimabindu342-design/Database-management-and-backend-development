import logger from "../utils/logger.js";
import { retryFetch } from "../utils/retryFetch.js";
import { getCached, setCached } from "../utils/apiCache.js";
import { XMLParser } from "./xmlParser.js";

const WHO_RSS_URL = "https://www.who.int/feeds/entity/csr/don/en/rss.xml";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours — WHO updates infrequently

// Country name aliases for better matching
const COUNTRY_ALIASES = {
  india: ["india", "ind", "bharat", "republic of india"],
  "united states": ["united states", "usa", "us", "america", "united states of america"],
  "united kingdom": ["united kingdom", "uk", "great britain", "britain"],
  china: ["china", "prc", "people's republic of china"],
  pakistan: ["pakistan", "pak"],
  bangladesh: ["bangladesh", "bgd"],
};

function buildAliases(countryName) {
  const lower = countryName.toLowerCase();
  for (const [, aliases] of Object.entries(COUNTRY_ALIASES)) {
    if (aliases.includes(lower)) return aliases;
  }
  return [lower];
}

export async function getWHOOutbreaks() {
  const cacheKey = "who:outbreaks";
  const cached = getCached(cacheKey);
  if (cached) return cached;

  logger.info("[WHO] Fetching Disease Outbreak News feed");

  try {
    const response = await retryFetch(WHO_RSS_URL,{},3,10000);
    if (!response.ok) throw new Error(`WHO feed returned ${response.status}`);

    const xmlText = await response.text();
    const items = XMLParser.extractItems(xmlText).slice(0, 15);

    const outbreaks = items.map((item) => ({
      title: item.title,
      summary: item.description?.slice(0, 280) || "",
      link: item.link,
      pubDate: item.pubDate,
    }));

    setCached(cacheKey, outbreaks, CACHE_TTL_MS);
    logger.info(`[WHO] Success — ${outbreaks.length} items fetched`);
    return outbreaks;
  } catch (error) {
  logger.error(
    `[WHO] Fetch failed: ${error?.message || "Unknown error"}`
  );
  return [];
}
}

export function filterOutbreaksByCountry(outbreaks, countryName) {
  if (!countryName) return [];

  const aliases = buildAliases(countryName);
  const matched = outbreaks.filter((o) => {
    const text = o.title.toLowerCase();
    return aliases.some((alias) => text.includes(alias));
  });

  logger.info(`[WHO] Country filter "${countryName}" — ${matched.length}/${outbreaks.length} matched`);
  return matched;
}