import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation();

  return (
    <div className={`languageSwitcher${compact ? " languageSwitcherCompact" : ""}`}>
      {!compact ? <label className="languageSwitcherLabel">{t("common.language")}</label> : null}
      <select
        className="input languageSwitcherSelect"
        value={i18n.language}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        aria-label={t("common.language")}
      >
        <option value="en">{t("common.english")}</option>
        <option value="sq">{t("common.albanian")}</option>
      </select>
    </div>
  );
}
