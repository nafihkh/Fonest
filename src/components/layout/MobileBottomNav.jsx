import React from "react";
import { NavLink } from "react-router-dom";
import { House, ClipboardList, User, ShoppingCart } from "lucide-react";

const navItems = [
  { to: "/home", label: "Home", icon: House },
  { to: "/purchase-history", label: "Orders", icon: ClipboardList },
  { to: "/profile", label: "You", icon: User },
  { to: "/cart", label: "Cart", icon: ShoppingCart, badge: 9 },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-gray-800 dark:bg-gray-950/95 dark:supports-[backdrop-filter]:bg-gray-950/80">
      <div className="mx-auto flex w-full max-w-md items-center justify-around px-2 py-2 md:max-w-3xl md:px-4 md:py-3">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `group relative flex min-w-[64px] flex-col items-center justify-center rounded-2xl px-3 py-1.5 transition-all duration-200 md:min-w-[88px] md:px-4 md:py-2 ${
                isActive
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-500/10"
                      : "bg-transparent group-hover:bg-gray-100/70 dark:group-hover:bg-white/5"
                  }`}
                />

                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={2.2}
                    className={`transition-all duration-200 md:h-[22px] md:w-[22px] ${
                      isActive
                        ? "scale-105 text-blue-500 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />

                  {badge ? (
                    <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow-sm md:h-5 md:min-w-5 md:text-[11px] dark:bg-red-500">
                      {badge}
                    </span>
                  ) : null}
                </div>

                <span
                  className={`relative mt-1 text-[11px] font-medium transition-colors md:text-[12px] ${
                    isActive
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {label}
                </span>

                <span
                  className={`relative mt-1 h-[3px] rounded-full bg-blue-500 transition-all duration-200 dark:bg-blue-400 ${
                    isActive ? "w-5 opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}