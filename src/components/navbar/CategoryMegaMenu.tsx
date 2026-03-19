'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { CATEGORY_TREE } from "../../data/categories"

export function CategoryMegaMenu(){

const [activeCategory,setActiveCategory] = useState(CATEGORY_TREE[0])

return(

<div className="relative group">

<button className="flex items-center gap-1 font-semibold text-sm hover:text-orange-600">

Categories

<ChevronDown
size={14}
className="group-hover:rotate-180 transition"
/>

</button>

<div
className="absolute left-0 top-full hidden group-hover:flex
w-[900px] bg-white border shadow-xl rounded-xl
overflow-hidden z-50"
>

{/* LEFT CATEGORY LIST */}

<div className="w-[220px] bg-gray-50 border-r">

{CATEGORY_TREE.map(cat=>(
<button
key={cat.id}
onMouseEnter={()=>setActiveCategory(cat)}
className={`w-full text-left px-4 py-3 text-sm font-medium
${activeCategory.id===cat.id
? "bg-white text-orange-600"
: "hover:bg-gray-100"
}`}
>
{cat.name}
</button>
))}

</div>

{/* RIGHT GRID */}

<div className="flex-1 p-6">

<h3 className="font-bold text-lg mb-6">
Shop {activeCategory.name}
</h3>

<div className="grid grid-cols-3 gap-6">

{activeCategory.items.map(item=>(
<Link
key={item.name}
href={`/category/${item.name.toLowerCase()}`}
className="flex flex-col items-center gap-2 group"
>

<div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">

<Image
src={item.img}
alt={item.name}
fill
className="object-cover group-hover:scale-110 transition"
/>

</div>

<span className="text-xs font-medium text-center">
{item.name}
</span>

</Link>
))}

</div>

</div>

</div>

</div>

)
}