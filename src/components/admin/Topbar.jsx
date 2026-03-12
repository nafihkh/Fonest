import {Search, Bell, Sun, Moon} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import NotificationToast from "../ui/NotificationToast"; // adjust path if needed
import { useDispatch, useSelector } from "react-redux";
export default function Topbar() {

  const [theme, setTheme] = useState(
  document.documentElement.classList.contains("dark") ? "dark" : "light"
);
const [notifOpen, setNotifOpen] = useState(false);
const bellRef = useRef(null);

const handleToggleTheme = () => {
  const next = toggleTheme();   // toggleTheme returns "light" or "dark"
  setTheme(next);
};
const dispatch = useDispatch();
const toast = useSelector((s) => s.toast);

  return (
    <header className="h-[68px] bg-white dark:bg-slate-900 border-b border-slate-200/70 dark:border-slate-700 px-6 flex items-center justify-between gap-4">
      <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">
        Dashboard Overview
      </div>

      <div className="flex-1 max-w-[520px]">
        <div className="flex items-center gap-2 px-3 py-2">
          <span className="text-slate-400"><Search size={16} className="text-[#565D6D]" /></span>
          <input
            className="w-full bg-transparent outline-none text-[14px] text-slate-700 dark:text-slate-100 placeholder:text-[#565D6D] dark:placeholder:text-slate-400"
            placeholder="Search gadgets, orders, users..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative top-1" ref={bellRef}>
          <button onClick={() => setNotifOpen(p => !p)} className="w-10 h-10 dark:text-slate-100 text-neutral-900">
            <Bell size={20} />
          </button>

          <NotificationToast
            open={notifOpen}
            anchorRef={bellRef}
            onClose={() => setNotifOpen(false)}
            type="warning"
            title="Low Stock Warning"
            message="iPhone 15 Case - Matte Black is below 5 units."
          />
        </div>
        <div className="text-neutral-300 text-xl">|</div>
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right leading-tight">
            <div className="text-[13px] font-semibold text-slate-900  dark:text-slate-100">Admin User</div>
            <div className="text-[12px] text-slate-500">Administrator</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500" />
        </div>
      </div>
    </header>
    
  );
  
}