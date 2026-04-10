"use client";

import { useEffect, useRef, useState } from "react";
import { Booking } from "@/lib/types";
import { createClient } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

interface CustomerSliderProps {
  booking: Booking | null;
  onClose: () => void;
  onStatusChange: (bookingId: string, newStatus: Booking["status"]) => void;
}

const STATUS_OPTIONS: Booking["status"][] = ["pending", "confirmed", "cancelled"];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
}

export default function CustomerSlider({
  booking,
  onClose,
  onStatusChange,
}: CustomerSliderProps) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useTranslation();
  const isRtl = lang === "ur";

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleStatusChange(newStatus: Booking["status"]) {
    if (!booking) return;
    setUpdating(true);
    setUpdateError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", booking.id);

    if (error) {
      setUpdateError(t("bookingError"));
    } else {
      onStatusChange(booking.id, newStatus);
    }
    setUpdating(false);
  }

  const statusLabels: Record<Booking["status"], string> = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    cancelled: t("statusCancelled"),
  };

  const isOpen = !!booking;

  // RTL: panel slides from left; LTR: panel slides from right
  const panelPositionClass = isRtl ? "left-0" : "right-0";
  const panelBorderClass = isRtl ? "border-r border-neutral-200" : "border-l border-neutral-200";
  const openTransform = "translate-x-0";
  const closedTransform = isRtl ? "-translate-x-full" : "translate-x-full";

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className={`fixed inset-0 bg-black transition-opacity duration-250 z-40 ${
          isOpen ? "opacity-30 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slider panel */}
      <div
        className={`fixed top-0 ${panelPositionClass} h-full w-full sm:w-96 bg-white ${panelBorderClass} z-50 flex flex-col
          transition-transform duration-250 ease-out ${
          isOpen ? openTransform : closedTransform
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <h3 className="font-mono text-sm uppercase tracking-wider">
            {t("bookingDetail")}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 transition-colors"
            aria-label={t("close")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        {booking && (
          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <DetailRow label={t("customerLabel")} value={booking.customer_name} />
              <DetailRow label={t("phoneDetail")} value={booking.customer_phone} />
              <DetailRow
                label={t("serviceDetail")}
                value={booking.services?.name ?? "—"}
              />
              <DetailRow
                label={t("appointmentDetail")}
                value={formatDateTime(booking.appointment_time)}
              />
              {booking.comment && (
                <DetailRow label={t("noteDetail")} value={booking.comment} />
              )}
            </div>

            {/* Status update */}
            <div className="border-t border-neutral-100 pt-4">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3">
                {t("updateStatus")}
              </p>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.map((s) => (
                  <Button
                    key={s}
                    variant={booking.status === s ? "primary" : "outline"}
                    size="sm"
                    loading={updating && booking.status !== s}
                    disabled={updating}
                    onClick={() => handleStatusChange(s)}
                    className={
                      s === "confirmed" && booking.status === s
                        ? "!bg-amber-500 !border-amber-500"
                        : s === "cancelled" && booking.status === s
                        ? "!bg-red-500 !border-red-500"
                        : ""
                    }
                  >
                    {statusLabels[s]}
                  </Button>
                ))}
              </div>
              {updateError && (
                <p className="mt-2 text-xs text-red-500 font-mono">
                  {updateError}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="px-5 py-4 border-t border-neutral-200">
          <Button variant="outline" size="md" onClick={onClose} className="w-full">
            {t("close")}
          </Button>
        </div>
      </div>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-0.5">
        {label}
      </p>
      <p className="text-sm text-black">{value}</p>
    </div>
  );
}
