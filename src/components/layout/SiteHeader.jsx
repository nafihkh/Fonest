import { Link, NavLink } from "react-router-dom";

const LOGO =
  "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771488519/Logo_c07lrq.jpghttps://res.cloudinary.com/dl0wwvy4j/image/upload/v1771488519/Logo_c07lrq.jpg";

const nav = [
  { label: "Home", to: "/home" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function SiteHeader({ cartCount = 3 }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-xl shadow-lg">
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link className="flex items-center gap-3 group" to="/">
            <img
              alt="FONEST Logo"
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
              src={LOGO}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              FONEST
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "text-[15px] font-medium transition-all duration-300 relative whitespace-nowrap",
                    isActive ? "text-red-600" : "text-gray-700 hover:text-red-600",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative p-2 hover:bg-red-50 rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Cart"
            >
              <i className="ri-shopping-cart-line text-[22px] text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="p-2 hover:bg-red-50 rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Menu"
              type="button"
            >
              <i className="ri-file-list-3-line text-[22px] text-gray-700" />
            </button>

            <Link
              to="/profile"
              className="p-2 hover:bg-red-50 rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Profile"
            >
              <i className="ri-user-line text-[22px] text-gray-700" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}