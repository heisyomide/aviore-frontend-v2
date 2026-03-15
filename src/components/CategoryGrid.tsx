'use client';

const categories = [
  { name: 'Fruits & Veg', icon: '🍎' },
  { name: 'Breads & Sweets', icon: '🍞' },
  { name: 'Frozen Foods', icon: '❄️' },
  { name: 'Raw Meats', icon: '🥩' },
  { name: 'Drinks', icon: '🍷' },
  { name: 'Dairy', icon: '🥛' },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <div 
          key={cat.name} 
          className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition cursor-pointer"
        >
          <span className="text-4xl mb-3">{cat.icon}</span>
          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
        </div>
      ))}
    </div>
  );
}