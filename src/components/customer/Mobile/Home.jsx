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
  Heart,
  Star,
  MapPin,
} from "lucide-react";
import MobileLayout from "../../layout/MobileLayout";


const categories = [
  {
    id: 1,
    name: "Mobile",
    icon: Smartphone,
    bg: "bg-blue-50",
    color: "text-blue-500",
  },
  {
    id: 2,
    name: "Laptops",
    icon: Laptop,
    bg: "bg-violet-50",
    color: "text-violet-500",
  },
  {
    id: 3,
    name: "Audio",
    icon: Headphones,
    bg: "bg-orange-50",
    color: "text-orange-500",
  },
  {
    id: 4,
    name: "Watches",
    icon: Watch,
    bg: "bg-emerald-50",
    color: "text-emerald-500",
  },
  {
    id: 5,
    name: "Trends",
    icon: TrendingUp,
    bg: "bg-pink-50",
    color: "text-pink-500",
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
      <h2 className="text-[15px] md:text-[18px] font-bold text-gray-900">
        {title}
      </h2>

      <button className="flex items-center gap-1 text-[12px] md:text-[13px] font-medium text-blue-500">
        {actionText}
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function DealCard({ item }) {
  return (
    <div className="relative h-36 md:h-44 min-w-[235px] md:min-w-[320px] overflow-hidden rounded-2xl bg-gray-200">
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 text-white">
        <span className="mb-2 inline-block rounded-full bg-pink-500 px-3 py-1 text-[10px] font-bold">
          {item.badge}
        </span>

        <h3 className="text-[16px] md:text-[20px] font-bold leading-tight">
          {item.title}
        </h3>
        <p className="text-[12px] md:text-[13px] text-white/90">
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
        className={`flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl ${item.bg}`}
      >
        <Icon size={20} className={item.color} />
      </div>

      <span className="text-[12px] md:text-[13px] font-medium text-gray-700">
        {item.name}
      </span>
    </button>
  );
}

function ProductCard({ product }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="h-36 bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-3">
        <p className="text-[11px] text-gray-500">{product.brand}</p>
        <h3 className="line-clamp-2 text-[13px] font-semibold text-gray-900">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <p className="text-[18px] font-bold text-gray-900">
            ₹{product.price}
          </p>

          {product.compareAtPrice > 0 ? (
            <p className="text-[12px] text-gray-400 line-through">
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
  pagination,
  brands = [],
  categories = [],
  loading = false,
  error = "",

  search,
  setSearch,

  selectedCategory,
  setSelectedCategory,

  selectedBrand,
  setSelectedBrand,

  priceRange,
  setPriceRange,

  clearFilters,
  handleSortChange,
}) {

 if (loading) {
  return (
    <MobileLayout>
      {/* Address Skeleton */}
      <div className="mb-5 rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm md:px-5 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-slate-200 animate-pulse" />
            <div>
              <div className="mb-2 h-3 w-20 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
            </div>
          </div>

          <div className="h-10 w-20 rounded-xl bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* Deals Skeleton */}
      <section className="mb-6 md:mb-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
          <div className="h-5 w-5 rounded bg-slate-200 animate-pulse" />
        </div>

        <div className="mb-3 h-4 w-28 rounded bg-slate-200 animate-pulse" />

        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
          {Array.from({ length: 2 }).map((_, i) => (
            <MobileDealSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="mb-8 md:mb-10">
        <div className="grid grid-cols-5 gap-3 md:gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <MobileCategorySkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Recently Viewed Skeleton */}
      <section className="mb-8 md:mb-10">
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div className="h-5 w-32 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
        </div>

        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-1 no-scrollbar">
          {Array.from({ length: 5 }).map((_, i) => (
            <MobileRecentSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Recommended Skeleton */}
      <section className="pb-3">
        <div className="mb-3 flex items-center justify-between md:mb-4">
          <div className="h-5 w-40 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-12 rounded bg-slate-200 animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </MobileLayout>
  );
}
if (error) {
  return (
    <MobileLayout>
      <EmptyState
        title="Failed to load home data"
        message={error || "Please try again later."}
      />
    </MobileLayout>
  );
}
  return (
    <MobileLayout>
      {/* Address */}
      <div className="mb-5 rounded-2xl border border-blue-100 bg-white px-4 py-4 shadow-sm md:px-5 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <MapPin size={18} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Deliver To
              </p>
              <p className="text-[14px] md:text-[16px] font-semibold text-gray-900">
                Home • Kochi 682001
              </p>
            </div>
          </div>

          <button className="rounded-xl border border-gray-200 bg-white px-4 py-2 md:px-5 md:py-2.5 text-[13px] md:text-[14px] font-semibold text-gray-700 shadow-sm">
            Change
          </button>
        </div>
      </div>
      {/* Continue Shopping Deals */}
      <section className="mb-6 md:mb-8">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[17px] md:text-[22px] font-bold text-gray-900">
            Continue Shopping Deals
          </h2>

          <button className="text-gray-500">
            <ChevronRight size={18} />
          </button>
        </div>

        <p className="mb-3 text-[13px] md:text-[14px] font-semibold text-red-500">
          Up to 70% Off • Ends Today
        </p>

        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
          {deals.map((item) => (
            <DealCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8 md:mb-10">
        <div className="grid grid-cols-5 gap-3 md:gap-5">
          {categories.map((item) => (
            <CategoryItem key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      <section className="mb-8 md:mb-10">
        <SectionHeader title="Recently Viewed" actionText="View History" />

        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-1 no-scrollbar">
          {recentlyViewed.map((img, index) => (
            <div
              key={index}
              className="h-14 w-14 md:h-16 md:w-16 min-w-[56px] md:min-w-[64px] overflow-hidden rounded-xl bg-white shadow-sm"
            >
              <img
                src={img}
                alt={`recent-${index}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          <button className="flex h-14 w-14 md:h-16 md:w-16 min-w-[56px] md:min-w-[64px] items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm">
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Recommended */}
      <section className="pb-3">
        <SectionHeader title="Recommended for You" actionText="Filter" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <button className="mt-4 w-full rounded-2xl border border-gray-200 bg-white py-3 md:py-4 text-[14px] md:text-[15px] font-medium text-gray-500">
          See All Products
        </button>
      </section>
    </MobileLayout>
  );
}