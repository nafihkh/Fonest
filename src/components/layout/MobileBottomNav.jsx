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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-md md:max-w-3xl items-center justify-around px-2 py-2 md:px-4 md:py-3">
        {navItems.map(({ to, label, icon: Icon, badge }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `relative flex min-w-[64px] md:min-w-[88px] flex-col items-center justify-center rounded-xl px-3 py-1.5 md:px-4 md:py-2 transition ${
                isActive ? "text-blue-500" : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon size={20} className="md:w-[22px] md:h-[22px]" strokeWidth={2.2} />
                  {badge ? (
                    <span className="absolute -right-3 -top-2 flex h-4 min-w-4 md:h-5 md:min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] md:text-[11px] font-semibold text-white">
                      {badge}
                    </span>
                  ) : null}
                </div>

                <span
                  className={`mt-1 text-[11px] md:text-[12px] font-medium ${
                    isActive ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}