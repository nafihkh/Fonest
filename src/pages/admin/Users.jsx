// src/pages/admin/Users.jsx
import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Search,
  Download,
  UserPlus,
  Pencil,
  Trash2,
  MoreVertical,
  Shield,
  Users as UsersIcon,
  UserCog,
  Clock,
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    Suspended:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30",
  };
  return (
    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${map[status] || map.Active}`}>
      {status}
    </span>
  );
}

function RoleCell({ role }) {
  const icon =
    role === "Admin" ? (
      <Shield size={16} className="text-indigo-600 dark:text-indigo-300" />
    ) : role === "Staff" ? (
      <UserCog size={16} className="text-indigo-600 dark:text-indigo-300" />
    ) : (
      <UsersIcon size={16} className="text-indigo-600 dark:text-indigo-300" />
    );

  return (
    <div className="flex items-center gap-2">
      <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center">
        {icon}
      </span>
      <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{role}</span>
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

function Pagination({ page, totalPages, onPrev, onNext, onSet }) {
  const pages = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) arr.push(i);
    return arr;
  }, [totalPages]);

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200/70 dark:border-slate-700">
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        Showing <span className="font-semibold">1</span> to <span className="font-semibold">6</span> of{" "}
        <span className="font-semibold">1,240</span> users
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
                     disabled:opacity-50 disabled:hover:bg-white disabled:dark:hover:bg-slate-900"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ---------- Page ----------
const seedUsers = [
  {
    id: "u1",
    name: "Alexander Pierce",
    email: "alex.pierce@fonest.com",
    role: "Admin",
    status: "Active",
    joined: "Jan 12, 2023",
  },
  {
    id: "u2",
    name: "Sarah Jenkins",
    email: "s.jenkins@staff.fonest.com",
    role: "Staff",
    status: "Active",
    joined: "Mar 05, 2023",
  },
  {
    id: "u3",
    name: "Marcus Thorne",
    email: "m.thorne@customer.io",
    role: "Customer",
    status: "Pending",
    joined: "Oct 22, 2023",
  },
  {
    id: "u4",
    name: "Elena Rodriguez",
    email: "elena.r@fonest.com",
    role: "Staff",
    status: "Suspended",
    joined: "Feb 18, 2023",
  },
  {
    id: "u5",
    name: "David Kim",
    email: "dkim88@gmail.com",
    role: "Customer",
    status: "Active",
    joined: "Dec 01, 2023",
  },
  {
    id: "u6",
    name: "Isabella Vang",
    email: "isa.vang@admin.fonest.com",
    role: "Admin",
    status: "Active",
    joined: "Aug 14, 2022",
  },
];

export default function Users() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return seedUsers
      .filter((u) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        );
      })
      .filter((u) => (role === "All Roles" ? true : u.role === role))
      .filter((u) => (status === "All Status" ? true : u.status === status));
  }, [query, role, status]);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatTile icon={UsersIcon} title="Total Users" value="12,482" badge="+8.2%" badgeTone="green" />
          <StatTile icon={Shield} title="Active Admins" value="14" badge="Stable" />
          <StatTile icon={UserCog} title="Staff Members" value="156" badge="+24" badgeTone="green" />
          <StatTile icon={Clock} title="Pending Approval" value="43" badge="-12%" badgeTone="red" />
        </div>

        {/* Filters + table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
          {/* Filter bar */}
          <div className="p-5 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, email, or role..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 w-full lg:w-[420px]">
              <Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setPage(1);
                }}
              >
                <option>All Roles</option>
                <option>Admin</option>
                <option>Staff</option>
                <option>Customer</option>
              </Select>

              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
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
          <div className="px-5 pb-5">
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                <div className="col-span-5">User Profile</div>
                <div className="col-span-3">Account Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Joined Date</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {rows.map((u) => (
                <div
                  key={u.id}
                  className="grid grid-cols-12 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 items-center"
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <Avatar name={u.name} />
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {u.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{u.email}</div>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <RoleCell role={u.role} />
                  </div>

                  <div className="col-span-2">
                    <StatusPill status={u.status} />
                  </div>

                  <div className="col-span-1 text-[12px] text-slate-500 dark:text-slate-400">
                    {u.joined}
                  </div>

                  <div className="col-span-1 flex justify-end items-center gap-2">
                    <button
                      type="button"
                      className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
                                 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                 grid place-items-center"
                      title="Edit"
                    >
                      <Pencil size={16} className="text-slate-600 dark:text-slate-200" />
                    </button>

                    <button
                      type="button"
                      className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
                                 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                 grid place-items-center"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-slate-600 dark:text-slate-200" />
                    </button>

                    <button
                      type="button"
                      className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
                                 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                 grid place-items-center"
                      title="More"
                    >
                      <MoreVertical size={16} className="text-slate-600 dark:text-slate-200" />
                    </button>
                  </div>
                </div>
              ))}

              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                onSet={setPage}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}