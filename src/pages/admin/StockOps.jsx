// src/pages/admin/StockOps.jsx
import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  PackagePlus,
  TrendingDown,
  Users,
  AlertTriangle,
  Plus,
  SlidersHorizontal,
  Clock3,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

// ---------- small UI helpers ----------
function StatTile({ title, value, icon: Icon, badge, badgeTone = "neutral" }) {
  const tone =
    badgeTone === "green"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      : badgeTone === "red"
      ? "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-semibold">
            {title}
          </div>
          <div className="mt-1 text-[22px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
            {value}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {badge ? (
            <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${tone}`}>
              {badge}
            </span>
          ) : null}
          <span className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
            <Icon size={18} className="text-slate-700 dark:text-slate-200" />
          </span>
        </div>
      </div>
    </div>
  );
}

function Card({ title, subtitle, right, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="px-5 pt-5 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-extrabold text-slate-900 dark:text-slate-100">
            {title}
          </div>
          {subtitle ? (
            <div className="mt-1 text-[12px] text-slate-500 dark:text-slate-400">
              {subtitle}
            </div>
          ) : null}
        </div>
        {right}
      </div>
      <div className="px-5 pb-5 pt-4">{children}</div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

function TextInput({ className = "", leftIcon: LeftIcon, ...props }) {
  return (
    <div className="relative">
      {LeftIcon ? (
        <LeftIcon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      ) : null}
      <input
        {...props}
        className={[
          "w-full h-11 rounded-2xl text-[14px]",
          LeftIcon ? "pl-10 pr-4" : "px-4",
          "bg-white dark:bg-slate-900",
          "border border-slate-200/70 dark:border-slate-700",
          "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
          className,
        ].join(" ")}
      />
    </div>
  );
}

function Segment({ value, onChange }) {
  return (
    <div className="inline-flex rounded-2xl border border-slate-200/70 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
      <button
        type="button"
        onClick={() => onChange("in")}
        className={[
          "h-10 px-4 text-[13px] font-semibold transition",
          value === "in"
            ? "bg-indigo-600 text-white"
            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
        ].join(" ")}
      >
        Stock In
      </button>
      <button
        type="button"
        onClick={() => onChange("out")}
        className={[
          "h-10 px-4 text-[13px] font-semibold transition border-l border-slate-200/70 dark:border-slate-700",
          value === "out"
            ? "bg-indigo-600 text-white"
            : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
        ].join(" ")}
      >
        Stock Out
      </button>
    </div>
  );
}

function Pill({ children, tone = "gray" }) {
  const cls =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
      : tone === "red"
      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30"
      : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700";

  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full border ${cls}`}>
      {children}
    </span>
  );
}

