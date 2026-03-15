'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SummerSaleBanner() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const targetDate = new Date('2025-12-07T23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft('Sale Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#A4143D] text-white px-8 py-12 rounded-lg flex flex-col md:flex-row items-center justify-between gap-10">
      {/* Left Text Content */}
      <div className="max-w-lg">
        <h2 className="text-5xl font-bold mb-2">20% OFF</h2>
        <p className="text-xl font-semibold mb-1">FINE SMILE</p>
        <p className="text-sm mb-6">15 Nov to 7 Dec</p>

        <h3 className="text-3xl font-bold mb-2">Beats Solo Air</h3>
        <p className="text-xl mb-2">Summer Sale</p>
        <p className="text-sm mb-4">
          Company that's grown from 270 to 480 employees in the last 12 months.
        </p>

        <p className="text-lg font-semibold mb-4">Ends in: {timeLeft}</p>

        <button className="bg-white text-[#d70000] px-6 py-2 rounded font-semibold hover:bg-red-100 transition">
          Shop
        </button>
      </div>

      {/* Right Product Image with animation */}
      <div className="w-full max-w-sm animate-float">
        <Image
          src="/beats-headphones.png"
          alt="Beats Solo Air"
          width={400}
          height={400}
          className="object-contain"
          priority
        />
      </div>
    </section>
  );
}