import { useEffect, useRef } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  MoreHorizontal,
} from "lucide-react";

export default function NotificationToast({
  open,
  anchorRef,
  type = "info", // success | error | warning | info
  title = "Notification",
  message = "",
  autoCloseMs = 3500,
  onClose,
}) {
  const popRef = useRef(null);

  // auto close
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), autoCloseMs);
    return () => clearTimeout(t);
  }, [open, autoCloseMs, onClose]);

  // close on outside click
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      const anchorEl = anchorRef?.current;
      const popEl = popRef.current;
      if (!anchorEl || !popEl) return;
      if (anchorEl.contains(e.target)) return;
      if (popEl.contains(e.target)) return;
      onClose?.();
    };

    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open, anchorRef, onClose]);

  // close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const config = {
    success: {
      Icon: CheckCircle2,
      bubble: "bg-emerald-50 dark:bg-emerald-500/15",
      icon: "text-emerald-600 dark:text-emerald-300",
      border: "border-emerald-200/70 dark:border-emerald-500/30",
    },
    error: {
      Icon: XCircle,
      bubble: "bg-rose-50 dark:bg-rose-500/15",
      icon: "text-rose-600 dark:text-rose-300",
      border: "border-rose-200/70 dark:border-rose-500/30",
    },
    warning: {
      Icon: AlertTriangle,
      bubble: "bg-amber-50 dark:bg-amber-500/15",
      icon: "text-amber-600 dark:text-amber-300",
      border: "border-amber-200/70 dark:border-amber-500/30",
    },
    info: {
      Icon: Info,
      bubble: "bg-indigo-50 dark:bg-indigo-500/15",
      icon: "text-indigo-600 dark:text-indigo-300",
      border: "border-indigo-200/70 dark:border-indigo-500/30",
    },
  }[type] || {
    Icon: Info,
    bubble: "bg-indigo-50 dark:bg-indigo-500/15",
    icon: "text-indigo-600 dark:text-indigo-300",
    border: "border-indigo-200/70 dark:border-indigo-500/30",
  };

  const { Icon, bubble, icon, border } = config;

  return (
    <div
      ref={popRef}
      className={[
        "absolute right-[-100px] top-[68px] z-50 w-[340px] rounded-2xl p-3",
        "bg-white dark:bg-slate-900",
        "border shadow-[0_12px_30px_rgba(2,6,23,0.12)]",
        "border-slate-200/70 dark:border-slate-700",
        border,
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-2xl grid place-items-center shrink-0 ${bubble}`}>
          <Icon size={18} className={icon} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
              {title}
            </div>

            <button
              type="button"
              className="w-8 h-8 rounded-xl grid place-items-center
                         text-slate-500 dark:text-slate-300
                         hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="More"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400 truncate">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}