"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import { AvailabilitySlot } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n";

interface TimeSlotPickerProps {
  barberId: string;
  selectedSlotId: string | null;
  onSelect: (slot: AvailabilitySlot) => void;
  onNext: () => void;
  onBack: () => void;
}

function groupByDate(slots: AvailabilitySlot[]): Record<string, AvailabilitySlot[]> {
  return slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    const date = new Date(slot.slot_time).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});
}

export default function TimeSlotPicker({
  barberId,
  selectedSlotId,
  onSelect,
  onNext,
  onBack,
}: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const fetchSlots = useCallback(() => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    supabase
      .from("availability_slots")
      .select("*")
      .eq("barber_id", barberId)
      .eq("is_booked", false)
      .gt("slot_time", new Date().toISOString())
      .order("slot_time")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setSlots(data ?? []);
        setLoading(false);
      });
  }, [barberId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-16 font-mono text-sm text-neutral-400">
        {t("loadingSlots")}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col gap-4">
        <div className="font-mono text-sm text-red-500 border border-red-200 px-4 py-3">
          {t("unableToLoadSlots")}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
            {t("back")}
          </Button>
          <Button variant="primary" size="lg" onClick={fetchSlots} className="flex-1">
            {t("retry")}
          </Button>
        </div>
      </div>
    );

  const grouped = groupByDate(slots);
  const dates = Object.keys(grouped);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-mono text-lg uppercase tracking-wider mb-1">
          {t("pickATime")}
        </h2>
        <p className="text-sm text-neutral-500">{t("availableSlotsDesc")}</p>
      </div>

      {dates.length === 0 ? (
        <div className="py-12 text-center font-mono text-sm text-neutral-400 border border-neutral-200">
          {t("noAvailableSlots")}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {dates.map((date) => (
            <div key={date}>
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">
                {date}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {grouped[date].map((slot) => {
                  const isSelected = slot.id === selectedSlotId;
                  const time = new Date(slot.slot_time).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  );
                  return (
                    <button
                      key={slot.id}
                      onClick={() => onSelect(slot)}
                      className={[
                        "py-2.5 px-2 font-mono text-xs border transition-all duration-150",
                        isSelected
                          ? "bg-amber-500 text-white border-amber-500"
                          : "bg-white text-black border-neutral-300 hover:border-black",
                      ].join(" ")}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          {t("back")}
        </Button>
        <Button
          variant="primary"
          size="lg"
          disabled={!selectedSlotId}
          onClick={onNext}
          className="flex-1"
        >
          {t("continue")}
        </Button>
      </div>
    </div>
  );
}
