import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

// Providers
import { Providers } from "../components/providers/Provider";
import { CartSyncProvider } from "../components/providers/CartSyncProvider";
import { WishlistProvider } from "../components/providers/WishlistProvider";

// UI
import { BackToTop } from "../components/ui/BackToTop";
import { CartToast } from "@/src/components/product/CartToast";

// Error Handling
import GlobalErrorHandler from "../components/GlobalErrorHandler";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "Aviore Marketplace | Unique Artifacts & Global Deals",
    template: "%s | Aviore",
  },
  description:
    "Experience the ultimate discovery loop. Shop artifacts, electronics, and fashion with 90-day returns and secure payments.",
  keywords: [
    "e-commerce",
    "marketplace",
    "artifacts",
    "deals",
    "industrial shopping",
    "Aviore",
  ],
  icons: { icon: "/favicon.ico" },
};

// Viewport
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-[#FAFAFA]
          text-zinc-900
          selection:bg-blue-600 selection:text-white
        `}
      >
        <Providers>
          {/* Global Error Handling */}
          <GlobalErrorHandler />

          {/* Global State Providers (CLIENT SAFE) */}
          <WishlistProvider>
            <CartSyncProvider>

              {/* App Layout */}
              <div className="relative flex min-h-screen flex-col">
                
                {/* Main Content */}
                <main className="flex-1">
                  {children}
                </main>

                {/* Global UI */}
                <CartToast />
                <BackToTop />
              </div>

            </CartSyncProvider>
          </WishlistProvider>

          {/* Global Toast System */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#18181b",
                color: "#fff",
                borderRadius: "12px",
                fontSize: "12px",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}