import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCartTotalItems } from "../../store/slices/cartSlice";

const LOGO =
  "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771488519/Logo_c07lrq.jpg";

const nav = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Orders", to: "/purchase-history" },
  { label: "Profile", to: "/profile" },
];

export default function SiteHeader() {
  const cartCount = useSelector(selectCartTotalItems);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-blue-100 bg-white/85 shadow-lg shadow-blue-100/40 backdrop-blur-xl dark:border-blue-900/40 dark:bg-[#081120]/85 dark:shadow-black/20">
      <div className="mx-auto max-w-[1600px] px-6 py-4">
        <div className="flex items-center justify-between">
          <Link className="group flex items-center gap-3" to="/">
            <img
              alt="FONEST Logo"
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
              src={LOGO}
            />
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-300">
              FONEST
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "relative whitespace-nowrap text-[15px] font-medium transition-all duration-300",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-blue-600 transition-all duration-300 dark:bg-blue-400 ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative rounded-full p-2.5 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
              aria-label="Cart"
            >
              <i className="ri-shopping-cart-line text-[22px] text-gray-700 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-md dark:bg-blue-500">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <Link
              to="/purchase-history"
              className="rounded-full p-2.5 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
              aria-label="Orders"
            >
              <i className="ri-file-list-3-line text-[22px] text-gray-700 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
            </Link>

            <Link
              to="/profile"
              className="rounded-full p-2.5 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-500/10"
              aria-label="Profile"
            >
              <i className="ri-user-line text-[22px] text-gray-700 transition-colors duration-300 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}