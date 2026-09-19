import logger from "../utils/logger.js";
import { getCached, setCached } from "../utils/apiCache.js";

const GEMINI_URL = () =>
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

async function callGemini(prompt) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await fetch(GEMINI_URL(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error("Gemini API error: " + data.error.message);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
}

function cleanJSON(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}


/* =========================================================
   AI SYMPTOM ANALYSIS
   ========================================================= */

export async function getMedicalAdvice(symptom) {
  logger.info("[Gemini] Analyzing symptoms");

  const prompt = `
You are a medical symptom analysis assistant.

Patient symptoms:
${symptom}

Return ONLY valid JSON in this exact format:

{
  "specialization": "",
  "risk": "",
  "emergency": false,
  "advice": ""
}

STRICT RULES:

1. The "risk" field MUST contain exactly ONE of these values:
   "Low"
   "Medium"
   "High"

2. NEVER return:
   "Low to Moderate"
   "Moderate"
   "Very High"
   "Low-Medium"
   "Medium to High"
   or any other risk value.

3. Risk classification:
   - Low = mild symptoms with no immediate concern
   - Medium = symptoms that may require medical attention
   - High = potentially serious symptoms or possible emergency

4. The "emergency" field MUST contain only:
   true
   or
   false

5. The "specialization" field should contain the most appropriate medical specialization.

Examples:
Pregnancy symptoms -> Gynecology
Chest pain -> Cardiology
Skin rash -> Dermatology
Bone fracture -> Orthopedics
Headache/Migraine -> Neurology

6. "advice" should provide clear and concise general health advice.

7. Return ONLY valid JSON.
8. Do NOT use markdown.
9. Do NOT add explanations outside the JSON.

Return exactly this JSON structure:

{
  "specialization": "",
  "risk": "Low",
  "emergency": false,
  "advice": ""
}
`;

  const text = await callGemini(prompt);

  const result = JSON.parse(cleanJSON(text));

  // Safety check before sending the result to MongoDB
  const allowedRisks = ["Low", "Medium", "High"];

  if (!allowedRisks.includes(result.risk)) {
    logger.warn(
      `[Gemini] Invalid risk received: "${result.risk}". Defaulting to Medium.`
    );

    result.risk = "Medium";
  }

  // Safety check for emergency field
  if (typeof result.emergency !== "boolean") {
    result.emergency = false;
  }

  logger.info(
    `[Gemini] Symptom analysis complete — Risk: ${result.risk}, Specialization: ${result.specialization}`
  );

  return result;
}


/* =========================================================
   COMMUNITY HEALTH DASHBOARD AI SYNTHESIS
   ========================================================= */

export async function synthesizeDashboard(payload) {
  const {
    location,
    countryFull,
    weather,
    aqi,
    whoOutbreaks,
    news,
    govAdvisories,
    vitals,
  } = payload;

  const cacheKey = `gemini:dashboard:${location}:${new Date().toDateString()}`;

  const cached = getCached(cacheKey);

  if (cached) {
    logger.info(
      `[Gemini] Dashboard synthesis served from cache for ${location}`
    );

    return cached;
  }

  logger.info(
    `[Gemini] Synthesizing dashboard for ${location}, ${countryFull}`
  );

  const whoContext = whoOutbreaks?.length
    ? whoOutbreaks
        .map((o) => `- ${o.title}: ${o.summary}`)
        .join("\n")
    : "No active WHO-reported outbreaks found for this country in the current feed.";

  const newsContext =
    news?.available && news.articles?.length
      ? news.articles
          .map((a) => `- ${a.title}: ${a.summary}`)
          .join("\n")
      : "No health news articles are available for this location right now.";

  const govContext =
    govAdvisories?.available && govAdvisories.advisories?.length
      ? govAdvisories.advisories
          .map((a) => `- ${a.title}: ${a.summary}`)
          .join("\n")
      : "No government advisories are available right now.";

  const prompt = `
You are a public health analyst.

Base your answer ONLY on the REAL data provided below.

Never invent outbreaks, diseases, advisories or statistics.

If a section has no real data, return an empty array for that section.

LOCATION
Country: ${countryFull || "Unknown"}
City: ${location}
Month: ${new Date().toLocaleString("default", {
    month: "long",
  })}

WEATHER
Temperature: ${weather.temperature}°C
Humidity: ${weather.humidity}%
Condition: ${weather.condition}

AIR QUALITY
AQI Index: ${aqi.aqiIndex}
AQI Label: ${aqi.aqiLabel}
PM2.5: ${aqi.components.pm2_5}
PM10: ${aqi.components.pm10}

WHO OUTBREAKS (use ONLY these for officialOutbreaks)
${whoContext}

HEALTH NEWS (use ONLY these for regionalNews)
${newsContext}

GOVERNMENT ADVISORIES (use ONLY these for governmentAdvisories)
${govContext}

PATIENT VITALS
Blood Pressure: ${vitals.bp || "Not recorded"}
Blood Sugar: ${vitals.sugar || "Not recorded"}
Heart Rate: ${vitals.heartRate || "Not recorded"}
Sleep Hours: ${vitals.sleep || "Not recorded"}
Water Intake: ${vitals.water || "Not recorded"}
Exercise Minutes: ${vitals.exercise || "Not recorded"}
Daily Steps: ${vitals.steps || "Not recorded"}

STRICT RULES

1. officialOutbreaks → ONLY from WHO OUTBREAKS section above.

2. regionalNews → ONLY from HEALTH NEWS section above.
   Each item MUST have a "name" field containing the article headline.

3. governmentAdvisories → ONLY from GOVERNMENT ADVISORIES section above.

4. environmentalRisks → ONLY inferred from weather and AQI data above.

5. Never fabricate.
   Never guess.
   Never invent disease names.

6. Every array item MUST have a "name" field as the main display title.

7. The risk field must be exactly one of:
   "Low", "Moderate", "High".

8. "recommendations" must be an array of plain strings only.
   Never return objects inside recommendations.

9. For regionalNews, ONLY include articles directly about:
   diseases, outbreaks, public health, hospitals, or medical conditions.

10. Return ONLY valid JSON.
    No markdown.
    No explanation.

Return exactly this JSON shape:

{
  "summary": "",
  "communityRisk": "Low",
  "officialOutbreaks": [
    {
      "name": "",
      "reason": "",
      "risk": "Low",
      "source": "WHO"
    }
  ],
  "regionalNews": [
    {
      "name": "",
      "summary": "",
      "risk": "Low"
    }
  ],
  "governmentAdvisories": [
    {
      "name": "",
      "reason": "",
      "risk": "Low",
      "source": "Government"
    }
  ],
  "environmentalRisks": [
    {
      "name": "",
      "reason": "",
      "risk": "Low",
      "source": "Climate Correlation"
    }
  ],
  "personalRisk": {
    "level": "",
    "reasoning": ""
  },
  "recommendations": []
}
`;

  const text = await callGemini(prompt);

  const result = JSON.parse(cleanJSON(text));

  setCached(cacheKey, result, CACHE_TTL_MS);

  logger.info(
    `[Gemini] Dashboard synthesis complete — Community Risk: ${result.communityRisk}`
  );

  return result;
}


/* =========================================================
   TRANSLATION
   ========================================================= */

export async function translateText(
  text,
  sourceLanguage,
  targetLanguage
) {
  if (!text) {
    return "";
  }

  logger.info(
    `[Gemini] Translating from ${sourceLanguage} to ${targetLanguage}`
  );

  const prompt = `
You are a professional medical translator.

Translate the following medical text.

Source Language: ${sourceLanguage}
Target Language: ${targetLanguage}

Rules:
- Translate accurately.
- Preserve medical meaning.
- Do NOT explain.
- Do NOT summarize.
- Return ONLY the translated text.

Medical Text:
${text}
`;

  const translated = await callGemini(prompt);

  return translated.trim();
}