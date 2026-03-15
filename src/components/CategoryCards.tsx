'use client';
import Link from 'next/link';

const categories = [
  { name: 'Fresh Produce', icon: '🍎' },
  { name: 'Bakery', icon: '🍞' },
  { name: 'Dairy & Eggs', icon: '🥛' },
  { name: 'Meat & Seafood', icon: '🥩' },
  { name: 'Beverages', icon: '🥤' },
  { name: 'Snacks', icon: '🥨' },
];

export function CategoryCards() {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            href={`/category/${cat.name.toLowerCase().replace(' ', '-')}`}
            className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-md transition-all group"
          >
            <span className="text-4xl mb-3">{cat.icon}</span>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}