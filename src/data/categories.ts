// --- INTERFACES ---

export interface HomeCategory {
  id: string;
  name: string;
  image: string; // 🏠 High-quality image for the Homepage Circle
  slug: string;
}

export interface MegaMenuItem {
  name: string;
  img: string;   // 🛰️ Product-specific image for the Mega Menu
  slug: string;
  hot?: boolean;
}

export interface MegaSubCategory {
  name: string;
  slug: string;
  items: (string | MegaMenuItem)[];
}

export interface MegaMainCategory {
  id: string;
  name: string;
  children: MegaSubCategory[];
}

// --- DATA 1: HOMEPAGE CATEGORY CIRCLES ---
// Add your 8 main "Circle" images here.
export const HOME_CATEGORIES: HomeCategory[] = [
  { id: 'electronics', name: 'Electronics', image: '/registry/categories/electronics.jpg', slug: 'electronics' },
  { id: 'fashion', name: 'Fashion', image: '/registry/categories/fashion.jpg', slug: 'fashion' },
  { id: 'home-living', name: 'Home & Living', image: '/registry/categories/home.jpg', slug: 'home-living' },
  { id: 'artifacts', name: 'Artifacts & Unique', image: '/registry/categories/artifacts.jpg', slug: 'artifacts' },
  { id: 'groceries', name: 'Groceries & Food', image: '/registry/categories/groceries.jpg', slug: 'groceries' },
  { id: 'beauty', name: 'Beauty & Care', image: '/registry/categories/beauty.jpg', slug: 'beauty' },
  { id: 'industrial', name: 'Tools & Industrial', image: '/registry/categories/industrial.jpg', slug: 'industrial' },
  { id: 'deals', name: 'Clearance & Deals', image: '/registry/categories/deals.jpg', slug: 'deals' },
];

