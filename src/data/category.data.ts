// src/data/category.data.ts

export interface CategoryItem {
  name: string;
  slug: string;
  image?: string; // 🎯 Added to hold individual sub-category thumbnails
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
    banner: '/banners/fash.jpg',

    children: [
      {
        name: 'Women Fashion',
        slug: 'women-fashion',
        children: [
          { name: 'Dresses', slug: 'dresses', image: '/cat/dresses.jpg' },
          { name: 'Tops', slug: 'tops', image: '/cat/Tops.jpg' },
          { name: 'Jeans', slug: 'jeans', image: '/cat/jeans.jpg' },
          { name: 'Skirts', slug: 'skirts', image: '/cat/skirts.jpg' },
          { name: 'Two Piece Sets', slug: 'two-piece-sets', image: '/cat/two-peice-sets.jpg' },
          { name: 'Lingerie', slug: 'lingerie', image: '/cat/lingerie.jpg' },
          { name: 'Abayas', slug: 'abayas', image: '/cat/abaya.jpg' },
          { name: 'Jumpsuits', slug: 'jumpsuits', image: '/cat/jump-suits.jpg' },
        ],
      },

      {
        name: 'Men Fashion',
        slug: 'men-fashion',
        children: [
          { name: 'Shirts', slug: 'shirts', image: '/cat/shirts.jpg' },
          { name: 'T-Shirts', slug: 't-shirts', image: '/cat/tshirts.jpg' },
          { name: 'Jeans', slug: 'men-jeans', image: '/cat/men-jean.jpg' },
          { name: 'Native Wear', slug: 'native-wear', image: '/cat/native-wears.jpg' },
          { name: 'Trousers', slug: 'trousers', image: '/cat/trousers.jpg' },
          { name: 'Suits', slug: 'suits', image: '/cat/suits.jpg' },
          { name: 'Shorts', slug: 'shorts', image: '/cat/shorts.jpg' },
        ],
      },

      {
        name: 'Footwear',
        slug: 'footwear',
        children: [
          { name: 'Sneakers', slug: 'sneakers', image: '/cat/sneakers.jpg' },
          { name: 'Heels', slug: 'heels', image: '/cat/heels.jpg' },
          { name: 'Slides', slug: 'slides', image: '/cat/slides.jpg' },
          { name: 'Sandals', slug: 'sandals', image: '/cat/sandals.jpg' },
          { name: 'Boots', slug: 'boots', image: '/cat/boots.jpg' },
        ],
      },

      {
        name: 'Bags',
        slug: 'bags',
        children: [
          { name: 'Handbags', slug: 'handbags', image: '/cat/handbags.jpg' },
          { name: 'Crossbody Bags', slug: 'crossbody-bags', image: '/cat/crossbody-bags.jpg' },
          { name: 'Backpacks', slug: 'backpacks', image: '/cat/back-packs.jpg' },
          { name: 'Wallets', slug: 'wallets', image: '/cat/wallets.jpg' },
        ],
      },

      {
        name: 'Watches & Jewelry',
        slug: 'watches-jewelry',
        children: [
          { name: 'Watches', slug: 'watches', image: '/cat/watches.jpg' },
          { name: 'Necklaces', slug: 'necklaces', image: '/cat/necklace.jpg' },
          { name: 'Bracelets', slug: 'bracelets', image: '/cat/bracelets.jpg' },
          { name: 'Rings', slug: 'rings', image: '/cat/ringd.jpg' },
          { name: 'Earrings', slug: 'earrings', image: '/cat/earrings.jpg' },
        ],
      },

      {
        name: 'Wigs & Hair',
        slug: 'wigs-hair',
        children: [
          { name: 'Human Hair', slug: 'human-hair', image: '/cat/human-hair.jpg' },
          { name: 'Bone Straight', slug: 'bone-straight', image: '/cat/bone-straight.jpg' },
          { name: 'Curly Wigs', slug: 'curly-wigs', image: '/cat/curly-wigs.jpg' },
          { name: 'Frontal Wigs', slug: 'frontal-wigs', image: '/cat/frontal-wigs.jpg' },
          { name: 'Closures', slug: 'closures', image: '/cat/closures.jpg' },
          { name: 'Hair Bundles', slug: 'hair-bundles', image: '/cat/hair-bundles.jpg' },
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
          { name: 'Face Creams', slug: 'face-creams', image: '/cat/face-cream.jpg' },
          { name: 'Body Creams', slug: 'body-creams', image: '/cat/body-cream.jpg' },
          { name: 'Face Wash', slug: 'face-wash', image: '/cat/face-wash.jpg' },
          { name: 'Serums', slug: 'serums', image: '/cat/serums.jpg' },
          { name: 'Sunscreen', slug: 'sunscreen', image: '/cat/sunscreen.jpg' },
          { name: 'Soaps', slug: 'soaps', image: '/cat/soaps.jpg' },
        ],
      },

      {
        name: 'Makeup',
        slug: 'makeup',
        children: [
          { name: 'Lipsticks', slug: 'lipsticks', image: '/cat/lipsticks.jpg' },
          { name: 'Powders', slug: 'powders', image: '/cat/powders.jpg' },
          { name: 'Foundations', slug: 'foundations', image: '/cat/foundations.jpg' },
          { name: 'Lashes', slug: 'lashes', image: '/cat/lashes.jpg' },
          { name: 'Beauty Tools', slug: 'beauty-tools', image: '/cat/beauty-tools.jpg' },
        ],
      },

      {
        name: 'Fragrances',
        slug: 'fragrances',
        children: [
          { name: 'Perfumes', slug: 'perfumes', image: '/cat/perfumes.jpg' },
          { name: 'Body Sprays', slug: 'body-sprays', image: '/cat/body-spray.jpg' },
          { name: 'Oils', slug: 'oils', image: '/cat/oils.jpg' },
        ],
      },

      {
        name: 'Haircare',
        slug: 'haircare',
        children: [
          { name: 'Shampoo', slug: 'shampoo', image: '/cat/shampoo.jpg' },
          { name: 'Conditioners', slug: 'conditioners', image: '/cat/conditioner.jpg' },
          { name: 'Hair Oils', slug: 'hair-oils', image: '/cat/hair-oil.jpg' },
          { name: 'Hair Treatment', slug: 'hair-treatment', image: '/cat/hair-treatment.jpg' },
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
          { name: 'Sunglasses', slug: 'sunglasses', image: '/cat/sunglasses.jpg' },
          { name: 'Caps', slug: 'caps', image: '/cat/caps.jpg' },
          { name: 'Belts', slug: 'belts', image: '/cat/belts.jpg' },
          { name: 'Phone Accessories', slug: 'phone-accessories', image: '/cat/phone-accessories.jpg' },
          { name: 'Fashion Accessories', slug: 'fashion-accessories', image: '/cat/fashion-accessories.jpg' },
        ],
      },
    ],
  },
];