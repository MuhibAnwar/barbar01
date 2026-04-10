"use client";

import { useEffect, useRef } from "react";

export default function QRSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    const bookUrl = `${window.location.origin}/book`;

    import("qrcode").then((QRCode) => {
      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, bookUrl, {
          width: 140,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        });
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 mt-2">
      <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
        Scan to Book
      </p>
      <div className="p-2 bg-white">
        <canvas ref={canvasRef} />
      </div>
      <p className="font-mono text-xs text-neutral-600">
        Or save to your home screen
      </p>
    </div>
  );
}