// --- DATA 2: MEGA MENU DATA ---
// Add your deep sub-category images here.
export const MEGA_MENU_DATA: MegaMainCategory[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    children: [
      { 
        name: 'Mobile & Accessories', 
        slug: 'mobile-accessories',
        items: [
          { name: 'Smartphones', img: '/cat/phone.jpg', hot: true, slug: 'smartphones' },
          { name: 'Smartwatches', img: '/cat/Smartwatches.jpg', hot: true, slug: 'smartwatches' },
          { name: 'Screen Protectors', img: '/cat/Screen Protectors.jpg', hot: true, slug: 'Screen Protectors' },
           { name: 'Power Banks', img: '/cat/Power Banks.jpg', hot: true, slug: 'Power Banks' },
            { name: 'Feature Phones', img: '/cat/Feature Phones.jpg', hot: true, slug: 'Feature Phones' },
          { name: 'Phone Cases', img: '/cat/Phone Cases.jpg', hot: true, slug: 'Phone Cases' },
          { name: 'Chargers', img: '/cat/Chargers.jpg', hot: true, slug: 'Chargers' },
         
        ] 
      },
      { name: 'Computers', slug: 'computers', items: [
        { name: 'Laptops', img: '/cat/Laptops.jpg', slug: 'laptops' },
        { name: 'Desktops', img: '/cat/Desktops.jpg', slug: 'Desktops' },
        { name: 'Monitors', img: '/cat/Monitors.jpg', slug: 'Monitors' },
        { name: 'Keyboards', img: '/cat/Keyboards.jpg', slug: 'Keyboards' },
        { name: 'Storage', img: '/cat/Storage.jpg', slug: 'Storage' },
  
      ]},
      { name: 'TV & Home Entertainment', slug: 'tv-entertainment', items: [
                { name: 'Smart TVs', img: '/cat/Smart TVs.jpg', slug: 'Smart TVs' },
        { name: 'Projectors', img: '/cat/Projectors.jpg', slug: 'Projectors' },
        { name: 'Soundbars', img: '/cat/Soundbars.jpg', slug: 'Soundbars' },
        
        
        ] },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion',
    children: [
      { 
        name: 'Men', 
        slug: 'men-fashion',
        items: [
          { name: "Men's T-Shirts", img: "/cat/tshirt.jpg", hot: true, slug: 't-shirts' },
          { name: "Shirts", img: "/cat/Shirts.jpg", hot: true, slug: 'Shirts' },
          { name: "Jeans", img: "/cat/Jeans.jpg", hot: true, slug: 'Jeans' },
          { name: "Trousers", img: "/cat/Trousers.jpg", hot: true, slug: 'Trousers' },
          { name: "Suits", img: "/cat/Suits.jpg", hot: true, slug: 'Suits' },
          { name: "Footwear", img: "/cat/Footwear.jpg", hot: true, slug: 'Footwear' },
      
        ] 
      },
      { name: 'Women', slug: 'women-fashion', items: [
          { name: "Dresses", img: "/cat/Dresses.jpg", hot: true, slug: 'Dresses' },
          { name: "Tops", img: "/cat/Tops.jpg", hot: true, slug: 'Tops' },
          { name: "Skirts", img: "/cat/Skirts.jpg", hot: true, slug: 'Skirts' },
          { name: "Handbags", img: "/cat/Handbags.jpg", hot: true, slug: 'Handbags' },
          { name: "Heels", img: "/cat/Heels.jpg", hot: true, slug: 'Heels' },
          { name: "Jewelry", img: "/cat/Jewelry.jpg", hot: true, slug: 'Jewelry' },
        ] },
    ],
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    children: [
      { name: 'Furniture', slug: 'furniture', items: [
          { name: "Sofas", img: "/cat/Sofas.jpg", hot: true, slug: 'Sofas' },
          { name: "Beds", img: "/cat/Beds.jpg", hot: true, slug: 'Beds' },
          { name: "Wardrobes", img: "/cat/Wardrobes.jpg", hot: true, slug: 'Wardrobes' },
          { name: "Office Chairs", img: "/cat/Office Chairs.jpg", hot: true, slug: 'Office Chairs' },
        ] },



      { name: 'Home Decor', slug: 'decor', items: [
        { name: "Decor", img: "/cat/decor.jpg", hot: false, slug: 'home-decor' },
          { name: "Wall Art", img: "/cat/Wall Art.jpg", hot: true, slug: 'Wall Art' },
          { name: "Mirrors", img: "/cat/Mirrors.jpg", hot: true, slug: 'Mirrors' },
          { name: "Lighting", img: "/cat/Lighting.jpg", hot: true, slug: 'Lighting' },
          ] },
      { name: 'Kitchen & Dining', slug: 'kitchen', items: [
         { name: "Cookware", img: "/cat/Cookware.jpg", hot: true, slug: 'Cookware' },
          { name: "Utensils", img: "/cat/Utensils.jpg", hot: true, slug: 'Utensils' },
          { name: "Plates & Cups", img: "/cat/Plates & Cups.jpg", hot: true, slug: 'Plates & Cups' },
        
        ] },
    ],
  },
  {
    id: 'artifacts',
    name: 'Artifacts & Unique',
    children: [
      { name: 'Collectibles', slug: 'collectibles', items: [
        { name: "Artifacts", img: "/cat/artifacts.jpg", hot: true, slug: 'ancient-artifacts' },
         { name: "Statues", img: "/cat/Statues.jpg", hot: true, slug: 'Statues' },
         { name: "Vintage Coins", img: "/cat/Vintage Coins.jpg", hot: true, slug: 'Vintage Coins' },
        ] }
    ]
  },
  {
    id: 'groceries',
    name: 'Groceries & Food',
    children: [{ name: 'All Food', slug: 'all-food', items: [
        { name: "Beverages", img: "/cat/Beverages.jpg", hot: false, slug: 'Beverages' },
          { name: "Snacks", img: "/cat/Snacks.jpg", hot: true, slug: 'Snacks' },
          { name: "Rice & Grains", img: "/cat/Rice & Grains.jpg", hot: true, slug: 'Rice & Grains' },
          { name: "Spices", img: "/cat/Spices.jpg", hot: true, slug: 'Spices' },
     ] }]
  },
  {
    id: 'beauty',
    name: 'Beauty & Care',
    children: [{ name: 'Personal Care', slug: 'personal-care', items: [
       { name: "Skincare", img: "/cat/Skincare.jpg", hot: false, slug: 'Skincare' },
          { name: "Haircare", img: "/cat/Haircare.jpg", hot: true, slug: 'Haircare' },
          { name: "Makeup", img: "/cat/Makeup.jpg", hot: true, slug: 'Makeup' },
          { name: "Fragrances", img: "/cat/Fragrances.jpg", hot: true, slug: 'Fragrances' },
     ] }]
  },
  {
    id: 'industrial',
    name: 'Tools & Industrial',
    children: [{ name: 'Equipment', slug: 'equipment', items: [
        { name: "Power Tools", img: "/cat/Power Tools.jpg", hot: true, slug: 'Power Tools' },
          { name: "Hand Tools", img: "/cat/Hand Tools.jpg", hot: true, slug: 'Hand Tools' },
          { name: "Safety Gear", img: "/cat/Safety Gear.jpg", hot: true, slug: 'Safety Gear' },
      ] }]
  },
  {
    id: 'deals',
    name: 'Clearance & Deals',
    children: [{ name: 'Flash Sales', slug: 'flash-sales', items: [
      { name: "Discounted Items", img: "/cat/Discounted Items.jpg", hot: true, slug: 'Discounted Items' },
          { name: "Bundles", img: "/cat/Bundles.jpg", hot: true, slug: 'Bundles' },
          { name: "Last Chance", img: "/cat/Last Chance.jpg", hot: true, slug: 'Last Chance' },
      ] }]
  }
];