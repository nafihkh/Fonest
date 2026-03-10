import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import EmptyState from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/TableSkeleton";
import { StatCardSkeleton } from "../../components/ui/StatCardSkeleton";
import useDebounce from "../../hooks/useDebounce";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Search,
  Download,
  UserPlus,
  MoreVertical,
  Shield,
  Users as UsersIcon,
  UserCog,
  Clock,
  Ban,
  Trash2,
  CheckCircle2,
} from "lucide-react";

// ---------- UI helpers ----------
function StatTile({ icon: Icon, title, value, badge, badgeTone = "neutral" }) {
  const tone =
    badgeTone === "green"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : badgeTone === "red"
      ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center">
          <Icon size={18} className="text-indigo-600 dark:text-indigo-300" />
        </span>

        {badge ? (
          <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${tone}`}>
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <div className="text-[12px] text-slate-500 dark:text-slate-400 font-semibold">
          {title}
        </div>
        <div className="mt-1 text-[26px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
          {value}
        </div>
      </div>
    </div>
  );
}

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
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const normalized = (status || "").toLowerCase();

  const map = {
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    suspended:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
  };

  const label =
    normalized === "active"
      ? "Active"
      : normalized === "pending"
      ? "Pending"
      : normalized === "suspended"
      ? "Suspended"
      : status;

  return (
    <span
      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
        map[normalized] || map.active
      }`}
    >
      {label}
    </span>
  );
}

function RoleCell({ role }) {
  const normalized = (role || "").toLowerCase();

  const icon =
    normalized === "admin" ? (
      <Shield size={16} className="text-indigo-600 dark:text-indigo-300" />
    ) : normalized === "staff" ? (
      <UserCog size={16} className="text-indigo-600 dark:text-indigo-300" />
    ) : (
      <UsersIcon size={16} className="text-indigo-600 dark:text-indigo-300" />
    );

  const label =
    normalized === "admin"
      ? "Admin"
      : normalized === "staff"
      ? "Staff"
      : "Customer";

  return (
    <div className="flex items-center gap-2">
      <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center">
        {icon}
      </span>
      <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
        {label}
      </span>
    </div>
  );
}

function Avatar({ name }) {
  const initial = (name || "?").trim().slice(0, 1).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/15 grid place-items-center text-indigo-700 dark:text-indigo-300 text-[12px] font-bold">
      {initial}
    </div>
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
        <span className="font-semibold">{total}</span> users
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

function UserActionMenu({
  user,
  open,
  loading,
  onToggle,
  onBlockToggle,
  onDelete,
  menuRef,
}) {
  const isBlocked = user.status?.toLowerCase() === "suspended";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
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
                onClick={onBlockToggle}
                disabled={loading}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                           text-[13px] font-medium text-slate-700 dark:text-slate-200
                           hover:bg-slate-50 dark:hover:bg-slate-800/80 transition
                           disabled:opacity-60"
              >
                {isBlocked ? (
                  <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-300" />
                ) : (
                  <Ban size={16} className="text-amber-600 dark:text-amber-300" />
                )}
                <span>{loading ? "Please wait..." : isBlocked ? "Unblock User" : "Block User"}</span>
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
                <span>{loading ? "Please wait..." : "Delete User"}</span>
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function Users() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const menuRefs = useRef({});

  const debouncedQuery = useDebounce(query, 500);

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAdmins: 0,
    staffMembers: 0,
    pendingApproval: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/api/admin/users/stats");
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    const start = Date.now();

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (debouncedQuery.trim()) params.search = debouncedQuery.trim();
      if (role) params.role = role;
      if (status) params.status = status;

      const res = await api.get("/api/users", { params });

      setUsers(res.data.users || []);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination?.total || 0,
        totalPages: res.data.pagination?.totalPages || 1,
      }));
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      const elapsed = Date.now() - start;
      const minDuration = 350;

      setTimeout(() => {
        setLoading(false);
      }, Math.max(0, minDuration - elapsed));
    }
  }, [debouncedQuery, role, status, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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

  const rows = users;

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    try {
      setActionLoadingId(id);
      await api.delete(`/api/users/${id}`);
      setOpenMenuId(null);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBlockToggle = async (user) => {
    try {
      setActionLoadingId(user._id);

      const isBlocked = user.status?.toLowerCase() === "suspended";
      const endpoint = isBlocked
        ? `/api/users/${user._id}/unblock`
        : `/api/users/${user._id}/block`;

      await api.patch(endpoint);

      setOpenMenuId(null);
      await fetchUsers();
      await fetchStats();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          (user.status?.toLowerCase() === "suspended"
            ? "Unblock failed"
            : "Block failed")
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading && stats.totalUsers === 0 ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatTile
                icon={UsersIcon}
                title="Total Users"
                value={stats.totalUsers}
                badge="+8.2%"
                badgeTone="green"
              />
              <StatTile
                icon={Shield}
                title="Active Admins"
                value={stats.activeAdmins}
                badge="Stable"
              />
              <StatTile
                icon={UserCog}
                title="Staff Members"
                value={stats.staffMembers}
                badge="+24"
                badgeTone="green"
              />
              <StatTile
                icon={Clock}
                title="Pending Approval"
                value={stats.pendingApproval}
                badge="-12%"
                badgeTone="red"
              />
            </>
          )}
        </div>

        {/* Filters + table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          {/* Filter bar */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
                placeholder="Search by name or email..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 w-full lg:w-[420px]">
              <Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="customer">Customer</option>
              </Select>

              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPagination((p) => ({ ...p, page: 1 }));
                }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </Select>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                           border border-slate-200/70 dark:border-slate-700
                           bg-white dark:bg-slate-900
                           text-slate-700 dark:text-slate-200
                           hover:bg-slate-50 dark:hover:bg-slate-800 transition
                           inline-flex items-center gap-2"
              >
                <Download size={16} />
                Export CSV
              </button>

              <button
                type="button"
                className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                           bg-indigo-600 text-white hover:bg-indigo-700 transition
                           shadow-sm inline-flex items-center gap-2"
              >
                <UserPlus size={16} />
                Add New User
              </button>
            </div>
          </div>

          {/* Table */}
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
                  <TableSkeleton rows={6} columns={5} />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900"
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
                  className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <EmptyState
                    title="No users found"
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
                  className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700"
                >
                  <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                    <div className="col-span-5">User Profile</div>
                    <div className="col-span-3">Account Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Joined Date</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>

                  {rows.map((u, index) => (
                    <motion.div
                      key={u._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      className="grid grid-cols-12 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 items-center"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <Avatar name={u.name} />
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                            {u.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {u.email}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-3">
                        <RoleCell role={u.role} />
                      </div>

                      <div className="col-span-2">
                        <StatusPill status={u.status} />
                      </div>

                      <div className="col-span-1 text-[12px] text-slate-500 dark:text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>

                      <div className="col-span-1 flex justify-end items-center gap-2">
                        <UserActionMenu
                          user={u}
                          open={openMenuId === u._id}
                          loading={actionLoadingId === u._id}
                          onToggle={() =>
                            setOpenMenuId((prev) => (prev === u._id ? null : u._id))
                          }
                          onBlockToggle={() => handleBlockToggle(u)}
                          onDelete={() => handleDelete(u._id)}
                          menuRef={(node) => {
                            if (node) menuRefs.current[u._id] = node;
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onPrev={() =>
                      setPagination((p) => ({
                        ...p,
                        page: Math.max(1, p.page - 1),
                      }))
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
      </div>
    </AdminLayout>
  );
}