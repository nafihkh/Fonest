import { Link } from "react-router-dom";

const LOGO =
  "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771488519/Logo_c07lrq.jpg";

export default function SiteFooter() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 to-blue-100/50 pt-16 pb-8 transition-colors dark:from-[#081120] dark:to-[#0f172a]">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                alt="FONEST"
                className="h-10 w-10 object-contain"
                src={LOGO}
              />

              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-cyan-300">
                FONEST
              </span>
            </div>

            <p className="mb-4 text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
              Your trusted destination for premium digital gadgets and
              accessories. Quality products, exceptional service.
            </p>

            <div className="flex items-center gap-3">
              {[
                { icon: "ri-facebook-fill", href: "https://facebook.com" },
                { icon: "ri-instagram-line", href: "https://instagram.com" },
                { icon: "ri-twitter-x-line", href: "https://twitter.com" },
                { icon: "ri-youtube-fill", href: "https://youtube.com" },
              ].map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-blue-500"
                >
                  <i className={`${s.icon} text-[16px]`} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-bold text-gray-900 dark:text-gray-100">
              Quick Links
            </h3>

            <ul className="space-y-2.5">
              <li>
                <Link
                  className="text-[14px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  to="/"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  className="text-[14px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  to="/shop"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  className="text-[14px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  to="/about"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  className="text-[14px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-bold text-gray-900 dark:text-gray-100">
              Customer Service
            </h3>

            <ul className="space-y-2.5">
              <li>
                <Link
                  className="text-[14px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  to="/tracking"
                >
                  Track Order
                </Link>
              </li>

              <li>
                <Link
                  className="text-[14px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  to="/orders"
                >
                  Order History
                </Link>
              </li>

              <li>
                <button
                  className="text-[14px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  type="button"
                >
                  Returns &amp; Refunds
                </button>
              </li>

              <li>
                <button
                  className="text-[14px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  type="button"
                >
                  Warranty Info
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-bold text-gray-900 dark:text-gray-100">
              Contact Us
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <i className="ri-phone-line mt-0.5 text-[16px] text-blue-600 dark:text-blue-400" />
                <span className="text-[14px] text-gray-600 dark:text-gray-400">
                  +1 (555) 123-4567
                </span>
              </li>

              <li className="flex items-start gap-3">
                <i className="ri-mail-line mt-0.5 text-[16px] text-blue-600 dark:text-blue-400" />
                <span className="text-[14px] text-gray-600 dark:text-gray-400">
                  support@fonest.com
                </span>
              </li>

              <li className="flex items-start gap-3">
                <i className="ri-map-pin-line mt-0.5 text-[16px] text-blue-600 dark:text-blue-400" />
                <span className="text-[14px] text-gray-600 dark:text-gray-400">
                  123 Tech Street, Silicon Valley, CA 94025
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-200 pt-8 dark:border-blue-900/40">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-[13px] text-gray-600 dark:text-gray-500">
              © 2025 FONEST. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <button
                className="text-[13px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
                type="button"
              >
                Privacy Policy
              </button>

              <button
                className="text-[13px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
                type="button"
              >
                Terms of Service
              </button>

              <a
                href="https://fonset.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-gray-600 transition-colors duration-300 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
              >
                Powered by Fonest
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}