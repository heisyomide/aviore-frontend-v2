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
  metadataBase: new URL('https://shopaviore.com'),

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
      url: 'https://shopaviore.com',
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
    url: 'https://shopaviore.com',
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
    ],

  

    apple: [
      {
        url: '/appicon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },

  manifest: '/site.webmanifest',

  category: 'shopping',
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