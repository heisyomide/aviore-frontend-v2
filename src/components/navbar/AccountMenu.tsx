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
LayoutDashboard
} from "lucide-react"

type Role = "admin" | "vendor" | "customer" | null

export function AccountMenu(){

const router = useRouter()

const [role,setRole] = useState<Role>(null)
const [firstName,setFirstName] = useState("")
const [lastName,setLastName] = useState("")

useEffect(()=>{

const token = localStorage.getItem("token")

if(token){

setRole(localStorage.getItem("role") as Role)

setFirstName(localStorage.getItem("firstName") || "")

setLastName(localStorage.getItem("lastName") || "")

}

},[])

const handleLogout = ()=>{

localStorage.removeItem("token")
localStorage.removeItem("role")
localStorage.removeItem("firstName")
localStorage.removeItem("lastName")

router.push("/")
}

const userInitials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}` || "U"

const roleMenus = {
admin:[
{label:"Admin Dashboard",href:"/admin/dashboard"},
],
vendor:[
{label:"Vendor Dashboard",href:"/vendor/dashboard"},
],
customer:[
{label:"Account Dashboard",href:"/dashboard"},
]
}

return(

<div className="relative group">

{/* ACCOUNT BUTTON */}

<button className="flex items-center gap-2">

<div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-sm">

{userInitials}

</div>

<div className="hidden md:flex flex-col text-left leading-tight">

<span className="text-xs text-gray-500">

Orders &

</span>

<span className="text-sm font-semibold">

Account

</span>

</div>

</button>

{/* DROPDOWN */}

<div
className="
absolute right-0 top-full
hidden group-hover:block
w-72 bg-white border shadow-xl rounded-xl
overflow-hidden z-50
"
>

{/* USER INFO */}

<div className="p-4 border-b">

<p className="font-semibold text-sm truncate">

{firstName ? `${firstName} ${lastName}` : "Guest"}

</p>

<p className="text-xs text-gray-500">

{role ?? "Not logged in"}

</p>

</div>

{/* MENU */}

<div className="p-2 text-sm">

<Link href="/dashboard/orders"
className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">

<Package size={16}/> Orders

</Link>

<Link href="/dashboard/reviews"
className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">

<Star size={16}/> Reviews

</Link>

<Link href="/dashboard/profile"
className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">

<User size={16}/> Profile

</Link>

<Link href="/dashboard/addresses"
className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">

<MapPin size={16}/> Addresses

</Link>

<Link href="/history"
className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">

<History size={16}/> Browsing History

</Link>

<Link href="/coupons"
className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">

<Ticket size={16}/> Coupons

</Link>

{/* ROLE MENU */}

{role && roleMenus[role]?.map(item=>(
<Link
key={item.label}
href={item.href}
className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-orange-600 font-semibold"
>

<LayoutDashboard size={16}/> {item.label}

</Link>
))}

{/* LOGOUT */}

<button
onClick={handleLogout}
className="
w-full flex items-center gap-3
px-3 py-3 mt-2
text-red-600 font-semibold
border-t hover:bg-red-50
"
>

<LogOut size={16}/> Sign out

</button>

</div>

</div>

</div>

)
}