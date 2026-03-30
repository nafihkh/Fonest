import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  ShieldCheck,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

const productData = {
  _id: "1",
  name: "Fitbit Versa 4 Smart Watch",
  brand: "Fitbit",
  rating: 4.6,
  reviewsCount: 2841,
  description:
    "Stay on top of your health and fitness with the Fitbit Versa 4. Track workouts, heart rate, sleep, stress, and daily activity with a sleek premium design.",
  price: 12999,
  compareAtPrice: 15999,
  stock: 12,
  freeDelivery: true,
  estimatedDelivery: "Tomorrow, 7 Mar",
  deliverTo: "Nafih - Kochi 682001",
  images: [
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop",
  ],
  colors: [
    {
      id: "marine-blue",
      name: "Marine Blue",
      image:
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "black",
      name: "Black",
      image:
        "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1774278402/fonest/products/dj0x687slarxcs0ppkpu.jpg",
    },
  ],
  variants: [
    { id: "8-128", label: "8 GB + 128 GB" },
    { id: "12-256", label: "12 GB + 256 GB" },
  ],
  relatedProducts: [
    {
      _id: "r1",
      name: "Apple Watch SE",
      price: 24999,
      image:
        "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=800&auto=format&fit=crop",
    },
    {
      _id: "r2",
      name: "Samsung Galaxy Watch",
      price: 18999,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    },
    {
      _id: "r3",
      name: "Noise Smart Watch",
      price: 4999,
      image:
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=800&auto=format&fit=crop",
    },
  ],
  reviews: [
    {
      id: "rev1",
      name: "Arjun",
      rating: 5,
      comment: "Very good battery and premium feel. Worth the price.",
    },
    {
      id: "rev2",
      name: "Riya",
      rating: 4,
      comment: "Display is nice and fitness tracking is accurate.",
    },
  ],
};

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating);

        return (
          <Star
            key={i}
            size={size}
            className={
              filled
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        );
      })}
    </div>
  );
}

function RelatedCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="min-w-[145px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="h-32 bg-gray-100 dark:bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-3">
        <h4 className="line-clamp-2 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
          {product.name}
        </h4>

        <p className="mt-2 text-[15px] font-bold text-gray-900 dark:text-gray-100">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export default function MobileProductDetailsPage() {
  const product = productData;

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.id || ""
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]?.id || ""
  );

  const isSmartphone =
    product.category?.toLowerCase() === "smartphone";

  const selectedColorData = useMemo(
    () => product.colors.find((c) => c.id === selectedColor),
    [product.colors, selectedColor]
  );

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setActiveImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 pb-28 pt-4 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
      {/* Brand + Rating */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
            Brand:{" "}
            <span className="text-gray-800 dark:text-gray-100">
              {product.brand}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end">
          <Stars rating={product.rating} size={13} />
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            ({product.reviewsCount.toLocaleString()} reviews)
          </p>
        </div>
      </div>

      {/* Title */}
      <h1 className="mb-3 text-[18px] font-bold leading-6 text-gray-900 dark:text-gray-100">
        {product.name}
      </h1>

      {/* Image Carousel */}
      <div className="relative mb-5 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="h-[300px] bg-gray-100 dark:bg-gray-800">
          <img
            src={product.images[activeImage]}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <button
          onClick={prevImage}
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm dark:bg-gray-900/90 dark:text-gray-100"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm dark:bg-gray-900/90 dark:text-gray-100"
        >
          <ChevronRight size={18} />
        </button>

        <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm dark:bg-gray-900/90">
          <Heart
            size={18}
            className="text-gray-600 dark:text-gray-300"
          />
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`h-2 rounded-full transition-all ${
                activeImage === idx
                  ? "w-5 bg-blue-500"
                  : "w-2 bg-white/80 dark:bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-2 text-[14px] font-bold text-gray-900 dark:text-gray-100">
          Description
        </h2>

        <p className="text-[13px] leading-6 text-gray-600 dark:text-gray-300">
          {product.description}
        </p>
      </div>

      {/* Colors */}
      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-[14px] font-bold text-gray-900 dark:text-gray-100">
          Color:{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {selectedColorData?.name || ""}
          </span>
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {product.colors.map((color) => {
            const active = selectedColor === color.id;

            return (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`overflow-hidden rounded-2xl border p-2 transition ${
                  active
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200 dark:bg-blue-500/10 dark:ring-blue-500/30"
                    : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
                  <img
                    src={color.image}
                    alt={color.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="text-center text-[12px] font-medium text-gray-800 dark:text-gray-100">
                  {color.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Variant */}
      {isSmartphone && product.variants?.length > 0 && (
        <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-[14px] font-bold text-gray-900 dark:text-gray-100">
            Variant
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {product.variants.map((variant) => {
              const active = selectedVariant === variant.id;

              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant.id)}
                  className={`rounded-2xl border px-3 py-3 text-[13px] font-medium transition ${
                    active
                      ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      : "border-gray-200 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-[26px] font-bold text-gray-900 dark:text-gray-100">
          {formatPrice(product.price)}
        </p>

        {product.compareAtPrice > 0 && (
          <p className="mt-1 text-[14px] text-gray-400 line-through dark:text-gray-500">
            {formatPrice(product.compareAtPrice)}
          </p>
        )}

        <div className="mt-3">
          <span
            className={`rounded-full px-3 py-1 text-[13px] font-medium ${
              product.stock > 0
                ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Delivery */}
      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <Truck size={16} />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
              {product.freeDelivery
                ? "Free Delivery"
                : "Delivery Charges Applied"}
            </p>

            <p className="mt-1 text-[12px] text-gray-600 dark:text-gray-300">
              Estimated delivery: {product.estimatedDelivery}
            </p>

            <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400">
              Deliver to {product.deliverTo}
            </p>
          </div>
        </div>
      </div>

      {/* Secure Product */}
      <div className="mb-5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <ShieldCheck size={16} />
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
              Secure Product
            </p>

            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              Genuine product with standard warranty support
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 rounded-2xl border border-blue-500 bg-white py-3.5 text-[14px] font-semibold text-blue-500 transition hover:bg-blue-50 dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-blue-500/10">
          <ShoppingCart size={16} />
          Add to Cart
        </button>

        <button className="rounded-2xl bg-blue-500 py-3.5 text-[14px] font-semibold text-white transition hover:bg-blue-600">
          Buy Now
        </button>
      </div>

      {/* Related Products */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-gray-900 dark:text-gray-100">
            Related Products
          </h2>

          <Link
            to="/shop"
            className="text-[12px] font-medium text-blue-500 dark:text-blue-400"
          >
            View all
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {product.relatedProducts.map((item) => (
            <RelatedCard key={item._id} product={item} />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-[15px] font-bold text-gray-900 dark:text-gray-100">
          Product Reviews
        </h2>

        <div className="space-y-4">
          {product.reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0 dark:border-gray-800"
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                  {review.name}
                </p>

                <Stars rating={review.rating} size={12} />
              </div>

              <p className="text-[12px] leading-5 text-gray-600 dark:text-gray-300">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}