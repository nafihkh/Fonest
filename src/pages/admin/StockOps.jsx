// src/pages/admin/StockOps.jsx
import { useMemo, useState,  useEffect, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/slices/toastSlice";
import useDebounce from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  PackagePlus,
  TrendingDown,
  Users,
  AlertTriangle,
  Plus,
  SlidersHorizontal,
  Clock3,
  BadgeCheck,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ---------- small UI helpers ----------
function StatTile({ title, value, icon: Icon, badge, badgeTone = "neutral" }) {
  const tone =
    badgeTone === "green"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : badgeTone === "red"
      ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
            {title}
          </div>
          <div className="mt-1 text-[22px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
            {value}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {badge ? (
            <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${tone}`}>
              {badge}
            </span>
          ) : null}
          <span className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
            <Icon size={18} className="text-slate-700 dark:text-slate-200" />
          </span>
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, right, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="px-5 pt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
      </div>
      <div className="px-5 pb-5 pt-4">{children}</div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

function TextInput({ className = "", leftIcon: LeftIcon, ...props }) {
  return (
    <div className="relative">
      {LeftIcon ? (
        <LeftIcon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      ) : null}
      <input
        {...props}
        className={[
          "w-full h-11 rounded-2xl text-[14px]",
          LeftIcon ? "pl-10 pr-4" : "px-4",
          "bg-white dark:bg-slate-900",
          "border border-slate-200/70 dark:border-slate-700",
          "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
          className,
        ].join(" ")}
      />
    </div>
  );
}

function Segment({ value, onChange }) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
      <button
        type="button"
        onClick={() => onChange("in")}
        className={[
          "h-10 px-4 text-[13px] font-semibold transition",
          value === "in"
            ? "bg-indigo-600 text-white"
            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
        ].join(" ")}
      >
        Stock In
      </button>
      <button
        type="button"
        onClick={() => onChange("out")}
        className={[
          "h-10 px-4 text-[13px] font-semibold transition border-l border-slate-200/70 dark:border-slate-700",
          value === "out"
            ? "bg-indigo-600 text-white"
            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
        ].join(" ")}
      >
        Stock Out
      </button>
    </div>
  );
}

function Pill({ children, tone = "gray" }) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
      : tone === "red"
      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
}

function MiniBtn({ children, tone = "primary", ...props }) {
  const cls =
    tone === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800";

  return (
    <button
      type="button"
      className={`h-10 px-4 rounded-2xl text-[13px] font-semibold transition ${cls}`}
      {...props}
    >
      {children}
    </button>
  );
}


function AlertDetailsModal({ open, loading, alert, onClose, onQuickRestock }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-200/70 dark:border-slate-700">
          <div className="text-[18px] font-extrabold text-slate-900 dark:text-slate-100">
            Alert Details
          </div>
          <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            View detailed stock alert information.
          </div>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <div className="py-10 text-center text-[13px] text-slate-500 dark:text-slate-400">
              Loading details...
            </div>
          ) : !alert ? (
            <div className="py-10 text-center text-[13px] text-slate-500 dark:text-slate-400">
              No details available.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden grid place-items-center">
                  {alert.product?.image ? (
                    <img
                      src={alert.product.image}
                      alt={alert.product?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[20px]">📦</span>
                  )}
                </div>

                <div>
                  <div className="text-[15px] font-bold text-slate-900 dark:text-slate-100">
                    {alert.product?.name || "Unknown Product"}
                  </div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400">
                    SKU: {alert.product?.sku || "—"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 p-4">
                  <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Alert Type
                  </div>
                  <div className="mt-1 text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                    {alert.alertType === "out_of_stock" ? "Out of Stock" : "Low Stock"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 p-4">
                  <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Product Status
                  </div>
                  <div className="mt-1 text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                    {alert.product?.status || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 p-4">
                  <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Current Stock
                  </div>
                  <div className="mt-1 text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                    {alert.currentStock}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 p-4">
                  <div className="text-[11px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Threshold
                  </div>
                  <div className="mt-1 text-[14px] font-semibold text-slate-900 dark:text-slate-100">
                    {alert.threshold}
                  </div>
                </div>
              </div>

              <div className="text-[12px] text-slate-500 dark:text-slate-400">
                Created: {new Date(alert.createdAt).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex justify-end gap-3">
          <MiniBtn tone="secondary" onClick={onClose}>
            Close
          </MiniBtn>
          {alert?.product ? (
            <MiniBtn
              tone="primary"
              onClick={() => {
                onQuickRestock(alert);
                onClose();
              }}
            >
              Quick Restock
            </MiniBtn>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function StockOps() {
  const [mode, setMode] = useState("in");
  const [globalMin, setGlobalMin] = useState(15);
  const [productResults, setProductResults] = useState([]);
  const [productSearchLoading, setProductSearchLoading] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const productSearchRef = useRef(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [rebuildAlertsLoading, setRebuildAlertsLoading] = useState(false);
  const dispatch = useDispatch();
  const [recentMoves, setRecentMoves] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    tone: "primary",
    onConfirm: null,
  });

  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsPagination, setAlertsPagination] = useState({
    page: 1,
    limit: 4,
    total: 0,
    totalPages: 1,
    hasMore: false,
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedAlertDetails, setSelectedAlertDetails] = useState(null);

  const [thresholdLoading, setThresholdLoading] = useState(false);
  const [movesLoading, setMovesLoading] = useState(false);
  const navigate = useNavigate();
  const [entry, setEntry] = useState({
    query: "",
    qty: "",
    supplier: "",
    date: "",
    notes: "",
  });
  const openConfirmModal = ({
    title,
    message,
    confirmText = "Confirm",
    tone = "primary",
    onConfirm,
  }) => {
    setConfirmModal({
      open: true,
      title,
      message,
      confirmText,
      tone,
      onConfirm,
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({
      ...prev,
      open: false,
      onConfirm: null,
    }));
  };
  const handleRebuildAlerts = async ({ silent = false } = {}) => {
    try {
      setRebuildAlertsLoading(true);

      const res = await api.post("/api/admin/stock/alerts/rebuild");

      if (!silent) {
        dispatch(
          showToast({
            type: "success",
            title: "Alerts Rebuilt",
            message:
              res?.data?.message || "Stock alerts rebuilt successfully.",
          })
        );
      }

      await fetchAlerts({ page: 1, append: false });
    } catch (err) {
      console.error(err);

      if (!silent) {
        dispatch(
          showToast({
            type: "error",
            title: "Rebuild Failed",
            message:
              err?.response?.data?.message || "Failed to rebuild stock alerts.",
          })
        );
      }
    } finally {
      setRebuildAlertsLoading(false);
    }
  };

  const debouncedProductQuery = useDebounce(entry.query, 350);
  const fetchRecentMoves = async () => {
    try {
      setMovesLoading(true);

      const res = await api.get("/api/admin/stock/activity", {
        params: { page: 1, limit: 8 },
      });

      setRecentMoves(res.data.activities || []);
    } catch (err) {
      console.error(err);
      setRecentMoves([]);
    } finally {
      setMovesLoading(false);
    }
  };
  useEffect(() => {
    fetchRecentMoves();
  }, []);
  const fetchAlerts = async ({ page = 1, append = false } = {}) => {
    try {
      setAlertsLoading(true);

      const res = await api.get("/api/admin/stock/alerts", {
        params: { page, limit: 4 },
      });

      const incoming = res.data.alerts || [];

      setAlerts((prev) => (append ? [...prev, ...incoming] : incoming));

      setAlertsPagination({
        page: res.data.pagination?.page || 1,
        limit: res.data.pagination?.limit || 4,
        total: res.data.pagination?.total || 0,
        totalPages: res.data.pagination?.totalPages || 1,
        hasMore: res.data.pagination?.hasMore || false,
      });
    } catch (err) {
      console.error(err);
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  };
  useEffect(() => {
    handleRebuildAlerts({ silent: true });
  }, []);
  const handleLoadMoreAlerts = async () => {
    if (!alertsPagination.hasMore || alertsLoading) return;

    await fetchAlerts({
      page: alertsPagination.page + 1,
      append: true,
    });
  };
  const handleQuickRestock = (alert) => {
    if (!alert?.product) return;

    const threshold = Number(alert.threshold || alert.product.lowStockThreshold || 10);
    const currentStock = Number(alert.currentStock || alert.product.stock || 0);

    const suggestedQty = Math.max(threshold - currentStock + 1, 1);

    setMode("in");
    setSelectedProduct({
      _id: alert.product._id,
      name: alert.product.name,
      sku: alert.product.sku,
      stock: alert.product.stock,
      lowStockThreshold: alert.product.lowStockThreshold,
    });

    setEntry((prev) => ({
      ...prev,
      query: alert.product.name,
      qty: String(suggestedQty),
    }));

    dispatch(
      showToast({
        type: "info",
        title: "Quick Restock Ready",
        message: `${alert.product.name} selected with suggested quantity ${suggestedQty}.`,
      })
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleViewAlertDetails = async (alertId) => {
    try {
      setDetailsLoading(true);
      setDetailsOpen(true);

      const res = await api.get(`/api/admin/stock/alerts/${alertId}`);
      setSelectedAlertDetails(res.data.alert || null);
    } catch (err) {
      console.error(err);
      setSelectedAlertDetails(null);

      dispatch(
        showToast({
          type: "error",
          title: "Details Failed",
          message: err?.response?.data?.message || "Unable to load alert details.",
        })
      );
    } finally {
      setDetailsLoading(false);
    }
  };
  useEffect(() => {
    const fetchSuggestions = async () => {
      const q = entry.query.trim();

      if (!q) {
        setProductResults([]);
        setShowProductDropdown(false);
        return;
      }

      try {
        setProductSearchLoading(true);

        const res = await api.get("/api/search-suggestions", {
          params: { q },
        });

        setProductResults(res.data.products || []);
        setShowProductDropdown(true);
      } catch (err) {
        console.error(err);
        setProductResults([]);
        setShowProductDropdown(false);
      } finally {
        setProductSearchLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedProductQuery]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (
        productSearchRef.current &&
        !productSearchRef.current.contains(e.target)
      ) {
        setShowProductDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);
  const handleApplyGlobalThreshold = async () => {
    try {
      setThresholdLoading(true);

      const res = await api.patch("/api/low-stock-threshold", {
        lowStockThreshold: globalMin,
      });

      dispatch(
        showToast({
          type: "success",
          title: "Threshold Updated",
          message:
            res?.data?.message ||
            `Low stock threshold set to ${globalMin} for all products.`,
        })
      );
      await fetchAlerts({ page: 1, append: false });
      // optional refresh if connected
      // await fetchStats();
      // await fetchAlerts();
    } catch (err) {
      console.error(err);

      dispatch(
        showToast({
          type: "error",
          title: "Update Failed",
          message:
            err?.response?.data?.message ||
            "Failed to apply low stock threshold.",
        })
      );
    } finally {
      setThresholdLoading(false);
    }
  };
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setEntry((prev) => ({
      ...prev,
      query: product.name,
    }));
    setShowProductDropdown(false);

    dispatch(
      showToast({
        type: "success",
        title: "Product Selected",
        message: `${product.name} selected for stock operation.`,
      })
    );
  };
  const handleSubmitStock = async () => {
    if (!selectedProduct?._id) {
      dispatch(
        showToast({
          type: "warning",
          title: "Product Required",
          message: "Please select a product first.",
        })
      );
      setEntry({
        query: "",
        qty: "",
        supplier: "",
        date: "",
        notes: "",
      });
      setSelectedProduct(null);
      setProductResults([]);
      setShowProductDropdown(false);
      await Promise.all([
        fetchRecentMoves(),
        fetchAlerts({ page: 1, append: false }),
      ]);
      
      return;
    }

    const qty = Number(entry.qty);
    if (!qty || qty <= 0) {
      dispatch(
        showToast({
          type: "warning",
          title: "Invalid Quantity",
          message: "Enter a valid quantity greater than 0.",
        })
      );
      return;
    }

    try {
      setSubmitLoading(true);

      if (mode === "in") {
        const res = await api.post("/api/admin/stock/in", {
          productId: selectedProduct._id,
          quantityAdded: qty,
          supplier: entry.supplier,
          reference: "",
          date: entry.date,
          notes: entry.notes,
        });

        dispatch(
          showToast({
            type: "success",
            title: "Stock Added",
            message: `${selectedProduct.name} stock increased successfully.`,
          })
        );

        console.log("Stock in success:", res.data);
      } else {
        const res = await api.post("/api/admin/stock/out", {
          productId: selectedProduct._id,
          quantityRemoved: qty,
          reason: "manual",
          reference: entry.supplier,
          date: entry.date,
          notes: entry.notes,
        });

        dispatch(
          showToast({
            type: "success",
            title: "Stock Updated",
            message: `${selectedProduct.name} stock out recorded successfully.`,
          })
        );

        console.log("Stock out success:", res.data);
      }

      setEntry({
        query: "",
        qty: "",
        supplier: "",
        date: "",
        notes: "",
      });
      setSelectedProduct(null);
      setProductResults([]);
      setShowProductDropdown(false);

      // call these if already connected
      // fetchStats();
      // fetchActivity();
      // fetchAlerts();
    } catch (err) {
      console.error(err);

      dispatch(
        showToast({
          type: "error",
          title: "Stock Update Failed",
          message: err?.response?.data?.message || "Unable to update stock.",
        })
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  

  const lastUpdated = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatTile
            title="Total Stock Value"
            value="$248,500"
            icon={TrendingDown}
            badge={<ArrowUpRight size={14} />}
            badgeTone="green"
          />
          <StatTile
            title="Total Units (Today)"
            value="142"
            icon={PackagePlus}
            badge={<ArrowDownRight size={14} />}
            badgeTone="red"
          />
          <StatTile title="Active Suppliers" value="24" icon={Users} />
          <StatTile title="Low Stock Items" value="12" icon={AlertTriangle} badge="⚠" badgeTone="amber" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Segment + last updated */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Segment value={mode} onChange={setMode} />
              <div className="text-[11px] text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                <Clock3 size={14} className="opacity-70" />
                Last Updated {lastUpdated} AM
              </div>
            </div>

            {/* Procurement Entry */}
            <Card
              title={mode === "in" ? "Procurement Entry" : "Stock Out Entry"}
              subtitle={
                mode === "in"
                  ? "Add new inventory items received from your warehouse or suppliers."
                  : "Record product removals due to sales, damage, or transfers."
              }
              right={
                <button
                  type="button"
                  className="w-10 h-10 rounded-2xl border border-slate-200/70 dark:border-slate-700
                             bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                             grid place-items-center"
                  title="Add"
                >
                  <Plus size={18} className="text-indigo-600 dark:text-indigo-300" />
                </button>
              }
            >
              <div className="space-y-4">
                <div ref={productSearchRef}>
                  <Label>Select Product</Label>
                  <div className="mt-2 relative">
                    <TextInput
                      leftIcon={Search}
                      placeholder="Search gadget name or SKU..."
                      value={entry.query}
                      onChange={(e) => {
                        setEntry((p) => ({ ...p, query: e.target.value }));
                        setSelectedProduct(null);
                      }}
                      onFocus={() => {
                        if (productResults.length > 0) setShowProductDropdown(true);
                      }}
                    />

                    {productSearchLoading ? (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader2 size={16} className="animate-spin text-slate-400" />
                      </div>
                    ) : null}

                    {showProductDropdown && (
                      <div
                        className="absolute left-0 right-0 top-[48px] z-40 overflow-hidden rounded-2xl
                                  border border-slate-200/70 dark:border-slate-700
                                  bg-white dark:bg-slate-900 shadow-[0_12px_30px_rgba(2,6,23,0.12)]"
                      >
                        {productResults.length > 0 ? (
                          <div className="max-h-72 overflow-y-auto py-2">
                            {productResults.map((product) => {
                              const isOut = Number(product.stock || 0) === 0;
                              const isLow =
                                Number(product.stock || 0) > 0 &&
                                Number(product.stock || 0) <= Number(product.lowStockThreshold || 0);

                              return (
                                <button
                                  key={product._id}
                                  type="button"
                                  onClick={() => handleSelectProduct(product)}
                                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">
                                        {product.name}
                                      </div>
                                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                        SKU: {product.sku} • ₹{product.price}
                                      </div>
                                    </div>

                                    <div className="shrink-0">
                                      <span
                                        className={[
                                          "inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-full border",
                                          isOut
                                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
                                            : isLow
                                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
                                        ].join(" ")}
                                      >
                                        Stock: {product.stock}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="px-4 py-4 text-[12px] text-slate-500 dark:text-slate-400">
                            No matching products found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {selectedProduct ? (
                    <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                      Selected:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {selectedProduct.name}
                      </span>{" "}
                      • SKU: {selectedProduct.sku} • Current stock: {selectedProduct.stock}
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <div className="mt-2">
                      <TextInput
                        placeholder="e.g. 100"
                        value={entry.qty}
                        onChange={(e) => setEntry((p) => ({ ...p, qty: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Supplier / Source</Label>
                    <div className="mt-2">
                      <TextInput
                        placeholder="e.g. Apple Wholesale"
                        value={entry.supplier}
                        onChange={(e) => setEntry((p) => ({ ...p, supplier: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Transaction Date</Label>
                    <div className="mt-2">
                      <TextInput
                        type="date"
                        value={entry.date}
                        onChange={(e) => setEntry((p) => ({ ...p, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Internal Notes (Optional)</Label>
                    <div className="mt-2">
                      <TextInput
                        placeholder="Additional details..."
                        value={entry.notes}
                        onChange={(e) => setEntry((p) => ({ ...p, notes: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                 <button
                    type="button"  
                    className="w-full h-11 rounded-2xl text-[13px] font-semibold
                              bg-indigo-600 text-white hover:bg-indigo-700 transition
                              shadow-sm inline-flex items-center justify-center gap-2
                              disabled:opacity-60"
                    onClick={() =>
                      openConfirmModal({
                        title: mode === "in" ? "Confirm Stock In" : "Confirm Stock Out",
                        message:
                          mode === "in"
                            ? `Add ${entry.qty || 0} units to ${
                                selectedProduct?.name || "this product"
                              }?`
                            : `Remove ${entry.qty || 0} units from ${
                                selectedProduct?.name || "this product"
                              }?`,
                        confirmText: mode === "in" ? "Complete Stock In" : "Complete Stock Out",
                        tone: mode === "in" ? "primary" : "warning",
                        onConfirm: async () => {
                          closeConfirmModal();
                          await handleSubmitStock();
                        },
                      })
                    }
                    disabled={submitLoading}
                  >
                    <BadgeCheck size={16} />
                    {submitLoading
                      ? "Please wait..."
                      : mode === "in"
                      ? "Complete Stock In"
                      : "Complete Stock Out"}
                  </button>
                </div>
              </div>
            </Card>

            {/* Recent Stock Movements */}
            <Card
              title="Recent Stock Movements"
              subtitle="Real-time log of the last 5 transactions across all categories."
            >
              <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-hidden">
                <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Move</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Reference</div>
                  <div className="col-span-2">Date</div>
                </div>

                {movesLoading ? (
                  <div className="px-5 py-10 text-center text-[13px] text-slate-500 dark:text-slate-400">
                    Loading recent stock moves...
                  </div>
                ) : recentMoves.length === 0 ? (
                  <div className="px-5 py-10 text-center text-[13px] text-slate-500 dark:text-slate-400">
                    No recent stock moves found.
                  </div>
                ) : (
                  recentMoves.map((move) => (
                    <div
                      key={`${move.type}-${move._id}`}
                      className="grid grid-cols-12 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 items-center"
                    >
                      <div className="col-span-4">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                          {move.product?.name || "Unknown Product"}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          SKU: {move.product?.sku || "—"}
                        </div>
                      </div>

                      <div className="col-span-2">
                        <span
                          className={[
                            "inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border",
                            move.type === "in"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
                          ].join(" ")}
                        >
                          {move.type === "in" ? "Stock In" : "Stock Out"}
                        </span>
                      </div>

                      <div className="col-span-2 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {move.quantity}
                      </div>

                      <div className="col-span-2 text-[12px] text-slate-500 dark:text-slate-400">
                        {move.reference || move.reason || move.supplier || "—"}
                      </div>

                      <div className="col-span-2 text-[12px] text-slate-500 dark:text-slate-400">
                        {new Date(move.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/admin/stock-history")}
                  className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 transition inline-flex items-center gap-1"
                >
                  View Full Transaction History <ChevronRight size={14} />
                </button>
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Initial stock rules */}
            <Card
              title="Initial Stock Rules"
              subtitle="Stock threshold config"
              right={
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl text-[12px] font-semibold
                             border border-slate-200/70 dark:border-slate-700
                             bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200
                             hover:bg-slate-50 dark:hover:bg-slate-800 transition inline-flex items-center gap-2"
                >
                  <SlidersHorizontal size={14} />
                  Settings
                </button>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                    Global Minimum
                  </div>
                  <Pill>{globalMin} units</Pill>
                </div>

                <input
                  type="range"
                  min={1}
                  max={50}
                  value={globalMin}
                  onChange={(e) => setGlobalMin(Number(e.target.value))}
                  className="fonest-range w-full"
                  style={{
                    "--range-progress": `${((globalMin - 1) / (50 - 1)) * 100}%`,
                  }}
                  />

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Note: Individual product thresholds will override this global setting if configured in
                  the product settings.
                </div>
                  <MiniBtn
                    tone="primary"
                    onClick={() =>
                      openConfirmModal({
                        title: "Apply Stock Rule",
                        message: `Apply minimum stock threshold of ${globalMin} units to all products?`,
                        confirmText: "Apply to All",
                        tone: "primary",
                        onConfirm: async () => {
                          closeConfirmModal();
                          await handleApplyGlobalThreshold();
                        },
                      })
                    }
                    disabled={thresholdLoading}
                  >
                    Apply to All Items
                  </MiniBtn>
              </div>
            </Card>

            {/* Stock Alerts */}
           <Card
              title={
                <div className="flex items-center gap-2">
                  Stock Alerts <span className="text-rose-600 dark:text-rose-300">●</span>
                </div>
              }
              subtitle="Live low stock and out of stock alerts"
              right={
                <MiniBtn
                  tone="secondary"
                  onClick={() => handleRebuildAlerts()}
                  disabled={rebuildAlertsLoading}
                >
                  {rebuildAlertsLoading ? "Rebuilding..." : "Rebuild Alerts"}
                </MiniBtn>
              }
            >
              <div className="space-y-3">
                {alertsLoading && alerts.length === 0 ? (
                  <div className="text-center py-8 text-[13px] text-slate-500 dark:text-slate-400">
                    Loading alerts...
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-8 text-[13px] text-slate-500 dark:text-slate-400">
                    No stock alerts found.
                  </div>
                ) : (
                  alerts.map((a) => {
                    const isOut = a.alertType === "out_of_stock";
                    const tone = isOut ? "red" : "amber";
                    const label = isOut ? "Out of Stock" : "Low Stock";

                    return (
                      <div
                        key={a._id}
                        className="rounded-2xl border p-3 border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden grid place-items-center">
                              {a.product?.image ? (
                                <img
                                  src={a.product.image}
                                  alt={a.product?.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[18px]">📦</span>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <Pill tone={tone}>{label}</Pill>
                              </div>

                              <div className="mt-1 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                                {a.product?.name || "Unknown Product"}
                              </div>

                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                Current: <span className="font-semibold">{a.currentStock}</span>
                                {" • "}
                                Threshold: <span className="font-semibold">{a.threshold}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleViewAlertDetails(a._id)}
                            className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
                                      bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                      grid place-items-center"
                            title="View Details"
                          >
                            <ChevronRight size={16} className="text-slate-600 dark:text-slate-200" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <MiniBtn tone="primary" onClick={() => handleQuickRestock(a)}>
                            Quick Restock
                          </MiniBtn>
                          <MiniBtn tone="secondary" onClick={() => handleViewAlertDetails(a._id)}>
                            View Details
                          </MiniBtn>
                        </div>
                      </div>
                    );
                  })
                )}

                {alertsPagination.hasMore ? (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleLoadMoreAlerts}
                      disabled={alertsLoading}
                      className="text-[12px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition disabled:opacity-60"
                    >
                      {alertsLoading ? "Loading..." : "Load more alerts"}
                    </button>
                  </div>
                ) : alerts.length > 0 ? (
                  <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500">
                    No more alerts
                  </div>
                ) : null}
              </div>
            </Card>

            {/* Tip */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm p-5">
              <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                Inventory Health Tip
              </div>
              <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                Products like <span className="font-semibold">Logitech MX Master 3S</span> have been out of stock for{" "}
                <span className="font-semibold">48 hours</span>. This is causing a projected daily loss of{" "}
                <span className="font-semibold">$340</span>.
              </div>
              <button
                type="button"
                className="mt-3 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 transition"
              >
                View Analytics Report →
              </button>
            </div>
          </div>
        </div>
      </div>
      <AlertDetailsModal
        open={detailsOpen}
        loading={detailsLoading}
        alert={selectedAlertDetails}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedAlertDetails(null);
        }}
        onQuickRestock={handleQuickRestock}
      />
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        tone={confirmModal.tone}
        loading={thresholdLoading || submitLoading}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
      />
    </AdminLayout>
  );
}