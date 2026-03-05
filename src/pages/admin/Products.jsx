// src/pages/admin/Products.jsx
import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
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
          <div className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">{title}</div>
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

function Pagination({ page, totalPages, onPrev, onNext, onSet }) {
  const pages = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) arr.push(i);
    return arr;
  }, [totalPages]);

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200/70 dark:border-slate-700">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold">1-5</span> of{" "}
        <span className="font-semibold">1,284</span> products
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
                     disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-slate-900"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {pages.slice(0, 5).map((p) => (
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
          <span className="px-1 text-slate-400">…</span>
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            24
          </button>
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
                     disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-slate-900"
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

// ---------- Page ----------
export default function Products() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState({}); // id -> bool
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // "", "draft", "active"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [pendingStatus, setPendingStatus] = useState(statusFilter); 

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return products;
    return products.filter((p) => {
      return (
        p.name.toLowerCase().includes(t) ||
        (p.brand || "").toLowerCase().includes(t) ||
        (p.sku || "").toLowerCase().includes(t)
      );
    });
  }, [q, products]);
  const navigate = useNavigate();
  


  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const allChecked = rows.length > 0 && rows.every((r) => checked[r.id]);

  const toggleAll = () => {
    const next = { ...checked };
    if (allChecked) rows.forEach((r) => (next[r.id] = false));
    else rows.forEach((r) => (next[r.id] = true));
    setChecked(next);
  };
  const openFilter = () => {
    setPendingStatus(statusFilter);
    setFilterOpen(true);
  };
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
      let mounted = true;

      const fetchProducts = async () => {
        try {
          setLoading(true);
          setError("");

          const res = await api.get("/api/products", {
            params: statusFilter ? { status: statusFilter } : {},
          });

          const list = res.data?.products || [];
          if (!mounted) return;

          // If you didn't populate brand/category, keep safe fallbacks:
          const normalized = list.map((p) => ({
            id: p._id || p.id,
            name: p.name || "",
            sku: p.sku || "",
            price: Number(p.price || 0),
            stock: Number(p.stock || 0),

            // Backend "status" could be: draft|active|inactive|archived
            // UI wants: In Stock | Low Stock | Out of Stock
            uiStatus:
              Number(p.stock || 0) === 0
                ? "Out of Stock"
                : Number(p.stock || 0) <= 10
                ? "Low Stock"
                : "In Stock",

            // optional if you used populate:
            brand: p.brandId?.name || p.brand?.name || "—",
            category: p.categoryId?.name || p.category?.name || "—",

            rawStatus: p.status,
          }));

          setProducts(normalized);
          setChecked({});
        } catch (e) {
          if (!mounted) return;
          setError(e?.response?.data?.message || "Failed to load products");
        } finally {
          if (mounted) setLoading(false);
        }
      };

      fetchProducts();

      return () => {
        mounted = false;
      };
    }, [statusFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatTile icon={Package} title="Total Products" value="1,284" sub="+12 New this month" tone="green" />
          <StatTile icon={AlertTriangle} title="Low Stock Items" value="24" />
          <StatTile icon={XCircle} title="Out of Stock" value="08" />
          <StatTile icon={Layers} title="Category Diversity" value="18" sub="Gadgets leading" tone="blue" />
        </div>

        {/* Search + actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, brand or SKU..."
            />

            <div className="flex items-center gap-3 justify-end">
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
                    <span className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded-full
                                    bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
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
                        className="w-9 h-9 rounded-xl grid place-items-center
                                  hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                  text-slate-500 dark:text-slate-300"
                        title="Close"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Status chips */}
                    <div className="mt-4">
                      <div className="text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                        Status
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {[
                          { label: "All", value: "" },
                          { label: "Active", value: "active" },
                          { label: "Draft", value: "draft" },
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

                    {/* Actions */}
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setPendingStatus("");
                          setStatusFilter("");
                          setPage(1);
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
                          setStatusFilter(pendingStatus); // ✅ triggers your useEffect fetch
                          setPage(1);
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
              <ActionBtn icon={null} label="Bulk Actions" />
              <ActionBtn icon={Download} label="Export" />
              <ActionBtn icon={BarChart3} label="Product Report" className="text-indigo-700 dark:text-indigo-200 border-indigo-200/70 dark:border-indigo-500/30" />
              <PrimaryBtn icon={Plus} label="Add Product" onClick={() => navigate("/admin/addproduct")} />
            </div>
          </div>
        </div>
        {loading && (
          <div className="text-[12px] text-slate-500 dark:text-slate-400">
            Loading products...
          </div>
        )}

        {error && (
          <div className="text-[12px] text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}
        {/* Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr className="text-left text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                  <th className="px-6 py-4 w-[56px]">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={toggleAll}
                      className="w-5 h-5
                            rounded-full
                            appearance-none
                            border-2
                            border-slate-300
                            dark:border-slate-600
                            bg-white
                            dark:bg-slate-800
                            checked:bg-indigo-600
                            checked:border-indigo-600
                            relative
                            cursor-pointer
                            after:content-['']
                            after:absolute
                            after:w-[6px]
                            after:h-[10px]
                            after:border-white
                            after:border-r-2
                            after:border-b-2
                            after:rotate-45
                            after:left-[6px]
                            after:top-[2px]
                            after:hidden
                            checked:after:block"
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
                {rows.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200/70 dark:border-slate-700">
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={!!checked[p.id]}
                        onChange={(e) => setChecked((prev) => ({ ...prev, [p.id]: e.target.checked }))}
                        className="w-5 h-5
                            rounded-full
                            appearance-none
                            border-2
                            border-slate-300
                            dark:border-slate-600
                            bg-white
                            dark:bg-slate-800
                            checked:bg-indigo-600
                            checked:border-indigo-600
                            relative
                            cursor-pointer
                            after:content-['']
                            after:absolute
                            after:w-[6px]
                            after:h-[10px]
                            after:border-white
                            after:border-r-2
                            after:border-b-2
                            after:rotate-45
                            after:left-[6px]
                            after:top-[2px]
                            after:hidden
                            checked:after:block"
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
                        <span className={p.stock === 0 ? "text-rose-600 dark:text-rose-300 font-semibold" : ""}>
                          {p.stock} pcs
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={p.uiStatus} />
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl border border-slate-200/70 dark:border-slate-700
                                     bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                     grid place-items-center"
                          title="More"
                        >
                          <MoreVertical size={16} className="text-slate-600 dark:text-slate-200" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              {rows.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[13px] text-slate-500 dark:text-slate-400">
                      No products match your filter.
                    </td>
                  </tr>
                ) : null}
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onSet={setPage}
          />
        </div>
      </div>
    </AdminLayout>
  );
}