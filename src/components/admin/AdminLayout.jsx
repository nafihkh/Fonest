import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { api } from "../../services/api";
import { initAdminNotifications } from "../../services/adminNotifications";

export default function AdminLayout({ children }) {
  // Initialize browser push notifications once per session
  useEffect(() => {
    api.get("/api/settings").then((res) => {
      const notifSettings = res.data?.settings?.notifications;
      initAdminNotifications(notifSettings || {});
    }).catch(() => {
      // If settings fetch fails, still try to init with defaults
      initAdminNotifications({});
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FF] dark:bg-slate-950 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar />

          <main className="flex-1 px-6 py-6">
            {children}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}