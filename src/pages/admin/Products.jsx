import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import useDebounce from "../../hooks/useDebounce";
import EmptyState from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { StatCardSkeleton } from "../../components/ui/StatCardSkeleton";
import {
  Search,
  SlidersHorizontal,
  Download,
  BarChart3,
  Plus,
  MoreVertical,
  Package,
  AlertTriangle,
  XCircle,
  Layers,
  PencilLine,
  Trash2,
} from "lucide-react";

// ---------- small UI helpers ----------
function StatTile({ icon: Icon, title, value, sub, tone = "neutral" }) {
  const subTone =
    tone === "green"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "blue"
      ? "text-indigo-600 dark:text-indigo-300"
      : "text-slate-500 dark:text-slate-400";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </div>
          <div className="mt-1 text-[26px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
            {value}
          </div>
          {sub ? <div className={`mt-1 text-[12px] font-semibold ${subTone}`}>{sub}</div> : null}
        </div>

        <span className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
          <Icon size={18} className="text-slate-700 dark:text-slate-200" />
        </span>
      </div>
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <div className="relative flex-1">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        className={[
          "w-full h-11 rounded-2xl pl-10 pr-4 text-[14px]",
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

function Pill({ children, tone = "gray" }) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
      : tone === "red"
      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
}

function ActionBtn({ icon: Icon, label, className = "", ...props }) {
  return (
    <button
      type="button"
      className={[
        "h-11 px-4 rounded-2xl text-[13px] font-semibold transition inline-flex items-center gap-2",
        "border border-slate-200/70 dark:border-slate-700",
        "bg-white dark:bg-slate-900",
        "text-slate-700 dark:text-slate-200",
        "hover:bg-slate-50 dark:hover:bg-slate-800",
        className,
      ].join(" ")}
      {...props}
    >
      {Icon ? <Icon size={16} /> : null}
      {label}
    </button>
  );
}

function PrimaryBtn({ icon: Icon, label, ...props }) {
  return (
    <button
      type="button"
      className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                 bg-indigo-600 text-white hover:bg-indigo-700 transition
                 shadow-sm inline-flex items-center gap-2"
      {...props}
    >
      {Icon ? <Icon size={16} /> : null}
      {label}
    </button>
  );
}

function Pagination({ page, totalPages, total, limit, onPrev, onNext, onSet }) {
  const pages = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) arr.push(i);
    return arr;
  }, [totalPages]);

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200/70 dark:border-slate-700">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold">{start}</span> to{" "}
        <span className="font-semibold">{end}</span> of{" "}
        <span className="font-semibold">{total}</span> products
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 1}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold
                     border border-slate-200/70 dark:border-slate-700
                     bg-white dark:bg-slate-900
                     text-slate-700 dark:text-slate-200
                     hover:bg-slate-50 dark:hover:bg-slate-800 transition
                     disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSet(p)}
              className={[
                "w-9 h-9 rounded-xl text-[12px] font-semibold transition",
                p === page
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={page === totalPages}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold
                     border border-slate-200/70 dark:border-slate-700
                     bg-white dark:bg-slate-900
                     text-slate-700 dark:text-slate-200
                     hover:bg-slate-50 dark:hover:bg-slate-800 transition
                     disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "In Stock") return <Pill tone="green">In Stock</Pill>;
  if (status === "Low Stock") return <Pill tone="amber">Low Stock</Pill>;
  return <Pill tone="red">Out of Stock</Pill>;
}

function ProductThumb({ name }) {
  const initial = (name || "?").trim().slice(0, 1).toUpperCase();
  return (
    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center text-slate-700 dark:text-slate-200 font-bold">
      {initial}
    </div>
  );
}

