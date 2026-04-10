import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAProvider from "@/components/pwa/PWAProvider";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
  title: "BarberBook",
  description: "Book your barber appointment instantly.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BarberBook",
  },
  icons: {
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180" }],
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Anti-flash: set dir/lang from localStorage before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=localStorage.getItem('barberbook_lang')||'en';document.documentElement.setAttribute('dir',l==='ur'?'rtl':'ltr');document.documentElement.setAttribute('lang',l);})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="BarberBook" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icons/icon-192.png"
        />
        <link
          rel="dns-prefetch"
          href="https://ryysbkfabkcvjmzzmiso.supabase.co"
        />
        <link
          rel="preconnect"
          href="https://ryysbkfabkcvjmzzmiso.supabase.co"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ClientLayout>
          <PWAProvider />
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
