"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { BookingState } from "@/lib/types";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import { useTranslation } from "@/lib/i18n";

interface CustomerFormProps {
  state: BookingState;
  onFieldChange: (field: "customerName" | "customerPhone" | "comment", value: string) => void;
  onSuccess: (bookingId: string) => void;
  onBack: () => void;
}

interface FormErrors {
  customerName?: string;
  customerPhone?: string;
}

export default function CustomerForm({
  state,
  onFieldChange,
  onSuccess,
  onBack,
}: CustomerFormProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { t } = useTranslation();

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!state.customerName || state.customerName.trim().length < 2) {
      newErrors.customerName = t("nameError");
    }
    if (!state.customerPhone || !/^\d{7,15}$/.test(state.customerPhone.trim())) {
      newErrors.customerPhone = t("phoneError");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);

    const supabase = createClient();

    const { data, error } = await supabase.rpc("book_slot", {
      p_slot_id: state.selectedSlotId,
      p_barber_id: state.selectedBarberId,
      p_service_id: state.selectedServiceId,
      p_customer_name: state.customerName.trim(),
      p_customer_phone: state.customerPhone.trim(),
      p_comment: state.comment.trim() || null,
    });

    if (error) {
      setSubmitError(
        error.message.includes("already booked")
          ? t("slotAlreadyBooked")
          : t("bookingError")
      );
      setSubmitting(false);
      return;
    }

    onSuccess(data as string);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-mono text-lg uppercase tracking-wider mb-1">
          {t("yourDetails")}
        </h2>
        <p className="text-sm text-neutral-500">{t("almostDone")}</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          label={t("fullName")}
          placeholder={t("namePlaceholder")}
          value={state.customerName}
          onChange={(e) => onFieldChange("customerName", e.target.value)}
          error={errors.customerName}
          autoComplete="name"
        />
        <Input
          label={t("phoneNumber")}
          placeholder={t("phonePlaceholder")}
          value={state.customerPhone}
          onChange={(e) => onFieldChange("customerPhone", e.target.value)}
          error={errors.customerPhone}
          inputMode="numeric"
          autoComplete="tel"
        />
        <Textarea
          label={t("commentOptional")}
          placeholder={t("commentPlaceholder")}
          value={state.comment}
          onChange={(e) => onFieldChange("comment", e.target.value)}
        />

        {submitError && (
          <p className="text-sm text-red-500 font-mono border border-red-200 px-3 py-2">
            {submitError}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="flex-1"
            disabled={submitting}
          >
            {t("back")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            className="flex-1"
          >
            {t("confirmBooking")}
          </Button>
        </div>
      </form>
    </div>
  );
}
