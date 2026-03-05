// src/pages/admin/Settings.jsx
import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  User as UserIcon,
  Shield,
  Bell,
  Palette,
  ChevronRight,
  Trash2,
} from "lucide-react";

function TabItem({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition",
        active
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 grid place-items-center">
          <Icon size={18} className={active ? "text-indigo-600 dark:text-indigo-300" : "text-slate-600 dark:text-slate-200"} />
        </span>
        <span className="text-[14px] font-semibold">{label}</span>
      </div>

      <ChevronRight size={18} className={active ? "text-indigo-600 dark:text-indigo-300" : "text-slate-400 dark:text-slate-500"} />
    </button>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700 rounded-2xl shadow-sm">
      <div className="px-6 pt-6">
        <div className="text-[18px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
          {title}
        </div>
        {subtitle ? (
          <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
        ) : null}
      </div>
      <div className="px-6 pb-6 pt-5">{children}</div>
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
      {children}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={[
        "w-full h-11 rounded-2xl px-4 text-[14px]",
        "bg-white dark:bg-slate-900",
        "border border-slate-200/70 dark:border-slate-700",
        "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
        className,
      ].join(" ")}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      {...props}
      className={[
        "w-full min-h-[90px] rounded-2xl px-4 py-3 text-[14px] resize-none",
        "bg-white dark:bg-slate-900",
        "border border-slate-200/70 dark:border-slate-700",
        "text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 dark:focus:border-indigo-500",
        className,
      ].join(" ")}
    />
  );
}

function OutlineBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 px-4 rounded-2xl text-[13px] font-semibold
                 border border-slate-200/70 dark:border-slate-700
                 bg-white dark:bg-slate-900
                 text-slate-700 dark:text-slate-200
                 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
    >
      {label}
    </button>
  );
}

function PrimaryBtn({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 px-5 rounded-2xl text-[13px] font-semibold
                 bg-indigo-600 text-white hover:bg-indigo-700 transition
                 shadow-sm"
    >
      {label}
    </button>
  );
}

export default function Settings() {
  const tabs = useMemo(
    () => [
      { key: "profile", label: "Profile Settings", icon: UserIcon },
      { key: "security", label: "Security & Privacy", icon: Shield },
      { key: "notifications", label: "Notifications", icon: Bell },
      { key: "appearance", label: "Appearance", icon: Palette },
    ],
    []
  );

  const [active, setActive] = useState("profile");

  const [form, setForm] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@fonest.digital",
    bio: "Managing high-end digital gadgets for elite tech enthusiasts.",
  });

  const save = () => {
    // TODO connect backend
    alert("Saved (UI only)");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* header row */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
              Settings
            </h1>
            <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
              Configure your admin environment.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <OutlineBtn label="Discard" onClick={() => setActive("profile")} />
            <PrimaryBtn label="Save Changes" onClick={save} />
          </div>
        </div>

        {/* content layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-8">
          {/* left nav */}
          <div className="space-y-2">
            {tabs.map((t) => (
              <TabItem
                key={t.key}
                active={active === t.key}
                icon={t.icon}
                label={t.label}
                onClick={() => setActive(t.key)}
              />
            ))}
          </div>

          {/* right panel */}
          <div className="space-y-6">
            {/* profile top card */}
            <Card title="Profile Settings" subtitle={null}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200/70 dark:border-slate-700 overflow-hidden grid place-items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-300 dark:bg-slate-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[20px] font-extrabold font-archivo text-slate-900 dark:text-slate-100">
                    Admin User
                  </div>
                  <div className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                    Super Admin • Joined March 2024
                  </div>

                  <button
                    type="button"
                    className="mt-3 h-10 px-4 rounded-2xl text-[13px] font-semibold
                               border border-slate-200/70 dark:border-slate-700
                               bg-white dark:bg-slate-900
                               text-slate-700 dark:text-slate-200
                               hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    Change Avatar
                  </button>
                </div>
              </div>
            </Card>

            {/* account info card */}
            <Card
              title="Account Information"
              subtitle="Update your personal details and how others see you."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <div className="mt-2">
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Last Name</Label>
                  <div className="mt-2">
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <Label>Email Address</Label>
                <div className="mt-2">
                  <Input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label>Professional Bio</Label>
                <div className="mt-2">
                  <Textarea
                    value={form.bio}
                    onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                  />
                </div>
              </div>
            </Card>

            {/* footer row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/70 dark:border-slate-700">
              <div className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Shield size={14} className="opacity-70" />
                Settings are encrypted and managed by FONEST Enterprise Security.
              </div>

              <button
                type="button"
                className="text-[12px] font-semibold text-rose-600 hover:text-rose-700 transition inline-flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Administrator Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}