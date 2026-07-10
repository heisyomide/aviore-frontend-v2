// app/admin/layout.tsx

'use client';

import { useState } from 'react';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import {
  Menu,
  Search,
  Bell,
  Moon,
  X,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased flex flex-col">
      <div className="flex flex-1 relative min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex sticky top-0 h-screen shrink-0">
          <AdminSidebar />
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <>
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            <aside className="fixed left-0 top-0 z-50 h-screen w-72 bg-white border-r border-slate-200 shadow-2xl lg:hidden">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <div>
                  <h2 className="text-lg font-black tracking-wide">
                    Aviorè
                  </h2>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Admin Suite
                  </p>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <AdminSidebar />
            </aside>
          </>
        )}

        {/* Main */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
            <div className="h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between">
              {/* Left */}
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden rounded-xl p-2 hover:bg-slate-100"
                >
                  <Menu size={22} />
                </button>

                <div className="hidden md:block">
                  <p className="text-xs font-mono text-slate-500">
                    Workspace / Administration Console
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <button className="relative rounded-xl p-2.5 hover:bg-slate-100 transition">
                  <Bell size={20} className="text-slate-500" />

                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
                </button>

                <button className="rounded-xl p-2.5 hover:bg-slate-100 transition">
                  <Moon
                    size={20}
                    className="text-slate-500"
                  />
                </button>

                <div className="hidden sm:flex h-8 w-px bg-slate-200" />

                <span className="hidden md:inline-flex rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                  ● System Live
                </span>

                <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm hover:bg-slate-50 transition">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center font-bold text-white">
                    A
                  </div>

                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-semibold">
                      Administrator
                    </p>

                    <p className="text-xs text-slate-500">
                      Super Admin
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden border-t border-slate-100 px-4 pb-5 pt-4">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400"
                />
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block border-t border-slate-100 px-6 lg:px-8 py-4">
              <div className="relative max-w-xl">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search users, vendors, products, orders..."
                  className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400"
                />
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 w-full overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8 pb-24 md:pb-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}