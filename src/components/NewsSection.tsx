'use client';

import Image from 'next/image';
import Section from '../components/Section';

const newsItems = [
  {
    id: 1,
    title: 'How to choose perfect gadgets',
    date: 'October 5, 2019',
    excerpt: 'Learn how to pick the right tech for your lifestyle.',
    image: '/images/news-smartwatch.png',
  },
  {
    id: 2,
    title: 'How to choose perfect gadgets',
    date: 'October 5, 2019',
    excerpt: 'Compare laptops and smartphones for productivity.',
    image: '/images/news-laptop-phone.png',
  },
  {
    id: 3,
    title: 'How to choose perfect gadgets',
    date: 'October 5, 2019',
    excerpt: 'Explore innovations in wearable health tech.',
    image: '/images/news-lab-coat.png',
  },
];

export default function RecentNewsSection() {
  return (
    <Section title="Recent News" className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border p-4 hover:shadow-lg transition-all duration-300"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={300}
              height={200}
              className="rounded mb-4 object-cover w-full h-auto"
            />
            <h3 className="text-lg font-semibold text-[#3a2f1b] mb-1">{item.title}</h3>
            <p className="text-sm text-[#7a6e57] mb-2">{item.date}</p>
            <p className="text-sm text-[#7a6e57] mb-4">{item.excerpt}</p>
            <button className="bg-[#bfa76f] text-white px-4 py-2 rounded hover:bg-[#a68e5a] transition">
              Read More
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}