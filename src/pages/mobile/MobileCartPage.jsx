import React, { useMemo, useState } from "react";
import { Truck, Minus, Plus, ShieldCheck, ChevronRight,Trash2 } from "lucide-react";
import MobileLayout from "../../components/layout/MobileLayout";

const initialCartItems = [
  {
    id: 1,
    name: "iPhone 15 Pro - Natural Titanium, 256GB",
    variant: "256GB / Titanium",
    price: 1099,
    oldPrice: null,
    qty: 1,
    stockLabel: "In Stock",
    warranty: "1-Year Warranty",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "AirPods Pro (2nd Generation) with MagSafe Case",
    variant: "USB-C Charging",
    price: 249,
    oldPrice: 299,
    qty: 1,
    stockLabel: "In Stock",
    warranty: "1-Year Warranty",
    image:
      "https://images.unsplash.com/photo-1606741965326-cb990ae01bb2?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "FONEST Premium Leather MagSafe Case",
    variant: "Midnight Blue",
    price: 59,
    oldPrice: null,
    qty: 2,
    stockLabel: "In Stock",
    warranty: "1-Year Warranty",
    image:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=900&auto=format&fit=crop",
  },
];

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
    <div className="flex items-center rounded-2xl bg-gray-100 px-2 py-1.5 md:px-3 md:py-2">
      <button
        onClick={onDecrease}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-white"
      >
        <Minus size={12} />
      </button>

      <span className="w-8 text-center text-[14px] md:text-[15px] font-semibold text-gray-900">
        {value}
      </span>

      <button
        onClick={onIncrease}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-white"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="border-b border-gray-100 py-4 last:border-b-0 md:py-5">
      <div className="flex gap-3 md:gap-4">
        <div className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[14px] md:text-[17px] font-semibold leading-5 text-gray-900">
                {item.name}
              </h3>

              <p className="mt-1 text-[12px] md:text-[13px] text-gray-500">
                {item.variant}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-[18px] md:text-[22px] font-bold text-gray-900">
                  ${item.price.toLocaleString()}
                </span>

                {item.oldPrice ? (
                  <span className="text-[13px] md:text-[14px] font-medium text-gray-400 line-through">
                    ${item.oldPrice.toLocaleString()}
                  </span>
                ) : null}
              </div>
            </div>

            <QuantityStepper
              value={item.qty}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={onRemove}
          className="text-[12px] flex gap-1 md:text-[14px] font-medium text-red-500 transition hover:text-red-600"
        >
            <Trash2 size={16} />
          Remove
        </button>

        <div className="flex items-center gap-1 text-[12px] md:text-[13px] text-gray-500">
          <ShieldCheck size={14} />
          <span>{item.warranty}</span>
        </div>
      </div>
    </div>
  );
}

function SavedCard({ item }) {
  return (
    <div className="h-28 w-24 md:h-36 md:w-32 min-w-[96px] md:min-w-[128px] overflow-hidden rounded-2xl bg-white shadow-sm">
      <img
        src={item.image}
        alt="Saved item"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function MobileCartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item,
      ),
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const { subtotal, totalItems } = useMemo(() => {
    const subtotalValue = cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    const totalItemsValue = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return {
      subtotal: subtotalValue,
      totalItems: totalItemsValue,
    };
  }, [cartItems]);

  return (
    <MobileLayout>
      <section className="pb-6">
        {/* Title row */}
        <div className="mb-5 flex items-center gap-3 md:mb-6">
          <button className="text-gray-700">
            <ChevronRight size={18} className="rotate-180" />
          </button>

          <h1 className="text-[18px] md:text-[32px] font-bold text-gray-900">
            Shopping Cart
          </h1>
        </div>

        {/* Shipping banner */}
        <div className="mb-5 rounded-2xl bg-blue-50 px-4 py-3 md:px-5 md:py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-500">
              <Truck size={18} />
            </div>

            <div>
              <p className="text-[12px] md:text-[14px] font-semibold text-blue-500">
                FREE Express Shipping
              </p>
              <p className="text-[10px] md:text-[13px] text-blue-400">
                Your order qualifies for complimentary next-day delivery
              </p>
            </div>
          </div>
        </div>

        {/* Cart items */}
        <div className="mb-6 rounded-3xl bg-white px-4 shadow-sm md:px-5">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => handleIncrease(item.id)}
              onDecrease={() => handleDecrease(item.id)}
              onRemove={() => handleRemove(item.id)}
            />
          ))}
        </div>

        {/* Saved for later */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] md:text-[24px] font-bold text-gray-900">
              Saved for Later
            </h2>

            <button className="flex items-center gap-1 text-[13px] md:text-[14px] font-medium text-blue-500">
              View All
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {savedForLater.map((item) => (
              <SavedCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-3xl bg-white p-4 shadow-sm md:p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[14px] md:text-[15px]">
              <span className="text-gray-500">
                Subtotal ({totalItems} items)
              </span>
              <span className="font-semibold text-gray-900">
                ${subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-[14px] md:text-[15px]">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold text-gray-900">FREE</span>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-[16px] md:text-[22px] font-bold text-gray-900">
                  Order Total
                </span>
                <span className="text-[20px] md:text-[32px] font-bold text-blue-500">
                  ${subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 tex1t-[18px] md:text-[17px] font-semibold text-white transition hover:bg-blue-600">
            Proceed to Checkout
            <ChevronRight size={20} />
          </button>
        </div>
      </section>
    </MobileLayout>
  );
}
