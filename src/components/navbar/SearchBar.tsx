import { Search } from "lucide-react"

export function SearchBar(){

return(

<div className="flex border rounded-full overflow-hidden">

<input
placeholder="Search products..."
className="flex-1 px-4 py-2 outline-none"
/>

<button className="bg-black text-white px-4">
<Search size={18}/>
</button>

</div>

)
}