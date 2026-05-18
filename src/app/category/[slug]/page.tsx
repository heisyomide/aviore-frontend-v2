'use client';

import { use, useEffect, useState, useMemo } from 'react';

import Link from 'next/link';

import Image from 'next/image';

import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

import { MARKETPLACE_CATEGORIES } from '@/src/data/category.data';

import { Navbar } from '@/src/components/navbar/Navbar';

import { ProductGrid } from '@/src/components/product/ProductGrid';

interface PageProps {

  params: Promise<{ slug: string }>;

}

interface Product {

  id: string;

  title?: string;

  name?: string;

  price: number;

  stock?: number;

  images?: { imageUrl: string }[];

  image?: string;

}

interface CategoryGroupPayload {

  id: string;

  name: string;

  slug: string;

  products?: Product[];

}

interface ParentCategoryPayload {

  id: string;

  name: string;

  slug: string;

  banner: string;

  children: CategoryGroupPayload[];

}

export default function CategoryWorldPage({ params }: PageProps) {

  const { slug } = use(params);

  const [categoryData, setCategoryData] = useState<ParentCategoryPayload | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [syncError, setSyncError] = useState(false);

  const staticFallback = useMemo(

    () => MARKETPLACE_CATEGORIES.find((c) => c.slug === slug) || MARKETPLACE_CATEGORIES[0],

    [slug]

  );

  const discoveryJumps = useMemo(

    () => MARKETPLACE_CATEGORIES.filter((c) => c.slug !== slug),

    [slug]

  );

  useEffect(() => {

    async function fetchData() {

      try {

        setIsLoading(true);

        setSyncError(false);

        const res = await fetch(

          `${process.env.NEXT_PUBLIC_API_URL}/storefront/category/${slug}`

        );

        if (!res.ok) throw new Error('Failed');

        const data: ParentCategoryPayload = await res.json();

        setCategoryData(data);

      } catch (e) {

        console.error(e);

        setSyncError(true);

      } finally {

        setIsLoading(false);

      }

    }

    if (slug) fetchData();

  }, [slug]);

  const normalizeProducts = (products?: Product[]) => {

    if (!products) return [];

    return products.map((p) => ({

      id: p.id,

      name: p.title || p.name || 'Product',

      price: Number(p.price) || 0,

      stock: p.stock ?? 0,

      image:

        p.images?.[0]?.imageUrl ||

        p.image ||

        '/placeholder.png',

    }));

  };

  if (isLoading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="animate-spin w-6 h-6 border-2 border-[#A4143D] border-t-transparent rounded-full" />

      </div>

    );

  }

  if (syncError || !categoryData) {

    return (

      <div className="min-h-screen flex flex-col items-center justify-center text-center">

        <p className="text-red-500 font-bold">CATEGORY LOAD FAILED</p>

        <Link href="/marketplace" className="mt-4 text-xs font-bold">

          Return Home

        </Link>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-white pb-32">

      <Navbar />

      {/* HERO */}

      <div className="relative h-56 w-full">

        <Image

          src={staticFallback.banner}

          alt={categoryData.name}

          fill

          className="object-cover brightness-75"

        />

        <div className="absolute bottom-0 p-6 text-white">

          <h1 className="text-3xl font-black uppercase">

            {categoryData.name}

          </h1>

        </div>

      </div>

      {/* SECTIONS */}

      <div className="py-8 space-y-12 px-4">

        {categoryData.children.map((group) => {

          const products = normalizeProducts(group.products);

          const cleanSlug = group.slug.replace(`${slug}-`, '');

          return (

            <div key={group.id} className="space-y-4">

              {/* HEADER */}

              <div className="flex justify-between  text-slate-900 items-center border-b pb-2">

                <h3 className="text-xs font-black uppercase">

                  {group.name}

                </h3>

                <Link

                  href={`/category/${slug}/${cleanSlug}`}

                  className="text-[10px] font-bold text-[#A4143D]"

                >

                  See All <ChevronRight size={12} />

                </Link>

              </div>

              {/* PRODUCTS */}

              <ProductGrid products={products} />

            </div>

          );

        })}

      </div>

      {/* DISCOVERY */}

      <div className="grid grid-cols-2 gap-3 px-4 mt-10">

        {discoveryJumps.map((cat) => (

          <Link

            key={cat.slug}

            href={`/category/${cat.slug}`}

            className="relative h-24 rounded-xl overflow-hidden"

          >

            <Image

              src={cat.banner}

              alt={cat.name}

              fill

              className="object-cover"

            />

            <div className="absolute bottom-0 p-3 text-white text-xs font-bold">

              {cat.name}

            </div>

          </Link>

        ))}

      </div>

    </div>

  );

}