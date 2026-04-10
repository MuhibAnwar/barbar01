"use client";

import { BookingState } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

interface BookingConfirmationProps {
  state: BookingState;
  onReset: () => void;
}

export default function BookingConfirmation({
  state,
  onReset,
}: BookingConfirmationProps) {
  const { t } = useTranslation();

  const appointmentDate = state.selectedSlotTime
    ? new Date(state.selectedSlotTime).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const appointmentTime = state.selectedSlotTime
    ? new Date(state.selectedSlotTime).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-mono text-lg uppercase tracking-wider">
          {t("bookingConfirmedTitle")}
        </h2>
      </div>

      <div className="border border-neutral-200 divide-y divide-neutral-200">
        <DetailRow label={t("barberLabel")} value={state.selectedBarberName ?? ""} />
        <div className="px-4 py-3 flex justify-between items-start">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            {t("serviceLabel")}
          </span>
          <div className="text-right">
            <p className="font-mono text-sm">{state.selectedServiceName}</p>
            <p className="font-mono text-xs text-neutral-500">
              ₹{state.selectedServicePrice?.toLocaleString()}
            </p>
          </div>
        </div>
        <DetailRow label={t("dateLabel")} value={appointmentDate} />
        <DetailRow label={t("timeLabel")} value={appointmentTime} />
        <DetailRow label={t("nameLabel")} value={state.customerName} />
        <DetailRow label={t("phoneLabel")} value={state.customerPhone} />
        {state.comment && (
          <div className="px-4 py-3 flex justify-between items-start gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 flex-shrink-0">
              {t("noteLabel")}
            </span>
            <span className="text-sm text-right text-neutral-600">
              {state.comment}
            </span>
          </div>
        )}
        <div className="px-4 py-3 flex justify-between items-center">
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            {t("statusLabel")}
          </span>
          <span className="font-mono text-xs bg-amber-500 text-white px-2 py-0.5">
            {t("confirmedStatus")}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={onReset}
        className="w-full"
      >
        {t("bookAnother")}
      </Button>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 flex justify-between items-start">
      <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
        {label}
      </span>
      <span className="font-mono text-sm text-right">{value}</span>
    </div>
  );
}
