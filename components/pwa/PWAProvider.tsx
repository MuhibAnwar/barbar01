"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";

function isIOS() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(window.navigator as unknown as { standalone?: boolean }).standalone
  );
}

export default function PWAProvider() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // ── Service Worker ───────────────────────────────────────────────────────
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => console.log("SW registered:", reg.scope))
          .catch((err) => console.error("SW registration failed:", err));
      });
    }

    // ── Offline detection ────────────────────────────────────────────────────
    setIsOffline(!navigator.onLine);
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // ── Install prompt (Android / Chrome) ────────────────────────────────────
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onAppInstalled = () => {
      setShowModal(false);
      localStorage.setItem("pwaInstalled", "true");
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    // ── Show modal on first visit (after 1.5s delay) ─────────────────────────
    if (!localStorage.getItem("pwaInstalled")) {
      if (isIOS()) setIosMode(true);
      const timer = setTimeout(() => setShowModal(true), 1500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("online", onOnline);
        window.removeEventListener("offline", onOffline);
        window.removeEventListener("beforeinstallprompt", onBeforeInstall);
        window.removeEventListener("appinstalled", onAppInstalled);
      };
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prompt = installPrompt as any;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") localStorage.setItem("pwaInstalled", "true");
    setShowModal(false);
    setInstallPrompt(null);
  }

  function dismiss() {
    setShowModal(false);
    localStorage.setItem("pwaInstalled", "true");
  }

  const iosSteps = [
    { step: "1", text: t("tapShare"), icon: "⬆️" },
    { step: "2", text: t("tapAddToHomeScreen"), icon: "➕" },
    { step: "3", text: t("tapAdd"), icon: "✅" },
  ];

  return (
    <>
      {/* ── Offline banner ─────────────────────────────────────────────────── */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[200] bg-yellow-50 border-b border-yellow-300 text-yellow-800 font-mono text-xs text-center py-2 px-4">
          {t("offlineBanner")}
        </div>
      )}

      {/* ── Install modal ──────────────────────────────────────────────────── */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[150] bg-black/60"
            onClick={dismiss}
          />

          {/* Modal */}
          <div className="fixed inset-x-4 bottom-6 z-[160] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-sm bg-white border border-neutral-200">
            {/* Header */}
            <div className="bg-black px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/icons/icon-72.png"
                  alt={t("appName")}
                  className="w-9 h-9"
                />
                <div>
                  <p className="font-mono text-sm font-bold text-white uppercase tracking-widest">
                    {t("appName")}
                  </p>
                  <p className="font-mono text-xs text-amber-500">
                    {t("addToHomeScreen")}
                  </p>
                </div>
              </div>
              <button
                onClick={dismiss}
                className="text-neutral-400 hover:text-white transition-colors text-lg leading-none px-1"
                aria-label={t("dismiss")}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4 flex flex-col gap-4">
              {iosMode ? (
                <>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {t("installBodyIos")}
                  </p>
                  <ol className="flex flex-col gap-2">
                    {iosSteps.map(({ step, text, icon }) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="font-mono text-xs bg-amber-500 text-black w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                          {step}
                        </span>
                        <span className="text-sm text-neutral-700">
                          {icon} {text}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <button
                    onClick={dismiss}
                    className="font-mono text-xs text-neutral-400 hover:text-neutral-600 text-center pt-1 transition-colors"
                  >
                    {t("maybeLater")}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {t("installBodyAndroid")}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={dismiss}
                      className="flex-1 font-mono text-xs border border-neutral-200 py-3 hover:border-neutral-400 transition-colors text-neutral-500"
                    >
                      {t("notNow")}
                    </button>
                    <button
                      onClick={handleInstall}
                      className="flex-1 font-mono text-xs bg-amber-500 text-black py-3 hover:bg-amber-400 transition-colors font-bold"
                    >
                      {t("installApp")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
