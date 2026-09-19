import { translateContent, SUPPORTED_LANGUAGES } from "../services/translationService.js";
import UserPreference from "../models/UserPreference.js";

export async function translate(req, res) {
  try {
    const { content, targetLanguage } = req.body;

    if (content === undefined || content === null) {
      return res.status(400).json({ error: "content is required." });
    }
    if (!targetLanguage) {
      return res.status(400).json({ error: "targetLanguage is required." });
    }

    const translated = await translateContent(content, targetLanguage);
    return res.json({ translated });
  } catch (err) {
    console.error("Translate error:", err.message);
    return res.status(500).json({ error: "Translation failed: " + err.message });
  }
}

export async function getLanguagePreference(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId query param is required." });
    }

    const pref = await UserPreference.findOne({ userId });
    return res.json({ preferredLanguage: pref?.preferredLanguage || "English" });
  } catch (err) {
    console.error("Get language preference error:", err.message);
    return res.status(500).json({ error: "Failed to fetch language preference." });
  }
}

export async function setLanguagePreference(req, res) {
  try {
    const { userId, role, preferredLanguage } = req.body;

    if (!userId || !role || !preferredLanguage) {
      return res.status(400).json({ error: "userId, role and preferredLanguage are required." });
    }

    if (!SUPPORTED_LANGUAGES.includes(preferredLanguage)) {
      return res.status(400).json({ error: `Unsupported language: ${preferredLanguage}` });
    }

    const pref = await UserPreference.findOneAndUpdate(
      { userId },
      { userId, role, preferredLanguage },
      { upsert: true, new: true }
    );

    return res.json(pref);
  } catch (err) {
    console.error("Set language preference error:", err.message);
    return res.status(500).json({ error: "Failed to save language preference." });
  }
}