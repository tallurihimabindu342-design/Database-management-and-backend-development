/**
 * ⚠️ MIGRATION IN PROGRESS
 *
 * getMedicalAdvice() and getCommunityHealthAnalysis() have moved to the
 * backend and no longer live here — calling Gemini directly from the
 * browser exposed the API key in the frontend bundle.
 *
 * - Symptom checking: now POST /api/symptom-check (see SymptomChecker.jsx)
 * - Community health analysis: now handled inside POST /api/dashboard
 *   (see CommunityHealthAlerts.jsx)
 *
 * translateText() remains here for now since multilingual consultation
 * booking (BookAppointment.jsx) still calls it client-side. This should
 * be migrated to the backend in a future pass for the same reason —
 * it currently still exposes VITE_GEMINI_API_KEY in the browser bundle.
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function translateText(text, sourceLanguage, targetLanguage) {
  if (!text) return "";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
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
`
            }],
          }],
        }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}