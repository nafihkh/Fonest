import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  CalendarDays,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

const orderTabs = [
  "All",
  "Not shipped yet",
  "Arriving today",
  "Delivered",
  "Cancelled",
];

function mapOrderStatus(order) {
  const raw = (order?.orderStatus || order?.status || "").toLowerCase();

  switch (raw) {
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "shipped":
      return "Arriving today";
    case "placed":
    case "confirmed":
    case "packed":
    case "processing":
      return "Not shipped yet";
    default:
      return "Not shipped yet";
  }
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getStatusConfig(status) {
  switch (status) {
    case "Arriving today":
      return {
        icon: Truck,
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-500/10",
      };

    case "Delivered":
      return {
        icon: CheckCircle2,
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-500/10",
      };

    case "Cancelled":
      return {
        icon: XCircle,
        text: "text-red-500 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-500/10",
      };

    default:
      return {
        icon: Package,
        text: "text-gray-500 dark:text-gray-400",
        bg: "bg-gray-100 dark:bg-gray-800",
      };
  }
}

function OrderTabs({ activeTab, setActiveTab }) {
  return (
    <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2">
      {orderTabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-[11px] font-medium transition-all duration-200 md:text-[12px] ${
              isActive
                ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20 dark:border-blue-500 dark:bg-blue-500"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
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
  const status = mapOrderStatus(order);
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  const firstItem = order.items?.[0];

  return (
    <div className="group rounded-3xl border mb-4 border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-100/40 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/20 dark:hover:shadow-black/20 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium md:text-[13px] ${statusConfig.text} ${statusConfig.bg}`}
        >
          <StatusIcon size={14} />
          <span>{status}</span>
        </div>

        <button className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-blue-500 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-blue-400">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-3 md:gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 md:h-20 md:w-20">
          <img
            src={firstItem?.image || ""}
            alt={firstItem?.name || "Order item"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[13px] font-medium text-gray-900 dark:text-gray-100 md:text-[14px]">
            {firstItem?.name || "Product"}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 md:text-[12px]">
            <CalendarDays size={12} />
            <span>{formatDate(order.createdAt)}</span>
          </div>

          <p className="mt-3 text-[18px] font-bold text-gray-900 dark:text-gray-100 md:text-[22px]">
            {formatPrice(order.pricing?.total || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyOrders({ count }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-14 text-center dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-400 dark:bg-blue-500/10 dark:text-blue-400">
        <Package size={42} strokeWidth={1.5} />
      </div>

      <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400">
        Showing {count} orders
      </p>
    </div>
  );
}

export default function MobileOrdersPage({
  orders = [],
  loading,
  error,
  search = "",
}) {
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const status = mapOrderStatus(order);

      const matchesTab = activeTab === "All" ? true : status === activeTab;

      const firstItem = order.items?.[0];
      const productName = firstItem?.name || "";

      const matchesSearch = productName
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [orders, search, activeTab]);

  return (
    <section className="pb-4">
      <div className="mb-5 md:mb-6">
        <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100 md:text-[34px]">
          Your Orders
        </h1>
      </div>

      <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100 md:text-[26px]">
          Purchase History
        </h2>

        <p className="text-[12px] text-gray-400 dark:text-gray-500 md:text-[13px]">
          Past 3 Months
        </p>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 text-center text-gray-500 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          Loading orders...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-100 bg-white p-6 text-center text-red-500 shadow-sm dark:border-red-500/20 dark:bg-gray-900 dark:text-red-400">
          {error}
        </div>
      ) : (
        <>
          <div className="space-y-4 md:space-y-5">
            {filteredOrders.map((order) => (
              <Link to={`/orders/${order._id}`}>
                <OrderCard key={order._id} order={order} />
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <EmptyOrders count={filteredOrders.length} />
          </div>
        </>
      )}
    </section>
  );
}