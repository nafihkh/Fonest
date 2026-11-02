// AdminDashboard.jsx — fully wired to real backend data
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import { initAdminNotifications } from "../../services/adminNotifications";
import {
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  TriangleAlert,
  RefreshCcw,
  Download,
  RotateCcw,
} from "lucide-react";

// ─── helpers ──────────────────────────────────────────────────────────────────
function fmt(v) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000)   return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000)     return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short",
  });
}

function fmtFull(v) {
  return `₹${Number(v || 0).toLocaleString("en-IN")}`;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, badge, loading }) {
  const isPositive = typeof badge === "number" ? badge >= 0 : badge?.startsWith("+");
  const isNegative = typeof badge === "number" ? badge < 0 : badge?.startsWith("-");
  const displayBadge = typeof badge === "number"
    ? `${badge >= 0 ? "+" : ""}${badge}%`
    : badge;

  const badgeStyles = isPositive
    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
    : isNegative
    ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
    : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/15 grid place-items-center text-[#636AE8] dark:text-indigo-300">
          {title.toLowerCase().includes("revenue") && <IndianRupee size={20} />}
          {title.toLowerCase().includes("profit") && (
            isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />
          )}
          {title.toLowerCase().includes("return") && <RotateCcw size={20} />}
        </div>

        {badge !== undefined && (
          <span className={`flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-full ${badgeStyles}`}>
            {isPositive && <ArrowUpRight size={14} />}
            {isNegative && <ArrowDownRight size={14} />}
            {displayBadge}
          </span>
        )}
      </div>

      <div className="text-[12px] uppercase tracking-wide text-[#565D6DFF] dark:text-slate-400 font-medium">
        {title}
      </div>
      <div className="mt-1 text-[24px] font-bold text-[#636AE8FF] dark:text-indigo-300">
        {loading ? <span className="animate-pulse text-slate-300 dark:text-slate-600">•••</span> : value}
      </div>
    </div>
  );
}

function MiniCard({ title, value, hint, status, Icon, loading }) {
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
          {Icon && <Icon size={20} />}
        </div>
        {hint ? (
          <span className={`flex items-center gap-1 text-[12px] font-medium px-2 py-1 rounded-full ${pill}`}>
            {isBad ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {hint}
          </span>
        ) : null}
      </div>

      <div className="text-[12px] uppercase tracking-wide text-[#565D6DFF] dark:text-slate-400 font-medium">
        {title}
      </div>
      <div className="mt-2 text-[24px] font-extrabold text-slate-900 dark:text-slate-100">
        {loading ? <span className="animate-pulse text-slate-300 dark:text-slate-600">•••</span> : value}
      </div>
    </div>
  );
}

// ─── BarChart ─────────────────────────────────────────────────────────────────
function BarChart({ data = [] }) {
  if (!data.length) return (
    <div className="h-[260px] flex items-center justify-center text-slate-400 text-[13px]">
      No data yet
    </div>
  );

  const maxY = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="h-[260px] w-full flex flex-col justify-end">
      <div className="flex items-end gap-4 px-2 flex-1">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <div className="w-full flex items-end gap-1">
              <div
                className="flex-1 rounded-t-xl bg-indigo-500/90 transition-all duration-700"
                style={{ height: `${Math.max(8, (d.revenue / maxY) * 220)}px` }}
                title={`Revenue: ${fmtFull(d.revenue)}`}
              />
              <div
                className="flex-1 rounded-t-xl bg-emerald-400/80 transition-all duration-700"
                style={{ height: `${Math.max(4, (d.profit / maxY) * 220)}px` }}
                title={`Profit: ${fmtFull(d.profit)}`}
              />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Revenue</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Profit</span>
      </div>
    </div>
  );
}

// ─── DonutChart ───────────────────────────────────────────────────────────────
function DonutChart({ stats }) {
  if (!stats) return null;
  const total = stats.totalProducts || 1;
  const healthy = Math.max(0, total - stats.lowStockItems - stats.outOfStockItems);
  const lowPct  = Math.round((stats.lowStockItems / total) * 100);
  const outPct  = Math.round((stats.outOfStockItems / total) * 100);
  const okPct   = 100 - lowPct - outPct;

  return (
    <div className="flex items-center justify-center h-[260px]">
      <div className="relative w-[180px] h-[180px] rounded-full" style={{
        background: `conic-gradient(#6366F1 0 ${okPct}%, #F59E0B ${okPct}% ${okPct + lowPct}%, #EF4444 ${okPct + lowPct}% 100%)`,
      }}>
        <div className="absolute inset-[24px] bg-white dark:bg-slate-900 rounded-full border border-slate-200/70 dark:border-slate-700 flex items-center justify-center">
          <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">{total}</span>
        </div>
      </div>
    </div>
  );
}

