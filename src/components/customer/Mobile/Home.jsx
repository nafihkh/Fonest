import React from "react";
import ProductCardSkeleton from "../../ui/ProductGridSkeleton";
import MobileDealSkeleton from "../../ui/MobileDealSkeleton";
import MobileCategorySkeleton from "../../ui/MobileCategorySkeleton";
import MobileRecentSkeleton from "../../ui/MobileRecentSkeleton";
import EmptyState from "../../ui/EmptyState";
import {
  ChevronRight,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  TrendingUp,
  MapPin,
} from "lucide-react";

const defaultCategories = [
  {
    id: 1,
    name: "Mobile",
    icon: Smartphone,
    bg: "bg-blue-50 dark:bg-blue-500/15",
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    id: 2,
    name: "Laptops",
    icon: Laptop,
    bg: "bg-violet-50 dark:bg-violet-500/15",
    color: "text-violet-500 dark:text-violet-400",
  },
  {
    id: 3,
    name: "Audio",
    icon: Headphones,
    bg: "bg-orange-50 dark:bg-orange-500/15",
    color: "text-orange-500 dark:text-orange-400",
  },
  {
    id: 4,
    name: "Watches",
    icon: Watch,
    bg: "bg-emerald-50 dark:bg-emerald-500/15",
    color: "text-emerald-500 dark:text-emerald-400",
  },
  {
    id: 5,
    name: "Trends",
    icon: TrendingUp,
    bg: "bg-pink-50 dark:bg-pink-500/15",
    color: "text-pink-500 dark:text-pink-400",
  },
];

const recentlyViewed = [
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop",
];

function SectionHeader({ title, actionText }) {
  return (
    <div className="mb-3 flex items-center justify-between md:mb-4">
      <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100 md:text-[18px]">
        {title}
      </h2>

      <button className="flex items-center gap-1 text-[12px] font-medium text-blue-500 dark:text-blue-400 md:text-[13px]">
        {actionText}
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function DealCard({ item }) {
  return (
    <div className="relative h-36 min-w-[235px] overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800 md:h-44 md:min-w-[320px]">
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white md:p-5">
        <span className="mb-2 inline-block rounded-full bg-pink-500 px-3 py-1 text-[10px] font-bold text-white dark:bg-pink-500">
          {item.badge}
        </span>

        <h3 className="text-[16px] font-bold leading-tight md:text-[20px]">
          {item.title}
        </h3>
        <p className="text-[12px] text-white/90 md:text-[13px]">
          {item.subtitle}
        </p>
      </div>
    </div>
  );
}

function CategoryItem({ item }) {
  const Icon = item.icon;

  return (
    <button className="flex flex-col items-center gap-2 md:gap-3">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} md:h-14 md:w-14`}
      >
        <Icon size={20} className={item.color} />
      </div>

      <span className="text-[12px] font-medium text-gray-700 dark:text-gray-300 md:text-[13px]">
        {item.name}
      </span>
    </button>
  );
}

function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
      <div className="h-36 bg-gray-100 dark:bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-3">
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          {product.brand}
        </p>

        <h3 className="line-clamp-2 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <p className="text-[18px] font-bold text-gray-900 dark:text-gray-100">
            ₹{product.price}
          </p>

          {product.compareAtPrice > 0 ? (
            <p className="text-[12px] text-gray-400 line-through dark:text-gray-500">
              ₹{product.compareAtPrice}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MobileHomePage({
  products = [],
  deals = [],
  recommendedProducts = [],
  categories = defaultCategories,
  loading = false,
  error = "",
  onAddToCart = () => {},
}) {
  if (loading) {
    return (
      <>
        <div className="mb-5 rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:px-5 md:py-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-gray-800 md:h-12 md:w-12" />
              <div>
                <div className="mb-2 h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />
              </div>
            </div>

            <div className="h-10 w-20 animate-pulse rounded-xl bg-slate-200 dark:bg-gray-800" />
          </div>
        </div>

        <section className="mb-6 md:mb-8">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />
            <div className="h-5 w-5 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />
          </div>

          <div className="mb-3 h-4 w-28 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />

          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 md:gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <MobileDealSkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="mb-8 md:mb-10">
          <div className="grid grid-cols-5 gap-3 md:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <MobileCategorySkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="mb-8 md:mb-10">
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />
          </div>

          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <MobileRecentSkeleton key={i} />
            ))}
          </div>
        </section>

        <section className="pb-3">
          <div className="mb-3 flex items-center justify-between md:mb-4">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />
            <div className="h-4 w-12 animate-pulse rounded bg-slate-200 dark:bg-gray-800" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <EmptyState
          title="Failed to load home data"
          message={error || "Please try again later."}
        />
      </>
    );
  }

  return (
    <>
      <div className="mb-5 rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:px-5 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-400 md:h-12 md:w-12">
              <MapPin size={18} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                Deliver To
              </p>
              <p className="text-[14px] font-semibold text-gray-900 dark:text-gray-100 md:text-[16px]">
                Home • Kochi 682001
              </p>
            </div>
          </div>

          <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 md:px-5 md:py-2.5 md:text-[14px]">
            Change
          </button>
        </div>
      </div>

      <section className="mb-6 md:mb-8">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-gray-900 dark:text-gray-100 md:text-[22px]">
            Continue Shopping Deals
          </h2>

          <button className="text-gray-500 dark:text-gray-400">
            <ChevronRight size={18} />
          </button>
        </div>

        <p className="mb-3 text-[13px] font-semibold text-red-500 dark:text-red-400 md:text-[14px]">
          Up to 70% Off • Ends Today
        </p>

        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 md:gap-4">
          {deals.map((item) => (
            <DealCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mb-8 md:mb-10">
        <div className="grid grid-cols-5 gap-3 md:gap-5">
          {categories.map((item) => (
            <CategoryItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className="mb-8 md:mb-10">
        <SectionHeader title="Recently Viewed" actionText="View History" />

        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1 md:gap-4">
          {recentlyViewed.map((img, index) => (
            <div
              key={index}
              className="h-14 w-14 min-w-[56px] overflow-hidden rounded-xl bg-white shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900 md:h-16 md:w-16 md:min-w-[64px]"
            >
              <img
                src={img}
                alt={`recent-${index}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          <button className="flex h-14 w-14 min-w-[56px] items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 md:h-16 md:w-16 md:min-w-[64px]">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <section className="pb-3">
        <SectionHeader title="Recommended for You" actionText="Filter" />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <button className="mt-4 w-full rounded-2xl border border-gray-200 bg-white py-3 text-[14px] font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 md:py-4 md:text-[15px]">
          See All Products
        </button>
      </section>
    </>
  );
}