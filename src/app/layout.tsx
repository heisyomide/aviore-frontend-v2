import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🚀 Core Infrastructure
import { Providers } from "../components/providers/Provider";
import { CartSyncProvider } from "../components/providers/CartSyncProvider";

// 🚀 UI Hierarchy - Rule 2: Atomic Hubs
import { Navbar } from "../components/navbar/Navbar";
import { MobileBottomNav } from "../components/navbar/MobileBottomNav";
import { BackToTop } from "../components/ui/BackToTop";
import { Footer } from "../components/Footer";

// 🏛️ Font Instrumentation
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

// 🏛️ Registry Metadata
export const metadata: Metadata = {
  title: {
    default: "Aviore Marketplace | Unique Artifacts & Global Deals",
    template: "%s | Aviore"
  },
  description: "Experience the ultimate discovery loop. Shop artifacts, electronics, and fashion with 90-day returns and secure payments.",
  keywords: ["e-commerce", "marketplace", "artifacts", "deals", "industrial shopping", "Aviore"],
  icons: { icon: "/favicon.ico" },
};

// 🏛️ Hardware Optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, 
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`
        ${geistSans.variable} 
        ${geistMono.variable} 
        antialiased 
        bg-white 
        text-zinc-900
        selection:bg-[#A4143D] selection:text-white
      `}>
        <Providers>
          {/* 🛰️ REGISTRY_HANDSHAKE: Background data sync with NestJS */}
          <CartSyncProvider />

          <div className="relative flex min-h-screen flex-col">
            {/* Navigation Hub */}
            

            {/* Main Stage */}
            <main className="flex-1">
              {children}
            </main>

            {/* Mobile Interaction Tier (Hidden on Desktop via CSS) */}
            

            {/* Global Instrumentation Tools */}
            <BackToTop />
            
          </div>
        </Providers>
      </body>
    </html>
  );
}