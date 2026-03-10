import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import useDebounce from "../../hooks/useDebounce";
import EmptyState from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/slices/toastSlice";
import { Pencil, Trash2, X } from "lucide-react";

function Input({ className = "", ...props }) {
  return (
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
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={[
          "w-full h-11 rounded-2xl px-4 pr-10 text-[14px]",
          "appearance-none",
          "bg-white dark:bg-slate-900",
          "border border-slate-200/70 dark:border-slate-700",
          "text-slate-900 dark:text-slate-100",
          "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
          className,
        ].join(" ")}
      >
        {children}
      </select>

      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, total, limit, onPrev, onNext, onSet }) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200/70 dark:border-slate-700">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold">{start}</span> to{" "}
        <span className="font-semibold">{end}</span> of{" "}
        <span className="font-semibold">{total}</span> transactions
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 1}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((p) => (
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

        <button
          type="button"
          onClick={onNext}
          disabled={page === totalPages}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function StockHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [editForm, setEditForm] = useState({
    quantity: "",
    supplier: "",
    reason: "manual",
    reference: "",
    });

  const debouncedSearch = useDebounce(search, 400);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const openEditModal = (row) => {
    setDeleteOpen(false);
    setSelectedRow(row);
    setEditForm({
        quantity: String(row.quantity || ""),
        supplier: row.supplier || "",
        reason: row.reason || "manual",
        reference: row.reference || "",
    });
    setEditOpen(true);
    };

    const openDeleteModal = (row) => {
    setEditOpen(false);
    setSelectedRow(row);
    setDeleteOpen(true);
    };
    const closeEditModal = () => {
        if (actionLoading) return;
        setEditOpen(false);
        setSelectedRow(null);
        setEditForm({
            quantity: "",
            supplier: "",
            reason: "manual",
            reference: "",
        });
    };

    const closeDeleteModal = () => {
        if (actionLoading) return;
        setDeleteOpen(false);
        setSelectedRow(null);
    };

    const handleUpdateHistory = async () => {
    if (!selectedRow?._id || !selectedRow?.type) return;

    const qty = Number(editForm.quantity);
    if (!qty || qty <= 0) {
        dispatch(
        showToast({
            type: "warning",
            title: "Invalid Quantity",
            message: "Quantity must be greater than 0.",
        })
        );
        return;
    }

    try {
        setActionLoading(true);

        const payload =
        selectedRow.type === "in"
            ? {
                quantityAdded: qty,
                supplier: editForm.supplier,
                reference: editForm.reference,
            }
            : {
                quantityRemoved: qty,
                reason: editForm.reason,
                reference: editForm.reference,
            };

        await api.patch(
        `/api/admin/stock/history/${selectedRow.type}/${selectedRow._id}`,
        payload
        );

        dispatch(
        showToast({
            type: "success",
            title: "History Updated",
            message: "Stock transaction updated successfully.",
        })
        );

        closeEditModal();
        await fetchHistory();
    } catch (err) {
        console.error(err);
        dispatch(
        showToast({
            type: "error",
            title: "Update Failed",
            message: err?.response?.data?.message || "Failed to update history.",
        })
        );
    } finally {
        setActionLoading(false);
    }
    };

    const handleDeleteHistory = async () => {
    if (!selectedRow?._id || !selectedRow?.type) return;

    try {
        setActionLoading(true);

        await api.delete(
        `/api/admin/stock/history/${selectedRow.type}/${selectedRow._id}`
        );

        dispatch(
        showToast({
            type: "success",
            title: "History Deleted",
            message: "Stock transaction deleted successfully.",
        })
        );

        closeDeleteModal();
        await fetchHistory();
    } catch (err) {
        console.error(err);
        dispatch(
        showToast({
            type: "error",
            title: "Delete Failed",
            message: err?.response?.data?.message || "Failed to delete history.",
        })
        );
    } finally {
        setActionLoading(false);
    }
    };

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/admin/stock/history", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: debouncedSearch,
          type,
        },
      });

      setRows(res.data.history || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination?.total || 0,
        totalPages: res.data.pagination?.totalPages || 1,
      }));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load stock history");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, type]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-[24px] font-extrabold text-slate-900 dark:text-slate-100">
            Stock Transaction History
          </h1>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            View full stock in and stock out history with backend pagination.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                placeholder="Search by product name or SKU..."
              />
            </div>

            <div className="w-full lg:w-[220px]">
              <Select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
              >
                <option value="">All Transactions</option>
                <option value="in">Stock In</option>
                <option value="out">Stock Out</option>
              </Select>
            </div>
          </div>

          <div className="px-5 pb-5 min-h-[420px]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <TableSkeleton rows={8} columns={7} />
                </motion.div> 
              ) : error ? (
                <div className="py-12 text-center text-[13px] text-rose-600 dark:text-rose-300">
                  {error}
                </div>
              ) : rows.length === 0 ? (
                <EmptyState
                  title="No transaction history found"
                  message="Try changing your search or filter."
                />
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700"
                >
                  <div className="grid grid-cols-14 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                    <div className="col-span-3">Product</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-1">Qty</div>
                    <div className="col-span-2">Reference</div>
                    <div className="col-span-2">User</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {rows.map((row) => (
                    <div
                    key={`${row.type}-${row._id}`}
                    className="grid grid-cols-14 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 items-center"
                    >
                    <div className="col-span-3">
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {row.product?.name || "Unknown Product"}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        SKU: {row.product?.sku || "—"}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <span
                        className={[
                            "inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border",
                            row.type === "in"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                            : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
                        ].join(" ")}
                        >
                        {row.type === "in" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {row.type === "in" ? "Stock In" : "Stock Out"}
                        </span>
                    </div>

                    <div className="col-span-1 text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {row.quantity}
                    </div>

                    <div className="col-span-2 text-[12px] text-slate-500 dark:text-slate-400">
                        {row.reference || row.reason || row.supplier || "—"}
                    </div>

                    <div className="col-span-2 text-[12px] text-slate-500 dark:text-slate-400">
                        {row.user?.name || "—"}
                    </div>

                    <div className="col-span-2 text-[12px] text-slate-500 dark:text-slate-400">
                        {new Date(row.createdAt).toLocaleDateString()}
                    </div>

                    <div className="col-span-2 flex justify-end items-center gap-2">
                        <button
                        type="button"
                        onClick={() => openEditModal(row)}
                        className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
                                    bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                    grid place-items-center"
                        title="Edit"
                        >
                        <Pencil size={15} className="text-slate-600 dark:text-slate-200" />
                        </button>

                        <button
                        type="button"
                        onClick={() => openDeleteModal(row)}
                        className="w-9 h-9 rounded-xl border border-rose-200 dark:border-rose-500/30
                                    bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition
                                    grid place-items-center"
                        title="Delete"
                        >
                        <Trash2 size={15} className="text-rose-600 dark:text-rose-300" />
                        </button>
                    </div>
                    </div>
                  ))}

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
            {editOpen && selectedRow ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div
                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
                   onClick={closeEditModal}
                    />

                    <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
                    <div className="px-6 py-5 border-b border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                        <div>
                        <div className="text-[18px] font-extrabold text-slate-900 dark:text-slate-100">
                            Edit Stock History
                        </div>
                        <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                            Update transaction details.
                        </div>
                        </div>

                        <button
                        type="button"
                        onClick={closeEditModal}
                        className="w-9 h-9 rounded-xl grid place-items-center hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                        <X size={16} className="text-slate-500 dark:text-slate-300" />
                        </button>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        <div>
                        <label className="block mb-2 text-[12px] font-bold text-slate-600 dark:text-slate-300">
                            Quantity
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={editForm.quantity}
                            onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, quantity: e.target.value }))
                            }
                            className="w-full h-11 rounded-2xl px-4 text-[14px] bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                        />
                        </div>

                        {selectedRow.type === "in" ? (
                        <div>
                            <label className="block mb-2 text-[12px] font-bold text-slate-600 dark:text-slate-300">
                            Supplier
                            </label>
                            <input
                            type="text"
                            value={editForm.supplier}
                            onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, supplier: e.target.value }))
                            }
                            className="w-full h-11 rounded-2xl px-4 text-[14px] bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                            />
                        </div>
                        ) : (
                        <div>
                            <label className="block mb-2 text-[12px] font-bold text-slate-600 dark:text-slate-300">
                            Reason
                            </label>
                            <select
                            value={editForm.reason}
                            onChange={(e) =>
                                setEditForm((prev) => ({ ...prev, reason: e.target.value }))
                            }
                            className="w-full h-11 rounded-2xl px-4 text-[14px] bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                            >
                            <option value="sale">Sale</option>
                            <option value="damaged">Damaged</option>
                            <option value="adjustment">Adjustment</option>
                            <option value="return_out">Return Out</option>
                            <option value="manual">Manual</option>
                            </select>
                        </div>
                        )}

                        <div>
                        <label className="block mb-2 text-[12px] font-bold text-slate-600 dark:text-slate-300">
                            Reference
                        </label>
                        <input
                            type="text"
                            value={editForm.reference}
                            onChange={(e) =>
                            setEditForm((prev) => ({ ...prev, reference: e.target.value }))
                            }
                            className="w-full h-11 rounded-2xl px-4 text-[14px] bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/25"
                        />
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex items-center justify-end gap-3">
                        <button
                        type="button"
                        onClick={closeEditModal}
                        className="h-11 px-4 rounded-2xl text-[13px] font-semibold border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                        Cancel
                        </button>

                        <button
                        type="button"
                        onClick={handleUpdateHistory}
                        disabled={actionLoading}
                        className="h-11 px-4 rounded-2xl text-[13px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm disabled:opacity-60"
                        >
                        {actionLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                    </div>
                </div>
                ) : null}
                {deleteOpen && selectedRow ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div
                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
                    onClick={closeDeleteModal}
                    />

                    <div className="relative w-full max-w-md rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
                    <div className="px-6 py-5 border-b border-slate-200/70 dark:border-slate-700">
                        <div className="text-[18px] font-extrabold text-slate-900 dark:text-slate-100">
                        Delete History Record
                        </div>
                        <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                        Are you sure you want to delete this transaction? This will also update product stock.
                        </div>
                    </div>

                    <div className="px-6 py-5">
                        <div className="text-[13px] text-slate-700 dark:text-slate-200">
                        <span className="font-semibold">{selectedRow.product?.name || "Unknown Product"}</span>
                        {" • "}
                        {selectedRow.type === "in" ? "Stock In" : "Stock Out"}
                        {" • Qty: "}
                        {selectedRow.quantity}
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex items-center justify-end gap-3">
                        <button
                        type="button"
                        onClick={closeDeleteModal}
                        className="h-11 px-4 rounded-2xl text-[13px] font-semibold border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                        Cancel
                        </button>

                        <button
                        type="button"
                        onClick={handleDeleteHistory}
                        disabled={actionLoading}
                        className="h-11 px-4 rounded-2xl text-[13px] font-semibold bg-rose-600 text-white hover:bg-rose-700 transition shadow-sm disabled:opacity-60"
                        >
                        {actionLoading ? "Deleting..." : "Yes, Delete"}
                        </button>
                    </div>
                    </div>
                </div>
                ) : null}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}