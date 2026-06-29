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
  ChevronDown,
  MessageSquare,
  Ticket,
  Wallet,
  History,
  MapPin,
  Settings,
  ShieldAlert
} from "lucide-react"

type Role = "admin" | "vendor" | "customer" | null

export function AccountMenu() {
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  
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

  // Determine if we should display the specialized customer hybrid architecture
  const isCustomerView = !isLoggedIn || role === 'customer'

  return (
    <div className="relative" ref={menuRef}>
      {/* 🔘 TRIGGER BAR */}
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
            <span className="text-[11px] font-[1000] uppercase tracking-tighter text-slate-900">Account</span>
            <ChevronDown size={10} className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* 🚀 DROPDOWN ROUTER INTERFACE */}
      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 z-[500] animate-in fade-in zoom-in-95 duration-200 ${isCustomerView ? 'w-80' : 'w-72'}`}>
          <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] overflow-hidden text-slate-900">
            
            {/* ─── CASE A: CUSTOMER OR GUEST VIEW (Hybrid Sheet Approach) ─── */}
            {isCustomerView ? (
              <div>
                {/* Identity Header */}
                <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#A4143D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-[#A4143D]/10">
                      {isLoggedIn ? initials : "AV"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-[1000] text-sm text-slate-900 uppercase tracking-tighter truncate">
                        {isLoggedIn ? `${firstName} ${lastName}` : "Aviorè Identity"}
                      </p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mt-0.5">
                        {isLoggedIn ? "Premium Member" : "Guest Mode"}
                      </p>
                    </div>
                  </div>

                  {isLoggedIn && (
                    <Link 
                      href="/dashboard/messages" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white active:scale-95 transition-all shrink-0"
                    >
                      <MessageSquare size={12} className="text-gray-500" />
                      <span className="text-[9px] font-black uppercase text-slate-700 tracking-wider">Inbox</span>
                    </Link>
                  )}
                </div>

                {/* 3 Top Macro Action Grid (Conditional upon login status) */}
                <div className="grid grid-cols-3 gap-1 p-3 border-b border-gray-50 bg-white">
                  <MacroActionButton 
                    icon={<Package size={18} />} 
                    label="Orders" 
                    href={isLoggedIn ? `${basePath}/orders` : '/login'} 
                    onClick={() => setIsOpen(false)} 
                  />
                  <MacroActionButton 
                    icon={<Ticket size={18} />} 
                    label="Coupons" 
                    href={isLoggedIn ? `${basePath}/coupons` : '/login'} 
                    onClick={() => setIsOpen(false)} 
                  />
                  <MacroActionButton 
                    icon={<Wallet size={18} />} 
                    label="Balance" 
                    href={isLoggedIn ? `${basePath}/balance` : '/login'} 
                    onClick={() => setIsOpen(false)} 
                  />
                </div>

                {/* Navigation Context Links Segments */}
                <div className="p-2 divide-y divide-gray-50">
                  <div className="space-y-0.5 pb-1.5">
                    <MenuRowLink icon={<LayoutDashboard size={15} />} label="Customer Center" href={isLoggedIn ? basePath : '/login'} onClick={() => setIsOpen(false)} highlight />
                    <MenuRowLink icon={<Star size={15} />} label="Your Reviews" href={isLoggedIn ? `${basePath}/reviews` : '/login'} onClick={() => setIsOpen(false)} />
                    <MenuRowLink icon={<History size={15} />} label="Browsing Vault" href="/history" onClick={() => setIsOpen(false)} />
                  </div>
                  <div className="space-y-0.5 pt-1.5">
                    <MenuRowLink icon={<MapPin size={15} />} label="Addresses" href={isLoggedIn ? `${basePath}/addresses` : '/login'} onClick={() => setIsOpen(false)} />
                    <MenuRowLink icon={<Settings size={15} />} label="Account Settings" href={isLoggedIn ? `${basePath}/settings` : '/login'} onClick={() => setIsOpen(false)} />
                    <MenuRowLink icon={<ShieldAlert size={15} />} label="Support Line" href={isLoggedIn ? `${basePath}/support` : '/login'} onClick={() => setIsOpen(false)} />
                  </div>
                </div>

                {/* Auth Bottom Anchor */}
                <div className="p-3 border-t border-gray-50 bg-white">
                  {!isLoggedIn ? (
                    <Link 
                      href="/login" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all"
                    >
                      <LogIn size={16} /> Open Session
                    </Link>
                  ) : (
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center justify-center gap-2 w-full py-2.5 text-red-600 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <LogOut size={14} /> Secure Logout
                    </button>
                  )}
                </div>
              </div>
            ) : (
              
             
              <div>
                
                <div className="p-6 border-b border-gray-50 bg-slate-50/50">
                  <p className="font-[1000] text-sm text-slate-900 uppercase tracking-tighter truncate">
                    {`${firstName} ${lastName}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[9px] font-black text-white bg-[#A4143D] px-2 py-0.5 rounded-full uppercase tracking-widest">
                       {role}
                     </span>
                  </div>
                </div>

                
                <div className="p-3 space-y-1">
                  <Link 
                    href={basePath} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 text-slate-900 font-black transition-all group/link"
                  >
                    <div className="p-2 bg-gray-50 rounded-lg group-hover/link:bg-[#A4143D]/10 transition-colors">
                      {role === 'admin' ? <ShieldCheck size={18} className="text-[#A4143D]" /> : <Store size={18} className="text-[#A4143D]" />}
                    </div>
                    <span className="text-[11px] uppercase tracking-widest">
                      {role === 'admin' ? 'Admin Panel' : 'Store Center'}
                    </span>
                  </Link>

                  <Link href={`${basePath}/orders`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-gray-50 text-slate-600 font-bold transition-all group/link">
                    <Package size={18} className="text-gray-400 group-hover/link:text-slate-900" />
                    <span className="text-[11px] uppercase tracking-wide">Manage Orders</span>
                  </Link>
                </div>

                
                <div className="p-4 border-t border-gray-50 bg-white">
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center justify-center gap-3 w-full py-3 text-red-600 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <LogOut size={18} /> Secure Logout
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

/* ─── CUSTOMER ATOM UI COMPONENTS ─── */

function MacroActionButton({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex flex-col items-center justify-center text-center py-2 rounded-xl hover:bg-slate-50/80 active:scale-95 transition-all group">
      <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-[#A4143D]/5 border border-gray-100 text-slate-700 group-hover:text-[#A4143D] flex items-center justify-center transition-colors mb-1.5">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-800 leading-none">{label}</span>
    </Link>
  )
}

function MenuRowLink({ icon, label, href, onClick, highlight = false }: { icon: React.ReactNode; label: string; href: string; onClick: () => void; highlight?: boolean }) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all group text-left
        ${highlight ? 'bg-[#A4143D]/5 text-[#A4143D] hover:bg-[#A4143D]/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'}`}
    >
      <div className={`p-1.5 rounded-lg transition-colors
        ${highlight ? 'bg-[#A4143D]/10 text-[#A4143D]' : 'bg-slate-50 text-gray-400 group-hover:text-slate-900 group-hover:bg-slate-100'}`}>
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-wider font-extrabold">{label}</span>
    </Link>
  )
}