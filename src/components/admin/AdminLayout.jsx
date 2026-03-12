import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function AdminLayout({ children }) {
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