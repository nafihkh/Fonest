import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/layout/SiteFooter";
import Header from "../../components/layout/SiteHeader"

const ordersData = [
  {
    id: "FNT-2025-00123",
    date: "12 Feb 2025",
    status: "Delivered",
    total: 648,
    items: [
      {
        id: 1,
        name: "Apple Watch Series 9",
        quantity: 1,
        price: 399,
        image:
          "https://readdy.ai/api/search-image?query=premium%20luxury%20apple%20watch%20series%209%20smartwatch%20with%20sleek%20black%20band%20on%20pure%20white%20minimalist%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20resolution%20close%20up%20detailed%20view&width=800&height=800&seq=prod1&orientation=squarish",
      },
    ],
  },
  {
    id: "FNT-2025-00098",
    date: "05 Feb 2025",
    status: "Processing",
    total: 498,
    items: [
      {
        id: 2,
        name: "AirPods Pro 2nd Gen",
        quantity: 2,
        price: 249,
        image:
          "https://readdy.ai/api/search-image?query=apple%20airpods%20pro%20second%20generation%20white%20wireless%20earbuds%20with%20charging%20case%20on%20clean%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20detail%20close%20up%20shot&width=800&height=800&seq=prod2&orientation=squarish",
      },
    ],
  },
  {
    id: "FNT-2025-00067",
    date: "28 Jan 2025",
    status: "Delivered",
    total: 1199,
    items: [
      {
        id: 3,
        name: "iPhone 15 Pro Max",
        quantity: 1,
        price: 1199,
        image:
          "https://readdy.ai/api/search-image?query=flagship%20apple%20iphone%2015%20pro%20max%20titanium%20smartphone%20with%20triple%20camera%20system%20on%20pristine%20white%20background%20premium%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20resolution%20detailed%20close%20up%20view&width=800&height=800&seq=prod3&orientation=squarish",
      },
    ],
  },
  {
    id: "FNT-2025-00045",
    date: "15 Jan 2025",
    status: "Cancelled",
    total: 349,
    items: [
      {
        id: 4,
        name: "Sony WH-1000XM5",
        quantity: 1,
        price: 349,
        image:
          "https://readdy.ai/api/search-image?query=sony%20premium%20noise%20cancelling%20over%20ear%20headphones%20black%20sleek%20design%20on%20white%20background%20product%20photography%20studio%20lighting%20ultra%20realistic%20high%20detail&width=800&height=800&seq=prod4&orientation=squarish",
      },
    ],
  },
];

const tabs = ["All Orders", "Delivered", "Processing", "Cancelled"];

function getStatusClasses(status) {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Processing":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}


function FilterTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const active = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full font-medium text-[14px] transition-all duration-300 whitespace-nowrap ${
              active
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}

function OrderItem({ item }) {
  return (
    <div className="flex items-center gap-4">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-xl bg-gray-50"
      />
      <div className="flex-1">
        <h4 className="text-[15px] font-semibold text-gray-900">{item.name}</h4>
        <p className="text-[13px] text-gray-500">Quantity: {item.quantity}</p>
      </div>
      <span className="text-[16px] font-bold text-gray-900">${item.price}</span>
    </div>
  );
}

function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-[18px] font-bold text-gray-900 mb-2">
            Order #{order.id}
          </h3>
          <p className="text-[14px] text-gray-600">
            <i className="ri-calendar-line mr-1"></i>
            Order Date: <strong>{order.date}</strong>
          </p>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-[13px] font-semibold w-fit ${getStatusClasses(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {order.items.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-100">
        <div>
          <p className="text-[14px] text-gray-600 mb-1">Total Amount</p>
          <p className="text-[20px] font-bold text-gray-900">${order.total}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {order.status !== "Cancelled" && (
            <Link
              to="/tracking"
              className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-medium text-[14px] hover:bg-gray-200 transition-all duration-300 whitespace-nowrap"
            >
              Track Order
            </Link>
          )}

          <Link
            to={`/product/${order.items[0]?.id}`}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium text-[14px] hover:bg-red-700 transition-all duration-300 whitespace-nowrap"
          >
            Buy Again
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
      <i className="ri-file-list-3-line text-5xl text-gray-300"></i>
      <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
        No orders found
      </h2>
      <p className="text-gray-500 mb-6">
        There are no orders in this category.
      </p>
      <Link
        to="/shop"
        className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all duration-300"
      >
        Continue Shopping
      </Link>
    </div>
  );
}



export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All Orders");

  const filteredOrders = useMemo(() => {
    if (activeTab === "All Orders") return ordersData;
    return ordersData.filter((order) => order.status === activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Order History</h1>
            <p className="text-[15px] text-gray-600">
              View and manage your past orders
            </p>
          </div>

          <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {filteredOrders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}