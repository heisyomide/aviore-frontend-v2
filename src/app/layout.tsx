import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
// Core Providers
import { Providers } from "../components/providers/Provider";
import { CartSyncProvider } from "../components/providers/CartSyncProvider";
import { CartToast } from '@/src/components/product/CartToast';

// UI Components
import { BackToTop } from "../components/ui/BackToTop";

// Global Error Handler (NEW)
import GlobalErrorHandler from "../components/GlobalErrorHandler";

// Font Configuration
const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: 'swap', 
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: 'swap',
});

// Metadata
export const metadata: Metadata = {
  title: {
    default: "Aviore Marketplace | Unique Artifacts & Global Deals",
    template: "%s | Aviore"
  },
  description: "Experience the ultimate discovery loop. Shop artifacts, electronics, and fashion with 90-day returns and secure payments.",
  keywords: ["e-commerce", "marketplace", "artifacts", "deals", "industrial shopping", "Aviore"],
  icons: { icon: "/favicon.ico" },
};

// Viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, 
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          {/* Global Error Logger - Captures ALL uncaught errors and promise rejections */}
          <GlobalErrorHandler />

          {/* Cart Sync Provider */}
          <CartSyncProvider />

          <div className="relative flex min-h-screen flex-col">
            {/* Main Content */}
            <main className="flex-1">
              {children}
              <CartToast />
                    <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#18181b',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '12px',
          },
        }}
      />

            </main>

            {/* Global Utilities */}
            <BackToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}