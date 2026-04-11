import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Home, ArrowLeft, Search, Package } from "lucide-react";

/* ─── Floating particle ─────────────────────────────────────── */
function Particle({ x, y, size, delay, duration, color }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, opacity: 0.18 }}
      animate={{ y: [0, -30, 0], opacity: [0.12, 0.3, 0.12], scale: [1, 1.3, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const PARTICLES = [
  { x: 8,  y: 20, size: 10, delay: 0,    duration: 4.2, color: "#3b82f6" },
  { x: 90, y: 15, size: 6,  delay: 0.8,  duration: 3.5, color: "#8b5cf6" },
  { x: 20, y: 75, size: 14, delay: 1.4,  duration: 5.1, color: "#06b6d4" },
  { x: 75, y: 70, size: 8,  delay: 0.3,  duration: 4.8, color: "#3b82f6" },
  { x: 50, y: 88, size: 6,  delay: 2.1,  duration: 3.9, color: "#8b5cf6" },
  { x: 60, y: 10, size: 12, delay: 1.0,  duration: 6.0, color: "#06b6d4" },
  { x: 35, y: 50, size: 5,  delay: 0.5,  duration: 4.5, color: "#3b82f6" },
  { x: 82, y: 45, size: 9,  delay: 1.8,  duration: 3.7, color: "#8b5cf6" },
  { x: 12, y: 55, size: 7,  delay: 2.5,  duration: 5.5, color: "#06b6d4" },
  { x: 68, y: 88, size: 11, delay: 0.6,  duration: 4.0, color: "#3b82f6" },
  { x: 45, y: 25, size: 4,  delay: 3.0,  duration: 3.2, color: "#ec4899" },
  { x: 93, y: 65, size: 7,  delay: 1.2,  duration: 5.8, color: "#ec4899" },
];

/* ─── Glitch digit ───────────────────────────────────────────── */
function GlitchDigit({ char, delay = 0 }) {
  return (
    <motion.span
      className="relative inline-block select-none font-black text-transparent"
      style={{
        WebkitTextStroke: "2px transparent",
        backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        fontSize: "clamp(5rem, 20vw, 12rem)",
        lineHeight: 1,
        fontFamily: "'Archivo', 'Inter', sans-serif",
        letterSpacing: "-0.05em",
      }}
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glitch layers */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(135deg, #ef4444, transparent)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
        }}
        animate={{ x: [-2, 2, 0, -1, 1, 0], opacity: [0, 0.6, 0, 0.4, 0, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5 + delay }}
      >
        {char}
      </motion.span>
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(135deg, #06b6d4, transparent)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
        }}
        animate={{ x: [2, -2, 0, 1, -1, 0], opacity: [0, 0.5, 0, 0.3, 0, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5 + delay, delay: 0.05 }}
      >
        {char}
      </motion.span>
      {char}
    </motion.span>
  );
}

/* ─── Floating Package Illustration ─────────────────────────── */
function FloatingPackage() {
  return (
    <motion.div
      className="relative mx-auto mb-8 md:mb-10"
      style={{ width: 120, height: 120 }}
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Shadow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-blue-500/20 blur-md"
        style={{ width: 80, height: 12 }}
        animate={{ scaleX: [1, 0.65, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Box body */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="boxTop"    x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="boxFront"  x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="boxSide"   x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>

        {/* Front face */}
        <path d="M 15 45 L 15 88 L 62 88 L 62 45 Z" fill="url(#boxFront)" />
        {/* Side face */}
        <path d="M 62 45 L 62 88 L 88 72 L 88 30 Z" fill="url(#boxSide)" />
        {/* Top face */}
        <path d="M 15 45 L 42 28 L 88 28 L 62 45 Z" fill="url(#boxTop)" />
        {/* Tape strip on front */}
        <rect x="35" y="45" width="9" height="43" fill="white" fillOpacity="0.18" rx="1" />
        {/* Tape strip on top */}
        <path d="M 46 28 L 39 45 L 48 45 L 55 28 Z" fill="white" fillOpacity="0.18" />
        {/* FONEST text on front */}
        <text x="20" y="72" fill="white" fillOpacity="0.9" fontSize="7" fontFamily="Arial" fontWeight="bold" letterSpacing="1">FONEST</text>
        {/* Star on front */}
        <text x="22" y="60" fill="white" fillOpacity="0.6" fontSize="9">✦</text>
      </svg>

      {/* Sparkles */}
      {[
        { cx: "85%", cy: "5%",  delay: 0   },
        { cx: "5%",  cy: "25%", delay: 0.7 },
        { cx: "90%", cy: "55%", delay: 1.4 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-400 text-sm pointer-events-none"
          style={{ left: s.cx, top: s.cy }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 180] }}
          transition={{ duration: 1.4, delay: s.delay, repeat: Infinity, repeatDelay: 2 }}
        >
          ✦
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─── Main 404 Page ──────────────────────────────────────────── */
export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 px-4 py-12 dark:bg-[radial-gradient(ellipse_at_top,_#1e3a8a_0%,_#111827_40%,_#030712_100%)]">

      {/* ── Background Particles ───────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08]"
          style={{
            backgroundImage: "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ── Glow blobs ────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">

        {/* FONEST badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200/50 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm dark:border-blue-500/30 dark:bg-white/5"
        >
          <span className="text-[15px] font-extrabold tracking-widest text-blue-600 dark:text-blue-400">
            FONEST
          </span>
          <span className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
          <span className="text-[12px] font-medium text-gray-500 dark:text-gray-400">Page Not Found</span>
        </motion.div>

        {/* Floating box */}
        <FloatingPackage />

        {/* 404 digits */}
        <div className="mb-6 flex items-center justify-center gap-2 md:gap-4">
          <GlitchDigit char="4" delay={0.1} />
          <GlitchDigit char="0" delay={0.25} />
          <GlitchDigit char="4" delay={0.4} />
        </div>

        {/* Divider line */}
        <motion.div
          className="mb-6 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent dark:via-blue-500"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* Message */}
        <motion.h1
          className="mb-3 text-[22px] font-bold text-gray-900 dark:text-gray-100 md:text-[28px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Oops! This page got lost in transit
        </motion.h1>

        <motion.p
          className="mb-10 max-w-sm text-[14px] leading-6 text-gray-500 dark:text-gray-400 md:text-[15px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-4 text-[14px] font-semibold text-white shadow-lg shadow-blue-500/30 transition-shadow hover:shadow-xl hover:shadow-blue-500/40 dark:from-blue-500 dark:to-violet-500"
          >
            <Home size={16} />
            Go to Home
          </motion.button>

          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-7 py-4 text-[14px] font-semibold text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:border-blue-500/50 dark:hover:text-blue-400"
          >
            <ArrowLeft size={16} />
            Go Back
          </motion.button>

          <motion.button
            onClick={() => navigate("/search")}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-7 py-4 text-[14px] font-semibold text-gray-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:border-blue-500/50 dark:hover:text-blue-400 sm:hidden md:flex"
          >
            <Search size={16} />
            Search
          </motion.button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          {[
            { label: "Shop",    path: "/shop"             },
            { label: "Cart",    path: "/cart"             },
            { label: "Profile", path: "/profile"          },
            { label: "Orders",  path: "/purchase-history" },
          ].map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="text-[13px] font-medium text-gray-400 transition hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
            >
              {link.label}
            </button>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="mt-8 text-[11px] text-gray-400 dark:text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          Error 404 · FONEST Team
        </motion.p>
      </div>
    </div>
  );
}
