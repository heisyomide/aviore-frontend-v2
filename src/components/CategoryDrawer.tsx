'use client';
import { useState } from 'react';

const categories = [
  "Fruits & Vegetables", "Breads & Sweets", "Frozen Seafoods", 
  "Raw Meats", "Wines & Alcohol", "Coffee & Tea", "Dairy & Eggs"
];

export function CategoryDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 p-6 transition-transform">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-xl text-blue-700">Categories</h2>
          <button onClick={onClose} className="text-2xl font-bold">&times;</button>
        </div>
        
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li key={cat} className="border-b pb-2 hover:text-blue-600 cursor-pointer transition">
              {cat}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}