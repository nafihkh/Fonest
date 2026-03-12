import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { useDispatch } from "react-redux";
import { showToast } from "../../store/slices/toastSlice";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  Download,
  RotateCcw,
  SlidersHorizontal,
  Clock3,
  Inbox,
  ShieldCheck,
  CreditCard,
  MoreVertical,
  Package,
  User,
  Search,
  CheckCircle2,
  XCircle,
  PackageCheck,
} from "lucide-react";

function StatTile({ title, value, icon: Icon }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
            {title}
          </div>
          <div className="mt-1 text-[26px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
            {value}
          </div>
        </div>
        <span className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
          <Icon size={18} className="text-slate-700 dark:text-slate-200" />
        </span>
      </div>
    </div>
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
      <Icon size={16} />
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
      <Icon size={16} />
      {label}
    </button>
  );
}

function TabPill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 px-4 rounded-full text-[12px] font-semibold transition",
        active
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Pill({ children, tone = "gray" }) {
  const cls =
    tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
      : tone === "blue"
      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30"
      : tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
      : tone === "red"
      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
      : tone === "indigo"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30"
      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
}

function ProductIcon({ image }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 overflow-hidden grid place-items-center">
      {image ? (
        <img src={image} alt="product" className="w-full h-full object-cover" />
      ) : (
        <Package size={16} className="text-slate-700 dark:text-slate-200" />
      )}
    </div>
  );
}

function statusTone(status) {
  if (status === "requested") return "indigo";
  if (status === "approved") return "blue";
  if (status === "received") return "green";
  if (status === "refunded") return "green";
  if (status === "picked_up") return "amber";
  if (status === "rejected") return "red";
  return "gray";
}

function refundTone(status) {
  if (status === "completed") return "green";
  if (status === "declined") return "red";
  if (status === "processing") return "amber";
  if (status === "pending") return "gray";
  return "gray";
}

