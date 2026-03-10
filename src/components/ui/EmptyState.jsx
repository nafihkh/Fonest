import { SearchX } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  message = "Try adjusting your filters or search.",
}) {
  return (
    <div className="py-14 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center">
        <SearchX size={22} className="text-slate-500 dark:text-slate-300" />
      </div>

      <div className="mt-4 text-[15px] font-bold text-slate-900 dark:text-slate-100">
        {title}
      </div>

      <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
        {message}
      </div>
    </div>
  );
}