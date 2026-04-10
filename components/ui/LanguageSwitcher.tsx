"use client";

import { useTranslation } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useTranslation();

  const activeClass =
    "bg-[#1E3A5F] text-white border border-[#1E3A5F]";
  const inactiveClass =
    "bg-white text-[#1E3A5F] border border-[#1E3A5F] hover:bg-[#1E3A5F]/5";

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <button
        onClick={() => setLang("en")}
        className={`text-[14px] px-[14px] py-[6px] rounded-[6px] cursor-pointer transition-colors leading-none ${
          lang === "en" ? activeClass : inactiveClass
        }`}
      >
        {t("english")}
      </button>
      <button
        onClick={() => setLang("ur")}
        className={`text-[14px] px-[14px] py-[6px] rounded-[6px] cursor-pointer transition-colors leading-none ${
          lang === "ur" ? activeClass : inactiveClass
        }`}
      >
        {t("urdu")}
      </button>
    </div>
  );
}
