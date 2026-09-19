import { XMLParser } from "./xmlParser.js";

const PIB_FEED_URLS = [
  "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3",
  "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=2",
  "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=4",
  "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=1",
  "https://pib.gov.in/RssMain.aspx?ModId=3&Lang=1&Regid=3",
  "https://pib.gov.in/RssMain.aspx?ModId=3&Lang=1&Regid=1",
];

const MOHFW_RSS_URL = "https://mohfw.gov.in/rss.xml";

const HEALTH_KEYWORDS = [
  "health", "hospital", "disease", "vaccine", "vaccination", "medical",
  "medicine", "dengue", "malaria", "covid", "outbreak", "epidemic",
  "ayushman", "AIIMS", "ICMR", "NCDC", "immunization", "healthcare",
  "pharma", "drug", "clinical", "TB", "tuberculosis", "family welfare",
  "ministry of health", "mohfw", "NHM", "sanitation", "nutrition",
  "maternal", "child health", "polio", "cholera", "typhoid", "fever",
];

const FETCH_OPTIONS = {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/rss+xml, application/xml, text/xml, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
  },
  signal: AbortSignal.timeout(20000),
};

async function fetchFeedItems(url) {
  try {
    const response = await fetch(url, FETCH_OPTIONS);
    if (!response.ok) {
      console.warn(`[AdvisoryService] Feed returned ${response.status}: ${url}`);
      return null;
    }
    const xmlText = await response.text();
    const items = XMLParser.extractItems(xmlText);
    if (!items || items.length === 0) {
      console.warn(`[AdvisoryService] Feed returned 0 items: ${url}`);
      return null;
    }
    console.log(`[AdvisoryService] Got ${items.length} items from: ${url}`);
    return items;
  } catch (error) {
    console.warn(`[AdvisoryService] Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

function filterHealthItems(items) {
  return items.filter((item) => {
    const text = `${item.title ?? ""} ${item.description ?? ""}`.toLowerCase();
    return HEALTH_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()));
  });
}

async function fetchFromPIB() {
  for (const url of PIB_FEED_URLS) {
    const items = await fetchFeedItems(url);
    if (items && items.length > 0) {
      return { items, source: "Press Information Bureau (PIB), Government of India", url };
    }
  }
  return null;
}

async function fetchFromMoHFW() {
  const items = await fetchFeedItems(MOHFW_RSS_URL);
  if (items && items.length > 0) {
    return {
      items,
      source: "Ministry of Health and Family Welfare (MoHFW), Government of India",
      url: MOHFW_RSS_URL,
    };
  }
  return null;
}

export async function getGovernmentAdvisories(city, state, countryCode) {
  if (countryCode && countryCode !== "IN") {
    return {
      available: false,
      reason: "Government advisory source is currently only configured for India (PIB / MoHFW).",
      advisories: [],
    };
  }

  let result = await fetchFromPIB();

  if (!result) {
    console.log("[AdvisoryService] All PIB feeds empty or failed, trying MoHFW...");
    result = await fetchFromMoHFW();
  }

  if (!result) {
    console.warn("[AdvisoryService] All advisory sources returned no content today.");
    return {
      available: false,
      reason:
        "No government health advisories are available right now. " +
        "PIB and MoHFW feeds are either empty or unreachable. This is normal on days " +
        "when no health-related press releases have been published.",
      advisories: [],
      lastChecked: new Date().toISOString(),
    };
  }

  const healthItems = filterHealthItems(result.items);

  if (healthItems.length === 0) {
    console.log(
      `[AdvisoryService] ${result.items.length} items fetched from ${result.url} but none matched health keywords.`
    );
    return {
      available: false,
      reason:
        "Government press releases were fetched successfully, but none of today's " +
        "releases are health-related. This is expected on days when other ministry " +
        "announcements dominate the feed.",
      advisories: [],
      totalFetched: result.items.length,
      source: result.source,
      lastChecked: new Date().toISOString(),
    };
  }

  const advisories = healthItems.slice(0, 10).map((item) => ({
    title: item.title?.trim() || "Untitled Advisory",
    summary: item.description?.slice(0, 280).trim() || "",
    link: item.link?.trim() || null,
    pubDate: item.pubDate || null,
    source: result.source,
  }));

  console.log(`[AdvisoryService] Returning ${advisories.length} health advisories from ${result.source}`);

  return {
    available: true,
    source: result.source,
    feedUrl: result.url,
    advisories,
    totalFetched: result.items.length,
    healthMatched: advisories.length,
    lastChecked: new Date().toISOString(),
  };
}