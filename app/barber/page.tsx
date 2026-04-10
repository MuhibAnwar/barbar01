"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function BarberLoginPage() {
  const [barberCode, setBarberCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!barberCode.trim()) {
      setError(t("pleaseEnterBarberId"));
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: queryError } = await supabase
      .from("barbers")
      .select("id, name")
      .eq("barber_code", barberCode.trim().toUpperCase())
      .single();

    if (queryError) {
      setError(
        queryError.code === "PGRST116" || queryError.message.includes("0 rows")
          ? t("barberIdNotFound")
          : t("unableToConnect")
      );
      setLoading(false);
      return;
    }

    if (!data) {
      setError(t("barberIdNotFound"));
      setLoading(false);
      return;
    }

    localStorage.setItem(
      "barber_session",
      JSON.stringify({ barberId: data.id, barberName: data.name })
    );

    router.push("/barber/dashboard");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-neutral-200 px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-widest hover:text-amber-500 transition-colors"
        >
          {t("appName")}
        </Link>
        <LanguageSwitcher />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div>
            <h1 className="font-mono text-2xl uppercase tracking-wider mb-2">
              {t("barberLogin")}
            </h1>
            <p className="text-sm text-neutral-500">
              {t("enterBarberCodeDesc")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label={t("barberIdLabel")}
              placeholder={t("barberIdInputPlaceholder")}
              value={barberCode}
              onChange={(e) => setBarberCode(e.target.value.toUpperCase())}
              autoCapitalize="characters"
              autoComplete="off"
              autoFocus
            />

            {error && (
              <p className="text-sm text-red-500 font-mono border border-red-200 px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {t("enterDashboard")}
            </Button>
          </form>

          <div className="border-t border-neutral-100 pt-4">
            <p className="text-xs text-neutral-400 font-mono">
              {t("barberCodesHint")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
