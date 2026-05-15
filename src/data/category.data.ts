// src/data/category.data.ts

export interface CategoryItem {
  name: string;
  slug: string;
}

export interface CategoryGroup {
  name: string;
  slug: string;
  children: CategoryItem[];
}

export interface MarketplaceCategory {
  name: string;
  slug: string;
  banner: string;
  children: CategoryGroup[];
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategory[] = [
  {
    name: 'Fashion',
    slug: 'fashion',
    banner: '/banners/fashion.jpg',

    children: [
      {
        name: 'Women Fashion',
        slug: 'women-fashion',

        children: [
          { name: 'Dresses', slug: 'dresses' },
          { name: 'Tops', slug: 'tops' },
          { name: 'Jeans', slug: 'jeans' },
          { name: 'Skirts', slug: 'skirts' },
          { name: 'Two Piece Sets', slug: 'two-piece-sets' },
          { name: 'Lingerie', slug: 'lingerie' },
          { name: 'Abayas', slug: 'abayas' },
          { name: 'Jumpsuits', slug: 'jumpsuits' },
        ],
      },

      {
        name: 'Men Fashion',
        slug: 'men-fashion',

        children: [
          { name: 'Shirts', slug: 'shirts' },
          { name: 'T-Shirts', slug: 't-shirts' },
          { name: 'Jeans', slug: 'men-jeans' },
          { name: 'Native Wear', slug: 'native-wear' },
          { name: 'Trousers', slug: 'trousers' },
          { name: 'Suits', slug: 'suits' },
          { name: 'Shorts', slug: 'shorts' },
        ],
      },

      {
        name: 'Footwear',
        slug: 'footwear',

        children: [
          { name: 'Sneakers', slug: 'sneakers' },
          { name: 'Heels', slug: 'heels' },
          { name: 'Slides', slug: 'slides' },
          { name: 'Sandals', slug: 'sandals' },
          { name: 'Boots', slug: 'boots' },
        ],
      },

      {
        name: 'Bags',
        slug: 'bags',

        children: [
          { name: 'Handbags', slug: 'handbags' },
          { name: 'Crossbody Bags', slug: 'crossbody-bags' },
          { name: 'Backpacks', slug: 'backpacks' },
          { name: 'Wallets', slug: 'wallets' },
        ],
      },

      {
        name: 'Watches & Jewelry',
        slug: 'watches-jewelry',

        children: [
          { name: 'Watches', slug: 'watches' },
          { name: 'Necklaces', slug: 'necklaces' },
          { name: 'Bracelets', slug: 'bracelets' },
          { name: 'Rings', slug: 'rings' },
          { name: 'Earrings', slug: 'earrings' },
        ],
      },

      {
        name: 'Wigs & Hair',
        slug: 'wigs-hair',

        children: [
          { name: 'Human Hair', slug: 'human-hair' },
          { name: 'Bone Straight', slug: 'bone-straight' },
          { name: 'Curly Wigs', slug: 'curly-wigs' },
          { name: 'Frontal Wigs', slug: 'frontal-wigs' },
          { name: 'Closures', slug: 'closures' },
          { name: 'Hair Bundles', slug: 'hair-bundles' },
        ],
      },
    ],
  },

  {
    name: 'Beauty & Skincare',
    slug: 'beauty-skincare',
    banner: '/banners/beauty.jpg',

    children: [
      {
        name: 'Skincare',
        slug: 'skincare',

        children: [
          { name: 'Face Creams', slug: 'face-creams' },
          { name: 'Body Creams', slug: 'body-creams' },
          { name: 'Face Wash', slug: 'face-wash' },
          { name: 'Serums', slug: 'serums' },
          { name: 'Sunscreen', slug: 'sunscreen' },
          { name: 'Soaps', slug: 'soaps' },
        ],
      },

      {
        name: 'Makeup',
        slug: 'makeup',

        children: [
          { name: 'Lipsticks', slug: 'lipsticks' },
          { name: 'Powders', slug: 'powders' },
          { name: 'Foundations', slug: 'foundations' },
          { name: 'Lashes', slug: 'lashes' },
          { name: 'Beauty Tools', slug: 'beauty-tools' },
        ],
      },

      {
        name: 'Fragrances',
        slug: 'fragrances',

        children: [
          { name: 'Perfumes', slug: 'perfumes' },
          { name: 'Body Sprays', slug: 'body-sprays' },
          { name: 'Oils', slug: 'oils' },
        ],
      },

      {
        name: 'Haircare',
        slug: 'haircare',

        children: [
          { name: 'Shampoo', slug: 'shampoo' },
          { name: 'Conditioners', slug: 'conditioners' },
          { name: 'Hair Oils', slug: 'hair-oils' },
          { name: 'Hair Treatment', slug: 'hair-treatment' },
        ],
      },
    ],
  },

  {
    name: 'Accessories',
    slug: 'accessories',
    banner: '/banners/accessories.jpg',

    children: [
      {
        name: 'Accessories',
        slug: 'all-accessories',

        children: [
          { name: 'Sunglasses', slug: 'sunglasses' },
          { name: 'Caps', slug: 'caps' },
          { name: 'Belts', slug: 'belts' },
          { name: 'Phone Accessories', slug: 'phone-accessories' },
          { name: 'Fashion Accessories', slug: 'fashion-accessories' },
        ],
      },
    ],
  },
];