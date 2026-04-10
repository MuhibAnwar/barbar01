"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-xs uppercase tracking-widest text-neutral-500"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          "w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-2",
          "text-sm text-black placeholder-neutral-400 outline-none",
          "focus:border-b-2 focus:border-amber-500 transition-all duration-150",
          error ? "border-red-500" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="font-mono text-xs uppercase tracking-widest text-neutral-500"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={3}
        className={[
          "w-full bg-transparent border border-neutral-300 px-3 py-2",
          "text-sm text-black placeholder-neutral-400 outline-none resize-none",
          "focus:border-amber-500 transition-all duration-150",
          error ? "border-red-500" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-mono">{error}</p>}
    </div>
  );
}
