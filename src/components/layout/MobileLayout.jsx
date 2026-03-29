import React, { useEffect, useRef, useState } from "react";
import MobileHeader from "./MobileHeader";
import MobileBottomNav from "./MobileBottomNav";
import SearchFilterChips from "../customer/SearchFilterChips";
import { MapPin, ChevronDown } from "lucide-react";

function DeliveryStrip({
  userName = "Guest",
  place = "Kochi",
  pincode = "682001",
}) {
  return (
    <div className="flex h-[34px] items-center gap-2 rounded-2xl border border-gray-200 bg-white/95 px-3 text-[12px] text-gray-700 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95 dark:text-gray-200">
      <MapPin
        size={14}
        className="shrink-0 text-blue-500 dark:text-blue-400"
      />

      <span className="truncate">
        Delivery to{" "}
        <span className="font-semibold text-gray-900 dark:text-gray-100">
          {userName}
        </span>{" "}
        - {place} {pincode}
      </span>

      <ChevronDown
        size={14}
        className="ml-auto shrink-0 text-gray-500 dark:text-gray-400"
      />
    </div>
  );
}

export default function MobileLayout({
  children,
  showHeader = true,
  headerProps = {},
  showDelivery = false,
  deliveryProps = {},
  showSearchFilters = false,
  searchFilterProps = {},
}) {
  const [hideDelivery, setHideDelivery] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setHideDelivery(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY.current + 8) {
        setHideDelivery(true);
      }

      if (currentScrollY < lastScrollY.current - 8) {
        setHideDelivery(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f6f7] text-gray-900 transition-colors dark:bg-[#0b1120] dark:text-gray-100">
      <div className="mx-auto min-h-screen w-full max-w-md pb-24 md:max-w-3xl">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-[#f6f6f7] via-[#f6f6f7]/95 to-transparent px-4 pt-4 backdrop-blur-sm dark:from-[#0b1120] dark:via-[#0b1120]/95">
          {showHeader ? <MobileHeader {...headerProps} /> : null}

          {showDelivery ? (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                hideDelivery
                  ? "mb-0 max-h-0 -translate-y-2 opacity-0"
                  : "mb-3 max-h-[44px] translate-y-0 opacity-100"
              }`}
            >
              <DeliveryStrip {...deliveryProps} />
            </div>
          ) : null}

          {showSearchFilters ? (
            <div className="transition-all duration-300 ease-in-out">
              <SearchFilterChips {...searchFilterProps} />
            </div>
          ) : null}
        </div>

        <main className="px-4 pt-2 md:px-6 md:pt-6">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}