'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  User,
  Package,
  Star,
  MapPin,
  History,
  Ticket,
  LogOut,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  Store
} from "lucide-react"

type Role = "admin" | "vendor" | "customer" | null

export function AccountMenu() {
  const router = useRouter()
  const [role, setRole] = useState<Role>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
      setRole(localStorage.getItem("role") as Role)
      setFirstName(localStorage.getItem("firstName") || "")
      setLastName(localStorage.getItem("lastName") || "")
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    setRole(null)
    router.push("/")
  }

  // 🚀 PATH DYNAMIC LOGIC
  // This ensures the links change based on who is logged in
  const getBasePath = () => {
    if (role === 'admin') return '/admin'
    if (role === 'vendor') return '/vendor'
    return '/dashboard' // Default for customer
  }

  const basePath = getBasePath()

  return (
    <div className="relative group">
      {/* TRIGGER BUTTON */}
      <button className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all ${isLoggedIn ? 'bg-[#A4143D] text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
          {isLoggedIn ? `${firstName?.[0]}${lastName?.[0]}` : <User size={18} />}
        </div>
        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {isLoggedIn ? `Hello, ${firstName}` : "Sign In"}
          </span>
          <span className="text-xs font-bold uppercase tracking-tighter">Account</span>
        </div>
      </button>

      {/* DROPDOWN */}
      <div className="absolute right-0 top-full hidden group-hover:block w-72 pt-2 z-50">
        <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden">
          
          {/* TOP IDENTITY SECTION */}
          <div className="p-5 border-b border-gray-50 bg-gray-50/50">
            <p className="font-black text-sm text-slate-900 uppercase tracking-tighter truncate">
              {isLoggedIn ? `${firstName} ${lastName}` : "Welcome to Aviorè"}
            </p>
            <div className="flex items-center gap-2 mt-1">
               {isLoggedIn && (
                 <span className="text-[9px] font-black text-[#A4143D] bg-[#A4143D]/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                   {role} Account
                 </span>
               )}
            </div>
          </div>

          {/* 🎯 DYNAMIC MENU LINKS */}
          <div className="p-2 space-y-1">
            {/* Dashboard Redirect: Admin Panel, Vendor Dashboard, or Customer Overview */}
            <Link href={basePath} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-[#A4143D] font-black group/link transition-all">
              {role === 'admin' ? <ShieldCheck size={18} /> : role === 'vendor' ? <Store size={18} /> : <LayoutDashboard size={18} />}
              <span className="text-[11px] uppercase tracking-wide">
                {role === 'admin' ? 'Admin Control' : role === 'vendor' ? 'Vendor Center' : 'My Account'}
              </span>
            </Link>

            {/* Orders Link: /admin/orders, /vendor/orders, or /dashboard/orders */}
            <Link href={`${basePath}/orders`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-slate-600 font-bold group/link transition-all">
              <Package size={18} className="text-gray-400 group-hover/link:text-slate-900" />
              <span className="text-[11px] uppercase tracking-wide">Manage Orders</span>
            </Link>

            {/* Profile Link: /admin/profile, /vendor/profile, or /dashboard/profile */}
            <Link href={`${basePath}/profile`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-slate-600 font-bold group/link transition-all">
              <User size={18} className="text-gray-400 group-hover/link:text-slate-900" />
              <span className="text-[11px] uppercase tracking-wide">Profile Settings</span>
            </Link>

            {/* Conditional Reviews (Vendors/Customers only) */}
            {role !== 'admin' && (
              <Link href={`${basePath}/reviews`} className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-50 text-slate-600 font-bold group/link transition-all">
                <Star size={18} className="text-gray-400 group-hover/link:text-slate-900" />
                <span className="text-[11px] uppercase tracking-wide">
                  {role === 'vendor' ? 'Store Reviews' : 'My Reviews'}
                </span>
              </Link>
            )}
          </div>

          {/* BOTTOM ACTION */}
          <div className="p-4 border-t border-gray-50 bg-white">
            {!isLoggedIn ? (
              <Link href="/login" className="flex items-center justify-center gap-3 w-full py-3 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-all">
                <LogIn size={18} /> Sign In Safely
              </Link>
            ) : (
              <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2 text-red-600 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-xl transition-all">
                <LogOut size={18} /> Secure Logout
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}