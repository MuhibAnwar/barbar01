"use client";

import { useTranslation } from "@/lib/i18n";

const STEP_KEYS = ["stepBarber", "stepService", "stepTime", "stepDetails"] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
          {t("stepLabel")} {currentStep} {t("stepOf")} {STEP_KEYS.length}
        </span>
        <span className="font-mono text-xs text-amber-500 uppercase tracking-widest">
          {t(STEP_KEYS[currentStep - 1])}
        </span>
      </div>
      <div className="flex gap-1">
        {STEP_KEYS.map((_, i) => (
          <div
            key={i}
            className={[
              "h-0.5 flex-1 transition-colors duration-300",
              i < currentStep ? "bg-amber-500" : "bg-neutral-200",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
