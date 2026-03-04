// src/pages/admin/Returns.jsx
import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
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
} from "lucide-react";

// ---------- UI helpers ----------
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

function ProductIcon() {
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center">
      <Package size={16} className="text-slate-700 dark:text-slate-200" />
    </div>
  );
}

// ---------- demo data ----------
const seedReturns = [
  {
    id: "RET-8421",
    product: "iPhone 15 Pro Max",
    brand: "DIGITAL GADGET",
    customer: "Marcus Vane",
    reason: "Defective Speaker",
    workStatus: { label: "Inspecting", tone: "amber" },
    refund: { label: "Processing", tone: "gray" },
  },
  {
    id: "RET-8422",
    product: "Sony WH-1000XM5",
    brand: "DIGITAL GADGET",
    customer: "Sarah Jenkins",
    reason: "Change of Mind",
    workStatus: { label: "Received", tone: "blue" },
    refund: { label: "Waiting", tone: "gray" },
  },
  {
    id: "RET-8423",
    product: "Samsung S24 Ultra",
    brand: "DIGITAL GADGET",
    customer: "David Chen",
    reason: "Wrong Color",
    workStatus: { label: "Refunded", tone: "green" },
    refund: { label: "Completed", tone: "green" },
  },
  {
    id: "RET-8424",
    product: "MacBook Air M3",
    brand: "DIGITAL GADGET",
    customer: "Emma Wilson",
    reason: "Keyboard Issue",
    workStatus: { label: "Pending Approval", tone: "indigo" },
    refund: { label: "N/A", tone: "gray" },
  },
  {
    id: "RET-8425",
    product: "Apple Watch Ultra",
    brand: "DIGITAL GADGET",
    customer: "James Bond",
    reason: "Damaged on Arrival",
    workStatus: { label: "Rejected", tone: "red" },
    refund: { label: "Declined", tone: "red" },
  },
];

export default function Returns() {
  const [tab, setTab] = useState("all");
  const [checked, setChecked] = useState({});

  const rows = useMemo(() => {
    if (tab === "all") return seedReturns;
    if (tab === "inspect") return seedReturns.filter((r) => r.workStatus.label === "Inspecting");
    if (tab === "refund") return seedReturns.filter((r) => r.refund.label === "Processing" || r.refund.label === "Waiting");
    return seedReturns;
  }, [tab]);

  const allChecked = rows.length > 0 && rows.every((r) => checked[r.id]);

  const toggleAll = () => {
    const next = { ...checked };
    if (allChecked) rows.forEach((r) => (next[r.id] = false));
    else rows.forEach((r) => (next[r.id] = true));
    setChecked(next);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
              Returns &amp; Refunds
            </h1>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400 max-w-[760px]">
              Manage gadget return requests, verify product integrity, and authorize financial refunds through the automated workflow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ActionBtn icon={Download} label="Export CSV" />
            <PrimaryBtn icon={RotateCcw} label="Sync Inventory" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatTile title="Pending Approval" value="24" icon={Clock3} />
          <StatTile title="Received Today" value="18" icon={Inbox} />
          <StatTile title="Avg. Inspection Time" value="1.2d" icon={ShieldCheck} />
          <StatTile title="Total Refunded (MTD)" value="$12,450" icon={CreditCard} />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              className="h-9 px-4 rounded-full text-[12px] font-semibold
                         border border-slate-200/70 dark:border-slate-700
                         bg-white dark:bg-slate-900
                         text-slate-700 dark:text-slate-200
                         hover:bg-slate-50 dark:hover:bg-slate-800 transition
                         inline-flex items-center gap-2"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>

            <div className="flex items-center gap-2 flex-wrap">
              <TabPill active={tab === "all"} onClick={() => setTab("all")}>
                All Returns
              </TabPill>
              <TabPill active={tab === "inspect"} onClick={() => setTab("inspect")}>
                Awaiting Inspection
              </TabPill>
              <TabPill active={tab === "refund"} onClick={() => setTab("refund")}>
                Refund Pending
              </TabPill>
            </div>
          </div>
        </div>

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
                      className="w-5 h-5 rounded-full accent-indigo-600 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4">Return Ticket</th>
                  <th className="px-6 py-4">Product &amp; Brand</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Work Status</th>
                  <th className="px-6 py-4">Refund</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-200/70 dark:border-slate-700">
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={!!checked[r.id]}
                        onChange={(e) => setChecked((p) => ({ ...p, [r.id]: e.target.checked }))}
                        className="w-5 h-5 rounded-full accent-indigo-600 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 cursor-pointer"
                      />
                    </td>

                    <td className="px-6 py-5">
                      <div className="inline-flex items-center">
                        <span className="text-[12px] font-extrabold text-indigo-600 dark:text-indigo-300">
                          #{r.id}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <ProductIcon />
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                            {r.product}
                          </div>
                          <div className="text-[10px] tracking-wide uppercase text-slate-500 dark:text-slate-400">
                            {r.brand}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="inline-flex items-center gap-2 text-[13px] text-slate-900 dark:text-slate-100 font-semibold">
                        <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center">
                          <User size={16} className="text-slate-600 dark:text-slate-200" />
                        </span>
                        {r.customer}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-[12px] text-slate-600 dark:text-slate-300">{r.reason}</div>
                    </td>

                    <td className="px-6 py-5">
                      <Pill tone={r.workStatus.tone}>{r.workStatus.label}</Pill>
                    </td>

                    <td className="px-6 py-5">
                      <span className={`text-[12px] font-semibold ${r.refund.tone === "green" ? "text-emerald-700 dark:text-emerald-300" : r.refund.tone === "red" ? "text-rose-700 dark:text-rose-300" : "text-slate-600 dark:text-slate-300"}`}>
                        {r.refund.label}
                      </span>
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
            </table>
          </div>

          {/* bottom padding like screenshot */}
          <div className="h-4" />
        </div>
      </div>
    </AdminLayout>
  );
}