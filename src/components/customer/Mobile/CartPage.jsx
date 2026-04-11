import React, { useMemo } from "react";
import {
  Truck,
  Minus,
  Plus,
  ShieldCheck,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const savedForLater = [
  {
    id: 101,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 102,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=900&auto=format&fit=crop",
  },
];

function QuantityStepper({ value, onDecrease, onIncrease }) {
  return (
    <div className="flex items-center rounded-2xl bg-gray-100 px-2 py-1.5 dark:bg-gray-800 md:px-3 md:py-2">
      <button
        onClick={onDecrease}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <Minus size={12} />
      </button>

      <span className="w-8 text-center text-[14px] font-semibold text-gray-900 dark:text-gray-100 md:text-[15px]">
        {value}
      </span>

      <button
        onClick={onIncrease}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-white dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function CartItem({ item, onIncrease, onDecrease, onRemove, navigate }) {
  const product = item.product || {};
  const productId = product._id || item.product;
  const productName = product.name || item.name || "Product";
  const productImage =
    product.images?.[0]?.url || product.images?.[0] || item.image || "";
  const price = item.price ?? product.price ?? 0;
  const quantity = item.quantity || 1;

  return (
    <div className="border-b border-gray-100 py-4 last:border-b-0 dark:border-gray-800 md:py-5">
      <div className="flex gap-3 md:gap-4">
        <button
          onClick={() => navigate(`/product/${productId}`)}
          className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 md:h-24 md:w-24"
        >
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-cover"
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] font-semibold leading-5 text-gray-900 dark:text-gray-100 md:text-[17px]">
                {productName}
              </h3>

              <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-400 md:text-[13px]">
                {item.variantName || item.variantLabel || "Standard"}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[18px] font-bold text-gray-900 dark:text-gray-100 md:text-[22px]">
                  {formatPrice(price)}
                </span>
              </div>
            </div>

            <QuantityStepper
              value={quantity}
              onDecrease={() => onDecrease(item)}
              onIncrease={() => onIncrease(item)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => onRemove(item)}
          className="flex gap-1 text-[12px] font-medium text-red-500 transition hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 md:text-[14px]"
        >
          <Trash2 size={16} />
          Remove
        </button>

        <div className="flex items-center gap-1 text-[12px] text-gray-500 dark:text-gray-400 md:text-[13px]">
          <ShieldCheck size={14} />
          <span>1-Year Warranty</span>
        </div>
      </div>
    </div>
  );
}

function SavedCard({ item, navigate }) {
  const image = item.images?.[0]?.url || item.images?.[0] || "";
  const name = item.name || "Product";
  const price = item.price || 0;

  return (
    <button
      onClick={() => navigate(`/product/${item._id}`)}
      className="h-auto w-24 min-w-[96px] overflow-hidden rounded-2xl bg-white text-left shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900 md:h-36 md:w-32 md:min-w-[128px]"
    >
      <div className="h-28 w-full overflow-hidden md:h-36">
        <img
          src={item.image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-2">
        <p className="line-clamp-2 text-[11px] font-medium text-gray-800 dark:text-gray-100">
          {name}
        </p>
        <p className="mt-1 text-[12px] font-bold text-gray-900 dark:text-gray-100">
          {formatPrice(price)}
        </p>
      </div>
    </button>
  );
}

export default function MobileCartPage({
  cartItems = [],
  subtotal = 0,
  totalItems = 0,
  loading,
  error,
  onIncrease,
  onDecrease,
  savedProducts = [],
  onRemove,
  onProceedToPayment,
}) {
  const navigate = useNavigate();

  const safeSubtotal = useMemo(() => Number(subtotal || 0), [subtotal]);
  console.log(loading)
  if (loading) {
    return (
      <section className="pb-6 animate-pulse">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3">
          <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Delivery banner skeleton */}
        <div className="mb-5 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700" />

        {/* Cart items skeleton */}
        <div className="mb-6 rounded-3xl bg-white px-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-gray-100 py-4 last:border-b-0 dark:border-gray-800">
              <div className="flex gap-3">
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="h-9 w-20 rounded-2xl bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary skeleton */}
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
              <div className="flex justify-between">
                <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </div>
          </div>
          <div className="mt-5 h-14 w-full rounded-2xl bg-slate-200 dark:bg-slate-700" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-6">
        <div className="rounded-3xl bg-white p-6 text-center text-red-500 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="pb-6">
      <div className="mb-5 flex items-center gap-3 md:mb-6">
        <button className="text-gray-700 dark:text-gray-300">
          <ChevronRight size={18} className="rotate-180" />
        </button>

        <h1 className="text-[18px] font-bold text-gray-900 dark:text-gray-100 md:text-[32px]">
          Shopping Cart
        </h1>
      </div>

      <div className="mb-5 rounded-2xl bg-blue-50 px-4 py-3 dark:bg-blue-500/10 md:px-5 md:py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-blue-500 dark:text-blue-400">
            <Truck size={18} />
          </div>

          <div>
            <p className="text-[12px] font-semibold text-blue-500 dark:text-blue-400 md:text-[14px]">
              FREE Express Shipping
            </p>
            <p className="text-[10px] text-blue-400 dark:text-blue-300/80 md:text-[13px]">
              Your order qualifies for complimentary next-day delivery
            </p>
          </div>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <p className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
            Your cart is empty
          </p>
          <p className="mt-2 text-[13px] text-gray-500 dark:text-gray-400">
            Add some products to continue shopping.
          </p>

          <button
            onClick={() => navigate("/shop")}
            className="mt-5 rounded-2xl bg-blue-500 px-6 py-3 text-[14px] font-semibold text-white"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-3xl bg-white px-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900 md:px-5">
            {cartItems.map((item, index) => (
              <CartItem
                key={item._id || `${item.product}-${index}`}
                item={item}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
                onRemove={onRemove}
                navigate={navigate}
              />
            ))}
          </div>

          {!!savedProducts.length && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 md:text-[24px]">
                Saved for Later
              </h2>

              <button className="flex items-center gap-1 text-[13px] font-medium text-blue-500 dark:text-blue-400 md:text-[14px]">
                View All
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {savedProducts.map((item) => (
                <SavedCard key={item._id} item={item} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

          <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900 md:p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[14px] md:text-[15px]">
                <span className="text-gray-500 dark:text-gray-400">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatPrice(safeSubtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-[14px] md:text-[15px]">
                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  FREE
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-bold text-gray-900 dark:text-gray-100 md:text-[22px]">
                    Order Total
                  </span>
                  <span className="text-[20px] font-bold text-blue-500 dark:text-blue-400 md:text-[32px]">
                    {formatPrice(safeSubtotal)}
                  </span>
                </div>
              </div>
            </div>

            <button
             onClick={() => navigate("/checkout/cart")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 text-[18px] font-semibold text-white transition hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 md:text-[17px]"
            >
              Proceed to Checkout
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}