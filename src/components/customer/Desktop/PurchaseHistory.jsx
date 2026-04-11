import React, { useState } from "react";
import { Link } from "react-router-dom";
import SiteFooter from "../../layout/SiteFooter";
import SiteHeader from "../../layout/SiteHeader";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { label: "All Orders", value: "all" },
  { label: "Pending",    value: "pending" },
  { label: "Delivered",  value: "delivered" },
  { label: "Cancelled",  value: "cancelled" },
];

const MONTHS = [
  { label: "All Months", value: "" },
  { label: "January",   value: "1" },
  { label: "February",  value: "2" },
  { label: "March",     value: "3" },
  { label: "April",     value: "4" },
  { label: "May",       value: "5" },
  { label: "June",      value: "6" },
  { label: "July",      value: "7" },
  { label: "August",    value: "8" },
  { label: "September", value: "9" },
  { label: "October",   value: "10" },
  { label: "November",  value: "11" },
  { label: "December",  value: "12" },
];

function buildYearOptions() {
  const current = new Date().getFullYear();
  const years = [{ label: "All Years", value: "" }];
  for (let y = current; y >= current - 5; y--) {
    years.push({ label: String(y), value: String(y) });
  }
  return years;
}
const YEAR_OPTIONS = buildYearOptions();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeStatus(order) {
  const raw = (order?.orderStatus || order?.status || "").toLowerCase();
  switch (raw) {
    case "delivered":  return "Delivered";
    case "cancelled":  return "Cancelled";
    default:           return "Pending";
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
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-4">
      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const active = filters.status === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onFilterChange({ status: tab.value })}
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 ${
                active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 dark:bg-blue-500"
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Month Dropdown */}
      <select
        value={filters.month}
        onChange={(e) => onFilterChange({ month: e.target.value })}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      {/* Year Dropdown */}
      <select
        value={filters.year}
        onChange={(e) => onFilterChange({ year: e.target.value })}
        className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
      >
        {YEAR_OPTIONS.map((y) => (
          <option key={y.value} value={y.value}>{y.label}</option>
        ))}
      </select>
    </div>
  );
}

function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  const { page, totalPages } = meta;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        <i className="ri-arrow-left-s-line text-[18px]" />
      </button>

      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">1</button>
          {start > 2 && <span className="px-1 text-gray-400">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`flex h-10 w-10 items-center justify-center rounded-xl border text-[13px] font-medium transition ${
            p === page
              ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/25 dark:border-blue-500 dark:bg-blue-500"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
          <button onClick={() => onPageChange(totalPages)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">{totalPages}</button>
        </>
      )}

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-blue-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        <i className="ri-arrow-right-s-line text-[18px]" />
      </button>
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
          const name  = item.name || item.product?.name || "Product";
          const image = item.image || item.product?.image || item.product?.images?.[0]?.url;
          const qty   = item.quantity || 1;
          const price = item.unitPrice ?? item.price ?? 0;

          return (
            <div key={item._id || idx} className="flex items-center gap-4">
              {image ? (
                <img src={image} alt={name} className="h-20 w-20 rounded-xl bg-gray-50 object-cover dark:bg-gray-800" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  <i className="ri-box-3-line text-[24px] text-gray-300" />
                </div>
              )}
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">{name}</h4>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">Quantity: {qty}</p>
              </div>
              <span className="text-[16px] font-bold text-gray-900 dark:text-gray-100">₹{price}</span>
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

function SkeletonCards() {
  return (
    <div className="space-y-5 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-28 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          {[1, 2].map((j) => (
            <div key={j} className="mb-4 flex items-center gap-4">
              <div className="h-20 w-20 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-5 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="flex gap-3">
              <div className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
      <i className="ri-file-list-3-line text-5xl text-gray-300 dark:text-blue-400" />
      <h2 className="mb-2 mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">No orders found</h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400">There are no orders matching your filters.</p>
      <Link
        to="/shop"
        className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function OrdersPage({ orders = [], meta, loading, error, filters = {}, onFilterChange, onPageChange }) {
  const bg = "min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]";

  if (error) {
    return (
      <div className={bg}>
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
    <div className={bg}>
      <SiteHeader />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-[1400px] px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-bold text-gray-900 dark:text-gray-100">Order History</h1>
            <p className="text-[15px] text-gray-500 dark:text-gray-400">
              View and manage your past orders
              {meta && !loading && (
                <span className="ml-2 text-blue-500 dark:text-blue-400">
                  — {meta.total} order{meta.total !== 1 ? "s" : ""} found
                </span>
              )}
            </p>
          </div>

          {/* Filters */}
          <FilterBar filters={filters} onFilterChange={onFilterChange} />

          {/* Content */}
          {loading ? (
            <SkeletonCards />
          ) : orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && <Pagination meta={meta} onPageChange={onPageChange} />}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}