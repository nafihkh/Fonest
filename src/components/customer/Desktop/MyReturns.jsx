import React from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../../layout/SiteHeader";
import SiteFooter from "../../layout/SiteFooter";
import { RotateCcw, Package } from "lucide-react";

const STATUS_CONFIG = {
  requested:  { label: "Requested",   cls: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" },
  approved:   { label: "Approved",    cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  rejected:   { label: "Rejected",    cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" },
  picked_up:  { label: "Picked Up",   cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  received:   { label: "Received",    cls: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400" },
  refunded:   { label: "Refunded",    cls: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" },
};

const REFUND_CONFIG = {
  pending:    { label: "Pending",    cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
  processing: { label: "Processing", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  completed:  { label: "Completed",  cls: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400" },
  declined:   { label: "Declined",   cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" },
  n_a:        { label: "N/A",        cls: "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500" },
};

const STATUS_TABS = [
  { label: "All Returns", value: "all" },
  { label: "Requested",   value: "requested" },
  { label: "Approved",    value: "approved" },
  { label: "Rejected",    value: "rejected" },
  { label: "Refunded",    value: "refunded" },
];

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900">
        <i className="ri-arrow-left-s-line text-[18px]" />
      </button>
      {start > 1 && <><button onClick={() => onPageChange(1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[13px] font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900">1</button>{start > 2 && <span className="text-gray-400">…</span>}</>}
      {pages.map((p) => (
        <button key={p} onClick={() => onPageChange(p)} className={`flex h-10 w-10 items-center justify-center rounded-xl border text-[13px] font-medium transition ${p === page ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25" : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"}`}>{p}</button>
      ))}
      {end < totalPages && <><span className="text-gray-400">…</span><button onClick={() => onPageChange(totalPages)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[13px] text-gray-600 dark:border-gray-700 dark:bg-gray-900">{totalPages}</button></>}
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900">
        <i className="ri-arrow-right-s-line text-[18px]" />
      </button>
    </div>
  );
}

function ReturnCard({ ret }) {
  const statusCfg  = STATUS_CONFIG[ret.status]  || { label: ret.status,       cls: "bg-gray-100 text-gray-600" };
  const refundCfg  = REFUND_CONFIG[ret.refundStatus] || { label: ret.refundStatus, cls: "bg-gray-100 text-gray-600" };
  const firstItem  = ret.items?.[0];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-orange-500/30">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-500 dark:text-orange-400">
            {ret.ticketNo}
          </p>
          <p className="mt-1 text-[13px] text-gray-500 dark:text-gray-400">
            <i className="ri-calendar-line mr-1" />
            Requested: {formatDate(ret.requestedAt)}
          </p>
          {ret.adminNote && (
            <p className="mt-1 text-[12px] italic text-gray-400 dark:text-gray-500">
              Note: {ret.adminNote}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${statusCfg.cls}`}>{statusCfg.label}</span>
          <span className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${refundCfg.cls}`}>Refund: {refundCfg.label}</span>
        </div>
      </div>

      {/* Items preview */}
      <div className="mb-5 flex flex-wrap gap-3">
        {ret.items?.slice(0, 3).map((item) => (
          <div key={item._id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800/50">
            {item.image ? (
              <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700">
                <Package size={16} className="text-gray-400" />
              </div>
            )}
            <div>
              <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
              <p className="text-[11px] text-gray-400">Qty: {item.quantity} · ₹{item.refundAmount?.toLocaleString("en-IN")}</p>
            </div>
          </div>
        ))}
        {ret.items?.length > 3 && (
          <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 text-[12px] text-gray-400 dark:border-gray-700">
            +{ret.items.length - 3} more
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
        <div>
          <p className="text-[12px] text-gray-500 dark:text-gray-400">Total Refund</p>
          <p className="text-[18px] font-bold text-orange-600 dark:text-orange-400">
            ₹{ret.totalRefund?.toLocaleString("en-IN") || 0}
          </p>
        </div>
        <Link
          to={`/returns/${ret._id}`}
          className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-5 py-2.5 text-[13px] font-semibold text-orange-700 transition hover:bg-orange-100 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
        >
          View Details <i className="ri-arrow-right-line" />
        </Link>
      </div>
    </div>
  );
}

function SkeletonCards() {
  return (
    <div className="space-y-5 animate-pulse">
      {[1,2,3].map((i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex justify-between">
            <div className="space-y-2"><div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" /><div className="h-3 w-36 rounded bg-slate-200 dark:bg-slate-700" /></div>
            <div className="h-7 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="mb-4 flex gap-3"><div className="h-20 w-48 rounded-xl bg-slate-200 dark:bg-slate-700" /></div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="h-5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyReturnsDesktop({
  returns = [],
  meta,
  loading,
  error,
  filters = {},
  onFilterChange,
  onPageChange,
}) {
  const bg = "min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#111827_35%,_#030712_100%)]";

  return (
    <div className={bg}>
      <SiteHeader />

      <div className="pb-20 pt-24">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-500/15">
              <RotateCcw size={26} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Returns</h1>
              <p className="text-[14px] text-gray-500 dark:text-gray-400">
                Track your return requests and refund status
                {meta && !loading && <span className="ml-2 text-orange-500"> — {meta.total} return{meta.total !== 1 ? "s" : ""}</span>}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {STATUS_TABS.map((tab) => {
              const active = (filters.status || "all") === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => onFilterChange({ status: tab.value })}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 ${
                    active
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                      : "border border-gray-200 bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-orange-500/40 dark:hover:bg-orange-500/10"
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
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center text-red-500 dark:border-red-500/20 dark:bg-gray-900 dark:text-red-400">{error}</div>
          ) : returns.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
              <RotateCcw size={48} className="mx-auto mb-4 text-orange-300 dark:text-orange-500/50" />
              <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No returns found</h2>
              <p className="mb-6 text-[14px] text-gray-500 dark:text-gray-400">You haven't submitted any return requests yet.</p>
              <Link to="/purchase-history" className="inline-block rounded-xl bg-orange-500 px-6 py-3 font-medium text-white transition hover:bg-orange-600">
                View Orders
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {returns.map((ret) => <ReturnCard key={ret._id} ret={ret} />)}
            </div>
          )}

          {!loading && <Pagination meta={meta} onPageChange={onPageChange} />}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
