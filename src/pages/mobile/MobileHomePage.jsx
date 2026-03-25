import React from "react";
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
import MobileLayout from "../../components/layout/MobileLayout";

const dealCards = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    subtitle: "Save up to $200 with trade-in",
    badge: "Limited Offer",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Sony WH-1000XM5",
    subtitle: "Flat 20% Off today",
    badge: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop",
  },
];

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

const recommendedProducts = [
  {
    id: 1,
    title: "MacBook Air M2",
    price: 999,
    oldPrice: 1199,
    rating: 4.8,
    reviews: 2450,
    tag: "Bestseller",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 2,
    title: 'iPad Pro 11"',
    price: 799,
    oldPrice: null,
    rating: 4.9,
    reviews: 1200,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "AirPods Pro 2",
    price: 249,
    oldPrice: null,
    rating: 4.7,
    reviews: 890,
    tag: "New",
    image:
      "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Apple Watch S9",
    price: 399,
    oldPrice: null,
    rating: 4.8,
    reviews: 1300,
    tag: "",
    image:
      "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?q=80&w=1000&auto=format&fit=crop",
  },
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
      <div className="relative h-36 md:h-44 bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover"
        />

        {product.tag ? (
          <span className="absolute left-2 top-2 rounded-full bg-blue-500 px-2 py-1 text-[10px] font-bold text-white">
            {product.tag}
          </span>
        ) : null}

        <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm">
          <Heart size={16} />
        </button>
      </div>

      <div className="p-3 md:p-4">
        <h3 className="line-clamp-2 text-[13px] md:text-[14px] font-semibold text-gray-900">
          {product.title}
        </h3>

        <div className="mt-1 flex items-center gap-1 text-[11px] md:text-[12px] text-gray-500">
          <Star size={12} className="fill-current" />
          <span>{product.rating}</span>
          <span>({product.reviews})</span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <p className="text-[20px] md:text-[22px] font-bold text-gray-900">
            ${product.price}
          </p>
          {product.oldPrice ? (
            <p className="text-[12px] font-medium text-gray-400 line-through">
              ${product.oldPrice}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MobileHomePage() {
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
          {dealCards.map((item) => (
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