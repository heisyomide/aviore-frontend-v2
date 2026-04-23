import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🚀 Core Infrastructure
import { Providers } from "../components/providers/Provider";
import { CartSyncProvider } from "../components/providers/CartSyncProvider";
import { CartToast } from '@/src/components/product/CartToast';

// 🚀 UI Hierarchy

import { BackToTop } from "../components/ui/BackToTop";



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
        bg-[#FAFAFA] 
        text-zinc-900
        selection:bg-blue-600 selection:text-white
      `}>
        <Providers>
          {/* 🛰️ REGISTRY_HANDSHAKE: Keeps Laptop & Phone in sync via NestJS */}
          <CartSyncProvider />

          <div className="relative flex min-h-screen flex-col">


            {/* 2. Main Stage (Registry Content) */}
            <main className="flex-1">
              {children}
              <CartToast /> {/* It will only render when needed. */}
            </main>

     
            {/* 5. Global Utility Tools */}
            <BackToTop />
            
          </div>
        </Providers>
      </body>
    </html>
  );
}