import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Camera,
  ChevronRight,
  ClipboardList,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Headphones,
  Info,
  LogOut,
  Moon,
} from "lucide-react";
import { updateMySettings } from "../../../store/slices/profileSlice";

function SectionTitle({ children }) {
  return (
    <h3 className="mb-3 text-[12px] font-bold uppercase tracking-wide text-[#575E6B] dark:text-gray-400 md:text-[13px]">
      {children}
    </h3>
  );
}

function MenuItem({
  icon: Icon,
  title,
  subtitle,
  rightText,
  danger = false,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800/60"
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl md:h-11 md:w-11 ${
          danger
            ? "bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-400"
            : "bg-blue-50 text-blue-500 dark:bg-blue-500/15 dark:text-blue-400"
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[16px] font-medium md:text-[15px] ${
            danger
              ? "text-red-500 dark:text-red-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {title}
        </p>

        {subtitle ? (
          <p className="mt-0.5 text-[11px] text-[#575E6B] dark:text-gray-400 md:text-[12px]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {rightText ? (
        <span className="mr-1 text-[12px] text-gray-400 dark:text-gray-500 md:text-[13px]">
          {rightText}
        </span>
      ) : null}

      <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
    </button>
  );
}

function Card({ children }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:border dark:border-gray-800 dark:bg-gray-900">
      {children}
    </div>
  );
}

function formatMemberSince(date) {
  if (!date) return "Since recently";
  return `Since ${new Date(date).getFullYear()}`;
}

function getAddressLabel(addresses = []) {
  if (!addresses.length) return "No address";

  const labels = addresses
    .slice(0, 2)
    .map((a) => a.label || "Address")
    .join(", ");

  return labels;
}

export default function MobileProfilePage({
  profile,
  settings,
  addresses = [],
  loading,
  error,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="pb-4">
        <div className="rounded-3xl bg-white p-6 text-center text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400">
          Loading profile...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-4">
        <div className="rounded-3xl bg-white p-6 text-center text-red-500 shadow-sm dark:bg-gray-900 dark:text-red-400">
          {error}
        </div>
      </section>
    );
  }

  const fullName = profile?.fullName || "User";
  const email = profile?.email || "No email";
  const avatar = profile?.avatar || "";
  const memberSince = formatMemberSince(profile?.memberSince);
  const theme = settings?.appearance?.theme || "system";

  const activeOrdersCount = 0;

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    dispatch(
      updateMySettings({
        appearance: {
          theme: nextTheme,
        },
      })
    );
  };

  return (
    <section className="pb-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[18px] font-bold text-gray-900 dark:text-gray-100 md:text-[34px]">
          Account
        </h1>

        <button
          onClick={handleThemeToggle}
          className="text-gray-700 dark:text-gray-300"
        >
          <Settings size={18} className="md:h-5 md:w-5" />
        </button>
      </div>

      <div className="mb-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 md:h-28 md:w-28">
            {avatar ? (
              <img
                src={avatar}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl text-gray-300 dark:text-gray-600 md:text-4xl">
                ⌁
              </span>
            )}
          </div>

          <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white shadow-md dark:border-gray-900 md:h-9 md:w-9">
            <Camera size={14} />
          </button>
        </div>

        <h2 className="text-[24px] font-bold leading-none text-gray-900 dark:text-gray-100 md:text-[32px]">
          {fullName}
        </h2>

        <p className="mt-2 text-[14px] text-gray-400 dark:text-gray-500 md:text-[14px]">
          {email}
        </p>

        <div className="mt-3 flex items-center gap-3 text-[12px] md:text-[14px]">
          <span className="font-medium text-blue-500 dark:text-blue-400">
            FONEST Member
          </span>

          <span className="text-gray-300 dark:text-gray-600">|</span>

          <span className="text-gray-500 dark:text-gray-400">
            {memberSince}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <SectionTitle>Recent Activity</SectionTitle>

        <Card>
          <MenuItem
            icon={ClipboardList}
            title="My Orders"
            rightText={`${activeOrdersCount} Active`}
            onClick={() => navigate("/orders")}
          />

          <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
            <p className="text-center text-[12px] text-gray-600 dark:text-gray-400 md:text-[13px]">
              View your recent purchases and order history
            </p>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <SectionTitle>Account & Security</SectionTitle>

        <Card>
          <MenuItem
            icon={MapPin}
            title="Saved Addresses"
            rightText={getAddressLabel(addresses)}
            onClick={() => navigate("/profile/addresses")}
          />

          <div className="border-t border-gray-100 dark:border-gray-800" />

          <MenuItem
            icon={CreditCard}
            title="Payment Methods"
            rightText="Coming soon"
          />

          <div className="border-t border-gray-100 dark:border-gray-800" />

          <MenuItem
            icon={Moon}
            title="Appearance"
            subtitle={`Theme: ${theme}`}
            onClick={handleThemeToggle}
          />

          <div className="border-t border-gray-100 dark:border-gray-800" />

          <MenuItem
            icon={Bell}
            title="Notification Settings"
            onClick={() => navigate("/profile/settings")}
          />

          <div className="border-t border-gray-100 dark:border-gray-800" />

          <MenuItem
            icon={Shield}
            title="Privacy & Security"
            onClick={() => navigate("/profile/settings")}
          />
        </Card>
      </div>

      <div className="mb-6">
        <SectionTitle>Support</SectionTitle>

        <Card>
          <MenuItem icon={Headphones} title="Help Center" />

          <div className="border-t border-gray-100 dark:border-gray-800" />

          <MenuItem icon={Info} title="About FONEST" />
        </Card>
      </div>

      <div className="mb-8">
        <Card>
          <MenuItem icon={LogOut} title="Log Out" danger />
        </Card>
      </div>

      <div className="pb-2 text-center">
        <p className="text-[10px] text-gray-300 dark:text-gray-600 md:text-[11px]">
          FONEST Mobile Build
        </p>
      </div>
    </section>
  );
}