"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { Service } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

interface ServiceSelectProps {
  selectedServiceId: string | null;
  onSelect: (service: Service) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ServiceSelect({
  selectedServiceId,
  onSelect,
  onNext,
  onBack,
}: ServiceSelectProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const fetchServices = useCallback(() => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    supabase
      .from("services")
      .select("*")
      .order("price")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setServices(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-16 font-mono text-sm text-neutral-400">
        {t("loadingServices")}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col gap-4">
        <div className="font-mono text-sm text-red-500 border border-red-200 px-4 py-3">
          {t("unableToLoadServices")}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
            {t("back")}
          </Button>
          <Button variant="primary" size="lg" onClick={fetchServices} className="flex-1">
            {t("retry")}
          </Button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-mono text-lg uppercase tracking-wider mb-1">
          {t("selectService")}
        </h2>
        <p className="text-sm text-neutral-500">{t("whatAreYouComingFor")}</p>
      </div>

      <div className="flex flex-col border border-neutral-200">
        {services.map((service, index) => {
          const isSelected = service.id === selectedServiceId;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={[
                "w-full text-left px-4 py-3.5 flex items-center justify-between transition-all duration-150",
                index !== 0 ? "border-t border-neutral-200" : "",
                isSelected
                  ? "bg-amber-50 border-l-4 border-l-amber-500"
                  : "hover:bg-neutral-50",
              ].join(" ")}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-mono text-sm font-medium">{service.name}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {service.duration_mins} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium">
                  ₹{service.price.toLocaleString()}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          {t("back")}
        </Button>
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedServiceId}
          onClick={onNext}
          className="flex-1"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