function Pagination({ page, totalPages, total, limit, onPrev, onNext, onSet }) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200/70 dark:border-slate-700">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold">{start}</span> to{" "}
        <span className="font-semibold">{end}</span> of{" "}
        <span className="font-semibold">{total}</span> returns
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page === 1}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-50"
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
                ? "bg-indigo-600 text-white"
                : "border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200",
            ].join(" ")}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={onNext}
          disabled={page === totalPages}
          className="h-9 px-3 rounded-xl text-[12px] font-semibold border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ReturnActionMenu({ row, open, onToggle, onApprove, onReject, onReceive }) {
  return (
    <div className="relative">
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

      {open ? (
        <div className="absolute right-0 top-11 z-30 w-48 overflow-hidden rounded-2xl
                        border border-slate-200/80 dark:border-slate-700
                        bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
                        shadow-[0_16px_40px_rgba(15,23,42,0.14)]">
          <div className="p-2 space-y-1">
            {["requested", "picked_up"].includes(row.status) ? (
              <button
                type="button"
                onClick={onApprove}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition"
              >
                <CheckCircle2 size={16} />
                Approve Return
              </button>
            ) : null}

            {["requested", "picked_up", "approved"].includes(row.status) ? (
              <button
                type="button"
                onClick={onReject}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
              >
                <XCircle size={16} />
                Reject Return
              </button>
            ) : null}

            {["approved", "picked_up"].includes(row.status) ? (
              <button
                type="button"
                onClick={onReceive}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[13px] font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition"
              >
                <PackageCheck size={16} />
                Receive & Restore
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Returns() {
  const dispatch = useDispatch();

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({
    pendingApproval: 0,
    receivedToday: 0,
    avgInspectionTime: "0d",
    totalRefundedMTD: 0,
  });

  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    tone: "primary",
    loading: false,
    action: null,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    totalPages: 1,
  });

  const menuRefs = useRef({});

  const statusFilter = useMemo(() => {
    if (tab === "inspect") return "requested";
    if (tab === "refund") return "approved";
    return "";
  }, [tab]);

  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await api.get("/api/admin/returns/stats");
      setStats(res.data.stats || {});
    } catch (err) {
      console.error(err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/admin/returns", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          status: statusFilter,
          search: query.trim(),
        },
      });

      setRows(res.data.returns || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination?.total || 0,
        totalPages: res.data.pagination?.totalPages || 1,
      }));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load returns");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter, query]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (!openMenuId) return;
      const currentRef = menuRefs.current[openMenuId];
      if (currentRef && !currentRef.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [openMenuId]);

  const openConfirm = ({ title, message, confirmText, tone, action }) => {
    setConfirmState({
      open: true,
      title,
      message,
      confirmText,
      tone,
      loading: false,
      action,
    });
  };

  const closeConfirm = () => {
    setConfirmState((prev) => ({
      ...prev,
      open: false,
      action: null,
      loading: false,
    }));
  };

  const runAction = async () => {
    if (!confirmState.action) return;

    try {
      setConfirmState((prev) => ({ ...prev, loading: true }));
      await confirmState.action();

      closeConfirm();
      await Promise.all([fetchReturns(), fetchStats()]);
    } catch (err) {
      console.error(err);
      setConfirmState((prev) => ({ ...prev, loading: false }));

      dispatch(
        showToast({
          type: "error",
          title: "Action Failed",
          message: err?.response?.data?.message || "Unable to complete action.",
        })
      );
    }
  };

  const approveReturn = async (id) => {
    await api.patch(`/api/admin/returns/${id}/approve`, {
      adminNote: "",
    });

    dispatch(
      showToast({
        type: "success",
        title: "Return Approved",
        message: "Return request approved successfully.",
      })
    );
  };

  const rejectReturn = async (id) => {
    await api.patch(`/api/admin/returns/${id}/reject`, {
      adminNote: "",
    });

    dispatch(
      showToast({
        type: "success",
        title: "Return Rejected",
        message: "Return request rejected successfully.",
      })
    );
  };

  const receiveReturn = async (id) => {
    await api.patch(`/api/admin/returns/${id}/receive`);

    dispatch(
      showToast({
        type: "success",
        title: "Stock Restored",
        message: "Return received and stock restored successfully.",
      })
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
              Returns &amp; Refunds
            </h1>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400 max-w-[760px]">
              Manage gadget return requests, inspect outcomes, and control refund workflows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ActionBtn icon={Download} label="Export CSV" />
            <PrimaryBtn icon={RotateCcw} label="Refresh Data" onClick={() => {
              fetchReturns();
              fetchStats();
            }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatTile
            title="Pending Approval"
            value={statsLoading ? "..." : stats.pendingApproval}
            icon={Clock3}
          />
          <StatTile
            title="Received Today"
            value={statsLoading ? "..." : stats.receivedToday}
            icon={Inbox}
          />
          <StatTile
            title="Avg. Inspection Time"
            value={statsLoading ? "..." : stats.avgInspectionTime}
            icon={ShieldCheck}
          />
          <StatTile
            title="Total Refunded (MTD)"
            value={statsLoading ? "..." : stats.totalRefundedMTD}
            icon={CreditCard}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                placeholder="Search by order no or reason..."
                className="w-full h-11 rounded-2xl pl-10 pr-4 text-[14px] bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <ActionBtn icon={SlidersHorizontal} label="Filters" />
              <TabPill active={tab === "all"} onClick={() => {
                setTab("all");
                setPagination((p) => ({ ...p, page: 1 }));
              }}>
                All Returns
              </TabPill>
              <TabPill active={tab === "inspect"} onClick={() => {
                setTab("inspect");
                setPagination((p) => ({ ...p, page: 1 }));
              }}>
                Awaiting Inspection
              </TabPill>
              <TabPill active={tab === "refund"} onClick={() => {
                setTab("refund");
                setPagination((p) => ({ ...p, page: 1 }));
              }}>
                Refund Pending
              </TabPill>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr className="text-left text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                  <th className="px-6 py-4">Return Ticket</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Work Status</th>
                  <th className="px-6 py-4">Refund</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[13px] text-slate-500 dark:text-slate-400">
                      Loading returns...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[13px] text-rose-600 dark:text-rose-300">
                      {error}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[13px] text-slate-500 dark:text-slate-400">
                      No returns found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r._id} className="border-t border-slate-200/70 dark:border-slate-700">
                      <td className="px-6 py-5">
                        <span className="text-[12px] font-extrabold text-indigo-600 dark:text-indigo-300">
                          #{r.ticketNo}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <ProductIcon image={r.product?.image} />
                          <div>
                            <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                              {r.product?.name || "Unknown Product"}
                            </div>
                            <div className="text-[10px] tracking-wide uppercase text-slate-500 dark:text-slate-400">
                              {r.order?.orderNo || "No Order"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 text-[13px] text-slate-900 dark:text-slate-100 font-semibold">
                          <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center">
                            <User size={16} className="text-slate-600 dark:text-slate-200" />
                          </span>
                          {r.user?.name || "Unknown"}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="text-[12px] text-slate-600 dark:text-slate-300">{r.reason || "—"}</div>
                      </td>

                      <td className="px-6 py-5">
                        <Pill tone={statusTone(r.status)}>{r.status}</Pill>
                      </td>

                      <td className="px-6 py-5">
                        <Pill tone={refundTone(r.refundStatus)}>{r.refundStatus}</Pill>
                      </td>

                      <td className="px-6 py-5">
                        <div
                          className="flex justify-end"
                          ref={(node) => {
                            if (node) menuRefs.current[r._id] = node;
                          }}
                        >
                          <ReturnActionMenu
                            row={r}
                            open={openMenuId === r._id}
                            onToggle={() =>
                              setOpenMenuId((prev) => (prev === r._id ? null : r._id))
                            }
                            onApprove={() =>
                              openConfirm({
                                title: "Approve Return",
                                message: "Approve this return request?",
                                confirmText: "Approve",
                                tone: "primary",
                                action: async () => approveReturn(r._id),
                              })
                            }
                            onReject={() =>
                              openConfirm({
                                title: "Reject Return",
                                message: "Reject this return request?",
                                confirmText: "Reject",
                                tone: "danger",
                                action: async () => rejectReturn(r._id),
                              })
                            }
                            onReceive={() =>
                              openConfirm({
                                title: "Receive Return",
                                message: "Receive this return and restore stock automatically?",
                                confirmText: "Receive & Restore",
                                tone: "warning",
                                action: async () => receiveReturn(r._id),
                              })
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
            onSet={(page) => setPagination((p) => ({ ...p, page }))}
          />
        </div>
      </div>

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        tone={confirmState.tone}
        loading={confirmState.loading}
        onClose={closeConfirm}
        onConfirm={runAction}
      />
    </AdminLayout>
  );
}