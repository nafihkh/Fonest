import React from "react";
import {
  PackageCheck,
  Truck,
  House,
  MapPin,
  CalendarDays,
  CreditCard,
  Share2,
  RotateCcw,
  ChevronLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../layout/SiteHeader";
import Footer from "../../layout/SiteFooter";

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}

function StatusStep({ icon: Icon, title, subtitle, active, completed, last }) {
  return (
    <div className="relative flex flex-1 items-start gap-4">
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300 ${
            completed || active
              ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
              : "border-gray-300 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500"
          }`}
        >
          <Icon size={18} />
        </div>

        {!last && (
          <div
            className={`mt-2 h-16 w-[2px] ${
              completed
                ? "bg-blue-600 dark:bg-blue-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        )}
      </div>

      <div className="pt-2">
        <h4
          className={`text-[15px] font-semibold ${
            completed || active
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {title}
        </h4>
        <p
          className={`mt-1 text-[13px] ${
            completed || active
              ? "text-gray-600 dark:text-gray-400"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-5 text-[18px] font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400 dark:text-gray-500">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p
          className={`mt-1 text-[14px] leading-6 text-gray-700 dark:text-gray-300 ${valueClass}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ProductRow({ item }) {
  const product = item.product || {};
  const productId = product._id || item.productId || item.product;
  const name = item.name || product.name || "Product";
  const image =
    item.image ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    "";
  const quantity = item.quantity || 1;
  const price = item.price ?? product.price ?? 0;
  const total = quantity * price;

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:flex-row">
      <Link
        to={`/product/${productId}`}
        className="h-28 w-full overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-800 sm:w-28"
      >
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Electronics
            </p>

            <Link
              to={`/product/${productId}`}
              className="mt-1 block text-[18px] font-semibold text-gray-900 transition-colors hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400"
            >
              {name}
            </Link>

            <p className="mt-2 text-[14px] text-gray-500 dark:text-gray-400">
              {item.variantName || item.variantLabel || "Standard Variant"}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-[22px] font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(total)}
            </p>
            <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
              {formatPrice(price)} × {quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ order }) {
  const subtotal = order?.pricing?.subtotal || 0;
  const shipping = order?.pricing?.deliveryCharge || 0;
  const tax = order?.pricing?.tax || 0;
  const total = order?.pricing?.total || subtotal + shipping + tax;

  return (
    <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-6 text-[18px] font-bold text-gray-900 dark:text-gray-100">
        Order Summary
      </h2>

      <div className="space-y-4">
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
            {shipping === 0 ? "FREE" : formatPrice(shipping)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[14px] text-gray-600 dark:text-gray-400">
            Tax
          </span>
          <span className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
            {formatPrice(tax)}
          </span>
        </div>
      </div>

      <div className="my-6 border-t border-gray-200 pt-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
            Grand Total
          </span>
          <span className="text-[24px] font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
          <Share2 size={16} />
          Share Order
        </button>

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 py-4 text-[15px] font-semibold text-gray-900 transition-all duration-300 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
          <RotateCcw size={16} />
          Return / Replace
        </button>
      </div>
    </div>
  );
}

export default function OrderDetailsDesktop({
  order,
  loading,
  error,
  relatedProducts = [],
}) {
  const navigate = useNavigate();

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
        <Header />
        <div className="pb-20 pt-24">
          <div className="mx-auto max-w-[1600px] px-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
              Loading order...
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
        <Header />
        <div className="pb-20 pt-24">
          <div className="mx-auto max-w-[1600px] px-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-red-500 dark:border-gray-800 dark:bg-gray-900">
              {error}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
        <Header />
        <div className="pb-20 pt-24">
          <div className="mx-auto max-w-[1600px] px-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
              Order not found
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const status = (order.orderStatus || "").toLowerCase();
  const isCancelled = status === "cancelled";

  const statusTitleMap = {
    placed: "Order Placed",
    confirmed: "Order Confirmed",
    packed: "Packed",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const statusTitle = statusTitleMap[status] || "Order Details";

  const stepMap = {
    placed: 1,
    confirmed: 2,
    packed: 2,
    shipped: 3,
    delivered: 4,
  };

  const currentStep = stepMap[status] || 1;

  const fullAddress = `${order.address?.fullName || "Customer"}, ${
    order.address?.line1 || ""
  } ${order.address?.line2 || ""}, ${order.address?.city || ""}, ${
    order.address?.state || ""
  } - ${order.address?.pincode || ""}, ${order.address?.country || "India"}`;

  const paymentText =
    order.payment?.method ||
    order.paymentMethod ||
    "Razorpay / Online Payment";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
      <Header />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="mb-3 inline-flex items-center gap-2 text-[14px] font-medium text-gray-500 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {statusTitle}
              </h1>

              <p className="mt-2 text-[15px] text-gray-500 dark:text-gray-400">
                Order ID:{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {order.orderNumber || order._id}
                </span>
              </p>
            </div>

            <Link
              to="/orders"
              className="rounded-2xl bg-white px-5 py-3 text-[14px] font-semibold text-gray-900 transition-all duration-300 hover:shadow-md dark:border dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
            >
              See All Orders
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="space-y-8 xl:col-span-2">
              <InfoCard title="Shipping Progress">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <StatusStep
                    icon={PackageCheck}
                    title="Placed"
                    subtitle="Your order has been placed"
                    completed={!isCancelled && currentStep > 1}
                    active={!isCancelled && currentStep === 1}
                  />

                  <StatusStep
                    icon={PackageCheck}
                    title="Packed"
                    subtitle="Packed and ready for dispatch"
                    completed={!isCancelled && currentStep > 2}
                    active={!isCancelled && currentStep === 2}
                  />

                  <StatusStep
                    icon={Truck}
                    title="Shipped"
                    subtitle="On the way to your address"
                    completed={!isCancelled && currentStep > 3}
                    active={!isCancelled && currentStep === 3}
                  />

                  <StatusStep
                    icon={House}
                    title="Delivered"
                    subtitle="Delivered successfully"
                    completed={!isCancelled && currentStep === 4}
                    active={false}
                    last
                  />
                </div>
              </InfoCard>

              <InfoCard title="Ordered Items">
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <ProductRow
                      key={item._id || `${item.product}-${index}`}
                      item={item}
                    />
                  ))}
                </div>
              </InfoCard>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <InfoCard title="Delivery Information">
                  <div className="space-y-5">
                    <InfoRow
                      icon={MapPin}
                      label="Shipping Address"
                      value={fullAddress}
                    />

                    <InfoRow
                      icon={CalendarDays}
                      label="Order Date"
                      value={formatDate(order.createdAt)}
                    />

                    <InfoRow
                      icon={CalendarDays}
                      label="Estimated Delivery"
                      value={order.estimatedDeliveryText || "Will be updated soon"}
                    />
                  </div>
                </InfoCard>

                <InfoCard title="Payment Information">
                  <div className="space-y-5">
                    <InfoRow
                      icon={CreditCard}
                      label="Payment Method"
                      value={paymentText}
                    />

                    <InfoRow
                      icon={CreditCard}
                      label="Payment Status"
                      value={order.paymentStatus || "Pending"}
                      valueClass="font-semibold text-blue-600 dark:text-blue-400"
                    />

                    <InfoRow
                      icon={PackageCheck}
                      label="Tracking ID"
                      value={order._id?.slice(-10)?.toUpperCase() || "FONEST-TRACK"}
                    />
                  </div>
                </InfoCard>
              </div>

              {!!relatedProducts?.length && (
                <InfoCard title="Related Products">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                    {relatedProducts.map((product) => (
                      <Link
                        key={product._id || product.id}
                        to={`/product/${product._id || product.id}`}
                        className="overflow-hidden rounded-2xl bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
                      >
                        <div className="h-44 bg-gray-100 dark:bg-gray-800">
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

                        <div className="p-4">
                          <h4 className="line-clamp-2 text-[14px] font-medium text-gray-800 dark:text-gray-200">
                            {product.name}
                          </h4>
                          <p className="mt-2 text-[16px] font-bold text-gray-900 dark:text-gray-100">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </InfoCard>
              )}
            </div>

            <div className="xl:col-span-1">
              <SummaryCard order={order} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}