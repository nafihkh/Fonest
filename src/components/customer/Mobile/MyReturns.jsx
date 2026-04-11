import React from "react";
import { Link } from "react-router-dom";
import { RotateCcw, Package, ChevronRight, ChevronLeft } from "lucide-react";

const STATUS_CONFIG = {
  requested:  { label: "Requested",   cls: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
  approved:   { label: "Approved",    cls: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
  rejected:   { label: "Rejected",    cls: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
  picked_up:  { label: "Picked Up",   cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" },
  received:   { label: "Received",    cls: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400" },
  refunded:   { label: "Refunded",    cls: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" },
};

const STATUS_TABS = [
  { label: "All",       value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Approved",  value: "approved" },
  { label: "Rejected",  value: "rejected" },
  { label: "Refunded",  value: "refunded" },
];

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function ReturnCard({ ret }) {
  const statusCfg = STATUS_CONFIG[ret.status] || { label: ret.status, cls: "bg-gray-100 text-gray-600" };
  const firstItem = ret.items?.[0];

  return (
    <Link to={`/returns/${ret._id}`} className="block">
      <div className="mb-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-[#10141f]">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400">
              {ret.ticketNo}
            </p>
            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">
              {formatDate(ret.requestedAt)}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusCfg.cls}`}>
            {statusCfg.label}
          </span>
        </div>

        {/* Items row */}
        <div className="no-scrollbar mb-3 overflow-x-auto">
          <div className="flex gap-3">
            {ret.items?.map((item) => (
              <div
                key={item._id}
                className="flex w-[160px] shrink-0 items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-2.5 dark:border-gray-800 dark:bg-[#121622]"
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700">
                    <Package size={14} className="text-gray-400" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[11px] font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                  <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
          <div>
            <p className="text-[10px] text-gray-400">Est. Refund</p>
            <p className="text-[14px] font-bold text-orange-600 dark:text-orange-400">
              ₹{ret.totalRefund?.toLocaleString("en-IN") || 0}
            </p>
          </div>
          <div className="flex items-center gap-1 text-[12px] font-semibold text-orange-500 dark:text-orange-400">
            <span>Details</span>
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
      {[1,2,3].map((i) => (
        <div key={i} className="animate-pulse rounded-3xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 flex justify-between">
            <div className="space-y-1.5"><div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" /><div className="h-2.5 w-20 rounded bg-slate-200 dark:bg-slate-700" /></div>
            <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mb-3 h-16 w-40 rounded-2xl bg-slate-200 dark:bg-slate-700" />
          <div className="flex justify-between border-t border-gray-100 pt-3 dark:border-gray-800">
            <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-14 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobilePagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;
  const { page, totalPages } = meta;
  return (
    <div className="mt-6 flex items-center justify-between">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[12px] font-medium text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        <ChevronLeft size={14} /> Prev
      </button>
      <span className="text-[12px] text-gray-400">Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[12px] font-medium text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        Next <ChevronRight size={14} />
      </button>
    </div>
  );
}

export default function MyReturnsMobile({
  returns = [],
  meta,
  loading,
  error,
  filters = {},
  onFilterChange,
  onPageChange,
}) {
  return (
    <section className="pb-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/15">
          <RotateCcw size={18} className="text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 dark:text-gray-100">My Returns</h1>
          {meta && !loading && (
            <p className="text-[11px] text-gray-400">{meta.total} return{meta.total !== 1 ? "s" : ""} found</p>
          )}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const active = (filters.status || "all") === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onFilterChange({ status: tab.value })}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-[11px] font-medium transition-all ${
                active
                  ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonCards />
      ) : error ? (
        <div className="rounded-3xl border border-red-100 bg-white p-6 text-center text-red-500 dark:border-red-500/20 dark:bg-gray-900 dark:text-red-400">{error}</div>
      ) : returns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <RotateCcw size={40} className="mb-3 text-orange-300 dark:text-orange-500/50" />
          <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400">No returns yet</p>
          <Link to="/purchase-history" className="mt-4 rounded-xl bg-orange-500 px-5 py-2 text-[12px] font-medium text-white">
            View Orders
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-1">
            {returns.map((ret) => <ReturnCard key={ret._id} ret={ret} />)}
          </div>
          <MobilePagination meta={meta} onPageChange={onPageChange} />
        </>
      )}
    </section>
  );
}
