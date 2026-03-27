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
    <div className="flex h-[30px] items-center gap-2 rounded-xl bg-white px-3 text-[12px] text-gray-700 shadow-sm">
      <MapPin size={14} className="text-gray-500" />
      <span className="truncate">
        Delivery to {userName} - {place} {pincode}
      </span>
      <ChevronDown size={14} className="ml-auto text-gray-500" />
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

      // top il vannal always show
      if (currentScrollY <= 10) {
        setHideDelivery(false);
        lastScrollY.current = currentScrollY;
        return;
      }

      // scroll down -> hide
      if (currentScrollY > lastScrollY.current + 8) {
        setHideDelivery(true);
      }

      // scroll up -> show
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
    <div className="min-h-screen bg-[#f6f6f7] text-gray-900">
      <div className="mx-auto min-h-screen w-full max-w-md pb-24 md:max-w-3xl">
        <div className="sticky top-0 z-40 bg-transparent px-4 pt-4">
          {showHeader ? <MobileHeader {...headerProps} /> : null}

          {showDelivery ? (
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                hideDelivery
                  ? "mb-0 max-h-0 -translate-y-2 opacity-0"
                  : "mb-3 max-h-[40px] translate-y-0 opacity-100"
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