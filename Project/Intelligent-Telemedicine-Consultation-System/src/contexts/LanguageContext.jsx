import { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// ── Static language options — exported so Sidebar can import directly ──────
export const LANGUAGE_OPTIONS = [
  { code: "English",   label: "English" },
  { code: "Telugu",    label: "తెలుగు" },
  { code: "Hindi",     label: "हिन्दी" },
  { code: "Tamil",     label: "தமிழ்" },
  { code: "Kannada",   label: "ಕನ್ನಡ" },
  { code: "Malayalam", label: "മലയാളം" },
];

// Kept for anything that still imports SUPPORTED_LANGUAGES
export const SUPPORTED_LANGUAGES = LANGUAGE_OPTIONS.map((l) => l.code);

// ── Static UI string table ─────────────────────────────────────────────────
const STRINGS = {
  English: {
    weather: "Weather", airQuality: "Air Quality",
    communityRisk: "Community Risk", communityHealthRisk: "Community Health Risk",
    communityAlerts: "Community Health Alerts",
    whoOutbreaks: "WHO Disease Outbreak News", healthNews: "Regional Health News",
    advisories: "Government Advisories", aiAnalysis: "AI Health Risk Synthesis",
    preventiveMeasures: "Preventive Measures", personalGuidance: "Personalized Guidance",
    escalationAlert: "Health Escalation Alert", emergency: "Emergency",
    high: "High", moderate: "Moderate", low: "Low", unknown: "Unknown",
    loading: "Loading...", bookAppointment: "Book Appointment",
    callEmergency: "Call Emergency — 108", nearbyHospitals: "Nearby Hospitals",
    noOutbreaks: "No active WHO-reported outbreaks for your country",
    language: "Language", callAmbulance: "Call Ambulance",
    goToER: "Go to Emergency Room", emergencyContacts: "Emergency Contacts",
    doNotDriveYourself: "Do not drive yourself",
    escalationLevel: "Level", escalationReason: "Reason",
    escalationAction: "Recommended Action",
    symptomChecker: "AI Symptom Checker",
    analyzeSymptoms: "Analyze Symptoms", analyzing: "Analyzing...",
    describeSymptoms: "Describe Your Symptoms",
    clinicalAdvice: "Clinical Advice", riskLevel: "Risk Level",
    recommendedSpecialist: "Recommended Specialization",
    noAlerts: "No active community health alerts.",
    viewHistory: "View History", newAnalysis: "New Analysis",
  },
  Telugu: {
    weather: "వాతావరణం", airQuality: "వాయు నాణ్యత",
    communityRisk: "సమాజ ఆరోగ్య ప్రమాదం", communityHealthRisk: "సమాజ ఆరోగ్య ప్రమాదం",
    communityAlerts: "సమాజ ఆరోగ్య హెచ్చరికలు",
    whoOutbreaks: "WHO రోగ వ్యాప్తి వార్తలు", healthNews: "ప్రాంతీయ ఆరోగ్య వార్తలు",
    advisories: "ప్రభుత్వ ఆరోగ్య సూచనలు", aiAnalysis: "AI ఆరోగ్య విశ్లేషణ",
    preventiveMeasures: "నివారణ చర్యలు", personalGuidance: "వ్యక్తిగత మార్గదర్శకత్వం",
    escalationAlert: "ఆరోగ్య హెచ్చరిక", emergency: "అత్యవసరం",
    high: "అధికం", moderate: "మధ్యస్థం", low: "తక్కువ", unknown: "తెలియదు",
    loading: "లోడ్ అవుతోంది...", bookAppointment: "అపాయింట్‌మెంట్ బుక్ చేయండి",
    callEmergency: "అత్యవసర సేవలను పిలవండి — 108",
    nearbyHospitals: "సమీప ఆసుపత్రులు",
    noOutbreaks: "మీ దేశంలో WHO నివేదించిన చురుకైన వ్యాప్తులు లేవు",
    language: "భాష", callAmbulance: "అంబులెన్స్ పిలవండి",
    goToER: "అత్యవసర గదికి వెళ్ళండి",
    emergencyContacts: "అత్యవసర సంప్రదింపులు",
    doNotDriveYourself: "మీరే నడవకండి",
    escalationLevel: "స్థాయి", escalationReason: "కారణం",
    escalationAction: "సిఫార్సు చేయబడిన చర్య",
    symptomChecker: "AI లక్షణ పరీక్ష",
    analyzeSymptoms: "లక్షణాలు విశ్లేషించండి", analyzing: "విశ్లేషిస్తోంది...",
    describeSymptoms: "మీ లక్షణాలను వివరించండి",
    clinicalAdvice: "వైద్య సలహా", riskLevel: "ప్రమాద స్థాయి",
    recommendedSpecialist: "సిఫార్సు చేయబడిన నిపుణత",
    noAlerts: "సక్రియ సమాజ ఆరోగ్య హెచ్చరికలు లేవు.",
    viewHistory: "చరిత్ర చూడండి", newAnalysis: "కొత్త విశ్లేషణ",
  },
  Hindi: {
    weather: "मौसम", airQuality: "वायु गुणवत्ता",
    communityRisk: "सामुदायिक स्वास्थ्य जोखिम", communityHealthRisk: "सामुदायिक स्वास्थ्य जोखिम",
    communityAlerts: "सामुदायिक स्वास्थ्य अलर्ट",
    whoOutbreaks: "WHO रोग प्रकोप समाचार", healthNews: "क्षेत्रीय स्वास्थ्य समाचार",
    advisories: "सरकारी स्वास्थ्य परामर्श", aiAnalysis: "AI स्वास्थ्य जोखिम विश्लेषण",
    preventiveMeasures: "निवारक उपाय", personalGuidance: "व्यक्तिगत मार्गदर्शन",
    escalationAlert: "स्वास्थ्य चेतावनी", emergency: "आपातकाल",
    high: "उच्च", moderate: "मध्यम", low: "कम", unknown: "अज्ञात",
    loading: "लोड हो रहा है...", bookAppointment: "अपॉइंटमेंट बुक करें",
    callEmergency: "आपातकालीन सेवाएं — 108", nearbyHospitals: "नजदीकी अस्पताल",
    noOutbreaks: "आपके देश के लिए कोई सक्रिय WHO प्रकोप नहीं",
    language: "भाषा", callAmbulance: "एम्बुलेंस बुलाएं",
    goToER: "आपातकालीन कक्ष जाएं", emergencyContacts: "आपातकालीन संपर्क",
    doNotDriveYourself: "खुद वाहन न चलाएं",
    escalationLevel: "स्तर", escalationReason: "कारण",
    escalationAction: "अनुशंसित कार्रवाई",
    symptomChecker: "AI लक्षण परीक्षक",
    analyzeSymptoms: "लक्षण विश्लेषण करें", analyzing: "विश्लेषण हो रहा है...",
    describeSymptoms: "अपने लक्षण बताएं",
    clinicalAdvice: "नैदानिक सलाह", riskLevel: "जोखिम स्तर",
    recommendedSpecialist: "अनुशंसित विशेषज्ञता",
    noAlerts: "कोई सक्रिय सामुदायिक स्वास्थ्य अलर्ट नहीं।",
    viewHistory: "इतिहास देखें", newAnalysis: "नया विश्लेषण",
  },
  Tamil: {
    weather: "வானிலை", airQuality: "காற்றுத் தரம்",
    communityRisk: "சமூக ஆரோக்கிய அபாயம்", communityHealthRisk: "சமூக ஆரோக்கிய அபாயம்",
    communityAlerts: "சமூக சுகாதார எச்சரிக்கைகள்",
    whoOutbreaks: "WHO நோய் வெடிப்பு செய்திகள்",
    healthNews: "பிராந்திய சுகாதார செய்திகள்",
    advisories: "அரசு சுகாதார அறிவிப்புகள்",
    aiAnalysis: "AI சுகாதார ஆபத்து பகுப்பாய்வு",
    preventiveMeasures: "தடுப்பு நடவடிக்கைகள்",
    personalGuidance: "தனிப்பட்ட வழிகாட்டுதல்",
    escalationAlert: "சுகாதார எச்சரிக்கை", emergency: "அவசரநிலை",
    high: "அதிகம்", moderate: "மிதமான", low: "குறைந்த", unknown: "தெரியாத",
    loading: "ஏற்றுகிறது...", bookAppointment: "சந்திப்பை பதிவு செய்யுங்கள்",
    callEmergency: "அவசர சேவைகளை அழைக்கவும் — 108",
    nearbyHospitals: "அருகிலுள்ள மருத்துவமனைகள்",
    noOutbreaks: "உங்கள் நாட்டிற்கு WHO அறிவித்த நோய் வெடிப்புகள் இல்லை",
    language: "மொழி", callAmbulance: "ஆம்புலன்ஸ் அழைக்கவும்",
    goToER: "அவசர அறைக்கு செல்லுங்கள்",
    emergencyContacts: "அவசர தொடர்புகள்",
    doNotDriveYourself: "நீங்களே வாகனம் ஓட்டாதீர்கள்",
    escalationLevel: "நிலை", escalationReason: "காரணம்",
    escalationAction: "பரிந்துரைக்கப்பட்ட நடவடிக்கை",
    symptomChecker: "AI அறிகுறி சரிபார்ப்பி",
    analyzeSymptoms: "அறிகுறிகளை பகுப்பாய்வு செய்யுங்கள்",
    analyzing: "பகுப்பாய்வு செய்கிறது...",
    describeSymptoms: "உங்கள் அறிகுறிகளை விவரிக்கவும்",
    clinicalAdvice: "மருத்துவ ஆலோசனை", riskLevel: "ஆபத்து நிலை",
    recommendedSpecialist: "பரிந்துரைக்கப்பட்ட நிபுணத்துவம்",
    noAlerts: "சுறுசுறுப்பான சமூக சுகாதார எச்சரிக்கைகள் இல்லை.",
    viewHistory: "வரலாற்றை பார்க்கவும்", newAnalysis: "புதிய பகுப்பாய்வு",
  },
  Kannada: {
    weather: "ಹವಾಮಾನ", airQuality: "ವಾಯು ಗುಣಮಟ್ಟ",
    communityRisk: "ಸಮುದಾಯ ಆರೋಗ್ಯ ಅಪಾಯ", communityHealthRisk: "ಸಮುದಾಯ ಆರೋಗ್ಯ ಅಪಾಯ",
    communityAlerts: "ಸಮುದಾಯ ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆಗಳು",
    whoOutbreaks: "WHO ರೋಗ ಏಕಾಏಕಿ ಸುದ್ದಿ",
    healthNews: "ಪ್ರಾದೇಶಿಕ ಆರೋಗ್ಯ ಸುದ್ದಿ",
    advisories: "ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಸಲಹೆಗಳು",
    aiAnalysis: "AI ಆರೋಗ್ಯ ಅಪಾಯ ವಿಶ್ಲೇಷಣೆ",
    preventiveMeasures: "ತಡೆಗಟ್ಟುವ ಕ್ರಮಗಳು",
    personalGuidance: "ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶನ",
    escalationAlert: "ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆ", emergency: "ತುರ್ತುಸ್ಥಿತಿ",
    high: "ಹೆಚ್ಚು", moderate: "ಮಧ್ಯಮ", low: "ಕಡಿಮೆ", unknown: "ಅಜ್ಞಾತ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", bookAppointment: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
    callEmergency: "ತುರ್ತು ಸೇವೆಗಳನ್ನು ಕರೆ ಮಾಡಿ — 108",
    nearbyHospitals: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು",
    noOutbreaks: "ನಿಮ್ಮ ದೇಶಕ್ಕೆ WHO ವರದಿ ಮಾಡಿದ ಏಕಾಏಕಿ ಇಲ್ಲ",
    language: "ಭಾಷೆ", callAmbulance: "ಆಂಬುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ",
    goToER: "ತುರ್ತು ಕೊಠಡಿಗೆ ಹೋಗಿ",
    emergencyContacts: "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    doNotDriveYourself: "ನೀವೇ ವಾಹನ ಚಾಲಿಸಬೇಡಿ",
    escalationLevel: "ಹಂತ", escalationReason: "ಕಾರಣ",
    escalationAction: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ",
    symptomChecker: "AI ರೋಗಲಕ್ಷಣ ಪರಿಶೀಲಕ",
    analyzeSymptoms: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    describeSymptoms: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರಿಸಿ",
    clinicalAdvice: "ವೈದ್ಯಕೀಯ ಸಲಹೆ", riskLevel: "ಅಪಾಯದ ಮಟ್ಟ",
    recommendedSpecialist: "ಶಿಫಾರಸು ಮಾಡಿದ ತಜ್ಞತೆ",
    noAlerts: "ಯಾವುದೇ ಸಕ್ರಿಯ ಸಮುದಾಯ ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ.",
    viewHistory: "ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ", newAnalysis: "ಹೊಸ ವಿಶ್ಲೇಷಣೆ",
  },
  Malayalam: {
    weather: "കാലാവസ്ഥ", airQuality: "വായു ഗുണനിലവാരം",
    communityRisk: "സമൂഹ ആരോഗ്യ അപകടം", communityHealthRisk: "സമൂഹ ആരോഗ്യ അപകടം",
    communityAlerts: "സമൂഹ ആരോഗ്യ അലർട്ടുകൾ",
    whoOutbreaks: "WHO രോഗ പൊട്ടിപ്പുറപ്പെടൽ വാർത്ത",
    healthNews: "പ്രാദേശിക ആരോഗ്യ വാർത്ത",
    advisories: "സർക്കാർ ആരോഗ്യ ഉപദേശങ്ങൾ",
    aiAnalysis: "AI ആരോഗ്യ അപകട വിശകലനം",
    preventiveMeasures: "പ്രതിരോധ നടപടികൾ",
    personalGuidance: "വ്യക്തിഗത മാർഗ്ഗനിർദ്ദേശം",
    escalationAlert: "ആരോഗ്യ മുന്നറിയിപ്പ്", emergency: "അടിയന്തരാവസ്ഥ",
    high: "ഉയർന്ന", moderate: "മിതമായ", low: "കുറഞ്ഞ", unknown: "അജ്ഞാതം",
    loading: "ലോഡ് ചെയ്യുന്നു...", bookAppointment: "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക",
    callEmergency: "അടിയന്തര സേവനങ്ങൾ വിളിക്കുക — 108",
    nearbyHospitals: "അടുത്തുള്ള ആശുപത്രികൾ",
    noOutbreaks: "നിങ്ങളുടെ രാജ്യത്ത് WHO അറിയിച്ച പൊട്ടിപ്പുറപ്പെടലുകൾ ഇല്ല",
    language: "ഭാഷ", callAmbulance: "ആംബുലൻസ് വിളിക്കുക",
    goToER: "അടിയന്തര മുറിയിലേക്ക് പോകുക",
    emergencyContacts: "അടിയന്തര ബന്ധപ്പെടേണ്ടവർ",
    doNotDriveYourself: "സ്വയം വണ്ടി ഓടിക്കരുത്",
    escalationLevel: "തലം", escalationReason: "കാരണം",
    escalationAction: "ശുപാർശ ചെയ്ത നടപടി",
    symptomChecker: "AI ലക്ഷണ പരിശോധക",
    analyzeSymptoms: "ലക്ഷണങ്ങൾ വിശകലനം ചെയ്യുക",
    analyzing: "വിശകലനം ചെയ്യുന്നു...",
    describeSymptoms: "നിങ്ങളുടെ ലക്ഷണങ്ങൾ വിവരിക്കുക",
    clinicalAdvice: "ക്ലിനിക്കൽ ഉപദേശം", riskLevel: "അപകട നിലവാരം",
    recommendedSpecialist: "ശുപാർശ ചെയ്ത സ്പെഷ്യലൈസേഷൻ",
    noAlerts: "സജീവ സമൂഹ ആരോഗ്യ അലർട്ടുകൾ ഇല്ല.",
    viewHistory: "ചരിത്രം കാണുക", newAnalysis: "പുതിയ വിശകലനം",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("English");
  const [loading, setLoading] = useState(true);

  const getUserId = () =>
    localStorage.getItem("patientId") ||
    localStorage.getItem("doctorId") ||
    localStorage.getItem("adminId") ||
    null;

  const getRole = () => localStorage.getItem("role") || "Patient";

  // Load saved preference on mount
  useEffect(() => {
    const userId = getUserId();
    if (!userId) { setLoading(false); return; }

    fetch(`${API_BASE}/api/translate/language?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setLanguageState(data.preferredLanguage || "English"))
      .catch(() => setLanguageState("English"))
      .finally(() => setLoading(false));
  }, []);

  // Save preference and update state
  const setLanguage = useCallback(async (newLanguage) => {
    setLanguageState(newLanguage);

    const userId = getUserId();
    if (!userId) return;

    try {
      await fetch(`${API_BASE}/api/translate/language`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: getRole(), preferredLanguage: newLanguage }),
      });
    } catch (err) {
      console.error("Failed to save language preference:", err);
    }
  }, []);

  // Translates dynamic AI-generated text via backend
  const translate = useCallback(async (content) => {
    if (language === "English" || !content) return content;
    try {
      const response = await fetch(`${API_BASE}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, targetLanguage: language }),
      });
      if (!response.ok) return content;
      const data = await response.json();
      return data.translated || content;
    } catch {
      return content;
    }
  }, [language]);

  // Looks up a static UI string — no API call needed
  const t = useCallback(
    (key) => STRINGS[language]?.[key] ?? STRINGS.English[key] ?? key,
    [language]
  );

  return (
    <LanguageContext.Provider value={{
      language,       // full name: "English", "Telugu" etc — for existing components
      setLanguage,    // call with full name: setLanguage("Telugu")
      translate,      // async: for AI-generated dynamic text
      t,              // sync: for static UI labels
      loading,
      LANGUAGE_OPTIONS, // array of { code, label } — also exported directly above
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}