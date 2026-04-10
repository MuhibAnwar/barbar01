"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Booking } from "@/lib/types";
import BookingsTable from "@/components/dashboard/BookingsTable";
import CustomerSlider from "@/components/dashboard/CustomerSlider";
import Toast, { ToastMessage } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

type FilterDate = "all" | "today";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [barberName, setBarberName] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [dateFilter, setDateFilter] = useState<FilterDate>("all");

  const addToast = useCallback((message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auth check
  useEffect(() => {
    const raw = localStorage.getItem("barber_session");
    if (!raw) {
      router.replace("/barber");
      return;
    }
    try {
      const session = JSON.parse(raw);
      setBarberId(session.barberId);
      setBarberName(session.barberName);
    } catch {
      router.replace("/barber");
    }
  }, [router]);

  // Fetch bookings
  useEffect(() => {
    if (!barberId) return;

    const supabase = createClient();
    setLoading(true);

    let query = supabase
      .from("bookings")
      .select("*, services(name, price)")
      .eq("barber_id", barberId)
      .order("appointment_time", { ascending: true });

    if (dateFilter === "today") {
      const { start, end } = getTodayRange();
      query = query.gte("appointment_time", start).lte("appointment_time", end);
    }

    if (!navigator.onLine) {
      const cached = localStorage.getItem("barberbook_bookings_cache");
      if (cached) setBookings(JSON.parse(cached));
      setLoading(false);
      return;
    }

    query.then(({ data, error: fetchError }) => {
      if (fetchError) {
        setError(fetchError.message);
      } else {
        const rows = data ?? [];
        setBookings(rows);
        localStorage.setItem("barberbook_bookings_cache", JSON.stringify(rows));
      }
      setLoading(false);
    });
  }, [barberId, dateFilter]);

  // Re-fetch when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (barberId) setDateFilter((f) => f);
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [barberId]);

  // Realtime subscription
  useEffect(() => {
    if (!barberId) return;

    const supabase = createClient();
    const channel = supabase
      .channel("barber-bookings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
          filter: `barber_id=eq.${barberId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("bookings")
            .select("*, services(name, price)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setBookings((prev) => [data, ...prev]);
            const time = new Date(data.appointment_time).toLocaleTimeString(
              "en-IN",
              { hour: "2-digit", minute: "2-digit", hour12: true }
            );
            addToast(
              `${data.customer_name} booked ${data.services?.name ?? "a service"} at ${time}`
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [barberId, addToast]);

  function handleStatusChange(bookingId: string, newStatus: Booking["status"]) {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("barber_session");
    router.push("/barber");
  }

  const todayCount = bookings.filter((b) => {
    const d = new Date(b.appointment_time);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }).length;

  if (!barberId) return null;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-neutral-200 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/"
              className="font-mono text-sm uppercase tracking-widest hover:text-amber-500 transition-colors flex-shrink-0"
            >
              {t("appName")}
            </Link>
            <span className="text-neutral-300 flex-shrink-0">/</span>
            <span className="font-mono text-sm text-neutral-500 truncate">
              {barberName}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              {t("logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full">
        {/* Stats + filter row */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <h1 className="font-mono text-lg uppercase tracking-wider">
              {t("yourBookings")}
            </h1>
            <span className="font-mono text-xs bg-amber-500 text-white px-2 py-0.5">
              {todayCount} {t("todayBadge")}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setDateFilter("all")}
              className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
                dateFilter === "all"
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {t("allFilter")}
            </button>
            <button
              onClick={() => setDateFilter("today")}
              className={`font-mono text-xs px-3 py-1.5 border transition-colors ${
                dateFilter === "today"
                  ? "bg-black text-white border-black"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              {t("todayFilter")}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20 font-mono text-sm text-neutral-400">
              {t("loadingBookings")}
            </div>
          ) : error ? (
            <div className="py-8 font-mono text-sm text-red-500 border border-red-200 px-4">
              {error}
            </div>
          ) : (
            <BookingsTable
              bookings={bookings}
              onRowClick={setSelectedBooking}
            />
          )}
        </div>
      </main>

      {/* Slider */}
      <CustomerSlider
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
