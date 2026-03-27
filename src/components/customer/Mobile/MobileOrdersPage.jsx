import React, { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  CalendarDays,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";
import MobileLayout from "../../components/layout/MobileLayout";

const orderTabs = [
  "All",
  "Not shipped yet",
  "Arriving today",
  "Delivered",
  "Cancelled",
];

const orders = [
  {
    id: 1,
    status: "Arriving today",
    productName: "iPhone 15 Pro Max - Titanium Blue",
    date: "October 24, 2023",
    price: 1190.0,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    status: "Delivered",
    productName: "Sony WH-1000XM5 Noise Cancelling Headphones",
    date: "October 15, 2023",
    price: 348.0,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    status: "Delivered",
    productName: "MacBook Air M2 - Space Gray",
    date: "September 28, 2023",
    price: 999.0,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    status: "Cancelled",
    productName: "Apple Watch Series 9 GPS",
    date: "September 12, 2023",
    price: 399.0,
    image:
      "https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?q=80&w=800&auto=format&fit=crop",
  },
];

function getStatusConfig(status) {
  switch (status) {
    case "Arriving today":
      return {
        icon: Truck,
        text: "text-gray-700",
        dot: "text-gray-500",
      };
    case "Delivered":
      return {
        icon: CheckCircle2,
        text: "text-blue-500",
        dot: "text-blue-500",
      };
    case "Cancelled":
      return {
        icon: XCircle,
        text: "text-red-500",
        dot: "text-red-500",
      };
    default:
      return {
        icon: Package,
        text: "text-gray-500",
        dot: "text-gray-500",
      };
  }
}     

function OrderTabs({ activeTab, setActiveTab }) {
  return (
    <div className="mb-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {orderTabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] md:text-[12px] font-medium transition ${
              isActive
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className={`flex items-center gap-2 text-[12px] md:text-[13px] font-medium ${statusConfig.text}`}>
          <StatusIcon size={14} />
          <span>{order.status}</span>
        </div>

        <button className="text-gray-400">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-3 md:gap-4">
        <div className="h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <img
            src={order.image}
            alt={order.productName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[13px] md:text-[14px] font-medium text-gray-900">
            {order.productName}
          </h3>

          <div className="mt-2 flex items-center gap-1 text-[11px] md:text-[12px] text-gray-400">
            <CalendarDays size={12} />
            <span>{order.date}</span>
          </div>

          <p className="mt-2 text-[14px] md:text-[22px] font-bold text-gray-900">
            ${order.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyOrders({ count }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-gray-300">
        <Package size={48} strokeWidth={1.5} />
      </div>

      <p className="text-[12px] md:text-[13px] text-gray-400">
        Showing {count} orders from the last 90 days
      </p>
    </div>
  );
}

export default function MobileOrdersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Arriving today");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab =
        activeTab === "All" ? true : order.status === activeTab;

      const matchesSearch =
        order.productName.toLowerCase().includes(search.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [search, activeTab]);

  return (
    <MobileLayout>
      <section className="pb-4">
        {/* Top title */}
        <div className="mb-5 md:mb-6">
          <h1 className="text-[24px] md:text-[34px] font-bold text-gray-900">
            Your Orders
          </h1>
        </div>

        {/* Tabs */}
        <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Purchase History */}
        <div className="mb-4">
          <h2 className="text-[18px] md:text-[26px] font-bold text-gray-900">
            Purchase History
          </h2>
          <p className="text-[12px] md:text-[13px] text-gray-400">
            Past 3 Months
          </p>
        </div>

        {/* Orders list */}
        <div className="space-y-4 md:space-y-5">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>

        {/* Bottom info */}
        <EmptyOrders count={filteredOrders.length} />
      </section>
    </MobileLayout>
  );
}