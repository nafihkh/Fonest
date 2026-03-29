import React from "react";
import {
  ChevronLeft,
  HelpCircle,
  ChevronRight,
  PackageCheck,
  Truck,
  House,
  MapPin,
  CalendarDays,
  CreditCard,
  Share2,
  RotateCcw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function StatusStep({ icon: Icon, label, active, completed, line }) {
  return (
    <div className="relative flex flex-1 flex-col items-center">
      <div
        className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
          completed || active
            ? "border-blue-500 bg-blue-500 text-white dark:border-blue-500 dark:bg-blue-500"
            : "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
        }`}
      >
        <Icon size={16} />
      </div>

      {line ? (
        <div
          className={`absolute left-1/2 top-5 h-[2px] w-full ${
            completed ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"
          }`}
        />
      ) : null}

      <p
        className={`mt-2 text-center text-[10px] font-medium ${
          completed || active
            ? "text-gray-900 dark:text-gray-100"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400 dark:text-gray-500">
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p
          className={`mt-1 text-[12px] leading-5 text-gray-700 dark:text-gray-300 ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function RelatedProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id || product.id}`}
      className="min-w-[108px] max-w-[108px]"
    >
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
        <div className="h-[88px] rounded-2xl bg-gray-100 dark:bg-gray-800">
          <img
            src={
              product.image ||
              product.images?.[0]?.url ||
              product.images?.[0] ||
              ""
            }
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="pt-2">
          <h4 className="line-clamp-2 text-[11px] font-medium leading-4 text-gray-800 dark:text-gray-200">
            {product.name}
          </h4>
          <p className="mt-1 text-[12px] font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function OrderDetailsMobile({
  order,
  loading,
  error,
  relatedProducts = [],
}) {
  const navigate = useNavigate();

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-4 text-sm text-gray-500 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)] dark:text-gray-400">
        Loading order...
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-4 text-sm text-blue-500 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)] dark:text-blue-400">
        {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f8fa] p-4 text-sm text-gray-500 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)] dark:text-gray-400">
        Order not found
      </div>
    );
  }

  const item = order.items?.[0];
  const status = (order.orderStatus || "").toLowerCase();

  const statusTitleMap = {
    placed: "Order Placed",
    confirmed: "Order Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const statusTitle = statusTitleMap[status] || "Order Status";

  const subtotal = order.pricing?.subtotal || 0;
  const shipping = order.pricing?.deliveryCharge || 0;
  const tax = order.pricing?.tax || 0;
  const total = order.pricing?.total || 0;

  const deliveryText = order.estimatedDeliveryText || "Monday, 14 July";

  const stepMap = {
    placed: 1,
    confirmed: 2,
    packed: 2,
    shipped: 3,
    delivered: 4,
  };

  const currentStep = stepMap[status] || 1;
  const isCancelled = status === "cancelled";

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#f7f8fa] px-4 pb-3 pt-4 dark:bg-[#0b1220]/90 dark:backdrop-blur-md">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-800 dark:text-gray-100"
          >
            <ChevronLeft size={18} />
            <span className="text-[15px] font-semibold">Order Detail</span>
          </button>

          <button className="text-[12px] font-medium text-blue-500 dark:text-blue-400">
            Help
          </button>
        </div>
      </div>

      <div className="space-y-4 px-4">
        {/* Delivery status */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">
              {statusTitle}
            </h2>

            <button className="text-[11px] font-medium text-blue-500 dark:text-blue-400">
              See all orders
            </button>
          </div>
        </div>

        {/* Product card */}
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <div className="flex gap-3">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
              <img
                src={item?.image || ""}
                alt={item?.name || "Product"}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400">
                Electronics
              </p>

              <h3 className="mt-1 line-clamp-2 text-[14px] font-semibold leading-5 text-gray-900 dark:text-gray-100">
                {item?.name || "iPhone 15 Pro Max - Titanium Black, 256GB"}
              </h3>

              <p className="mt-2 text-[13px] font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(item?.price || total)}
              </p>
            </div>
          </div>
        </div>

        {/* Shipping progress */}
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-gray-900 dark:text-gray-100">
                Shipping Progress
              </h3>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              Updated 5 mins ago
            </p>
          </div>

          <div className="flex items-start">
            <StatusStep
              icon={PackageCheck}
              label="Placed"
              completed={!isCancelled && currentStep > 1}
              active={!isCancelled && currentStep === 1}
              line={true}
            />

            <StatusStep
              icon={PackageCheck}
              label="Packed"
              completed={!isCancelled && currentStep > 2}
              active={!isCancelled && currentStep === 2}
              line={true}
            />

            <StatusStep
              icon={Truck}
              label="Shipped"
              completed={!isCancelled && currentStep > 3}
              active={!isCancelled && currentStep === 3}
              line={true}
            />

            <StatusStep
              icon={House}
              label="Delivered"
              completed={!isCancelled && currentStep === 4}
              active={false}
              line={false}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() =>
              item?.productId && navigate(`/product/${item.productId}`)
            }
            className="rounded-2xl bg-blue-500 py-3 text-[13px] font-semibold text-white transition dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Buy Again
          </button>

          <button onClick={() => item?._id && navigate(`/delivery-instructions/${item._id}`)} className="rounded-2xl border border-gray-200 bg-white py-3 text-[13px] font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            Update Instructions
          </button>
        </div>

        {/* Small actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 text-[12px] font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            <Share2 size={14} />
            Share
          </button>

          <button className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 text-[12px] font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
            <RotateCcw size={14} />
            Return
          </button>
        </div>

        {/* Tracking banner */}
        <div className="rounded-3xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500 dark:text-blue-400">
                Delivered by FONEST
              </p>
              <p className="mt-1 text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                Tracking ID :{" "}
                {order._id?.slice(-10)?.toUpperCase() || "FN998237410"}
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-900">
              <HelpCircle
                size={16}
                className="text-blue-500 dark:text-blue-400"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
                Track Live on Map
              </p>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                Courier is 2 miles away from your location
              </p>
            </div>

            <ChevronRight
              size={16}
              className="text-blue-500 dark:text-blue-400"
            />
          </div>
        </div>

        {/* Order Information */}
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-[14px] font-bold text-gray-900 dark:text-gray-100">
            Order Information
          </h3>

          <div className="space-y-4">
            <InfoRow
              icon={MapPin}
              label="Shipping Address"
              value={`${order.address?.fullName || "Demo User"}, ${
                order.address?.line1 || "321 Silicon Valley Way"
              }, ${order.address?.city || "Apartment 4B"}, ${
                order.address?.state || "San Jose"
              }, ${order.address?.pincode || "CA 95112"}, ${
                order.address?.country || "United States"
              }`}
            />

            <InfoRow
              icon={CreditCard}
              label="Payment Method"
              value={`Visa ending in **** ${order.payment?.last4 || "4242"}`}
            />

            <InfoRow
              icon={CalendarDays}
              label="Order Date"
              value={deliveryText}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-[14px] font-bold text-gray-900 dark:text-gray-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-[12px]">
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span>Order Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span>Shipping & Handling</span>
              <span>{formatPrice(shipping)}</span>
            </div>

            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>

            <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
                  Grand Total
                </span>
                <span className="text-[18px] font-bold text-blue-500 dark:text-blue-400">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {!!relatedProducts?.length && (
          <div className="pb-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">
                Related Products
              </h3>
              <button className="text-[11px] font-medium text-blue-500 dark:text-blue-400">
                View all
              </button>
            </div>

            <div className="no-scrollbar flex gap-3 overflow-x-auto">
              {relatedProducts.map((product) => (
                <RelatedProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}