import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import {
  CalendarDays,
  RefreshCcw,
  Download,
  BarChart3,
  LineChart,
  DollarSign,
  Receipt,
  Lightbulb,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// ── UI helpers ────────────────────────────────────────────────────────────────
function Chip({ icon: Icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="h-10 px-4 rounded-2xl text-[12px] font-semibold
                 border border-slate-200/70 dark:border-slate-700
                 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200
                 hover:bg-slate-50 dark:hover:bg-slate-800 transition inline-flex items-center gap-2">
      {Icon && <Icon size={14} />}
      <span>{label}</span>
    </button>
  );
}

function KPI({ title, value, delta, icon: Icon, loading }) {
  const positive = delta >= 0;
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">{title}</div>
          <div className="mt-1 text-[22px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
            {loading ? <span className="animate-pulse">...</span> : value}
          </div>
          {delta !== undefined && (
            <div className="mt-2 inline-flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                positive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
              }`}>
                {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {positive ? "+" : ""}{delta}%
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        <span className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
          <Icon size={18} className="text-slate-700 dark:text-slate-200" />
        </span>
      </div>
    </div>
  );
}

function Card({ title, subtitle, right, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="px-5 pt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100">{title}</div>
          {subtitle && <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{subtitle}</div>}
        </div>
        {right}
      </div>
      <div className="px-5 pb-5 pt-4">{children}</div>
    </div>
  );
}

function ProgressBar({ value, tone = "indigo" }) {
  const bar = tone === "indigo" ? "bg-indigo-600" : tone === "rose" ? "bg-rose-500" : "bg-emerald-500";
  return (
    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className={`h-full ${bar} transition-all duration-700`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

function LegendDot({ colorClass, label }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
      <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </div>
  );
}

function RevenueChart({ data = [] }) {
  if (!data.length) return null;

  const w = 900, h = 260, pad = 40;
  const maxY = Math.max(...data.map((d) => d.revenue), 1);
  const xs = data.map((_, i) => pad + (i * (w - pad * 2)) / Math.max(data.length - 1, 1));
  const y = (v) => pad + ((maxY - v) * (h - pad * 2)) / maxY;
  const makePath = (key) =>
    data.map((p, i) => `${i === 0 ? "M" : "L"} ${xs[i].toFixed(1)} ${y(p[key]).toFixed(1)}`).join(" ");

  const areaPath = (() => {
    const top = makePath("revenue");
    return `${top} L ${xs[xs.length - 1]} ${h - pad} L ${xs[0]} ${h - pad} Z`;
  })();

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[260px]">
      <defs>
        <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.20" />
          <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => {
        const yy = pad + (i * (h - pad * 2)) / 3;
        return <line key={i} x1={pad} x2={w - pad} y1={yy} y2={yy} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />;
      })}
      <path d={areaPath} fill="url(#revFill)" />
      <path d={makePath("revenue")} fill="none" stroke="rgb(99 102 241)" strokeWidth="2.5" strokeLinecap="round" />
      <path d={makePath("cost")} fill="none" stroke="rgb(244 63 94)" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />
      <path d={makePath("profit")} fill="none" stroke="rgb(16 185 129)" strokeWidth="2.5" strokeLinecap="round" />
      {data.map((p, i) => (
        <text key={p.month} x={xs[i]} y={h - 10} textAnchor="middle" fontSize="11" fill="rgb(100 116 139)">{p.month}</text>
      ))}
      {/* Revenue dots */}
      {data.map((p, i) => (
        <circle key={`r${i}`} cx={xs[i]} cy={y(p.revenue)} r="3.5" fill="rgb(99 102 241)" />
      ))}
    </svg>
  );
}

function fmtCurrency(v) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v}`;
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProfitAnalysis() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/analytics/profit");
      setStats(res.data.stats);
      setLastSync(new Date());
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load profit data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const breakdownRows = stats
    ? [
        { idx: 1, name: "Gross Revenue (Paid Orders)", amt: fmtCurrency(stats.monthlyRevenue), ch: `${stats.monthDelta >= 0 ? "+" : ""}${stats.monthDelta}%`, tone: stats.monthDelta >= 0 ? "green" : "red" },
        { idx: 2, name: "Est. Cost of Goods Sold (~62%)", amt: fmtCurrency(Math.round(stats.monthlyRevenue * 0.62)), ch: "-", tone: "red" },
        { idx: 3, name: "Estimated Net Profit (38%)", amt: fmtCurrency(stats.monthlyProfit), ch: `${stats.monthDelta >= 0 ? "+" : ""}${stats.monthDelta}%`, tone: stats.monthDelta >= 0 ? "green" : "red" },
      ]
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Chip icon={CalendarDays} label="This Month" />
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {lastSync
                ? `Last synced: ${lastSync.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
                : "Loading data..."}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Chip icon={RefreshCcw} label="Refresh" onClick={load} />
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-5 py-4 text-[13px] text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPI title="Monthly Net Profit" value={stats ? fmtCurrency(stats.monthlyProfit) : "—"} delta={stats?.monthDelta} icon={LineChart} loading={loading} />
          <KPI title="Yearly Net Profit" value={stats ? fmtCurrency(stats.yearlyProfit) : "—"} icon={DollarSign} loading={loading} />
          <KPI title="All-Time Cumulative Profit" value={stats ? fmtCurrency(stats.allTimeProfit) : "—"} icon={Receipt} loading={loading} />
        </div>

        {/* Chart */}
        <Card
          title="Revenue vs. Estimated Cost"
          subtitle="7-month trend — real data from paid orders"
          right={
            <span className="h-8 px-3 rounded-full text-[11px] font-bold
                             bg-indigo-50 text-indigo-700 border border-indigo-200
                             dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30
                             inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-300" />
              {loading ? "Loading…" : "LIVE DATA"}
            </span>
          }
        >
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-hidden">
            <div className="p-4">
              {loading ? (
                <div className="h-[260px] animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
              ) : (
                <RevenueChart data={stats?.chartData || []} />
              )}
            </div>
            <div className="px-5 pb-4 flex flex-wrap items-center justify-center gap-5">
              <LegendDot colorClass="bg-indigo-600" label="Total Revenue" />
              <LegendDot colorClass="bg-rose-500" label="Estimated Cost (~62%)" />
              <LegendDot colorClass="bg-emerald-500" label="Net Profit" />
            </div>
          </div>
        </Card>

        {/* Bottom split */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
          {/* Breakdown */}
          <Card
            title={<div className="flex items-center gap-2"><BarChart3 size={16} className="text-indigo-600 dark:text-indigo-300" /> Calculation Breakdown</div>}
            subtitle="Monthly profit derivation from real order data"
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                <div className="col-span-6">Item</div>
                <div className="col-span-3">Amount</div>
                <div className="col-span-3 text-right">Change</div>
              </div>

              {loading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="grid grid-cols-12 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 gap-3">
                      <div className="col-span-6 h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      <div className="col-span-3 h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                      <div className="col-span-3 h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
                    </div>
                  ))
                : breakdownRows.map((r) => (
                    <div key={r.idx} className="grid grid-cols-12 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 items-center">
                      <div className="col-span-6 flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-[12px] font-extrabold text-slate-700 dark:text-slate-200">{r.idx}</span>
                        <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{r.name}</div>
                      </div>
                      <div className="col-span-3 text-[13px] font-bold text-slate-900 dark:text-slate-100">{r.amt}</div>
                      <div className="col-span-3 flex justify-end">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          r.tone === "green"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
                        }`}>{r.ch}</span>
                      </div>
                    </div>
                  ))}

              {!loading && stats && (
                <div className="p-5 bg-indigo-50/60 dark:bg-indigo-500/10 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white grid place-items-center"><DollarSign size={18} /></span>
                    <div>
                      <div className="text-[10px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">Final Net Profit (This Month)</div>
                      <div className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100">{fmtCurrency(stats.monthlyProfit)}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Insights */}
          <Card title={<div className="flex items-center gap-2"><Lightbulb size={16} className="text-indigo-600 dark:text-indigo-300" /> Profit Insights</div>}>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  <span>Profit Margin</span>
                  <span className="text-slate-700 dark:text-slate-200">{loading ? "..." : `${stats?.profitMargin ?? 38}%`}</span>
                </div>
                <ProgressBar value={stats?.profitMargin ?? 38} tone="indigo" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  <span>Operating Cost Ratio</span>
                  <span className="text-slate-700 dark:text-slate-200">{loading ? "..." : `${stats?.operatingRatio ?? 62}%`}</span>
                </div>
                <ProgressBar value={stats?.operatingRatio ?? 62} tone="rose" />
              </div>

              <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
                <div className="text-[12px] font-extrabold text-slate-900 dark:text-slate-100">Key Recommendation</div>
                <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Profit margin is maintained at <span className="font-semibold text-indigo-600 dark:text-indigo-300">~38%</span>. To improve margins, consider reducing shipping costs and increasing average order value through bundling strategies.
                </div>
                <div className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
                  ⚠ Cost ratio is estimated (62%). Connect your procurement system for exact COGS.
                </div>
              </div>

              <div className="pt-1 text-center text-[10px] tracking-wide uppercase text-slate-400 dark:text-slate-500">
                "Precision in numbers. Clarity in growth."
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}