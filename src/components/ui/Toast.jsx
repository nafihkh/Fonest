import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";

export default function Toast({ type = "success", message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`min-w-[280px] max-w-[340px] rounded-2xl px-4 py-3 shadow-lg
        border flex items-center gap-3
        transition-all duration-300
        ${
          isSuccess
            ? "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-500/30"
            : "bg-white dark:bg-slate-900 border-red-200 dark:border-red-500/30"
        }`}
      >
        <div>
          {isSuccess ? (
            <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
          ) : (
            <XCircle className="text-red-600 dark:text-red-400" size={20} />
          )}
        </div>

        <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">
          {message}
        </div>
      </div>
    </div>
  );
}