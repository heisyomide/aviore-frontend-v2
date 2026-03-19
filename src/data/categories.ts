export const CATEGORY_TREE = [
  { 
    id: 'featured', 
    name: 'Featured', 
    items: [
      { name: "Men's T-Shirts", img: "/cat/tshirt.jpg", hot: true },
      { name: "Summer Sets", img: "/cat/shorts.jpg", hot: false },
      { name: "Artifacts", img: "/cat/artifact.jpg", hot: true }
    ] 
  },
  { 
    id: 'home', 
    name: 'Home & Kitchen', 
    items: [
      { name: "Decor", img: "/cat/decor.jpg", hot: false },
      { name: "Storage", img: "/cat/box.jpg", hot: true }
    ] 
  },
  { id: 'women', name: "Women's Clothing", items: [] },
  { id: 'men', name: "Men's Clothing", items: [] },
];