function EditProductModal({ open, product, saving, onClose, onSave, onChange }) {
  if (!open || !product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
        >
          <div className="px-6 py-5 border-b border-slate-200/70 dark:border-slate-700">
            <div className="text-[18px] font-extrabold text-slate-900 dark:text-slate-100">
              Edit Product
            </div>
            <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
              Update product name and publish status.
            </div>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block mb-2 text-[12px] font-bold text-slate-600 dark:text-slate-300">
                Product Name
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => onChange("name", e.target.value)}
                className="w-full h-11 rounded-2xl px-4 text-[14px]
                           bg-white dark:bg-slate-900
                           border border-slate-200/70 dark:border-slate-700
                           text-slate-900 dark:text-slate-100
                           outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block mb-2 text-[12px] font-bold text-slate-600 dark:text-slate-300">
                Status
              </label>
              <select
                value={product.status}
                onChange={(e) => onChange("status", e.target.value)}
                className="w-full h-11 rounded-2xl px-4 text-[14px]
                           bg-white dark:bg-slate-900
                           border border-slate-200/70 dark:border-slate-700
                           text-slate-900 dark:text-slate-100
                           outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="px-6 pb-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                         border border-slate-200/70 dark:border-slate-700
                         bg-white dark:bg-slate-900
                         text-slate-700 dark:text-slate-200
                         hover:bg-slate-50 dark:hover:bg-slate-800 transition
                         disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                         bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm
                         disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ProductRowMenu({
  open,
  loading,
  onToggle,
  onEdit,
  onDelete,
  menuRef,
}) {
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className="w-10 h-10 rounded-xl border border-slate-200/70 dark:border-slate-700
                   bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                   grid place-items-center"
        title="More"
      >
        <MoreVertical size={16} className="text-slate-600 dark:text-slate-200" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-2xl
                       border border-slate-200/80 dark:border-slate-700
                       bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
                       shadow-[0_16px_40px_rgba(15,23,42,0.14)]"
          >
            <div className="p-2">
              <button
                type="button"
                onClick={onEdit}
                disabled={loading}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                           text-[13px] font-medium text-slate-700 dark:text-slate-200
                           hover:bg-slate-50 dark:hover:bg-slate-800/80 transition
                           disabled:opacity-60"
              >
                <PencilLine size={16} className="text-indigo-600 dark:text-indigo-300" />
                <span>{loading ? "Please wait..." : "Edit Product"}</span>
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={loading}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                           text-[13px] font-medium text-rose-600 dark:text-rose-300
                           hover:bg-rose-50 dark:hover:bg-rose-500/10 transition
                           disabled:opacity-60"
              >
                <Trash2 size={16} />
                <span>{loading ? "Please wait..." : "Delete Product"}</span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// ---------- Page ----------
export default function Products() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const debouncedQuery = useDebounce(q, 500);

  const [checked, setChecked] = useState({});
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    draftProducts: 0,
    outOfStock: 0,
    lowStockItems: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [pendingStatus, setPendingStatus] = useState(statusFilter);

  const [bulkOpen, setBulkOpen] = useState(false);
  const bulkRef = useRef(null);
  const [bulkAction, setBulkAction] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [rowActionLoadingId, setRowActionLoadingId] = useState(null);
  const menuRefs = useRef({});

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const rows = products;
  const allChecked = rows.length > 0 && rows.every((r) => checked[r.id]);

  const toggleAll = () => {
    const next = { ...checked };
    if (allChecked) rows.forEach((r) => (next[r.id] = false));
    else rows.forEach((r) => (next[r.id] = true));
    setChecked(next);
  };

  const selectedIds = Object.entries(checked)
    .filter(([, val]) => val)
    .map(([id]) => id);

  const openFilter = () => {
    setPendingStatus(statusFilter);
    setFilterOpen(true);
  };

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await api.get("/api/products/stats");
      setStats(res.data.stats || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setError("");

    const start = Date.now();

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (debouncedQuery.trim()) params.search = debouncedQuery.trim();
      if (statusFilter) params.status = statusFilter;

      const res = await api.get("/api/products", { params });

      const list = res.data?.products || [];

      const normalized = list.map((p) => ({
        id: p._id || p.id,
        name: p.name || "",
        sku: p.sku || "",
        price: Number(p.price || 0),
        stock: Number(p.stock || 0),
        uiStatus:
          Number(p.stock || 0) === 0
            ? "Out of Stock"
            : Number(p.stock || 0) <= 10
            ? "Low Stock"
            : "In Stock",
        brand: p.brandId?.name || "—",
        category: p.categoryId?.name || "—",
        rawStatus: (p.status || "draft").toLowerCase(),
      }));

      setProducts(normalized);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination?.total || 0,
        totalPages: res.data.pagination?.totalPages || 1,
      }));
      setChecked({});
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      const elapsed = Date.now() - start;
      const minDuration = 350;

      setTimeout(() => {
        setLoadingProducts(false);
      }, Math.max(0, minDuration - elapsed));
    }
  }, [debouncedQuery, statusFilter, pagination.page, pagination.limit]);

  const handleBulkApply = async () => {
    if (!bulkAction) return;
    if (selectedIds.length === 0) {
      alert("Select products first");
      return;
    }

    try {
      await api.patch("/api/products/bulk-action", {
        ids: selectedIds,
        action: bulkAction,
      });

      setBulkOpen(false);
      setBulkAction("");
      setChecked({});
      await fetchProducts();
      await fetchStats();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Bulk action failed");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      status: product.rawStatus || "draft",
    });
    setEditOpen(true);
    setOpenMenuId(null);
  };

  const handleEditField = (field, value) => {
    setEditingProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingProduct?.id) return;

    try {
      setEditSaving(true);

      await api.patch(`/api/products/${editingProduct.id}`, {
        name: editingProduct.name.trim(),
        status: editingProduct.status,
      });

      setEditOpen(false);
      setEditingProduct(null);

      await fetchProducts();
      await fetchStats();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      setRowActionLoadingId(id);
      await api.delete(`/api/products/${id}`);
      setOpenMenuId(null);
      await fetchProducts();
      await fetchStats();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    } finally {
      setRowActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!filterOpen) return;

    const onDown = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setFilterOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [filterOpen]);

  useEffect(() => {
    if (!bulkOpen) return;

    const onDown = (e) => {
      if (bulkRef.current && !bulkRef.current.contains(e.target)) {
        setBulkOpen(false);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") setBulkOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [bulkOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!openMenuId) return;

      const currentRef = menuRefs.current[openMenuId];
      if (currentRef && !currentRef.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loadingStats && stats.totalProducts === 0 ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatTile
                icon={Package}
                title="Total Products"
                value={stats.totalProducts}
                sub={`${stats.activeProducts} Active`}
                tone="green"
              />
              <StatTile
                icon={AlertTriangle}
                title="Low Stock Items"
                value={stats.lowStockItems}
              />
              <StatTile
                icon={XCircle}
                title="Out of Stock"
                value={stats.outOfStock}
              />
              <StatTile
                icon={Layers}
                title="Draft Products"
                value={stats.draftProducts}
                sub="Not yet published"
                tone="blue"
              />
            </>
          )}
        </div>

        {/* Search + actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPagination((p) => ({ ...p, page: 1 }));
              }}
              placeholder="Search by name or SKU..."
            />

            <div className="flex items-center gap-3 justify-end">
              {/* Filter */}
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  onClick={filterOpen ? () => setFilterOpen(false) : openFilter}
                  className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                            border border-slate-200/70 dark:border-slate-700
                            bg-white dark:bg-slate-900
                            text-slate-700 dark:text-slate-200
                            hover:bg-slate-50 dark:hover:bg-slate-800 transition
                            inline-flex items-center gap-2"
                >
                  <SlidersHorizontal size={16} />
                  Filter
                  {statusFilter ? (
                    <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {statusFilter}
                    </span>
                  ) : null}
                </button>

                {filterOpen && (
                  <div
                    className="absolute right-0 top-[52px] z-50 w-[320px]
                              rounded-2xl bg-white dark:bg-slate-900
                              border border-slate-200/70 dark:border-slate-700
                              shadow-[0_12px_30px_rgba(2,6,23,0.12)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                          Filters
                        </div>
                        <div className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400">
                          Filter products by publish status.
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFilterOpen(false)}
                        className="w-9 h-9 rounded-xl grid place-items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-300"
                        title="Close"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                        Status
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          { label: "All", value: "" },
                          { label: "Active", value: "active" },
                          { label: "Draft", value: "draft" },
                          { label: "Archived", value: "archived" },
                        ].map((opt) => {
                          const active = pendingStatus === opt.value;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() => setPendingStatus(opt.value)}
                              className={[
                                "h-9 px-4 rounded-full text-[12px] font-semibold transition border",
                                active
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30"
                                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                              ].join(" ")}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPendingStatus("");
                          setStatusFilter("");
                          setPagination((p) => ({ ...p, page: 1 }));
                          setFilterOpen(false);
                        }}
                        className="flex-1 h-10 rounded-2xl text-[13px] font-semibold
                                  border border-slate-200/70 dark:border-slate-700
                                  bg-white dark:bg-slate-900
                                  text-slate-700 dark:text-slate-200
                                  hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        Reset
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter(pendingStatus);
                          setPagination((p) => ({ ...p, page: 1 }));
                          setFilterOpen(false);
                        }}
                        className="flex-1 h-10 rounded-2xl text-[13px] font-semibold
                                  bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bulk Actions */}
              <div className="relative" ref={bulkRef}>
                <button
                  type="button"
                  onClick={() => setBulkOpen((p) => !p)}
                  className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                            border border-slate-200/70 dark:border-slate-700
                            bg-white dark:bg-slate-900
                            text-slate-700 dark:text-slate-200
                            hover:bg-slate-50 dark:hover:bg-slate-800 transition
                            inline-flex items-center gap-2"
                >
                  Bulk Actions
                  {selectedIds.length > 0 ? (
                    <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {selectedIds.length}
                    </span>
                  ) : null}
                </button>

                {bulkOpen && (
                  <div
                    className="absolute right-0 top-[52px] z-50 w-[300px]
                              rounded-2xl bg-white dark:bg-slate-900
                              border border-slate-200/70 dark:border-slate-700
                              shadow-[0_12px_30px_rgba(2,6,23,0.12)] p-4"
                  >
                    <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                      Bulk Actions
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
                      Apply action to selected products.
                    </div>

                    <div className="mt-4 space-y-2">
                      {[
                        { label: "Publish", value: "publish" },
                        { label: "Archive", value: "archive" },
                        { label: "Delete", value: "delete" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setBulkAction(opt.value)}
                          className={[
                            "w-full h-10 rounded-2xl text-[13px] font-semibold border transition",
                            bulkAction === opt.value
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30"
                              : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/70 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setBulkAction("");
                          setBulkOpen(false);
                        }}
                        className="flex-1 h-10 rounded-2xl text-[13px] font-semibold
                                  border border-slate-200/70 dark:border-slate-700
                                  bg-white dark:bg-slate-900
                                  text-slate-700 dark:text-slate-200
                                  hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleBulkApply}
                        className="flex-1 h-10 rounded-2xl text-[13px] font-semibold
                                  bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <ActionBtn icon={Download} label="Export" />
              <ActionBtn
                icon={BarChart3}
                label="Product Report"
                className="text-indigo-700 dark:text-indigo-200 border-indigo-200/70 dark:border-indigo-500/30"
              />
              <PrimaryBtn
                icon={Plus}
                label="Add Product"
                onClick={() => navigate("/admin/addproduct")}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-0 pb-0 min-h-[420px]">
            <AnimatePresence mode="wait">
              {loadingProducts ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-5"
                >
                  <TableSkeleton rows={5} columns={6} />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="m-5 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <div className="py-12 text-center text-[13px] text-rose-600 dark:text-rose-300">
                    {error}
                  </div>
                </motion.div>
              ) : rows.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="m-5 overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <EmptyState
                    title="No products found"
                    message="Try changing your search or filters."
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr className="text-left text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                          <th className="px-6 py-4 w-[56px]">
                            <input
                              type="checkbox"
                              checked={allChecked}
                              onChange={toggleAll}
                              className="w-5 h-5 rounded-full appearance-none border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:bg-indigo-600 checked:border-indigo-600 relative cursor-pointer after:content-[''] after:absolute after:w-[6px] after:h-[10px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:left-[6px] after:top-[2px] after:hidden checked:after:block"
                            />
                          </th>
                          <th className="px-6 py-4">Product Details</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Stock</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {rows.map((p, index) => (
                          <motion.tr
                            key={p.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.04 }}
                            className="border-t border-slate-200/70 dark:border-slate-700"
                          >
                            <td className="px-6 py-5">
                              <input
                                type="checkbox"
                                checked={!!checked[p.id]}
                                onChange={(e) =>
                                  setChecked((prev) => ({ ...prev, [p.id]: e.target.checked }))
                                }
                                className="w-5 h-5 rounded-full appearance-none border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 checked:bg-indigo-600 checked:border-indigo-600 relative cursor-pointer after:content-[''] after:absolute after:w-[6px] after:h-[10px] after:border-white after:border-r-2 after:border-b-2 after:rotate-45 after:left-[6px] after:top-[2px] after:hidden checked:after:block"
                              />
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <ProductThumb name={p.name} />
                                <div>
                                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                                    {p.name}
                                  </div>
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {p.brand} • SKU: {p.sku}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <Pill>{p.category}</Pill>
                            </td>

                            <td className="px-6 py-5">
                              <div className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                                ${p.price.toFixed(2)}
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="text-[12px] text-slate-700 dark:text-slate-200">
                                <span
                                  className={
                                    p.stock === 0
                                      ? "text-rose-600 dark:text-rose-300 font-semibold"
                                      : ""
                                  }
                                >
                                  {p.stock} pcs
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <StatusBadge status={p.uiStatus} />
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex justify-end">
                                <ProductRowMenu
                                  open={openMenuId === p.id}
                                  loading={rowActionLoadingId === p.id}
                                  onToggle={() =>
                                    setOpenMenuId((prev) => (prev === p.id ? null : p.id))
                                  }
                                  onEdit={() => openEditModal(p)}
                                  onDelete={() => handleDeleteProduct(p.id)}
                                  menuRef={(node) => {
                                    if (node) menuRefs.current[p.id] = node;
                                  }}
                                />
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onPrev={() =>
                      setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                    }
                    onNext={() =>
                      setPagination((p) => ({
                        ...p,
                        page: Math.min(p.totalPages, p.page + 1),
                      }))
                    }
                    onSet={(nextPage) =>
                      setPagination((p) => ({ ...p, page: nextPage }))
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <EditProductModal
          open={editOpen}
          product={editingProduct}
          saving={editSaving}
          onClose={() => {
            if (editSaving) return;
            setEditOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveEdit}
          onChange={handleEditField}
        />
      </div>
    </AdminLayout>
  );
}