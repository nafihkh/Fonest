import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  LayoutDashboard,
  Users,
  Package,
  PlusCircle,
  Boxes,
  RotateCcw,
  TrendingUp,
  FileText,
  Settings,
  ChevronRight,
  LogOut,
   MoveUpRight,
} from "lucide-react";

const nav = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Add Product", to: "/admin/products/new", icon: PlusCircle },
  { label: "Stock Ops", to: "/admin/stock", icon: Boxes },
  { label: "Returns", to: "/admin/returns", icon: RotateCcw },
  { label: "Profit Analysis", to: "/admin/profit", icon: TrendingUp },
  { label: "Reports", to: "/admin/reports", icon: FileText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await api.post("/auth/logout"); // clears httpOnly refresh cookie
    } catch (e) {
      // ignore logout errors
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      navigate("/auth", { replace: true });
    }
  };
  return (
    <aside className="w-[270px] shrink-0 border-r border-slate-200/70 bg-white min-h-screen flex flex-col">
      <div className="h-[68px] px-5 flex items-center gap-2 border-b border-slate-200/70">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 grid place-items-center text-white font-bold">
          F
        </div>
        <div className="font-extrabold tracking-wide text-indigo-600">FONEST</div>
      </div>

      <div className="p-4 flex-1">
        <div className="text-[11px] font-semibold text-slate-400 px-3 mb-2">
          DASHBOARD
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium transition",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => {
                  const Icon = item.icon;

                  return (
                    <>
                      {/* Left side */}
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 grid place-items-center rounded-lg bg-slate-100">
                          <Icon size={18} />
                        </span>

                        <span className="truncate">{item.label}</span>
                      </div>

                      {/* Right side chevron (only if active) */}
                      {isActive && (
                        <ChevronRight size={16} className="text-indigo-600" />
                      )}
                    </>
                  );
                }}
              </NavLink>
            );
          })}
         
        </nav>
      </div>
       <div className="p-4 border-t border-slate-200/70">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            type="button"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 grid place-items-center rounded-lg bg-slate-100">
                <LogOut size={18} />
              </span>
              <span>Sign Out</span>
            </div>
            <MoveUpRight size={18} className="text-slate-500" />
          </button>
        </div>
    </aside>
  );
}