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
    <div className="min-h-screen bg-slate-100">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex">
          <AdminSidebar />
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <aside className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-2xl lg:hidden">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <h2 className="text-lg font-bold">Aviorè Admin</h2>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <AdminSidebar />
            </aside>
          </>
        )}

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 xl:px-8">
              {/* Left */}
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
                >
                  <Menu size={22} />
                </button>

                <div className="hidden md:block relative w-full max-w-lg">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    placeholder="Search users, products, vendors, orders..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2 md:gap-3">
                <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100">
                  <Bell size={20} />

                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
                </button>

                <button className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100">
                  <Moon size={20} />
                </button>

                <div className="hidden h-8 w-px bg-slate-200 md:block" />

                <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700 md:inline-flex">
                  ● System Live
                </span>

                <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white">
                    A
                  </div>

                  <div className="hidden text-left lg:block">
                    <p className="text-sm font-semibold text-slate-800">
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
            <div className="border-t border-slate-100 px-4 pb-4 pt-3 md:hidden">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1800px] p-4 md:p-6 xl:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}