const GNEWS_BASE_URL = "https://gnews.io/api/v4/search";

const STRICT_ADVISORY_KEYWORDS = [
  "ministry of health", "ICMR", "health ministry", "mohfw",
  "ayushman", "NHM", "AIIMS", "NCDC", "health advisory",
  "health warning", "health directive", "government health",
  "health department", "health scheme", "health program",
  "health initiative", "national health", "health policy",
];

let cachedAdvisoryResult = null;
let cachedAdvisoryTime = 0;
const GNEWS_CACHE_MS = 1000 * 60 * 25;

async function fetchGNews(query, max = 10) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error("NEWS_API_KEY not configured in environment variables.");

  const url = `${GNEWS_BASE_URL}?q=${encodeURIComponent(query)}&lang=en&max=${max}&apikey=${apiKey}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0] || `GNews request failed: ${response.status}`);
  }

  return data.articles || [];
}

async function fetchAdvisoryGNews(locationTerm) {
  const now = Date.now();
  if (cachedAdvisoryResult && now - cachedAdvisoryTime < GNEWS_CACHE_MS) {
    console.log("[GNews] Returning cached advisory result.");
    return cachedAdvisoryResult;
  }

  const query = locationTerm
    ? `("health advisory" OR "health ministry" OR "ICMR" OR "ministry of health" OR "NHM" OR "Ayushman" OR "AIIMS" OR "health warning" OR "health scheme" OR "health policy") AND (${locationTerm} OR India OR Telangana)`
    : `"health advisory" OR "health ministry" OR "ICMR" OR "ministry of health" OR "NHM" OR "Ayushman" OR "health warning" India`;

  const articles = await fetchGNews(query, 10);
  cachedAdvisoryResult = articles;
  cachedAdvisoryTime = now;
  console.log(`[GNews] Fetched ${articles.length} advisory articles.`);
  return articles;
}

function isAdvisory(article) {
  const text = `${article.title ?? ""} ${article.description ?? ""}`.toLowerCase();

  // Must mention a government/official health body
  const hasGovSource = [
    "ministry of health", "health ministry", "mohfw", "ayushman",
    "icmr", "aiims", "ncdc", "nhm", "health department",
    "health minister", "aarogya", "health mission", "disease control",
    "health scheme", "health program", "health policy", "government hospital",
    "public health", "health authority", "health official",
  ].some((kw) => text.includes(kw));

  // Must be relevant to community health action
  const hasCommunityRelevance = [
    "vaccine", "vaccination", "immunization", "disease", "outbreak",
    "dengue", "malaria", "fever", "cancer", "diabetes", "blood pressure",
    "hospital", "free", "awareness", "prevention", "screening",
    "consultation", "treatment", "medicine", "drug", "health check",
    "alert", "warning", "advisory", "risk", "epidemic", "infection",
    "mental health", "nutrition", "maternal", "child health", "elderly",
  ].some((kw) => text.includes(kw));

  // Must match BOTH — government source AND community relevance
  return hasGovSource && hasCommunityRelevance;
}

// Kept for import compatibility in dashboardController.js —
// returns empty gracefully so nothing breaks
export async function getHealthNews(city, state) {
  console.log("[NewsService] Health news disabled — using government advisories only.");
  return {
    available: false,
    reason: "Regional health news is currently disabled. See Government Advisories for official health updates.",
    articles: [],
  };
}

export async function getGovernmentAdvisories(city, state, countryCode) {
  if (countryCode && countryCode !== "IN") {
    return {
      available: false,
      reason: "Government advisory source is currently only configured for India.",
      advisories: [],
    };
  }

  try {
    const locationTerm = [city, state].filter(Boolean).join(" ");
    const rawArticles = await fetchAdvisoryGNews(locationTerm);
    const filtered = rawArticles.filter(isAdvisory);

    if (filtered.length === 0) {
      console.log("[AdvisoryService] No advisory articles matched strict keywords.");
      return {
        available: false,
        reason: "No government health advisories found in recent news.",
        advisories: [],
        lastChecked: new Date().toISOString(),
      };
    }

    const advisories = filtered.map((article) => ({
      title: article.title?.trim() || "Untitled Advisory",
      summary: article.description?.slice(0, 280).trim() || "",
      link: article.url || null,
      pubDate: article.publishedAt || null,
      source: article.source?.name || "GNews",
      image: article.image || null,
    }));

    console.log(`[AdvisoryService] Returning ${advisories.length} government advisories via GNews.`);

    return {
      available: true,
      source: "GNews (aggregated from Indian government press releases and news wires)",
      advisories,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[AdvisoryService] Government advisories fetch failed:", error.message);
    return {
      available: false,
      reason: "Unable to reach the news service for government advisories right now.",
      advisories: [],
      lastChecked: new Date().toISOString(),
    };
  }
}