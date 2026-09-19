import { useLanguage, SUPPORTED_LANGUAGES } from "../contexts/LanguageContext";

const LANGUAGE_LABELS = {
  English: "English",
  Telugu: "తెలుగు",
  Hindi: "हिन्दी",
  Tamil: "தமிழ்",
  Kannada: "ಕನ್ನಡ",
  Malayalam: "മലയാളം",
};

function LanguageSelector({ compact }) {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      style={{
        background: "#111827",
        color: "white",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "10px",
        padding: compact ? "6px 10px" : "10px 14px",
        fontSize: compact ? "13px" : "14px",
        cursor: "pointer",
        outline: "none",
      }}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          🌐 {LANGUAGE_LABELS[lang]}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;