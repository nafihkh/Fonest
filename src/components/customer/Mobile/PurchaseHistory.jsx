import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  CalendarDays,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
  ChevronLeft,
  SlidersHorizontal,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_TABS = [
  { label: "All",       value: "all" },
  { label: "Pending",   value: "pending" },
  { label: "Shipped",   value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const MONTHS = [
  { label: "All Months", value: "" },
  { label: "Jan",  value: "1" },
  { label: "Feb",  value: "2" },
  { label: "Mar",  value: "3" },
  { label: "Apr",  value: "4" },
  { label: "May",  value: "5" },
  { label: "Jun",  value: "6" },
  { label: "Jul",  value: "7" },
  { label: "Aug",  value: "8" },
  { label: "Sep",  value: "9" },
  { label: "Oct",  value: "10" },
  { label: "Nov",  value: "11" },
  { label: "Dec",  value: "12" },
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

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function getStatusConfig(rawStatus) {
  const s = (rawStatus || "").toLowerCase();
  switch (s) {
    case "shipped":
      return { icon: Truck,         text: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-500/10" };
    case "delivered":
      return { icon: CheckCircle2,  text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" };
    case "cancelled":
      return { icon: XCircle,       text: "text-red-500 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-500/10" };
    default:
      return { icon: Package,       text: "text-gray-500 dark:text-gray-400",    bg: "bg-gray-100 dark:bg-gray-800" };
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusTabs({ filters, onFilterChange }) {
  return (
    <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
      {STATUS_TABS.map((tab) => {
        const isActive = filters.status === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange({ status: tab.value })}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-[11px] font-medium transition-all duration-200 ${
              isActive
                ? "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/20"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

function DateFilters({ filters, onFilterChange, showFilters, setShowFilters }) {
  const hasFilter = filters.month || filters.year;
  return (
    <div className="mb-5">
      <button
        onClick={() => setShowFilters((v) => !v)}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-[12px] font-medium transition ${
          hasFilter
            ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400"
            : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        }`}
      >
        <SlidersHorizontal size={13} />
        {hasFilter
          ? `${MONTHS.find((m) => m.value === filters.month)?.label || ""}${filters.month && filters.year ? " · " : ""}${filters.year || ""}`
          : "Filter by date"}
      </button>

      {showFilters && (
        <div className="mt-3 flex flex-wrap gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-[#10141f]">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Month</label>
            <select
              value={filters.month}
              onChange={(e) => onFilterChange({ month: e.target.value })}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] font-medium text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Year</label>
            <select
              value={filters.year}
              onChange={(e) => onFilterChange({ year: e.target.value })}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[12px] font-medium text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>

          {hasFilter && (
            <div className="flex items-end">
              <button
                onClick={() => { onFilterChange({ month: "", year: "" }); setShowFilters(false); }}
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-500 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MobilePagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  const { page, totalPages } = meta;
  return (
    <div className="mt-6 flex items-center justify-between gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[12px] font-medium text-gray-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[12px] font-medium text-gray-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

function OrderCard({ order }) {
  const cfg = getStatusConfig(order.orderStatus);
  const StatusIcon = cfg.icon;

  return (
    <Link to={`/orders/${order._id}`} className="block">
      <div className="mb-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-[#10141f]">
        {/* Top Row */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Order #{order.orderNumber || order._id?.slice(-6)}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <CalendarDays size={12} />
              <span>{formatDate(order.createdAt)}</span>
              <span>•</span>
              <span>{order.items?.length || 0} item(s)</span>
            </div>
          </div>

          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${cfg.text} ${cfg.bg}`}>
            <StatusIcon size={11} />
            <span className="capitalize">{order.orderStatus || "pending"}</span>
          </div>
        </div>

        {/* Horizontal Products */}
        <div className="no-scrollbar mb-4 overflow-x-auto">
          <div className="flex gap-3">
            {order.items?.map((item) => {
              const image = item.image || item.product?.image || item.product?.images?.[0]?.url;
              const name  = item.name || item.product?.name || "Product";
              return (
                <div
                  key={item._id}
                  className="flex w-[200px] shrink-0 items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-[#121622]"
                >
                  {image ? (
                    <img src={image} alt={name} className="h-16 w-16 rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200 dark:bg-gray-700">
                      <Package size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[12px] font-semibold text-gray-900 dark:text-gray-100">{name}</p>
                    <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    <p className="mt-1 text-[12px] font-bold text-gray-900 dark:text-white">
                      ₹{item.totalPrice || (item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Total Amount</p>
            <p className="mt-1 text-[15px] font-bold text-gray-900 dark:text-white">
              ₹{order.totalAmount || order.pricing?.total || 0}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-300">
            <span>View Details</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCards() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-40 rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mb-3 flex gap-3">
            <div className="h-16 w-[200px] shrink-0 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-14 text-center dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-400 dark:bg-blue-500/10">
        <Package size={42} strokeWidth={1.5} />
      </div>
      <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400">No orders found</p>
      <Link to="/shop" className="mt-4 rounded-xl bg-blue-500 px-5 py-2 text-[12px] font-medium text-white">
        Continue Shopping
      </Link>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function MobileOrdersPage({
  orders = [],
  meta,
  loading,
  error,
  filters = {},
  onFilterChange,
  onPageChange,
}) {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <section className="pb-4">
      <div className="mb-5">
        <h1 className="text-[24px] font-bold text-gray-900 dark:text-gray-100">Your Orders</h1>
        {meta && !loading && (
          <p className="mt-1 text-[12px] text-gray-400 dark:text-gray-500">
            {meta.total} order{meta.total !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Status Tabs */}
      <StatusTabs filters={filters} onFilterChange={onFilterChange} />

      {/* Date Filter */}
      <DateFilters
        filters={filters}
        onFilterChange={onFilterChange}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

      {/* Section label */}
      <div className="mb-4">
        <h2 className="text-[18px] font-bold text-gray-900 dark:text-gray-100">Purchase History</h2>
        {(filters.month || filters.year) ? (
          <p className="text-[12px] text-blue-500 dark:text-blue-400">
            {MONTHS.find((m) => m.value === filters.month)?.label || ""}
            {filters.month && filters.year ? " · " : ""}
            {filters.year || ""}
          </p>
        ) : (
          <p className="text-[12px] text-gray-400 dark:text-gray-500">All time</p>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonCards />
      ) : error ? (
        <div className="rounded-3xl border border-red-100 bg-white p-6 text-center text-red-500 shadow-sm dark:border-red-500/20 dark:bg-gray-900 dark:text-red-400">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
          <MobilePagination meta={meta} onPageChange={onPageChange} />
        </>
      )}
    </section>
  );
}