import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SiteFooter from "../../layout/SiteFooter";
import SiteHeader from "../../layout/SiteHeader";

const STATUS_TABS = ["All Orders", "Pending", "Delivered", "Cancelled"];

function normalizeStatus(order) {
  const raw = (order?.orderStatus || order?.status || "").toLowerCase();
  switch (raw) {
    case "delivered": return "Delivered";
    case "cancelled": return "Cancelled";
    case "shipped":
    case "placed":
    case "confirmed":
    case "packed":
    case "processing": return "Pending";
    default: return "Pending";
  }
}

function getStatusClasses(status) {
  switch (status) {
    case "Delivered":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400";
    case "Pending":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400";
    case "Cancelled":
      return "bg-gray-200 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FilterTabs({ activeTab, setActiveTab }) {
  return (
    <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2">
      {STATUS_TABS.map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-[14px] font-medium transition-all duration-300 ${
              active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 dark:bg-blue-500"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const status = normalizeStatus(order);
  const orderId = order._id;
  const shortId = orderId ? `#${orderId.slice(-6).toUpperCase()}` : "#------";
  const total = order.totalAmount ?? order.pricing?.total ?? 0;

  return (
    <Link
      to={`/orders/${orderId}`}
      className="block rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/30"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="mb-2 text-[18px] font-bold text-gray-900 dark:text-gray-100">
            Order {shortId}
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400">
            <i className="ri-calendar-line mr-1" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <span className={`w-fit rounded-full px-4 py-2 text-[13px] font-semibold ${getStatusClasses(status)}`}>
          {status}
        </span>
      </div>

      {/* Items */}
      <div className="mb-6 space-y-4">
        {(order.items || []).map((item, idx) => {
          const name = item.name || item.product?.name || "Product";
          const image = item.image || item.product?.image || item.product?.images?.[0]?.url;
          const qty = item.quantity || 1;
          const price = item.unitPrice ?? item.price ?? 0;

          return (
            <div key={item._id || idx} className="flex items-center gap-4">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="h-20 w-20 rounded-xl bg-gray-50 object-cover dark:bg-gray-800"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  <i className="ri-box-3-line text-[24px] text-gray-300" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">{name}</h4>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">Quantity: {qty}</p>
              </div>
              <span className="text-[16px] font-bold text-gray-900 dark:text-gray-100">
                ₹{price}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-[14px] text-gray-500 dark:text-gray-400">Total Amount</p>
          <p className="text-[20px] font-bold text-blue-600 dark:text-blue-400">₹{total}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {status !== "Cancelled" && (
            <span className="whitespace-nowrap rounded-xl bg-gray-100 px-6 py-3 text-[14px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Track Order
            </span>
          )}
          <span className="whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 text-[14px] font-medium text-white dark:bg-blue-500">
            View Details <i className="ri-arrow-right-line ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
      <i className="ri-file-list-3-line text-5xl text-gray-300 dark:text-blue-400" />
      <h2 className="mb-2 mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
        No orders found
      </h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        There are no orders in this category.
      </p>
      <Link
        to="/shop"
        className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrdersPage({ orders = [], loading, error }) {
  const [activeTab, setActiveTab] = useState("All Orders");

  const filteredOrders = useMemo(() => {
    if (activeTab === "All Orders") return orders;
    return orders.filter((order) => normalizeStatus(order) === activeTab);
  }, [activeTab, orders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
        <SiteHeader />
        <div className="pb-20 pt-24">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="grid place-items-center rounded-2xl border border-gray-100 bg-white py-20 dark:border-gray-800 dark:bg-gray-900">
              <i className="ri-loader-4-line animate-spin text-[40px] text-blue-500" />
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
        <SiteHeader />
        <div className="pb-20 pt-24">
          <div className="mx-auto max-w-[1400px] px-6">
            <div className="rounded-2xl border border-blue-100 bg-white p-10 text-center text-blue-600 dark:border-blue-500/20 dark:bg-gray-900 dark:text-blue-400">
              {error}
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]">
      <SiteHeader />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-bold text-gray-900 dark:text-gray-100">
              Order History
            </h1>
            <p className="text-[15px] text-gray-500 dark:text-gray-400">
              View and manage your past orders
            </p>
          </div>

          <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {filteredOrders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}