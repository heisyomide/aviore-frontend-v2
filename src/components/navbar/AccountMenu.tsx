'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import {
  User,
  Package,
  Star,
  LogOut,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  Store,
  ChevronDown
} from "lucide-react"

type Role = "admin" | "vendor" | "customer" | null

export function AccountMenu() {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  
  // 🚀 STATE FOR MOBILE & DESKTOP INTERACTION
  const [isOpen, setIsOpen] = useState(false)
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

    // 🚀 CLOSE ON CLICK OUTSIDE
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    setIsLoggedIn(false)
    setRole(null)
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

  const getBasePath = () => {
    if (role === 'admin') return '/admin'
    if (role === 'vendor') return '/vendor'
    return '/dashboard'
  }

  const basePath = getBasePath()
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      {/* 🔘 TRIGGER: Now uses onClick for Mobile Support */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 group outline-none active:scale-95 transition-transform"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[10px] transition-all border-2 
          ${isLoggedIn 
            ? 'bg-[#A4143D] border-[#A4143D] text-white shadow-lg shadow-[#A4143D]/20' 
            : 'bg-white border-gray-100 text-gray-400'}`}>
          {isLoggedIn ? initials : <User size={18} strokeWidth={2.5} />}
        </div>
        
        <div className="hidden md:flex flex-col text-left leading-tight">
          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-400">
            {isLoggedIn ? `Hello, ${firstName}` : "Welcome"}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-[1000] uppercase tracking-tighter">Account</span>
            <ChevronDown size={10} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* 🚀 DROPDOWN: Uses conditional rendering instead of group-hover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 z-[500] animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden">
            
            {/* TOP IDENTITY SECTION */}
            <div className="p-6 border-b border-gray-50 bg-slate-50/50">
              <p className="font-[1000] text-sm text-slate-900 uppercase tracking-tighter truncate">
                {isLoggedIn ? `${firstName} ${lastName}` : "Aviorè Identity"}
              </p>
              {isLoggedIn && (
                <div className="flex items-center gap-2 mt-1">
                   <span className="text-[9px] font-black text-white bg-[#A4143D] px-2 py-0.5 rounded-full uppercase tracking-widest">
                     {role}
                   </span>
                </div>
              )}
            </div>

            {/* 🎯 MENU LINKS */}
            <div className="p-3 space-y-1">
              <Link 
                href={isLoggedIn ? basePath : '/login'} 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 text-slate-900 font-black transition-all group/link"
              >
                <div className="p-2 bg-gray-50 rounded-lg group-hover/link:bg-[#A4143D]/10 transition-colors">
                    {role === 'admin' ? <ShieldCheck size={18} className="text-[#A4143D]" /> : 
                     role === 'vendor' ? <Store size={18} className="text-[#A4143D]" /> : 
                     <LayoutDashboard size={18} className="text-[#A4143D]" />}
                </div>
                <span className="text-[11px] uppercase tracking-widest">
                  {role === 'admin' ? 'Admin Panel' : role === 'vendor' ? 'Store Center' : 'Dashboard'}
                </span>
              </Link>

              <Link href={`${basePath}/orders`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 text-slate-600 font-bold transition-all group/link">
                <Package size={18} className="text-gray-400 group-hover/link:text-slate-900" />
                <span className="text-[11px] uppercase tracking-wide">Manage Orders</span>
              </Link>

              {role !== 'admin' && (
                <Link href={`${basePath}/reviews`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 text-slate-600 font-bold transition-all group/link">
                  <Star size={18} className="text-gray-400 group-hover/link:text-slate-900" />
                  <span className="text-[11px] uppercase tracking-wide">Reviews</span>
                </Link>
              )}
            </div>

            {/* BOTTOM ACTION */}
            <div className="p-4 border-t border-gray-50 bg-white">
              {!isLoggedIn ? (
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                >
                  <LogIn size={18} /> Sign In
                </Link>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="flex items-center justify-center gap-3 w-full py-3 text-red-600 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
                >
                  <LogOut size={18} /> Secure Logout
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}