function MiniBtn({ children, tone = "primary", ...props }) {
  const cls =
    tone === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700"
      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200/70 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800";

  return (
    <button
      type="button"
      className={`h-10 px-4 rounded-2xl text-[13px] font-semibold transition ${cls}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ---------- demo data ----------
const alertsSeed = [
  {
    id: "a1",
    status: "Out of Stock",
    tone: "red",
    name: "iPhone 15 Pro Max - Titanium",
    current: 0,
    img: "📱",
  },
  {
    id: "a2",
    status: "Low Stock",
    tone: "amber",
    name: "Sony WH-1000XM5 Headphones",
    current: 4,
    img: "🎧",
  },
  {
    id: "a3",
    status: "Low Stock",
    tone: "amber",
    name: "MacBook Air M3 - 13”",
    current: 7,
    img: "💻",
  },
  {
    id: "a4",
    status: "Out of Stock",
    tone: "red",
    name: "Logitech MX Master 3S",
    current: 0,
    img: "🖱️",
  },
];

const movementsSeed = [
  { id: "m1", type: "IN", product: "Samsung S24 Ultra", qty: "+50", by: "Admin Sarah", time: "12 mins ago" },
  { id: "m2", type: "OUT", product: "AirPods Pro Gen 2", qty: "-2", by: "POS Terminal 1", time: "25 mins ago" },
  { id: "m3", type: "OUT", product: "Apple Watch Series 9", qty: "-1", by: "Online Store", time: "48 mins ago" },
  { id: "m4", type: "IN", product: "Dell XPS 15", qty: "+10", by: "Admin Sarah", time: "2 hours ago" },
  { id: "m5", type: "OUT", product: "iPad Pro 11”", qty: "-3", by: "POS Terminal 2", time: "3 hours ago" },
];

// ---------- Page ----------
export default function StockOps() {
  const [mode, setMode] = useState("in");
  const [globalMin, setGlobalMin] = useState(15);

  const [entry, setEntry] = useState({
    query: "",
    qty: "",
    supplier: "",
    date: "",
    notes: "",
  });

  const lastUpdated = useMemo(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatTile
            title="Total Stock Value"
            value="$248,500"
            icon={TrendingDown}
            badge={<ArrowUpRight size={14} />}
            badgeTone="green"
          />
          <StatTile
            title="Total Units (Today)"
            value="142"
            icon={PackagePlus}
            badge={<ArrowDownRight size={14} />}
            badgeTone="red"
          />
          <StatTile title="Active Suppliers" value="24" icon={Users} />
          <StatTile title="Low Stock Items" value="12" icon={AlertTriangle} badge="⚠" badgeTone="amber" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Segment + last updated */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Segment value={mode} onChange={setMode} />
              <div className="text-[11px] text-slate-500 dark:text-slate-400 inline-flex items-center gap-2">
                <Clock3 size={14} className="opacity-70" />
                Last Updated {lastUpdated} AM
              </div>
            </div>

            {/* Procurement Entry */}
            <Card
              title={mode === "in" ? "Procurement Entry" : "Stock Out Entry"}
              subtitle={
                mode === "in"
                  ? "Add new inventory items received from your warehouse or suppliers."
                  : "Record product removals due to sales, damage, or transfers."
              }
              right={
                <button
                  type="button"
                  className="w-10 h-10 rounded-2xl border border-slate-200/70 dark:border-slate-700
                             bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                             grid place-items-center"
                  title="Add"
                >
                  <Plus size={18} className="text-indigo-600 dark:text-indigo-300" />
                </button>
              }
            >
              <div className="space-y-4">
                <div>
                  <Label>Select Product</Label>
                  <div className="mt-2">
                    <TextInput
                      leftIcon={Search}
                      placeholder="Search gadget name or SKU..."
                      value={entry.query}
                      onChange={(e) => setEntry((p) => ({ ...p, query: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <div className="mt-2">
                      <TextInput
                        placeholder="e.g. 100"
                        value={entry.qty}
                        onChange={(e) => setEntry((p) => ({ ...p, qty: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Supplier / Source</Label>
                    <div className="mt-2">
                      <TextInput
                        placeholder="e.g. Apple Wholesale"
                        value={entry.supplier}
                        onChange={(e) => setEntry((p) => ({ ...p, supplier: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Transaction Date</Label>
                    <div className="mt-2">
                      <TextInput
                        type="date"
                        value={entry.date}
                        onChange={(e) => setEntry((p) => ({ ...p, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Internal Notes (Optional)</Label>
                    <div className="mt-2">
                      <TextInput
                        placeholder="Additional details..."
                        value={entry.notes}
                        onChange={(e) => setEntry((p) => ({ ...p, notes: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full h-11 rounded-2xl text-[13px] font-semibold
                               bg-indigo-600 text-white hover:bg-indigo-700 transition
                               shadow-sm inline-flex items-center justify-center gap-2"
                  >
                    <BadgeCheck size={16} />
                    {mode === "in" ? "Complete Stock In" : "Complete Stock Out"}
                  </button>
                </div>
              </div>
            </Card>

            {/* Recent Stock Movements */}
            <Card
              title="Recent Stock Movements"
              subtitle="Real-time log of the last 5 transactions across all categories."
            >
              <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-700">
                <div className="grid grid-cols-12 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-[11px] font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-300">
                  <div className="col-span-2">Type</div>
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-3">Performed By</div>
                  <div className="col-span-1 text-right">Time</div>
                </div>

                {movementsSeed.map((m) => (
                  <div
                    key={m.id}
                    className="grid grid-cols-12 px-4 py-3 border-t border-slate-200/70 dark:border-slate-700 items-center"
                  >
                    <div className="col-span-2">
                      {m.type === "IN" ? <Pill tone="green">IN</Pill> : <Pill tone="red">OUT</Pill>}
                    </div>
                    <div className="col-span-4 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                      {m.product}
                    </div>
                    <div className={`col-span-2 text-[12px] font-bold ${m.type === "IN" ? "text-indigo-600 dark:text-indigo-300" : "text-rose-600 dark:text-rose-300"}`}>
                      {m.qty}
                    </div>
                    <div className="col-span-3 text-[12px] text-slate-600 dark:text-slate-300">
                      {m.by}
                    </div>
                    <div className="col-span-1 text-right text-[11px] text-slate-500 dark:text-slate-400">
                      {m.time}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 transition inline-flex items-center gap-1"
                >
                  View Full Transaction History <ChevronRight size={14} />
                </button>
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Initial stock rules */}
            <Card
              title="Initial Stock Rules"
              subtitle="Stock threshold config"
              right={
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl text-[12px] font-semibold
                             border border-slate-200/70 dark:border-slate-700
                             bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200
                             hover:bg-slate-50 dark:hover:bg-slate-800 transition inline-flex items-center gap-2"
                >
                  <SlidersHorizontal size={14} />
                  Settings
                </button>
              }
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                    Global Minimum
                  </div>
                  <Pill>{globalMin} units</Pill>
                </div>

                <input
                  type="range"
                  min={1}
                  max={50}
                  value={globalMin}
                  onChange={(e) => setGlobalMin(Number(e.target.value))}
                  className="w-full"
                />

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Note: Individual product thresholds will override this global setting if configured in
                  the product settings.
                </div>

                <MiniBtn tone="primary">Apply to All Items</MiniBtn>
              </div>
            </Card>

            {/* Stock Alerts */}
            <Card
              title={
                <div className="flex items-center gap-2">
                  Stock Alerts <span className="text-rose-600 dark:text-rose-300">●</span>
                </div>
              }
              subtitle="Mark all read"
            >
              <div className="space-y-3">
                {alertsSeed.map((a) => (
                  <div
                    key={a.id}
                    className={[
                      "rounded-2xl border p-3",
                      "border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-[18px]">
                          {a.img}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Pill tone={a.tone}>{a.status}</Pill>
                          </div>
                          <div className="mt-1 text-[12px] font-semibold text-slate-900 dark:text-slate-100">
                            {a.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            Current: <span className="font-semibold">{a.current}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-9 h-9 rounded-xl border border-slate-200/70 dark:border-slate-700
                                   bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition
                                   grid place-items-center"
                        title="More"
                      >
                        <ChevronRight size={16} className="text-slate-600 dark:text-slate-200" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <MiniBtn tone="primary">Quick Restock</MiniBtn>
                      <MiniBtn tone="secondary">View Details</MiniBtn>
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    className="text-[12px] font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100 transition"
                  >
                    Load more alerts ↑
                  </button>
                </div>
              </div>
            </Card>

            {/* Tip */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm p-5">
              <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                Inventory Health Tip
              </div>
              <div className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
                Products like <span className="font-semibold">Logitech MX Master 3S</span> have been out of stock for{" "}
                <span className="font-semibold">48 hours</span>. This is causing a projected daily loss of{" "}
                <span className="font-semibold">$340</span>.
              </div>
              <button
                type="button"
                className="mt-3 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200 transition"
              >
                View Analytics Report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}