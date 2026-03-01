export default function Footer() {
  return (
    <footer>
      <div
        className="bg-white border border-slate-200/70 px-5 py-4 shadow-sm
                   dark:bg-slate-900 dark:border-slate-700"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left Text */}
          <div className="text-[12px] text-slate-500 dark:text-slate-400">
            © 2024 FONEST Digital Gadgets. All rights reserved.
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-5 text-[12px]">
            <button
              type="button"
              className="text-slate-500 hover:text-indigo-700 transition
                         dark:text-slate-400 dark:hover:text-indigo-400"
            >
              System Status
            </button>

            <button
              type="button"
              className="text-slate-500 hover:text-indigo-700 transition
                         dark:text-slate-400 dark:hover:text-indigo-400"
            >
              Help Desk
            </button>

            <button
              type="button"
              className="text-slate-500 hover:text-indigo-700 transition
                         dark:text-slate-400 dark:hover:text-indigo-400"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}