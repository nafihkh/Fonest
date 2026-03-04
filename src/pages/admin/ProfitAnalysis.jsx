// src/pages/admin/ProfitAnalysis.jsx
import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  CalendarDays,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  BarChart3,
  LineChart,
  DollarSign,
  Receipt,
  Lightbulb,
} from "lucide-react";

// ---------- UI helpers ----------
function Chip({ icon: Icon, label, right, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 px-4 rounded-2xl text-[12px] font-semibold
                 border border-slate-200/70 dark:border-slate-700
                 bg-white dark:bg-slate-900
                 text-slate-700 dark:text-slate-200
                 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                 inline-flex items-center gap-2"
    >
      {Icon ? <Icon size={14} /> : null}
      <span>{label}</span>
      {right ? <span className="text-slate-400 dark:text-slate-500">{right}</span> : null}
    </button>
  );
}

function PrimaryBtn({ icon: Icon, label }) {
  return (
    <button
      type="button"
      className="h-10 px-4 rounded-2xl text-[12px] font-semibold
                 bg-indigo-600 text-white hover:bg-indigo-700 transition
                 shadow-sm inline-flex items-center gap-2"
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function KPI({ title, value, delta, deltaTone = "green", icon: Icon }) {
  const tone =
    deltaTone === "green"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
            {title}
          </div>
          <div className="mt-1 text-[22px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
            {value}
          </div>
          <div className="mt-2 inline-flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${tone}`}>{delta}</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">vs. last period</span>
          </div>
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
          {subtitle ? <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">{subtitle}</div> : null}
        </div>
        {right}
      </div>
      <div className="px-5 pb-5 pt-4">{children}</div>
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

function ProgressBar({ value, tone = "indigo" }) {
  const bar =
    tone === "indigo"
      ? "bg-indigo-600"
      : tone === "rose"
      ? "bg-rose-500"
      : "bg-emerald-500";
  return (
    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className={`h-full ${bar}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

// ---------- Page ----------
export default function ProfitAnalysis() {
  const [range, setRange] = useState("Last 7 Months");

  const chartPoints = useMemo(
    () => [
      { m: "Jan", rev: 45, cost: 32, profit: 13 },
      { m: "Feb", rev: 52, cost: 34, profit: 18 },
      { m: "Mar", rev: 48, cost: 31, profit: 17 },
      { m: "Apr", rev: 62, cost: 36, profit: 26 },
      { m: "May", rev: 55, cost: 33, profit: 22 },
      { m: "Jun", rev: 68, cost: 38, profit: 30 },
      { m: "Jul", rev: 72, cost: 41, profit: 31 },
    ],
    []
  );

  // Simple SVG “chart” to match screenshot layout (no real chart lib)
  const Chart = () => {
    const w = 900;
    const h = 260;
    const pad = 30;

    const xs = chartPoints.map((_, i) => pad + (i * (w - pad * 2)) / (chartPoints.length - 1));
    const maxY = 80;

    const y = (v) => pad + ((maxY - v) * (h - pad * 2)) / maxY;

    const makePath = (key) =>
      chartPoints
        .map((p, i) => `${i === 0 ? "M" : "L"} ${xs[i].toFixed(1)} ${y(p[key]).toFixed(1)}`)
        .join(" ");

    const areaPath = (() => {
      const top = makePath("rev");
      const endX = xs[xs.length - 1];
      const startX = xs[0];
      return `${top} L ${endX} ${h - pad} L ${startX} ${h - pad} Z`;
    })();

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[280px]">
        <defs>
          <linearGradient id="revFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="grid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgb(148 163 184)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="rgb(148 163 184)" stopOpacity="0.10" />
          </linearGradient>
        </defs>

        {/* grid */}
        {[0, 1, 2, 3].map((i) => {
          const yy = pad + (i * (h - pad * 2)) / 3;
          return (
            <line
              key={i}
              x1={pad}
              x2={w - pad}
              y1={yy}
              y2={yy}
              stroke="url(#grid)"
              strokeWidth="1"
            />
          );
        })}

        {/* revenue area */}
        <path d={areaPath} fill="url(#revFill)" />

        {/* lines */}
        <path d={makePath("rev")} fill="none" stroke="rgb(99 102 241)" strokeWidth="2.5" />
        <path d={makePath("cost")} fill="none" stroke="rgb(244 63 94)" strokeWidth="2.5" strokeDasharray="5 4" />
        <path d={makePath("profit")} fill="none" stroke="rgb(16 185 129)" strokeWidth="2.5" />

        {/* x labels */}
        {chartPoints.map((p, i) => (
          <text
            key={p.m}
            x={xs[i]}
            y={h - 10}
            textAnchor="middle"
            fontSize="11"
            fill="rgb(100 116 139)"
          >
            {p.m}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Chip
              icon={CalendarDays}
              label={range}
              onClick={() => setRange((p) => (p === "Last 7 Months" ? "Last 12 Months" : "Last 7 Months"))}
            />
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Data last synced: <span className="font-semibold">2 mins ago</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Chip icon={RefreshCcw} label="Compare Periods" />
            <PrimaryBtn icon={Download} label="Export PDF Report" />
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPI title="Monthly Net Profit" value="$28,402.50" delta="+12.5%" deltaTone="green" icon={LineChart} />
          <KPI title="Yearly Net Profit" value="$342,190.00" delta="+8.1%" deltaTone="green" icon={DollarSign} />
          <KPI title="Total Cumulative Profit" value="$1,240,900.00" delta="-2.1%" deltaTone="red" icon={Receipt} />
        </div>

        {/* Chart card */}
        <Card
          title="Revenue vs. Operational Cost"
          subtitle="Visualizing the relationship between top-line sales and bottom-line profit margins."
          right={
            <span className="h-8 px-3 rounded-full text-[11px] font-bold
                             bg-indigo-50 text-indigo-700 border border-indigo-200
                             dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30
                             inline-flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-300" />
              LIVE FEED
            </span>
          }
        >
          <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
            <div className="p-4">
              <Chart />
            </div>

            <div className="px-5 pb-4 flex flex-wrap items-center justify-center gap-5">
              <LegendDot colorClass="bg-indigo-600" label="Total Revenue" />
              <LegendDot colorClass="bg-rose-500" label="Operational Cost" />
              <LegendDot colorClass="bg-emerald-500" label="Net Profit" />
            </div>
          </div>
        </Card>

        {/* Bottom split */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
          {/* Calculation Breakdown */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-indigo-600 dark:text-indigo-300" />
                Calculation Breakdown
              </div>
            }
            subtitle="Detailed audit of how net profit is derived from current operations."
          >
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
              <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                <div className="col-span-6">Item</div>
                <div className="col-span-3">Amount</div>
                <div className="col-span-3 text-right">Change</div>
              </div>

              {[
                { idx: 1, name: "Gross Merchandise Value", amt: "$842,500", ch: "+12%", tone: "green" },
                { idx: 2, name: "Cost of Goods Sold (COGS)", amt: "$512,200", ch: "+8%", tone: "red" },
                { idx: 3, name: "Shipping & Logistics", amt: "$42,300", ch: "-2%", tone: "green" },
                { idx: 4, name: "Marketing Spend", amt: "$35,000", ch: "+15%", tone: "red" },
                { idx: 5, name: "Customer Returns", amt: "$12,400", ch: "-5%", tone: "green" },
              ].map((r) => (
                <div
                  key={r.idx}
                  className="grid grid-cols-12 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 items-center"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-[12px] font-extrabold text-slate-700 dark:text-slate-200">
                      {r.idx}
                    </span>
                    <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                      {r.name}
                    </div>
                  </div>

                  <div className="col-span-3 text-[13px] font-bold text-slate-900 dark:text-slate-100">
                    {r.amt}
                  </div>

                  <div className="col-span-3 flex justify-end">
                    <span
                      className={[
                        "text-[11px] font-bold px-2.5 py-1 rounded-full",
                        r.tone === "green"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
                      ].join(" ")}
                    >
                      {r.ch}
                    </span>
                  </div>
                </div>
              ))}

              <div className="p-5 bg-indigo-50/60 dark:bg-indigo-500/10 border-t border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="inline-flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white grid place-items-center">
                    <DollarSign size={18} />
                  </span>
                  <div>
                    <div className="text-[10px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      Final Net Profit
                    </div>
                    <div className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
                      $248,200.00
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="h-10 px-4 rounded-2xl text-[12px] font-semibold
                             bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700
                             text-indigo-700 dark:text-indigo-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  View Full Audit Trail →
                </button>
              </div>
            </div>
          </Card>

          {/* Profit Insights */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-indigo-600 dark:text-indigo-300" />
                Profit Insights
              </div>
            }
          >
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  <span>Profit Margin</span>
                  <span className="text-slate-700 dark:text-slate-200">32.4%</span>
                </div>
                <ProgressBar value={32.4} tone="indigo" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  <span>Operating Ratio</span>
                  <span className="text-slate-700 dark:text-slate-200">68.1%</span>
                </div>
                <ProgressBar value={68.1} tone="rose" />
              </div>

              <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
                <div className="text-[12px] font-extrabold text-slate-900 dark:text-slate-100">
                  Key Recommendation
                </div>
                <div className="mt-2 text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  Logistics costs are <span className="font-semibold text-rose-600 dark:text-rose-300">+8%</span> higher than industry average.
                  Switching to <span className="font-semibold">FONEST Direct Shipping</span> could improve margins by{" "}
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">2.4%</span> monthly.
                </div>

                <button
                  type="button"
                  className="mt-3 w-full h-10 rounded-2xl text-[12px] font-semibold
                             bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Optimize Costs
                </button>
              </div>

              <div className="pt-1 text-center text-[10px] tracking-wide uppercase text-slate-400 dark:text-slate-500">
                “Precision in numbers. Clarity in growth.”
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-300 dark:text-slate-600">
                <span className="w-2 h-2 rounded-full bg-indigo-600/40" />
                <span className="w-2 h-2 rounded-full bg-indigo-600/60" />
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}