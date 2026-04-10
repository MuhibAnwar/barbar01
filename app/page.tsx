"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-neutral-800">
        <span className="font-mono text-sm uppercase tracking-widest">
          {t("appName")}
        </span>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/barber"
            className="font-mono text-xs text-neutral-400 hover:text-amber-500 transition-colors uppercase tracking-widest"
          >
            {t("barberLoginLink")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center gap-8">
        <div className="flex flex-col gap-4 max-w-md">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-500">
            {t("bookInSeconds")}
          </p>
          <h1 className="font-mono text-4xl sm:text-5xl uppercase tracking-tighter leading-tight">
            {t("tagline")}
          </h1>
          <p className="text-neutral-400 text-base leading-relaxed max-w-sm mx-auto">
            {t("taglineDesc")}
          </p>
        </div>

        <Link
          href="/book"
          className="font-mono text-sm uppercase tracking-widest bg-amber-500 text-black px-8 py-4 hover:bg-amber-400 transition-colors"
        >
          {t("bookNow")}
        </Link>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between">
        <span className="font-mono text-xs text-neutral-600 uppercase tracking-widest">
          {t("appName")}
        </span>
        <span className="font-mono text-xs text-neutral-600">
          {t("scanBookDone")}
        </span>
      </footer>
    </div>
  );
}
