import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  tone = "primary", // primary | danger | warning
  loading = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  const toneClasses =
    tone === "danger"
      ? {
          iconWrap: "bg-rose-50 dark:bg-rose-500/15",
          icon: "text-rose-600 dark:text-rose-300",
          confirm:
            "bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60",
        }
      : tone === "warning"
      ? {
          iconWrap: "bg-amber-50 dark:bg-amber-500/15",
          icon: "text-amber-600 dark:text-amber-300",
          confirm:
            "bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60",
        }
      : {
          iconWrap: "bg-indigo-50 dark:bg-indigo-500/15",
          icon: "text-indigo-600 dark:text-indigo-300",
          confirm:
            "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60",
        };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={loading ? undefined : onClose}
      />

      <div className="relative w-full max-w-md rounded-3xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
        <div className="px-6 py-5 border-b border-slate-200/70 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <div
              className={`w-11 h-11 rounded-2xl grid place-items-center shrink-0 ${toneClasses.iconWrap}`}
            >
              <AlertTriangle size={18} className={toneClasses.icon} />
            </div>

            <div>
              <div className="text-[18px] font-extrabold text-slate-900 dark:text-slate-100">
                {title}
              </div>
              <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                {message}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                       border border-slate-200/70 dark:border-slate-700
                       bg-white dark:bg-slate-900
                       text-slate-700 dark:text-slate-200
                       hover:bg-slate-50 dark:hover:bg-slate-800 transition
                       disabled:opacity-60"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`h-11 px-4 rounded-2xl text-[13px] font-semibold transition shadow-sm ${toneClasses.confirm}`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}