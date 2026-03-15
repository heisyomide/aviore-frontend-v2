'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const slides = [
  { id: 1, title: "Ramadan Sale", sub: "Up to 90% OFF", btn: "Shop Now", link: "/sale", img: "/ramadan.png", promo: { title: "Flash Deal", desc: "Limited time offer" } },
  { id: 2, title: "Become a Vendor", sub: "Join Aviore Today", btn: "Register", link: "/vendor", img: "/vendor.PNG", promo: { title: "Earn More", desc: "Sell to millions" } },
  { id: 3, title: "Tech Gadgets", sub: "Clearance Sale", btn: "View Deals", link: "/tech", img: "/bann.jpg", promo: { title: "Hot Picks", desc: "Top tech items" } },
  { id: 4, title: "Fashion Finds", sub: "Extra 20% OFF", btn: "Shop Now", link: "/fashion", img: "/fash.jpg", promo: { title: "New Styles", desc: "Weekly arrivals" } },
  { id: 5, title: "Home Essentials", sub: "Best Prices", btn: "Explore", link: "/home", img: "/home.jpg", promo: { title: "Home Decor", desc: "Upgrade your space" } },
];

export function HeroSection() {
  const router = useRouter();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
  }, [emblaApi]);

  const activeSlide = slides[selectedIndex];

  return (
    <section className="max-w-[1400px] mx-auto px-6 my-4 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[320px]">
      
      {/* LEFT: Carousel (Main Hero) */}
      <div className="lg:col-span-9 rounded-2xl overflow-hidden relative shadow-lg" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] relative h-full">
              {/* Background Image */}
              <Image 
                src={slide.img} 
                alt={slide.title} 
                fill 
                className="object-cover" 
                priority
              />
              {/* Dark Overlay for readability */}
              <div className="absolute inset-0 bg-black/30" />
              
              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col justify-center px-12 z-10">
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  {slide.title}<br/><span className="text-yellow-300">{slide.sub}</span>
                </h1>
                <button 
                  onClick={() => router.push(slide.link)}
                  className="mt-6 bg-[#f26522] text-white px-8 py-3 rounded-full font-bold w-fit hover:scale-105 transition-transform"
                >
                  {slide.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Synchronized Promo */}
      <div className="hidden lg:flex lg:col-span-3 flex-col gap-4">
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <span className="text-xs font-bold text-[#A4143D] uppercase tracking-wider mb-1">Recommended</span>
          <h3 className="text-lg font-black text-gray-900 mb-2">{activeSlide.promo.title}</h3>
          <p className="text-sm text-gray-500 mb-4">{activeSlide.promo.desc}</p>
          <button 
            onClick={() => router.push(activeSlide.link)}
            className="text-sm font-bold text-[#A4143D] border border-[#A4143D] px-4 py-2 rounded-full hover:bg-[#A4143D] hover:text-white transition"
          >
            Check it out
          </button>
        </div>
      </div>
    </section>
  );
}