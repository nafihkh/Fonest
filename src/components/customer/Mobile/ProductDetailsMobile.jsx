import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  ShieldCheck,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import {addToCart} from "../../../store/slices/cartSlice"
import { MobileProductDetailSkeleton } from "../../ui/ProductDetailSkeleton";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Stars({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(rating || 0);
        return (
          <Star
            key={i}
            size={size}
            className={filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        );
      })}
    </div>
  );
}

function RelatedCard({ product }) {
  return (
    <Link
      to={`/product/${product._id || product.id}`}
      className="min-w-[145px] overflow-hidden rounded-2xl bg-white shadow-sm"
    >
      <div className="h-32 bg-gray-100">
        <img
          src={product.image || product.images?.[0]?.url || product.images?.[0] || ""}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-3">
        <h4 className="line-clamp-2 text-[13px] font-semibold text-gray-900">
          {product.name}
        </h4>
        <p className="mt-2 text-[15px] font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

export default function ProductDetailsMobileView({ product, loading, error }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const navigate = useNavigate();
  const isSmartphone =
    (product?.category?.name || product?.category || "").toLowerCase() ===
    "smartphone";

  const selectedColorData = useMemo(() => {
    return product?.colors?.find((c) => (c.id || c._id) === selectedColor);
  }, [product?.colors, selectedColor]);

  const handleAddToCart = async () => {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
        })
      );
    };

  useEffect(() => {
    setActiveImage(0);
    setSelectedColor(product?.colors?.[0]?.id || product?.colors?.[0]?._id || "");
    setSelectedVariant(
      product?.variants?.[0]?.id || product?.variants?.[0]?._id || ""
    );
  }, [product]);

  const nextImage = () => {
    const total = product?.images?.length || 0;
    if (!total) return;
    setActiveImage((prev) => (prev + 1) % total);
  };

  const prevImage = () => {
    const total = product?.images?.length || 0;
    if (!total) return;
    setActiveImage((prev) => (prev - 1 + total) % total);
  };

  if (loading && !product) {
    return <MobileProductDetailSkeleton />;
  }

  if (error && !product) {
    return <div className="pb-6 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="pb-6">Product not found</div>;
  }

  return (
    <>
      <div className="pb-6">
        {/* Brand + Rating */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              Brand:{" "}
              <span className="text-gray-800 dark:text-gray-200">
                {product.brand?.name || product.brand || "FONEST"}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end">
            <Stars rating={product.rating || 0} size={13} />
            <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              ({Number(product.reviewsCount || product.reviews?.length || 0)})
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-[18px] font-bold leading-6 text-gray-900 dark:text-gray-100">
          {product.name}
        </h1>

        {/* Image */}
        <div className="relative mb-4 overflow-hidden">
          <div className="h-[300px] bg-gray-100 dark:bg-gray-800">
            <img
              src={
                product.images?.[activeImage]?.url ||
                product.images?.[activeImage] ||
                ""
              }
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200">
            <ChevronLeft size={18} />
          </button>

          <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200">
            <ChevronRight size={18} />
          </button>

          <button className="absolute right-3 top-3 text-gray-600 dark:text-gray-300">
            <Heart size={18} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {(product.images || []).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`h-2 rounded-full ${
                  activeImage === idx
                    ? "w-5 bg-gray-900 dark:bg-blue-500"
                    : "w-2 bg-white/80 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-5">
          <h2 className="mb-2 text-[14px] font-bold text-gray-900 dark:text-gray-100">
            Description
          </h2>
          <p className="text-[13px] leading-6 text-gray-600 dark:text-gray-400">
            {product.description}
          </p>
        </div>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-3 text-[14px] font-bold text-gray-900 dark:text-gray-100">
              Color:{" "}
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {selectedColorData?.name || ""}
              </span>
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {product.colors.map((color, index) => {
                const colorKey = color.id || color._id || index;
                const active = selectedColor === colorKey;

                return (
                  <button
                    key={colorKey}
                    onClick={() => setSelectedColor(colorKey)}
                    className={`rounded-2xl border p-2 ${
                      active
                        ? "border-blue-500 ring-1 ring-blue-300 dark:ring-blue-800"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div className="mx-auto mb-2 h-20 w-20 rounded-xl bg-gray-100 dark:bg-gray-800">
                      <img src={color.image || ""} className="h-full w-full object-cover" />
                    </div>

                    <p className="text-center text-[12px] text-gray-800 dark:text-gray-200">
                      {color.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mb-5">
          <p className="text-[26px] font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </p>

          {!!product.compareAtPrice && (
            <p className="text-[14px] text-gray-400 line-through dark:text-gray-500">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}

          <span
            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${
              product.stock > 0
                ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Delivery */}
        <div className="mb-5 flex gap-3">
          <div className="rounded-full bg-blue-50 dark:bg-blue-900/30 p-2 text-blue-600">
            <Truck size={16} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
              {product.freeDelivery ? "Free Delivery" : "Delivery Charges Applied"}
            </p>
            <p className="text-[12px] text-gray-600 dark:text-gray-400">
              {product.estimatedDelivery}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 rounded-2xl border border-blue-500 bg-white dark:bg-gray-900 text-blue-500 py-3.5 text-[14px] font-semibold"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          <button
            onClick={() => navigate(`/buy-now/${product._id}`)}
            className="rounded-2xl bg-blue-500 hover:bg-blue-600 py-3.5 text-white text-[14px] font-semibold"
          >
            Buy Now
          </button>
        </div>

        {/* Reviews */}
        {!!product.reviews?.length && (
          <div className="rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="mb-4 text-[15px] font-bold text-gray-900 dark:text-gray-100">
              Product Reviews
            </h2>

            {product.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                  {review.name}
                </p>
                <p className="text-[12px] text-gray-600 dark:text-gray-400">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}