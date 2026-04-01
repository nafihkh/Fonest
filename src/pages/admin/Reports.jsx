// src/pages/admin/Reports.jsx
import { useMemo, useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { api } from "../../services/api";
import {
  CalendarDays,
  Filter,
  Download,
  FileText,
  Search,
  MoreVertical,
  RefreshCcw,
} from "lucide-react";

// ---------- small UI helpers ----------
function Chip({ icon: Icon, label, onClick }) {
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
      <Icon size={14} />
      {label}
    </button>
  );
}

function ActionBtn({ icon: Icon, label, className = "" }) {
  return (
    <button
      type="button"
      className={[
        "h-10 px-4 rounded-2xl text-[12px] font-semibold transition inline-flex items-center gap-2",
        "border border-slate-200/70 dark:border-slate-700",
        "bg-white dark:bg-slate-900",
        "text-slate-700 dark:text-slate-200",
        "hover:bg-slate-50 dark:hover:bg-slate-800",
        className,
      ].join(" ")}
    >
      <Icon size={14} />
      {label}
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

function StatMini({ title, value, sub, subTone = "green" }) {
  const tone =
    subTone === "green"
      ? "text-emerald-600 dark:text-emerald-400"
      : subTone === "red"
      ? "text-rose-600 dark:text-rose-300"
      : "text-slate-500 dark:text-slate-400";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-1 text-[24px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
        {value}
      </div>
      {sub ? <div className={`mt-2 text-[12px] font-semibold ${tone}`}>{sub}</div> : null}
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

function Pill({ children, tone = "gray" }) {
  const cls =
    tone === "indigo"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30"
      : tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
      : tone === "red"
      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
}

function ProgressBar({ value, tone = "indigo" }) {
  const bar =
    tone === "indigo" ? "bg-indigo-600" : tone === "rose" ? "bg-rose-500" : "bg-emerald-500";
  return (
    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <div className={`h-full ${bar}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
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
        Showing <span className="font-semibold">6</span> of{" "}
        <span className="font-semibold">1,248</span> products
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
          {pages.slice(0, 3).map((p) => (
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
          <span className="px-1 text-slate-400">…</span>
          <button
            type="button"
            className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            42
          </button>
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

// ---------- demo data ----------
const bestProducts = [
  { id: "bp1", name: "Titan Pro Smartwatch", meta: "Wearables • 1,240 Sold", value: "$372,000", growth: "+12.5%" },
  { id: "bp2", name: "SonicBoom Wireless", meta: "Audio • 980 Sold", value: "$196,000", growth: "+8.2%" },
  { id: "bp3", name: "AeroBook Ultra 14", meta: "Laptops • 450 Sold", value: "$540,000", growth: "+15.4%" },
];

const worstProducts = [
  { id: "wp1", name: "Legacy Phone Case", meta: "Accessories • 12 Sold", value: "$240", growth: "-45.2%" },
  { id: "wp2", name: "OldGen Tablet V2", meta: "Tablets • 8 Sold", value: "$1,600", growth: "-22.1%" },
  { id: "wp3", name: "Wired Earbuds Classic", meta: "Audio • 4 Sold", value: "$80", growth: "-12.8%" },
];

const salesRows = [
  { id: "r1", name: "Titan Pro Smartwatch", category: "Wearables", units: "1,240", revenue: "$372,000", stock: 450, status: "In Stock", growth: "+12.5%" },
  { id: "r2", name: "SonicBoom Wireless", category: "Audio", units: "980", revenue: "$196,000", stock: 120, status: "In Stock", growth: "+8.2%" },
  { id: "r3", name: "AeroBook Ultra 14", category: "Laptops", units: "450", revenue: "$540,000", stock: 15, status: "Low Stock", growth: "+15.4%" },
  { id: "r4", name: "Legacy Phone Case", category: "Accessories", units: "12", revenue: "$240", stock: 1200, status: "In Stock", growth: "-45.2%" },
  { id: "r5", name: "OldGen Tablet V2", category: "Tablets", units: "8", revenue: "$1,600", stock: 85, status: "In Stock", growth: "-22.1%" },
  { id: "r6", name: "Wired Earbuds Classic", category: "Audio", units: "4", revenue: "$80", stock: 500, status: "In Stock", growth: "-12.8%" },
];

function Donut() {
  // simple conic donut
  return (
    <div className="flex items-center gap-6">
      <div
        className="relative w-[160px] h-[160px] rounded-full"
        style={{
          background:
            "conic-gradient(#6366F1 0 45%, #EC4899 45% 70%, #14B8A6 70% 90%, #A855F7 90% 100%)",
        }}
      >
        <div className="absolute inset-[18px] bg-white dark:bg-slate-900 rounded-full border border-slate-200/70 dark:border-slate-700" />
      </div>

      <div className="space-y-3 text-[12px]">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-indigo-600" />
          <div className="text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">45%</span> Mobile
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-pink-500" />
          <div className="text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">25%</span> Wearables
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-teal-500" />
          <div className="text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">20%</span> Audio
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <div className="text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-slate-100">10%</span> Computing
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------
export default function Reports() {
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/analytics/reports");
      setStats(res.data.stats);
    } catch {
      // fallback: keep null, show dummy
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function fmtCurrency(v) {
    if (!v) return "₹0";
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v}`;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* top bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Chip icon={CalendarDays} label="This Month" />
            <Chip icon={Filter} label="All Categories" />
          </div>

          <div className="flex items-center gap-3">
            <ActionBtn icon={RefreshCcw} label="Refresh" onClick={load} />
            <ActionBtn icon={Download} label="Export CSV" />
            <PrimaryBtn icon={FileText} label="Generate PDF Report" />
          </div>
        </div>

        {/* top stats + insight card */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatMini
              title="Total Items Sold"
              value={loading ? "..." : (stats?.monthlySoldUnits?.toLocaleString("en-IN") ?? "0")}
              sub={stats ? `vs. last month ${stats.unitsDelta >= 0 ? "↑" : "↓"} ${Math.abs(stats.unitsDelta)}%` : ""}
              subTone={stats?.unitsDelta >= 0 ? "green" : "red"}
            />
            <StatMini
              title="Gross Revenue (This Month)"
              value={loading ? "..." : fmtCurrency(stats?.monthlyRevenue ?? 0)}
              sub={stats ? `vs. last month ${stats.revenueDelta >= 0 ? "↑" : "↓"} ${Math.abs(stats.revenueDelta)}%` : ""}
              subTone={stats?.revenueDelta >= 0 ? "green" : "red"}
            />
            <StatMini title="Return Rate" value="—" sub="Connect returns data" subTone="neutral" />
          </div>

          <div className="bg-indigo-600 text-white rounded-2xl shadow-sm p-5">
            <div className="text-[13px] font-extrabold">Reporting Insights</div>
            <div className="text-[11px] opacity-80 mt-1">All-around summary for July 2024</div>

            <div className="mt-4 space-y-3 text-[12px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">Highest Growth</div>
                  <div className="opacity-80 text-[11px] mt-1">
                    “Wearables segment saw unusual surge in demand due to seasonal promotions.”
                  </div>
                </div>
                <div className="font-extrabold">+24.8%</div>
              </div>

              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold">Inventory Risk</div>
                  <div className="opacity-80 text-[11px] mt-1">
                    “Laptop category is currently experiencing stock-out issues on top 3 models.”
                  </div>
                </div>
                <div className="font-extrabold text-rose-200">14 Items</div>
              </div>

              <button
                type="button"
                className="mt-2 w-full h-10 rounded-2xl text-[12px] font-semibold
                           bg-white/15 hover:bg-white/20 transition"
              >
                View Full Insight Analysis
              </button>
            </div>
          </div>
        </div>

        {/* donut + right cards */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_360px] gap-6">
          <Card title="Category Distribution" subtitle="Sales volume share by gadget type">
            <Donut />
            <div className="mt-4 flex flex-wrap items-center gap-5 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Smartphones
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Wearables
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Audio
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Computing
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Top Performing Brands">
              <div className="space-y-4">
                {[
                  { name: "Apple", pct: 42, tone: "indigo" },
                  { name: "Samsung", pct: 28, tone: "rose" },
                  { name: "Sony", pct: 15, tone: "emerald" },
                  { name: "Dell", pct: 10, tone: "indigo" },
                ].map((b) => (
                  <div key={b.name} className="space-y-2">
                    <div className="flex items-center justify-between text-[12px] text-slate-700 dark:text-slate-200">
                      <span className="font-semibold">{b.name}</span>
                      <span className="font-bold">{b.pct}%</span>
                    </div>
                    <ProgressBar value={b.pct} tone={b.tone} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* best + worst */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card
            title="Best Selling Products"
            subtitle="Top revenue generators this month"
            right={
              <button className="text-[12px] font-semibold text-indigo-600 dark:text-indigo-300 hover:underline">View All</button>
            }
          >
            <div className="space-y-3">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
                  ))
                : (stats?.topProducts?.length
                    ? stats.topProducts
                    : bestProducts
                  ).map((p, idx) => (
                    <div key={p.name || p.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center">
                          <span className="text-slate-700 dark:text-slate-200 text-[12px] font-bold">{(p.name || p.id)[0]}</span>
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {p.category || p.meta} • {p.units ? `${p.units} Sold` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                          {p.revenue ? `₹${p.revenue.toLocaleString("en-IN")}` : p.value}
                        </div>
                        {p.growth && (
                          <div className={`text-[11px] font-semibold ${p.growth.startsWith("-") ? "text-rose-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                            {p.growth.startsWith("-") ? "↓" : "↑"} {p.growth}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
          </Card>

          <Card
            title="Worst Selling Products"
            subtitle="Items with lowest sales velocity"
            right={
              <button className="text-[12px] font-semibold text-indigo-600 dark:text-indigo-300 hover:underline">
                Audit Inventory
              </button>
            }
          >
            <div className="space-y-3">
              {worstProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200/70 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center">
                      <span className="text-slate-700 dark:text-slate-200 text-[12px] font-bold">
                        {p.name.slice(0, 1)}
                      </span>
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{p.meta}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                      {p.value}
                    </div>
                    <div className="text-[11px] text-rose-600 dark:text-rose-300 font-semibold">
                      ↓ {p.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* comprehensive table */}
        <Card
          title="Comprehensive Sales Report"
          subtitle="Full inventory performance breakdown"
          right={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-10 w-[260px] rounded-2xl pl-9 pr-3 text-[12px]
                             bg-white dark:bg-slate-900
                             border border-slate-200/70 dark:border-slate-700
                             text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500
                             outline-none focus:ring-2 focus:ring-indigo-500/25"
                  placeholder="Search by SKU..."
                />
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-2xl border border-slate-200/70 dark:border-slate-700
                           bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                           grid place-items-center"
              >
                <MoreVertical size={16} className="text-slate-600 dark:text-slate-200" />
              </button>
            </div>
          }
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
            <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
              <div className="col-span-4">Product Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-right">Unit Sales</div>
              <div className="col-span-2 text-right">Revenue</div>
              <div className="col-span-2">Stock Level</div>
              <div className="col-span-1 text-right">Growth</div>
            </div>

            {salesRows.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-12 px-5 py-4 border-t border-slate-200/70 dark:border-slate-700 items-center"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 grid place-items-center text-[12px] font-bold text-slate-700 dark:text-slate-200">
                    {r.name.slice(0, 1)}
                  </div>
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
                    {r.name}
                  </div>
                </div>

                <div className="col-span-2 text-[12px] text-slate-600 dark:text-slate-300">
                  {r.category}
                </div>

                <div className="col-span-1 text-right text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                  {r.units}
                </div>

                <div className="col-span-2 text-right text-[12px] font-extrabold text-indigo-600 dark:text-indigo-300">
                  {r.revenue}
                </div>

                <div className="col-span-2 flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={Math.min(100, (r.stock / 500) * 100)} tone={r.stock < 30 ? "rose" : "indigo"} />
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 w-[42px]">
                    {r.stock}
                  </div>
                </div>

                <div className="col-span-1 flex justify-end">
                  <Pill tone={r.growth.startsWith("-") ? "red" : "green"}>{r.growth}</Pill>
                </div>
              </div>
            ))}

            <Pagination
              page={page}
              totalPages={42}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
              onSet={setPage}
            />
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}