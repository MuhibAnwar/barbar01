"use client";

import { useReducer, useCallback } from "react";
import { Barber, Service, AvailabilitySlot, BookingState } from "@/lib/types";
import StepIndicator from "@/components/booking/StepIndicator";
import BarberSelect from "@/components/booking/BarberSelect";
import ServiceSelect from "@/components/booking/ServiceSelect";
import TimeSlotPicker from "@/components/booking/TimeSlotPicker";
import CustomerForm from "@/components/booking/CustomerForm";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const initialState: BookingState = {
  step: 1,
  selectedBarberId: null,
  selectedBarberName: null,
  selectedServiceId: null,
  selectedServiceName: null,
  selectedServicePrice: null,
  selectedSlotId: null,
  selectedSlotTime: null,
  customerName: "",
  customerPhone: "",
  comment: "",
  confirmedBookingId: null,
};

type Action =
  | { type: "SELECT_BARBER"; barber: Barber }
  | { type: "SELECT_SERVICE"; service: Service }
  | { type: "SELECT_SLOT"; slot: AvailabilitySlot }
  | { type: "SET_FIELD"; field: "customerName" | "customerPhone" | "comment"; value: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "CONFIRM"; bookingId: string }
  | { type: "RESET" };

function reducer(state: BookingState, action: Action): BookingState {
  switch (action.type) {
    case "SELECT_BARBER":
      return {
        ...state,
        selectedBarberId: action.barber.id,
        selectedBarberName: action.barber.name,
        selectedServiceId: null,
        selectedServiceName: null,
        selectedSlotId: null,
        selectedSlotTime: null,
      };
    case "SELECT_SERVICE":
      return {
        ...state,
        selectedServiceId: action.service.id,
        selectedServiceName: action.service.name,
        selectedServicePrice: action.service.price,
      };
    case "SELECT_SLOT":
      return {
        ...state,
        selectedSlotId: action.slot.id,
        selectedSlotTime: action.slot.slot_time,
      };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 5) as BookingState["step"] };
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) as BookingState["step"] };
    case "CONFIRM":
      return { ...state, confirmedBookingId: action.bookingId, step: 5 };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function BookPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { t } = useTranslation();

  const handleFieldChange = useCallback(
    (field: "customerName" | "customerPhone" | "comment", value: string) => {
      dispatch({ type: "SET_FIELD", field, value });
    },
    []
  );

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <BarberSelect
            selectedBarberId={state.selectedBarberId}
            onSelect={(barber) => dispatch({ type: "SELECT_BARBER", barber })}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
          />
        );
      case 2:
        return (
          <ServiceSelect
            selectedServiceId={state.selectedServiceId}
            onSelect={(service) => dispatch({ type: "SELECT_SERVICE", service })}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onBack={() => dispatch({ type: "PREV_STEP" })}
          />
        );
      case 3:
        return (
          <TimeSlotPicker
            barberId={state.selectedBarberId!}
            selectedSlotId={state.selectedSlotId}
            onSelect={(slot) => dispatch({ type: "SELECT_SLOT", slot })}
            onNext={() => dispatch({ type: "NEXT_STEP" })}
            onBack={() => dispatch({ type: "PREV_STEP" })}
          />
        );
      case 4:
        return (
          <CustomerForm
            state={state}
            onFieldChange={handleFieldChange}
            onSuccess={(bookingId) => dispatch({ type: "CONFIRM", bookingId })}
            onBack={() => dispatch({ type: "PREV_STEP" })}
          />
        );
      case 5:
        return (
          <BookingConfirmation
            state={state}
            onReset={() => dispatch({ type: "RESET" })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-200 px-4 py-4 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-widest hover:text-amber-500 transition-colors flex-shrink-0"
        >
          {t("appName")}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          {state.step < 5 && (
            <span className="font-mono text-xs text-neutral-400 hidden sm:inline">
              {state.selectedBarberName ?? t("noBarberSelected")}
            </span>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-md flex flex-col gap-8">
          {state.step < 5 && (
            <StepIndicator currentStep={state.step} />
          )}
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
