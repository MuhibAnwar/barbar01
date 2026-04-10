"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { Barber } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

interface BarberSelectProps {
  selectedBarberId: string | null;
  onSelect: (barber: Barber) => void;
  onNext: () => void;
}

export default function BarberSelect({
  selectedBarberId,
  onSelect,
  onNext,
}: BarberSelectProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const fetchBarbers = useCallback(() => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    supabase
      .from("barbers")
      .select("*")
      .order("name")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setBarbers(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchBarbers();
  }, [fetchBarbers]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-16 font-mono text-sm text-neutral-400">
        {t("loadingBarbers")}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col gap-4">
        <div className="font-mono text-sm text-red-500 border border-red-200 px-4 py-3">
          {t("unableToLoadBarbers")}
        </div>
        <Button variant="outline" size="lg" onClick={fetchBarbers}>
          {t("retry")}
        </Button>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-mono text-lg uppercase tracking-wider mb-1">
          {t("chooseYourBarber")}
        </h2>
        <p className="text-sm text-neutral-500">{t("selectWhoToBook")}</p>
      </div>

      <div className="flex flex-col gap-3">
        {barbers.map((barber) => {
          const isSelected = barber.id === selectedBarberId;
          return (
            <button
              key={barber.id}
              onClick={() => onSelect(barber)}
              className={[
                "w-full text-left px-4 py-4 border transition-all duration-150",
                "flex items-center justify-between",
                isSelected
                  ? "border-l-4 border-l-amber-500 border-t border-r border-b border-neutral-200 bg-amber-50"
                  : "border border-neutral-200 hover:border-neutral-400",
              ].join(" ")}
            >
              <div>
                <p className="font-mono text-sm font-medium">{barber.name}</p>
                {barber.specialty && (
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {barber.specialty}
                  </p>
                )}
              </div>
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <Button
        variant="primary"
        size="lg"
        disabled={!selectedBarberId}
        onClick={onNext}
        className="w-full"
      >
        {t("continue")}
      </Button>
    </div>
  );
}
