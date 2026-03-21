export interface CategoryItem {
  name: string;
  img: string;    // 📸 This image appears ONLY in the Mega Menu
  slug: string;
  hot?: boolean;
}

export interface SubCategory {
  name: string;
  slug: string;
  items: (string | CategoryItem)[]; 
}

export interface MainCategory {
  id: string;
  name: string;
  image: string;  // 🏠 This image appears ONLY in the Category Circle (Homepage)
  children: SubCategory[];
}