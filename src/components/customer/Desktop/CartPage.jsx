import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../layout/SiteFooter";
import Header from "../../layout/SiteHeader";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const product = item.product || {};
  const productId = product._id || item.product;
  const productName = product.name || item.name || "Product";
  const productImage =
    product.images?.[0]?.url || product.images?.[0] || item.image || "";
  const price = item.price ?? product.price ?? 0;
  const quantity = item.quantity || 1;
  const total = price * quantity;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/30">
      <div className="flex flex-col gap-6 sm:flex-row">
        <Link
          to={`/product/${productId}`}
          className="h-32 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 sm:w-32"
        >
          <img
            src={productImage}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </Link>

        <div className="flex-1">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <Link
                to={`/product/${productId}`}
                className="text-[17px] font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
              >
                {productName}
              </Link>

              <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
                {item.variantName || item.variantLabel || "Standard"}
              </p>
            </div>

            <button
              onClick={() => onRemove(item)}
              className="rounded-lg p-2 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              <i className="ri-delete-bin-line text-[20px] text-blue-600 dark:text-blue-400"></i>
            </button>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onDecrease(item)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-all duration-300 hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-500/20"
              >
                <i className="ri-subtract-line text-[16px]"></i>
              </button>

              <span className="w-12 text-center text-[15px] font-semibold text-gray-900 dark:text-gray-100">
                {quantity}
              </span>

              <button
                onClick={() => onIncrease(item)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 transition-all duration-300 hover:bg-blue-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-blue-500/20"
              >
                <i className="ri-add-line text-[16px]"></i>
              </button>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[20px] font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(total)}
              </p>

              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                {formatPrice(price)} each
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal }) {
  const navigate = useNavigate();
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-6 text-[18px] font-bold text-gray-900 dark:text-gray-100">
        Order Summary
      </h2>

      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-gray-600 dark:text-gray-400">
            Subtotal
          </span>

          <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] text-gray-600 dark:text-gray-400">
            Delivery
          </span>

          <span className="text-[15px] font-semibold text-blue-600 dark:text-blue-400">
            FREE
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] text-gray-600 dark:text-gray-400">
            Tax (8%)
          </span>

          <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
            {formatPrice(tax)}
          </span>
        </div>
      </div>

      <div className="mb-6 border-t border-gray-200 pt-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
            Total
          </span>

          <span className="text-[24px] font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="mb-3 w-full rounded-2xl bg-blue-600 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Proceed to Checkout
      </button>

      <Link
        to="/shop"
        className="block w-full rounded-2xl bg-gray-100 py-4 text-center text-[15px] font-semibold text-gray-900 transition-all duration-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function CartPage({
  cartItems = [],
  subtotal = 0,
  loading,
  error,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
      <Header />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-[1600px] px-6">
          <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
            Shopping Cart
          </h1>

          {loading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
              Loading cart...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-red-500 dark:border-gray-800 dark:bg-gray-900">
              {error}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
              <i className="ri-shopping-cart-line text-5xl text-gray-300 dark:text-blue-400"></i>

              <h2 className="mb-2 mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Your cart is empty
              </h2>

              <p className="mb-6 text-gray-500 dark:text-gray-400">
                Add some products to continue shopping.
              </p>

              <Link
                to="/shop"
                className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item._id || `${item.product}-${index}`}
                    item={item}
                    onIncrease={onIncrease}
                    onDecrease={onDecrease}
                    onRemove={onRemove}
                  />
                ))}
              </div>

              <div className="lg:col-span-1">
                <OrderSummary subtotal={Number(subtotal || 0)} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}