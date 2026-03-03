// AdminDashboard.jsx (updated with full dark mode support)

import AdminLayout from "../../components/admin/AdminLayout";
import {
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  TriangleAlert,
  Activity,
} from "lucide-react";

function StatCard({ title, value, badge }) {
  const isPositive = badge?.startsWith("+");
  const isNegative = badge?.startsWith("-");
  const cleanValue = badge?.replace(/^[+-]/, "");

  const badgeStyles = isPositive
    ? "bg-[#10B9811A] text-[#059669FF]"
    : isNegative
    ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center text-[#636AE8] dark:text-indigo-300">
          {title.toLowerCase().includes("revenue") && <IndianRupee size={20} />}

          {title.toLowerCase().includes("profit") &&
            (isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />)}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={[
              "flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-full border border-transparent",
              badgeStyles,
            ].join(" ")}
          >
            {isPositive && <ArrowUpRight size={14} />}
            {isNegative && <ArrowDownRight size={14} />}
            {cleanValue}
          </span>
        </div>
      </div>

      <div>
        <div className="text-[12px] uppercase tracking-wide text-[#565D6DFF] dark:text-slate-400 font-medium">
          {title}
        </div>
        <div className="mt-1 text-[24px] font-archivo font-bold text-[#636AE8FF] dark:text-indigo-300 [text-shadow:_0_0_4px_#636AE84D]">
          {value}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ title, value, hint, status }) {
  const pill =
    status === "critical"
      ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
      : status === "resolved"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300";

  const isBad = status === "critical";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 rounded-full bg-[#F3F4F6FF] dark:bg-slate-800 grid place-items-center text-[#565D6D] dark:text-slate-200 mb-3">
          {title.toLowerCase().includes("product") && <Package size={20} />}
          {title.toLowerCase().includes("stock") && <TriangleAlert size={20} />}
          {title.toLowerCase().includes("user") && <Users size={20} />}
        </div>

        {hint ? (
          <span className={`flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-full ${pill}`}>
            {isBad ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {hint}
          </span>
        ) : null}
      </div>

      <div className="flex items-start justify-between">
        <div className="text-[12px] uppercase tracking-wide text-[#565D6DFF] dark:text-slate-400 font-medium">
          {title}
        </div>
      </div>

      <div className="mt-2 text-[24px] font-archivo font-extrabold text-slate-900 dark:text-slate-100">
        {value}
      </div>

      {title.toLowerCase().includes("product") && (
        <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">Inventory Health</div>
      )}
    </div>
  );
}

function BarChartFake() {
  const bars = [70, 55, 88, 80, 72, 95];
  const bars2 = [28, 22, 35, 32, 30, 40];

  return (
    <div className="h-[260px] w-full">
      <div className="h-full flex items-end gap-6 px-2">
        {bars.map((h, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-8 rounded-xl bg-rose-400/90" style={{ height: `${h * 2.2}px` }} />
            <div className="w-8 rounded-xl bg-indigo-500/90" style={{ height: `${bars2[i] * 2.2}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutFake() {
  return (
    <div className="flex items-center justify-center h-[260px]">
      <div
        className="relative w-[180px] h-[180px] rounded-full"
        style={{
          background:
            "conic-gradient(#6366F1 0 40%, #F43F5E 40% 60%, #10B981 60% 78%, #A855F7 78% 100%)",
        }}
      >
        <div className="absolute inset-[20px] bg-white dark:bg-slate-900 rounded-full border border-slate-200/70 dark:border-slate-700" />
      </div>
    </div>
  );
}

function GrowthAnalysis() {
  const points = "20,160 70,150 120,135 170,120 220,105 270,80 320,55 370,35";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Growth Analysis</div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400">
            Cumulative platform growth over 5 years
          </div>
        </div>

        <span className="text-[11px] font-bold px-2 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30">
          High Performance
        </span>
      </div>

      <div className="mt-4">
        <svg viewBox="0 0 420 200" className="w-full h-[200px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <line
              key={i}
              x1="20"
              x2="400"
              y1={40 + i * 32}
              y2={40 + i * 32}
              stroke="rgba(148,163,184,0.35)"
              strokeWidth="1"
            />
          ))}

          <path d={`M ${points} L 370,180 L 20,180 Z`} fill="rgba(99,102,241,0.16)" />

          <polyline
            points={points}
            fill="none"
            stroke="rgba(99,102,241,0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="flex justify-between text-[11px] text-slate-400 px-1">
          <span>2019</span>
          <span>2020</span>
          <span>2021</span>
          <span>2022</span>
          <span>2023</span>
          <span>2024</span>
        </div>
      </div>
    </div>
  );
}

const activity = [
  { event: "Purchased iPhone 15 Pro", by: "Alex Rivera", time: "2 mins ago", status: "Success" },
  { event: "Stock Alert: MacBook Air M2", by: "System", time: "15 mins ago", status: "Warning" },
  { event: "New Admin Account Created", by: "Sarah Chen", time: "1 hour ago", status: "Info" },
  { event: "Return Processed #RET-902", by: "John Doe", time: "3 hours ago", status: "Success" },
  { event: "Database Backup Completed", by: "System", time: "5 hours ago", status: "Success" },
];

function StatusPill({ status }) {
  const map = {
    Success:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30",
    Warning:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30",
    Info:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30",
  };

  return (
    <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${map[status] || map.Info}`}>
      {status}
    </span>
  );
}

function SystemActivity() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">System Activity</div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400">Latest events and alerts</div>
        </div>

        <button
          className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 transition"
          type="button"
        >
          View Log
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-700">
        <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-300">
          <div className="col-span-7">Event</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        {activity.map((a, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 px-3 py-3 border-t border-slate-200/70 dark:border-slate-700 items-center"
          >
            <div className="col-span-7">
              <div className="text-[12px] font-semibold text-slate-900 dark:text-slate-100">{a.event}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">{a.by}</div>
            </div>
            <div className="col-span-2 text-[11px] text-slate-500 dark:text-slate-400">{a.time}</div>
            <div className="col-span-3 flex justify-end">
              <StatusPill status={a.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
            Welcome back, Admin
          </h1>
          <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-1">
            Here’s a snapshot of your store’s performance today.
          </p>
        </div>

        <div className="flex items-end gap-3">
          <button
            className="px-4 py-2 rounded-full border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[14px] font-medium text-slate-700 dark:text-slate-200 transition"
          >
            Download Report
          </button>

          <button
            className="px-4 py-2 flex items-center justify-center font-medium text-sm leading-[22px] text-white
                       bg-[#636AE8] rounded-2xl border-0 shadow-[0px_0px_2px_#636AE833,0px_4px_9px_#636AE833]
                       hover:bg-[#5A61E6] active:bg-[#4F56E2] disabled:opacity-40 transition"
          >
            Manage Inventory
          </button>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Monthly Revenue" value="₹ 124,592" badge="+12.5%" />
        <StatCard title="Yearly Revenue" value="₹ 1,420,000" badge="-8.2%" />
        <StatCard title="Total Revenue" value="₹ 3,842,100" badge="+15.4%" />
        <StatCard title="Monthly Profit" value="₹ 42,300" badge="+10.1%" />
        <StatCard title="Yearly Profit" value="₹ 482,000" badge="+5.4%" />
      </div>

      {/* Mini cards row */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Profit" value="$1,120,500" badge="+12.0%" />
        <MiniCard title="Total Products" value="1,248" hint="" status="ok" />
        <MiniCard title="Low Stock Items" value="24" hint="4 critical" status="critical" />
        <MiniCard title="Out of Stock" value="12" hint="2 resolved" status="resolved" />
        <MiniCard title="Total Users" value="8,942" hint="+240 new" status="ok" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Financial Performance</div>
              <div className="text-[12px] text-slate-500 dark:text-slate-400">
                Monthly revenue vs profit breakdown
              </div>
            </div>
            <button className="w-9 h-9 text-slate-700 dark:text-slate-200" type="button">
              <Activity />
            </button>
          </div>
          <div className="mt-4">
            <BarChartFake />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
          <div>
            <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Sales by Category</div>
            <div className="text-[12px] text-slate-500 dark:text-slate-400">
              Distribution of top performing sectors
            </div>
          </div>

          <DonutFake />

          <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Phones
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Audio
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Accessories
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Wearables
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <GrowthAnalysis />
        </div>

        <SystemActivity />
      </div>
    </AdminLayout>
  );
}