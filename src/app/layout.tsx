import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 🚀 Components - Rule 2: Atomic Hierarchy
import { Providers } from "../components/Providers";
import { Navbar } from "../components/navbar/Navbar";
import { MobileBottomNav } from "../components/navbar/MobileBottomNav";
import { Container } from "../components/layout/Container";
import { BackToTop } from "../components/ui/BackToTop";
import { Footer } from "../components/Footer";

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"],
  display: 'swap', // Optimization for Rule 15
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono", 
  subsets: ["latin"],
  display: 'swap',
});

// 🚀 SEO & Metadata - Rule 9 (Trust Signals)
export const metadata: Metadata = {
  title: {
    default: "Aviore Marketplace | Unique Artifacts & Global Deals",
    template: "%s | Aviore Marketplace"
  },
  description: "Experience the ultimate discovery loop. Shop artifacts, electronics, and fashion with 90-day returns and secure payments.",
  keywords: ["e-commerce", "marketplace", "artifacts", "deals", "Temu clone", "Nigeria shopping"],
  authors: [{ name: "Aviore Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

// 🚀 Mobile Viewport Optimization
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents annoying zoom on input focus in iOS
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
        text-[#222] 
        selection:bg-[#A4143D] selection:text-white
      `}>
        <Providers>
          {/* 🚀 THE LAYOUT ENGINE 
            We keep the Navbar and Mobile Nav here so they are 
            persisted across page transitions.
          */}
          <div className="relative flex min-h-screen flex-col">
            
            {/* Global Navigation Hub */}
            <Navbar />

            {/* Page Content Area */}
            <main className="flex-1">
              {children}
            </main>

            {/* 🚀 STICKY MOBILE NAVIGATION 
              This follows Rule 13 (Mobile First). It is hidden on 
              Desktop via CSS within the component.
            */}
            <MobileBottomNav />

            <BackToTop />
            <Footer/>

            {/* Global Footer (Optional: You can add it here or in specific pages) */}
          </div>
        </Providers>
      </body>
    </html>
  );
}