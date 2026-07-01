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
        
        <div className="hidden md:flex flex-col text-left leading-none justify-center">
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">
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
        <div className={`absolute right-0 top-full mt-3 z-[500] animate-in fade-in zoom-in-95 duration-200 ${isCustomerView ? 'w-[340px]' : 'w-76'}`}>
          <div className="bg-white border border-gray-100/80 shadow-[0_30px_70px_rgba(0,0,0,0.18)] rounded-[2.25rem] overflow-hidden text-slate-900">
            
            {/* ─── CASE A: CUSTOMER OR GUEST VIEW (As Seen in Live Reference File) ─── */}
            {isCustomerView ? (
              <div>
                {/* Profile Identity Header Block */}
                <div className="p-6 border-b border-gray-100 bg-slate-50/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-[#A4143D] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md shadow-[#A4143D]/10 tracking-widest">
                      {isLoggedIn ? initials : "AV"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-[1000] text-sm text-slate-900 uppercase tracking-tighter leading-none">
                        {isLoggedIn ? `${firstName} ${lastName}` : "Aviorè Identity"}
                      </p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mt-1.5 leading-none">
                        {isLoggedIn ? "Premium Member" : "Guest Mode"}
                      </p>
                    </div>
                  </div>

                  {isLoggedIn && (
                    <Link 
                      href="/dashboard/messages" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200/80 bg-white active:scale-95 transition-all shrink-0 shadow-sm"
                    >
                      <MessageSquare size={13} className="text-gray-400" />
                      <span className="text-[9px] font-black uppercase text-slate-700 tracking-wider">Inbox</span>
                    </Link>
                  )}
                </div>

                {/* Macro Dashboard Action Layout Panel */}
                <div className="grid grid-cols-3 gap-1.5 p-4 border-b border-gray-100 bg-white">
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

                {/* Navigation Rows Lists */}
                <div className="p-3 bg-white space-y-0.5">
                  <MenuRowLink icon={<LayoutDashboard size={15} />} label="Customer Center" href={isLoggedIn ? basePath : '/login'} onClick={() => setIsOpen(false)} highlight />
                  
                  <div className="py-1">
                    <div className="h-px bg-gray-100 w-full" />
                  </div>

                  <MenuRowLink icon={<Star size={15} />} label="Your Reviews" href={isLoggedIn ? `${basePath}/reviews` : '/login'} onClick={() => setIsOpen(false)} />
                  <MenuRowLink icon={<History size={15} />} label="Browsing History" href="/history" onClick={() => setIsOpen(false)} />
                  <MenuRowLink icon={<MapPin size={15} />} label="Addresses" href={isLoggedIn ? `${basePath}/addresses` : '/login'} onClick={() => setIsOpen(false)} />
                  <MenuRowLink icon={<Settings size={15} />} label="Account Settings" href={isLoggedIn ? `${basePath}/security` : '/login'} onClick={() => setIsOpen(false)} />
                  <MenuRowLink icon={<ShieldAlert size={15} />} label="Support Line" href={isLoggedIn ? `${basePath}/support` : '/login'} onClick={() => setIsOpen(false)} />
                </div>

                {/* Auth Interactive Footer */}
                <div className="p-4 border-t border-gray-100 bg-white">
                  {!isLoggedIn ? (
                    <Link 
                      href="/login" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all active:scale-95 shadow-md"
                    >
                      <LogIn size={14} /> Open Session
                    </Link>
                  ) : (
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center justify-center gap-2 w-full py-3 text-red-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50/50 rounded-xl transition-all"
                    >
                      <LogOut size={13} /> Secure Logout
                    </button>
                  )}
                </div>
              </div>
            ) : (
              
              /* ─── CASE B: MERCHANT / ADMIN PLATFORM CONTROL MODE ─── */
              <div>
                <div className="p-6 border-b border-gray-100 bg-slate-50/50">
                  <p className="font-[1000] text-sm text-slate-900 uppercase tracking-tighter truncate leading-none">
                    {`${firstName} ${lastName}`}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="text-[8px] font-black text-white bg-[#A4143D] px-2.5 py-1 rounded-md uppercase tracking-[0.15em] leading-none">
                       {role} Engine
                     </span>
                  </div>
                </div>

                <div className="p-3 space-y-0.5 bg-white">
                  <Link 
                    href={basePath} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 text-slate-900 font-black transition-all group/link"
                  >
                    <div className="p-2 bg-gray-50 rounded-xl group-hover/link:bg-[#A4143D]/10 text-[#A4143D] transition-colors">
                      {role === 'admin' ? <ShieldCheck size={16} /> : <Store size={16} />}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.15em] font-black">
                      {role === 'admin' ? 'Admin Panel' : 'Store Center'}
                    </span>
                  </Link>

                  <Link 
                    href={`${basePath}/orders`} 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-gray-50 text-slate-600 font-bold transition-all group/link"
                  >
                    <div className="p-2 bg-white text-gray-400 group-hover/link:text-slate-900 transition-colors">
                      <Package size={16} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.15em] font-black">Manage Orders</span>
                  </Link>
                </div>

                <div className="p-4 border-t border-gray-100 bg-white">
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center justify-center gap-2.5 w-full py-3.5 border border-gray-200 hover:border-red-200 text-red-600 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50/30 rounded-xl transition-all"
                  >
                    <LogOut size={14} /> Close Dashboard
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

/* ─── ATOM COMPONENTS SPECIFIC TO DESIGN LAYOUTS ─── */

function MacroActionButton({ icon, label, href, onClick }: { icon: React.ReactNode; label: string; href: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex flex-col items-center justify-center text-center py-3 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-slate-50/50 active:scale-95 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-[#A4143D]/5 border border-gray-100/70 text-slate-700 group-hover:text-[#A4143D] flex items-center justify-center transition-colors mb-2">
        {icon}
      </div>
      <span className="text-[10px] font-[1000] uppercase tracking-wide text-slate-800 leading-none">{label}</span>
    </Link>
  )
}

function MenuRowLink({ icon, label, href, onClick, highlight = false }: { icon: React.ReactNode; label: string; href: string; onClick: () => void; highlight?: boolean }) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group text-left
        ${highlight ? 'bg-[#A4143D]/5 text-[#A4143D] hover:bg-[#A4143D]/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/60'}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`p-1.5 rounded-lg transition-colors shrink-0
          ${highlight ? 'bg-[#A4143D]/10 text-[#A4143D]' : 'bg-slate-50 border border-gray-100/50 text-gray-400 group-hover:text-slate-950 group-hover:bg-slate-100'}`}>
          {icon}
        </div>
        <span className="text-[10px] uppercase tracking-[0.12em] font-[900] truncate">{label}</span>
      </div>
    </Link>
  )
}