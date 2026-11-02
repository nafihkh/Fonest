import { useEffect, useCallback, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { showToast } from "../../store/slices/toastSlice";
import {
  fetchAdminOrders,
  updateOrderStatus,
  selectAdminOrders,
  selectAdminOrdersMeta,
  selectAdminOrdersLoading,
  selectAdminOrdersError,
  selectUpdateStatusLoading,
} from "../../store/slices/orderSlice";
import {
  Search,
  RefreshCcw,
  ChevronDown,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Clock,
  PackageCheck,
} from "lucide-react";

// ── Status config ────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "placed",    label: "Placed",    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300" },
  { value: "packed",    label: "Packed",    color: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
  { value: "shipped",   label: "Shipped",   color: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
  { value: "delivered", label: "Delivered", color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { value: "cancelled", label: "Cancelled", color: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" },
];

const STATUS_TABS = [
  { value: "", label: "All Orders", icon: ClipboardList },
  { value: "placed", label: "Placed", icon: Clock },
  { value: "confirmed", label: "Confirmed", icon: Package },
  { value: "shipped", label: "Shipped", icon: Truck },
  { value: "delivered", label: "Delivered", icon: CheckCircle2 },
  { value: "cancelled", label: "Cancelled", icon: XCircle },
];

function statusConfig(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatCurrency(v) {
  return `₹${Number(v || 0).toLocaleString("en-IN")}`;
}

// ── Status Dropdown ──────────────────────────────────────────────────────────
function StatusDropdown({ orderId, current, onUpdate, updating }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const cfg = statusConfig(current);

  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const handleSelect = async (val) => {
    setOpen(false);
    if (val !== current) await onUpdate(orderId, val);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={updating}
        onClick={() => setOpen((p) => !p)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-semibold border transition ${cfg.color} ${
          updating ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:brightness-95"
        } border-transparent`}
      >
        <span className="capitalize">{cfg.label}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-10 z-30 w-44 overflow-hidden rounded-2xl
                        border border-slate-200/80 dark:border-slate-700
                        bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
                        shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
          <div className="p-2 space-y-0.5">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => handleSelect(s.value)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold text-left transition ${
                  s.value === current
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${s.color.split(" ")[0]}`} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, total, limit, onPrev, onNext, onSet }) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200/70 dark:border-slate-700">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold">{start}</span>–<span className="font-semibold">{end}</span> of <span className="font-semibold">{total}</span> orders
      </div>
      <div className="flex items-center gap-2">
        <button disabled={page === 1} onClick={onPrev}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold border border-slate-200/70 dark:border-slate-700
                     bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40">Previous</button>
        {pages.map((p) => (
          <button key={p} onClick={() => onSet(p)}
            className={`w-9 h-9 rounded-xl text-[12px] font-semibold transition ${
              p === page ? "bg-indigo-600 text-white" : "border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
            }`}>{p}</button>
        ))}
        <button disabled={page === totalPages} onClick={onNext}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold border border-slate-200/70 dark:border-slate-700
                     bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40">Next</button>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AdminOrders() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAdminOrders);
  const meta = useSelector(selectAdminOrdersMeta);
  const loading = useSelector(selectAdminOrdersLoading);
  const error = useSelector(selectAdminOrdersError);
  const updating = useSelector(selectUpdateStatusLoading);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchOrders = useCallback(() => {
    dispatch(fetchAdminOrders({
      search: debouncedSearch.trim(),
      status: activeTab || undefined,
      page,
      limit: LIMIT,
    }));
  }, [dispatch, debouncedSearch, activeTab, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = useCallback(async (id, orderStatus) => {
    const result = await dispatch(updateOrderStatus({ id, orderStatus }));
    if (updateOrderStatus.fulfilled.match(result)) {
      dispatch(showToast({ type: "success", title: "Status Updated", message: `Order marked as ${orderStatus}` }));
    } else {
      dispatch(showToast({ type: "error", title: "Update Failed", message: result.payload || "Could not update order status" }));
    }
  }, [dispatch]);

  const handleTabChange = (val) => { setActiveTab(val); setPage(1); };
  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };

  const totalPages = meta?.totalPages || 1;

  // Summary counts from current meta
  const summaryStats = useMemo(() => ({
    total: meta?.total ?? 0,
  }), [meta]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
              Order Management
            </h1>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400 max-w-[600px]">
              View all customer orders, update delivery status, and track fulfilment progress.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchOrders}
            className="h-11 px-5 rounded-2xl text-[13px] font-semibold inline-flex items-center gap-2
                       bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </div>

        {/* Status Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 p-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by customer name or product…"
                className="w-full h-11 rounded-2xl pl-10 pr-4 text-[14px]
                           bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700
                           text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
                           outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400"
              />
            </div>

            {/* Tab pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => handleTabChange(tab.value)}
                    className={`h-9 px-4 rounded-full text-[12px] font-semibold transition inline-flex items-center gap-1.5 ${
                      activeTab === tab.value
                        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr className="text-left text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Payment</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center text-[13px] text-slate-500 dark:text-slate-400">
                      <div className="flex justify-center">
                        <RefreshCcw size={22} className="animate-spin text-indigo-500" />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center text-[13px] text-rose-600 dark:text-rose-300">
                      {error}
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center">
                      <PackageCheck size={36} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                      <p className="text-[13px] text-slate-500 dark:text-slate-400">No orders found.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const shortId = `#${String(order._id).slice(-6).toUpperCase()}`;
                    const customer = order.address?.fullName || "Unknown";
                    const itemCount = order.items?.length ?? 0;
                    const firstItem = order.items?.[0];
                    const firstItemName = firstItem?.name || "Product";
                    const total = order.totalAmount ?? order.pricing?.total ?? 0;
                    const paymentStatus = order.payment?.status || "pending";
                    const paymentTone = paymentStatus === "paid" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400";

                    return (
                      <tr key={order._id} className="border-t border-slate-200/70 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="px-6 py-4">
                          <span className="text-[12px] font-extrabold text-indigo-600 dark:text-indigo-300">
                            {shortId}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center text-[12px] font-bold text-indigo-700 dark:text-indigo-300">
                              {customer[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{customer}</div>
                              {order.address?.phone && (
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">{order.address.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="text-[13px] text-slate-900 dark:text-slate-100 font-medium line-clamp-1 max-w-[180px]">
                            {firstItemName}
                          </div>
                          {itemCount > 1 && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">+{itemCount - 1} more items</div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(total)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`text-[12px] font-semibold capitalize ${paymentTone}`}>
                            {paymentStatus}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-[12px] text-slate-600 dark:text-slate-300">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <StatusDropdown
                            orderId={order._id}
                            current={order.orderStatus}
                            onUpdate={handleStatusUpdate}
                            updating={updating}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            total={meta?.total ?? 0}
            limit={LIMIT}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onSet={setPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
