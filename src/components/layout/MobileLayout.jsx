import React from "react";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";

export default function  MobileLayout({ children, showHeader = true }) {
  return (
    <div className="min-h-screen bg-[#f6f6f7] text-gray-900">
      <div className="mx-auto min-h-screen w-full max-w-md md:max-w-3xl pb-24">
        {showHeader ? <MobileHeader /> : null}
        <main className="px-4 md:px-6 pt-4 md:pt-6">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}