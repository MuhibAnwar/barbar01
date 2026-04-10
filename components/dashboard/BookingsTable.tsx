"use client";

import { Booking } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface BookingsTableProps {
  bookings: Booking[];
  onRowClick: (booking: Booking) => void;
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const { t } = useTranslation();
  const classes = {
    pending: "bg-neutral-100 text-neutral-600",
    confirmed: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-600",
  };
  const labels: Record<Booking["status"], string> = {
    pending: t("statusPending"),
    confirmed: t("statusConfirmed"),
    cancelled: t("statusCancelled"),
  };
  return (
    <span
      className={`font-mono text-xs px-2 py-0.5 uppercase tracking-wide ${classes[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return { date, time };
}

export default function BookingsTable({
  bookings,
  onRowClick,
}: BookingsTableProps) {
  const { t } = useTranslation();

  if (bookings.length === 0) {
    return (
      <div className="border border-neutral-200 py-16 text-center font-mono text-sm text-neutral-400">
        {t("noBookings")}
      </div>
    );
  }

  const headers = [
    { key: "customerHeader", label: t("customerHeader") },
    { key: "serviceHeader", label: t("serviceHeader") },
    { key: "dateHeader", label: t("dateHeader") },
    { key: "timeHeader", label: t("timeHeader") },
    { key: "statusHeader", label: t("statusHeader") },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200">
            {headers.map((h) => (
              <th
                key={h.key}
                className="font-mono text-xs uppercase tracking-widest text-neutral-400 text-left px-4 py-3 whitespace-nowrap"
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => {
            const { date, time } = formatDateTime(booking.appointment_time);
            return (
              <tr
                key={booking.id}
                onClick={() => onRowClick(booking)}
                className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono text-sm">
                  {booking.customer_name}
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">
                  {booking.services?.name ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-500 whitespace-nowrap">
                  {date}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-500 whitespace-nowrap">
                  {time}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={booking.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
