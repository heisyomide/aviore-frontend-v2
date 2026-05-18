import { ProductCard } from "./ProductCard";

interface ProductGridProps {

  products?: any[] | null;

}

export function ProductGrid({ products }: ProductGridProps) {

  const safeProducts = Array.isArray(products)

    ? products.filter((p) => p && typeof p === "object")

    : [];

  if (safeProducts.length === 0) {

    return (

      <div className="w-full py-16 text-center">

        <p className="text-zinc-400 text-xs font-medium">

          No products found.

        </p>

      </div>

    );

  }

  return (

    <div

      className="

        grid

        grid-cols-2

        md:grid-cols-3

        lg:grid-cols-4

        xl:grid-cols-5

        gap-x-[6px]

        gap-y-3

      "

    >

      {safeProducts.map((p, idx) => (

        <ProductCard

          key={p.id || idx}

          product={p}

        />

      ))}

    </div>

  );

}