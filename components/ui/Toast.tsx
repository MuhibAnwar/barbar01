"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Mount animation
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 4s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 bg-black text-white px-4 py-3 border-l-4 border-amber-500
        transition-all duration-300 max-w-xs w-full shadow-sm
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
    >
      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
      <p className="text-sm font-mono flex-1">{toast.message}</p>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="text-neutral-400 hover:text-white transition-colors flex-shrink-0"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
