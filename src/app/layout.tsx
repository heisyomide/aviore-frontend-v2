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

// PWA Engine Controller Injection
import PwaManager from "@/src/components/pwa/PwaManager"; // 🌟 ADDED

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

// Metadata Ecosystem Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://shopaviore.store'),

  title: {
    default: 'Aviorè Marketplace | Global Shopping, Fashion & Luxury Deals',
    template: '%s | Aviorè',
  },

  description:
    'Shop fashion, beauty, gadgets, accessories, luxury items and trending global products on Aviorè Marketplace. Secure payments, trusted vendors, fast delivery and premium shopping experience.',

  keywords: [
    'Aviorè',
    'Aviorè Marketplace',
    'Nigeria marketplace',
    'online shopping',
    'fashion',
    'beauty',
    'electronics',
    'gadgets',
    'luxury marketplace',
    'vendor storefront',
    'global deals',
    'secure shopping',
    'marketplace Nigeria',
    'buy online',
    'sell online',
  ],

  authors: [
    {
      name: 'Aviorè',
      url: 'https://shopaviore.store',
    },
  ],

  creator: 'Aviorè',
  publisher: 'Aviorè',

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shopaviore.store',
    siteName: 'Aviorè',
    title: 'Aviorè Marketplace',
    description:
      'Discover trending fashion, gadgets, beauty products and global marketplace deals on Aviorè.',
    images: [
      {
        url: '/appicon.png',
        width: 1200,
        height: 630,
        alt: 'Aviorè Marketplace',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Aviorè Marketplace',
    description:
      'Fashion, beauty, electronics & luxury deals from trusted vendors.',
    images: ['/appicon.png'],
    creator: '@aviorè',
  },

  icons: {
    icon: [
      { url: '/appicon.png' },
      { url: '/appicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' }, // 🌟 ADDED FOR PWA
    ],
    apple: [
      {
        url: '/icons/icon-512.png', // 🌟 ADDED FOR iOS HIGH-RES APPS
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },

  // 🌟 FIXED: Points to /manifest.json to match your build output precisely
  manifest: '/manifest.json',

  // 🌟 ADDED: Tells iOS Safari to remove mobile navigation chrome layout panels
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aviorè",
  },

  category: 'shopping',
};

// Viewport Setup for Ultra Fluid Mobile Controls
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // 🌟 ADDED: Integrates smoothly with mobile notch boundaries
  themeColor: "#0a0a0a", // 🌟 ADDED: Matches luxury dark background fallback aesthetics
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

                {/* Global UI Elements */}
                <CartToast />
                <BackToTop />
              </div>

            </CartSyncProvider>
          </WishlistProvider>

          {/* Global Toast System */}
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
                transform: "translateY(env(safe-area-inset-top, 0px))" // 🌟 FIXED: Flattened directly onto the parent style object
              },
            }}
          />

          {/* 🌟 INJECTED: Handles offline mode, updates, and custom install prompts globally */}
          <PwaManager />
        </Providers>
      </body>
    </html>
  );
}