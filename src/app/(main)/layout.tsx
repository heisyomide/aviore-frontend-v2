// src/app/(storefront)/layout.tsx
import { Navbar } from "@/src/components/navbar/Navbar";
import { Footer } from "@/src/components/Footer";
import { MobileBottomNav } from "@/src/components/navbar/MobileBottomNav";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <MobileBottomNav />
      <Footer />
    </>
  );
}