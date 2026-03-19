// src/components/home/TrustBar.tsx
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import { Container } from "../layout/Container";

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: "Secure Payment", desc: "Encrypted checkout" },
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide shipping" },
  { icon: RotateCcw, title: "90 Days Return", desc: "Easy money back" },
  { icon: Headphones, title: "24/7 Support", desc: "Dedicated team" }
];

export function TrustBar() {
  return (
    <div className="bg-gray-50 border-y border-gray-100 py-12">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 mb-4 transition-transform group-hover:-translate-y-1">
                <item.icon size={20} className="text-[#A4143D]" />
              </div>
              <h4 className="text-xs font-black uppercase text-gray-800 tracking-tight">{item.title}</h4>
              <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}