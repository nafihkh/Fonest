import AdminLayout from "../../components/admin/AdminLayout";
import { ArrowUpRight } from 'lucide';

function StatCard({ title, value, badge, badgeType = "up" }) {
  const badgeStyles =
    badgeType === "up"
      ? "bg-[#10B9811A] text-[#059669FF]"
      : badgeType === "down"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
            {title}
          </div>
          <div className="mt-1 text-[20px] font-extrabold text-indigo-700">
            {value}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={[
              "text-[11px] font-medium px-2 py-1 rounded-full",
              badgeStyles,
            ].join(" ")}
          >
            {badge}
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 grid place-items-center text-indigo-700">
            💠
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ title, value, hint, status }) {
  const pill =
    status === "critical"
      ? "bg-rose-50 text-rose-700 border-rose-200"
      : status === "resolved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-indigo-50 text-indigo-700 border-indigo-200";

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">
          {title}
        </div>
        {hint && (
          <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${pill}`}>
            {hint}
          </span>
        )}
      </div>
      <div className="mt-2 text-[22px] font-extrabold text-slate-900">{value}</div>
      <div className="mt-1 text-[12px] text-slate-500">Inventory Health</div>
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
            <div
              className="w-8 rounded-xl bg-rose-400/90"
              style={{ height: `${h * 2.2}px` }}
            />
            <div
              className="w-8 rounded-xl bg-indigo-500/90"
              style={{ height: `${bars2[i] * 2.2}px` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutFake() {
  // conic-gradient donut
  return (
    <div className="flex items-center justify-center h-[260px]">
      <div className="relative w-[180px] h-[180px] rounded-full"
        style={{
          background:
            "conic-gradient(#6366F1 0 40%, #F43F5E 40% 60%, #10B981 60% 78%, #A855F7 78% 100%)",
        }}
      >
        <div className="absolute inset-[20px] bg-white rounded-full border border-slate-200/70" />
      </div>
    </div>
  );
}
function GrowthAnalysis() {
  // simple SVG line chart (no libs)
  const points = "20,160 70,150 120,135 170,120 220,105 270,80 320,55 370,35";
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold text-slate-900">Growth Analysis</div>
          <div className="text-[12px] text-slate-500">Cumulative platform growth over 5 years</div>
        </div>
        <span className="text-[11px] font-bold px-2 py-1 rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
          High Performance
        </span>
      </div>

      <div className="mt-4">
        <svg viewBox="0 0 420 200" className="w-full h-[200px]">
          {/* grid */}
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

          {/* area */}
          <path
            d={`M ${points} L 370,180 L 20,180 Z`}
            fill="rgba(99,102,241,0.16)"
          />

          {/* line */}
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
          <span>2019</span><span>2020</span><span>2021</span><span>2022</span><span>2023</span><span>2024</span>
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
    Success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Warning: "bg-amber-50 text-amber-700 border-amber-200",
    Info: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${map[status] || map.Info}`}>
      {status}
    </span>
  );
}

function SystemActivity() {
  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[14px] font-bold text-slate-900">System Activity</div>
          <div className="text-[12px] text-slate-500">Latest events and alerts</div>
        </div>
        <button className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 transition" type="button">
          View Log
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/70">
        <div className="grid grid-cols-12 bg-slate-50 px-3 py-2 text-[11px] font-bold text-slate-500">
          <div className="col-span-7">Event</div>
          <div className="col-span-2">Time</div>
          <div className="col-span-3 text-right">Status</div>
        </div>

        {activity.map((a, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 px-3 py-3 border-t border-slate-200/70 items-center"
          >
            <div className="col-span-7">
              <div className="text-[12px] font-semibold text-slate-900">{a.event}</div>
              <div className="text-[11px] text-slate-500">{a.by}</div>
            </div>
            <div className="col-span-2 text-[11px] text-slate-500">{a.time}</div>
            <div className="col-span-3 flex justify-end" >
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
          <h1 className="text-[30px] font-extrabold font-archivo text-slate-900">
            Welcome back, Admin
          </h1>
          <p className="text-[16px] text-slate-500 mt-1">
            Here’s a snapshot of your store’s performance today.
          </p>
        </div>

        <div className="flex items-end gap-3">
          <button className="px-4 py-2 rounded-full border border-slate-200/70 bg-white hover:bg-slate-50 text-[14px] font-semibold">
            Download Report
          </button>
          <button className="px-4 py-2 flex items-center justify-center font-medium text-sm leading-[22px] text-white
         bg-[#636AE8] rounded-2xl border-0 shadow-[0px_0px_2px_#636AE833,0px_4px_9px_#636AE833]hover:bg-[#636AE8] active:bg-[#636AE8] disabled:opacity-40">
            Manage Inventory
          </button>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Monthly Revenue" value="$124,592" badge="+12.5%" />
        <StatCard title="Yearly Revenue" value="$1,420,000" badge="+8.2%" />
        <StatCard title="Total Revenue" value="$3,842,100" badge="+15.4%" />
        <StatCard title="Monthly Profit" value="$42,300" badge="+10.1%" />
        <StatCard title="Yearly Profit" value="$482,000" badge="+5.4%" />
      </div>

      {/* Mini cards row */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <MiniCard title="Total Profit" value="$1,120,500" hint="+12.0%" status="ok" />
        <MiniCard title="Total Products" value="1,248" hint="" status="ok" />
        <MiniCard title="Low Stock Items" value="24" hint="4 critical" status="critical" />
        <MiniCard title="Out of Stock" value="12" hint="2 resolved" status="resolved" />
        <MiniCard title="Total Users" value="8,942" hint="+240 new" status="ok" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[14px] font-bold text-slate-900">
                Financial Performance
              </div>
              <div className="text-[12px] text-slate-500">
                Monthly revenue vs profit breakdown
              </div>
            </div>
            <button className="w-9 h-9 rounded-xl border border-slate-200/70 hover:bg-slate-50">
              ↗️
            </button>
          </div>
          <div className="mt-4">
            <BarChartFake />
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 rounded-2xl p-4 shadow-sm">
          <div>
            <div className="text-[14px] font-bold text-slate-900">Sales by Category</div>
            <div className="text-[12px] text-slate-500">
              Distribution of top performing sectors
            </div>
          </div>
          <DonutFake />
          <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-600">
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