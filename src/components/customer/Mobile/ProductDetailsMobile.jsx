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
    return <div className="pb-6">Loading...</div>;
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
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-gray-500">
              Brand:{" "}
              <span className="text-gray-800">
                {product.brand?.name || product.brand || "FONEST"}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end">
            <Stars rating={product.rating || 0} size={13} />
            <p className="mt-1 text-[11px] text-gray-500">
              (
              {Number(
                product.reviewsCount || product.reviews?.length || 0
              ).toLocaleString()}{" "}
              reviews)
            </p>
          </div>
        </div>

        <h1 className="mb-3 text-[18px] font-bold leading-6 text-gray-900">
          {product.name}
        </h1>

        <div className="relative mb-4 overflow-hidden">
          <div className="h-[300px] bg-gray-100">
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

          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <ChevronRight size={18} />
          </button>

          <button className="absolute right-3 top-3">
            <Heart size={18} className="text-gray-600" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {(product.images || []).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeImage === idx ? "w-5 bg-gray-900" : "w-2 bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <h2 className="mb-2 text-[14px] font-bold text-gray-900">
            Description
          </h2>
          <p className="text-[13px] leading-6 text-gray-600">
            {product.description}
          </p>
        </div>

        {product.colors?.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-3 text-[14px] font-bold text-gray-900">
              Color:{" "}
              <span className="font-medium text-gray-600">
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
                    className={`overflow-hidden rounded-2xl border p-2 text-left transition ${
                      active
                        ? "border-blue-500 ring-1 ring-red-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={
                          color.image ||
                          product.images?.[0]?.url ||
                          product.images?.[0] ||
                          ""
                        }
                        alt={color.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-center text-[12px] font-medium text-gray-800">
                      {color.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isSmartphone && product.variants?.length > 0 && (
          <div className="mb-5 rounded-2xl">
            <h2 className="mb-3 text-[14px] font-bold text-gray-900">
              Variant
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {product.variants.map((variant, index) => {
                const variantKey = variant.id || variant._id || index;
                const active = selectedVariant === variantKey;

                return (
                  <button
                    key={variantKey}
                    onClick={() => setSelectedVariant(variantKey)}
                    className={`rounded-2xl border px-3 py-3 text-[13px] font-medium transition ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-500"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {variant.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-5 rounded-2xl">
          <p className="text-[26px] font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>

          {!!product.compareAtPrice && (
            <p className="mt-1 text-[14px] text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2 text-[13px]">
            <span
              className={`rounded-full px-2.5 py-1 font-medium ${
                product.stock > 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>

        <div className="mb-5 rounded-2xl">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-blue-50 p-2 text-blue-600">
              <Truck size={16} />
            </div>

            <div>
              <p className="text-[13px] font-semibold text-gray-900">
                {product.freeDelivery ? "Free Delivery" : "Delivery Charges Applied"}
              </p>
              <p className="mt-1 text-[12px] text-gray-600">
                Estimated delivery: {product.estimatedDelivery || "Check at checkout"}
              </p>
              <p className="mt-1 text-[12px] text-gray-500">
                Deliver to {product.deliverTo || "Select address"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600">
              <ShieldCheck size={16} />
            </div>

            <div>
              <p className="text-[13px] font-semibold text-gray-900">
                Secure Product
              </p>
              <p className="text-[12px] text-gray-500">
                Genuine product with standard warranty support
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          <button onClick={handleAddToCart} className="flex items-center justify-center gap-2 rounded-2xl border border-blue-500 bg-white py-3.5 text-[14px] font-semibold text-blue-500">
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          <button
            onClick={() => navigate(`/buy-now/${product._id}`)}
            className="rounded-2xl bg-blue-500 py-3.5 text-[14px] font-semibold text-white"
          >
            Buy Now
          </button>
        </div>

        {!!product.relatedProducts?.length && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-gray-900">
                Related Products
              </h2>
              <Link to="/shop" className="text-[12px] font-medium text-blue-500">
                View all
              </Link>
            </div>

            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {product.relatedProducts.map((item) => (
                <RelatedCard key={item._id || item.id} product={item} />
              ))}
            </div>
          </div>
        )}

        {!!product.reviews?.length && (
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-[15px] font-bold text-gray-900">
              Product Reviews
            </h2>

            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div
                  key={review.id || index}
                  className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-gray-900">
                      {review.name}
                    </p>
                    <Stars rating={review.rating} size={12} />
                  </div>

                  <p className="text-[12px] leading-5 text-gray-600">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}