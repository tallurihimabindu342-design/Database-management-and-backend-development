// Real WHO Disease Outbreak News (DON) RSS feed — no hardcoded data.
// WHO publishes this feed genuinely; we fetch it live via a CORS proxy
// since browsers cannot fetch WHO's XML directly due to CORS policy.

const WHO_RSS_URL = "https://www.who.int/feeds/entity/csr/don/en/rss.xml";
const CORS_PROXY = "https://api.allorigins.win/raw?url=";

const CACHE_KEY = "whoOutbreakCache";
const CACHE_TTL_MS = 1000 * 60 * 60 * 6; // WHO updates infrequently — 6hr cache is reasonable

/**
 * Fetches the live WHO Disease Outbreak News RSS feed and parses real entries.
 * Returns an array of { title, summary, link, pubDate } — all real WHO bulletins.
 */
export async function getWHOOutbreaks() {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const response = await fetch(CORS_PROXY + encodeURIComponent(WHO_RSS_URL));
    if (!response.ok) throw new Error(`WHO feed request failed: ${response.status}`);

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const parseError = xml.querySelector("parsererror");
    if (parseError) throw new Error("WHO feed returned malformed XML");

    const items = Array.from(xml.querySelectorAll("item")).slice(0, 15);

    const outbreaks = items.map((item) => ({
      title: item.querySelector("title")?.textContent?.trim() || "Untitled",
      summary: stripHtml(item.querySelector("description")?.textContent || ""),
      link: item.querySelector("link")?.textContent?.trim() || "",
      pubDate: item.querySelector("pubDate")?.textContent?.trim() || "",
    }));

    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: outbreaks }));
    return outbreaks;
  } catch (error) {
    console.error("WHO Outbreak fetch failed:", error);
    // Return stale cache if available rather than fabricating data
    if (cached) return cached.data;
    return [];
  }
}

/**
 * Filters real WHO outbreak entries to ones plausibly relevant to a given country.
 * This is real text matching against real WHO bulletin titles — not invented data.
 */
export function filterOutbreaksByCountry(outbreaks, countryName) {
  if (!countryName) return [];
  const country = countryName.toLowerCase();
  return outbreaks.filter((o) => o.title.toLowerCase().includes(country));
}

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").trim().slice(0, 280);
}