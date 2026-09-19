const SUPPORTED_LANGUAGES = ["English", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"];

export async function translateContent(content, targetLanguage) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  if (!API_KEY) {
    console.warn("[TranslationService] GEMINI_API_KEY not configured — returning original content.");
    return content;
  }

  if (!targetLanguage || targetLanguage === "English") {
    return content;
  }

  if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
    console.warn(`[TranslationService] Unsupported language: ${targetLanguage}`);
    return content;
  }

  const isArray = Array.isArray(content);
  const items = isArray ? content : [content];

  const indexed = items.map((item, i) => ({
    i,
    text: typeof item === "string" ? item : "",
  }));
  const nonEmpty = indexed.filter((entry) => entry.text.trim() !== "");

  if (nonEmpty.length === 0) {
    return content;
  }

  const prompt = `
You are a professional medical translator.

Translate each numbered item below into ${targetLanguage}.
Preserve medical meaning precisely. Do not add explanations, do not summarize,
do not merge items. Return ONLY a JSON array of translated strings, in the
exact same order, with the exact same number of items as the input.

Input items:
${nonEmpty.map((entry, idx) => `${idx + 1}. ${entry.text}`).join("\n")}

Return ONLY valid JSON array of strings, e.g. ["translated 1", "translated 2"]
`;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (response.status === 429) {
      console.warn("[TranslationService] Rate limited — returning original content.");
      return content;
    }

    const data = await response.json();

    if (data.error) {
      const msg = data.error.message || "";
      if (
        msg.toLowerCase().includes("quota") ||
        msg.includes("429") ||
        data.error.code === 429
      ) {
        console.warn("[TranslationService] Gemini quota exceeded — returning original content.");
        return content;
      }
      console.error("[TranslationService] Gemini error:", msg);
      return content;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.warn("[TranslationService] Empty response — returning original content.");
      return content;
    }

    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let translatedArray;
    try {
      translatedArray = JSON.parse(cleanText);
    } catch {
      console.warn("[TranslationService] JSON parse failed — returning original content.");
      return content;
    }

    if (
      !Array.isArray(translatedArray) ||
      translatedArray.length !== nonEmpty.length
    ) {
      console.warn("[TranslationService] Response shape mismatch — returning original content.");
      return content;
    }

    const result = [...items];
    nonEmpty.forEach((entry, idx) => {
      result[entry.i] = translatedArray[idx];
    });

    return isArray ? result : result[0];

  } catch (err) {
    if (err.name === "AbortError" || err.name === "TimeoutError") {
      console.warn("[TranslationService] Request timed out — returning original content.");
      return content;
    }
    console.error("[TranslationService] Unexpected error:", err.message);
    return content;
  }
}

export { SUPPORTED_LANGUAGES };