import React from "react";
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
} from "lucide-react";
import MobileLayout from "../../components/layout/MobileLayout";

function SectionTitle({ children }) {
  return (
    <h3 className="mb-3 text-[12px] md:text-[13px] font-bold uppercase tracking-wide text-[#575E6B]">
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
}) {
  return (
    <button className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-gray-50">
      <div
        className={`flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-2xl ${
          danger ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500"
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[16px] md:text-[15px] font-medium ${
            danger ? "text-red-500" : "text-gray-900"
          }`}
        >
          {title}
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-[11px] md:text-[12px] text-[#575E6B]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {rightText ? (
        <span className="mr-1 text-[12px] md:text-[13px] text-gray-400">
          {rightText}
        </span>
      ) : null}

      <ChevronRight size={16} className="text-gray-400" />
    </button>
  );
}

function Card({ children }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
      {children}
    </div>
  );
}

export default function MobileProfilePage() {
  return (
    <MobileLayout showHeader={false}>
      <section className="pb-4">
        {/* Top row */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[18px] md:text-[34px] font-bold text-gray-900">
            Account
          </h1>

          <button className="text-gray-700">
            <Settings size={18} className="md:h-5 md:w-5" />
          </button>
        </div>

        {/* Profile block */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-full bg-gray-200">
              <span className="text-gray-300 text-3xl md:text-4xl">⌁</span>
            </div>

            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-white shadow-md md:h-9 md:w-9">
              <Camera size={14} />
            </button>
          </div>

          <h2 className="text-[24px] md:text-[32px] font-bold leading-none text-gray-900">
            Alex Thompson
          </h2>

          <p className="mt-2 text-[14px] md:text-[14px] text-gray-400">
            alex.t@fonest-mail.com
          </p>

          <div className="mt-3 flex items-center gap-3 text-[12px] md:text-[14px]">
            <span className="font-medium text-blue-500">Gold Member</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">Since 2022</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="mb-6">
          <SectionTitle>Recent Activity</SectionTitle>

          <Card>
            <MenuItem
              icon={ClipboardList}
              title="My Orders"
              rightText="1 Active"
            />

            <div className="border-t border-gray-100 px-4 py-3">
              <p className="text-center text-[12px] md:text-[13px] text-gray-600">
                Order #FNS-9281 arriving by 6:00 PM today
              </p>
            </div>
          </Card>
        </div>

        {/* Account & security */}
        <div className="mb-6">
          <SectionTitle>Account & Security</SectionTitle>

          <Card>
            <MenuItem
              icon={MapPin}
              title="Saved Addresses"
              rightText="Home, Work"
            />
            <div className="border-t border-gray-100" />
            <MenuItem
              icon={CreditCard}
              title="Payment Methods"
              rightText="Visa •• 42"
            />
            <div className="border-t border-gray-100" />
            <MenuItem icon={Bell} title="Notification Settings" />
            <div className="border-t border-gray-100" />
            <MenuItem icon={Shield} title="Privacy & Security" />
          </Card>
        </div>

        {/* Support */}
        <div className="mb-6">
          <SectionTitle>Support</SectionTitle>

          <Card>
            <MenuItem icon={Headphones} title="Help Center" />
            <div className="border-t border-gray-100" />
            <MenuItem icon={Info} title="About FONEST" />
          </Card>
        </div>

        {/* Logout */}
        <div className="mb-8">
          <Card>
            <MenuItem icon={LogOut} title="Log Out" danger />
          </Card>
        </div>

        {/* Footer note */}
        <div className="pb-2 text-center">
          <p className="text-[10px] md:text-[11px] text-gray-300">
            FONEST iOS v2.4.12 Build 892
          </p>
        </div>
      </section>
    </MobileLayout>
  );
}