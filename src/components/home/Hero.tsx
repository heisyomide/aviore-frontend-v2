import Image from "next/image";
import { Container } from "../layout/Container";

export function Hero() {
  return (
    <section className="bg-white py-4 md:py-6">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[480px]">
          
          {/* Main Slider Area (8/12 columns) */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-gray-100 group shadow-sm">
            <Image 
              src="/registry/categories/hero.jpg" 
              alt="Promotional Banner" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8 md:p-12">
              <span className="text-yellow-400 font-black uppercase tracking-[0.3em] text-xs mb-4">Limited Time Offer</span>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-none mb-6 italic uppercase tracking-tighter">
                Big Savings <br /> On Artifacts
              </h1>
              <button className="w-fit bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors active:scale-95">
                Shop The Drop
              </button>
            </div>
          </div>

          {/* Side Banners (4/12 columns) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="relative rounded-2xl overflow-hidden h-[200px] lg:h-full bg-orange-500 border-4 border-orange-100">
               <Image src="/categories/side1.jpg" alt="Deal 1" fill className="object-cover" />
               <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Flash Discount</p>
                  <p className="text-sm font-black text-orange-600">UP TO 70% OFF</p>
               </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-[200px] lg:h-full bg-zinc-900 border-4 border-zinc-100 hidden lg:block">
               <Image src="/categories/arrival.jpg" alt="Deal 2" fill className="object-cover opacity-80" />
               <div className="absolute top-4 left-4">
                  <p className="text-white font-black text-lg italic tracking-tighter uppercase">New Arrivals</p>
               </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}