// ─── RecentOrders table ───────────────────────────────────────────────────────
const STATUS_COLORS = {
  placed:    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  confirmed: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  packed:    "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  shipped:   "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  delivered: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  cancelled: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

function RecentOrdersTable({ orders = [], loading }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Recent Orders</div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400">Latest 5 transactions</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-b-2xl border-t border-slate-200/70 dark:border-slate-700">
        <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-5 py-2.5 text-[11px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wide">
          <div className="col-span-4">Customer</div>
          <div className="col-span-2">Order ID</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {loading ? (
          [1,2,3,4,5].map((i) => (
            <div key={i} className="grid grid-cols-12 px-5 py-3 border-t border-slate-200/70 dark:border-slate-700 gap-3">
              <div className="col-span-4 h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div className="col-span-2 h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div className="col-span-3 h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div className="col-span-2 h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
              <div className="col-span-1 h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))
        ) : orders.length === 0 ? (
          <div className="px-5 py-10 text-center text-[13px] text-slate-400">No orders yet</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className="grid grid-cols-12 px-5 py-3 border-t border-slate-200/70 dark:border-slate-700 items-center">
              <div className="col-span-4 text-[13px] font-semibold text-slate-900 dark:text-slate-100 truncate">{o.customer}</div>
              <div className="col-span-2 text-[12px] font-bold text-indigo-600 dark:text-indigo-300">#{o.id}</div>
              <div className="col-span-3 text-[12px] text-slate-500 dark:text-slate-400">{formatDate(o.date)}</div>
              <div className="col-span-2 text-right text-[12px] font-bold text-slate-900 dark:text-slate-100">{fmtFull(o.total)}</div>
              <div className="col-span-1 flex justify-end">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[o.status] || STATUS_COLORS.placed}`}>
                  {o.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── GrowthChart (real SVG area chart) ───────────────────────────────────────
function GrowthChart({ data = [] }) {
  if (!data.length) return null;
  const w = 420, h = 200, pad = 30;
  const maxY = Math.max(...data.map((d) => d.revenue), 1);
  const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(data.length - 1, 1));
  const y = (v) => pad + ((maxY - v) * (h - pad * 2)) / maxY;
  const pts = data.map((d, i) => `${xs[i].toFixed(1)},${y(d.revenue).toFixed(1)}`).join(" ");
  const area = `M ${data.map((d, i) => `${xs[i].toFixed(1)} ${y(d.revenue).toFixed(1)}`).join(" L ")} L ${xs[xs.length-1]} ${h-pad} L ${xs[0]} ${h-pad} Z`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Revenue Trend</div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400">Last {data.length} months</div>
        </div>
        <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
          Live Data
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[200px]">
        <defs>
          <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0,1,2,3].map((i) => {
          const yy = pad + (i * (h - pad * 2)) / 3;
          return <line key={i} x1={pad} x2={w-pad} y1={yy} y2={yy} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />;
        })}
        <path d={area} fill="url(#revGrad)" />
        <polyline points={pts} fill="none" stroke="rgb(99 102 241)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <text key={i} x={xs[i]} y={h - 8} textAnchor="middle" fontSize="10" fill="rgb(100 116 139)">{d.month}</text>
        ))}
      </svg>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/analytics/dashboard");
      setStats(res.data.stats);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // kick off notifications once settings are known
    api.get("/api/settings").then((res) => {
      const notifSettings = res.data?.settings?.notifications;
      initAdminNotifications(notifSettings || {});
    }).catch(() => {
      initAdminNotifications({});
    });
  }, [load]);

  return (
    <AdminLayout>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
            Welcome back, Admin
          </h1>
          <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-1">
            Here's a snapshot of your store's performance today.
          </p>
        </div>

        <div className="flex items-end gap-3">
          <button
            onClick={load}
            className="px-4 py-2 rounded-full border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[14px] font-medium text-slate-700 dark:text-slate-200 transition inline-flex items-center gap-2"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            onClick={() => navigate("/admin/reports")}
            className="px-4 py-2 flex items-center justify-center gap-2 font-medium text-sm leading-[22px] text-white
                       bg-[#636AE8] rounded-2xl border-0 shadow-[0px_0px_2px_#636AE833,0px_4px_9px_#636AE833]
                       hover:bg-[#5A61E6] active:bg-[#4F56E2] disabled:opacity-40 transition"
          >
            <Download size={14} />
            Download Report
          </button>

          <button
            onClick={() => navigate("/admin/stock")}
            className="px-4 py-2 flex items-center justify-center gap-2 font-medium text-sm leading-[22px] text-white
                       bg-slate-800 dark:bg-slate-700 rounded-2xl hover:bg-slate-700 dark:hover:bg-slate-600 transition"
          >
            <Package size={14} />
            Manage Inventory
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-2xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-5 py-4 text-[13px] text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Revenue & Profit Stat Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Monthly Revenue" value={stats ? fmt(stats.monthlyRevenue) : "—"} badge={stats?.monthDelta} loading={loading} />
        <StatCard title="Yearly Revenue"  value={stats ? fmt(stats.yearlyRevenue)  : "—"} loading={loading} />
        <StatCard title="Total Revenue"   value={stats ? fmt(stats.totalRevenue)   : "—"} loading={loading} />
        <StatCard title="Monthly Profit"  value={stats ? fmt(stats.monthlyProfit)  : "—"} loading={loading} />
        <StatCard title="Yearly Profit"   value={stats ? fmt(stats.yearlyProfit)   : "—"} loading={loading} />
      </div>

      {/* Mini Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Total Profit"  value={stats ? fmt(stats.totalProfit) : "—"} loading={loading} />
        <MiniCard title="Total Products"   Icon={Package}      value={loading ? "…" : (stats?.totalProducts ?? 0).toLocaleString("en-IN")} />
        <MiniCard title="Low Stock Items"  Icon={TriangleAlert} value={loading ? "…" : (stats?.lowStockItems ?? 0)} hint={stats?.lowStockItems > 0 ? `${stats.lowStockItems} items` : undefined} status={stats?.lowStockItems > 0 ? "critical" : "ok"} />
        <MiniCard title="Out of Stock"     Icon={TriangleAlert} value={loading ? "…" : (stats?.outOfStockItems ?? 0)} hint={stats?.outOfStockItems > 0 ? `${stats.outOfStockItems} items` : undefined} status={stats?.outOfStockItems > 0 ? "critical" : "resolved"} />
        <MiniCard title="Total Customers"  Icon={Users}         value={loading ? "…" : (stats?.totalUsers ?? 0).toLocaleString("en-IN")} hint={stats?.pendingReturns > 0 ? `${stats.pendingReturns} returns` : undefined} status={stats?.pendingReturns > 0 ? "critical" : "ok"} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Financial Performance</div>
              <div className="text-[12px] text-slate-500 dark:text-slate-400">Monthly revenue vs profit breakdown</div>
            </div>
            <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${loading ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"}`}>
              {loading ? "Loading…" : "LIVE DATA"}
            </span>
          </div>
          {loading
            ? <div className="h-[260px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
            : <BarChart data={stats?.chartData || []} />
          }
        </div>

        {/* Inventory Donut */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100">Inventory Health</div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400">Stock distribution overview</div>
          {loading
            ? <div className="h-[260px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl mt-4" />
            : <DonutChart stats={stats} />
          }
          <div className="grid grid-cols-1 gap-1.5 text-[12px] text-slate-600 dark:text-slate-300 mt-2">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Healthy Stock</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Low Stock ({stats?.lowStockItems ?? 0})</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Out of Stock ({stats?.outOfStockItems ?? 0})</div>
          </div>
        </div>

        {/* Revenue Trend + Recent Orders */}
        <div className="lg:col-span-2">
          {loading
            ? <div className="h-[280px] animate-pulse bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-700" />
            : <GrowthChart data={stats?.chartData || []} />
          }
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="text-[14px] font-bold text-slate-900 dark:text-slate-100 mb-1">Quick Actions</div>
          <div className="space-y-2 mt-3">
            {[
              { label: "Manage Orders", path: "/admin/orders", color: "bg-indigo-600 hover:bg-indigo-700 text-white" },
              { label: "View Returns",  path: "/admin/returns", color: "bg-rose-500 hover:bg-rose-600 text-white" },
              { label: "Stock Control", path: "/admin/stock",   color: "bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white" },
              { label: "Manage Users",  path: "/admin/users",   color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
            ].map((a) => (
              <button key={a.path} type="button" onClick={() => navigate(a.path)}
                className={`w-full py-2.5 px-4 rounded-xl text-[13px] font-semibold text-left transition ${a.color}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="mt-4">
        <RecentOrdersTable orders={stats?.recentOrders || []} loading={loading} />
      </div>
    </AdminLayout>
  );
}