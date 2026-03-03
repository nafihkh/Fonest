import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F6F8FF] dark:bg-slate-950 text-slate-900">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <main className="px-6 py-6">{children}</main>
          <Footer />
        </div>
      </div>
      
    </div>
  );
}