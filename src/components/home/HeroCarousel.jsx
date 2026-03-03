import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, User } from "lucide-react";

/**
 * ✅ Put images in: /public/products/...
 * Example:
 *  /public/products/headphone-red.png
 *  /public/products/headphone-blue.png
 *  /public/products/headphone-green.png
 */

const SLIDES = [
  {
    id: "red",
    bigWord: "OVERHEAD",
    name: "Volt Audio",
    desc:
      "The VoltAudio RedPulse Pro is a sleek, over-ear wireless headset designed for powerful sound and all-day comfort.",
    img: "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771521115/Rectangle_5_pjglqk.png",
    // your exact gradient:
    gradient:
      "radial-gradient(circle at center, #ef0000 0.0%, #5d1111 100.0%)",
  },
  {
    id: "blue",
    bigWord: "IPHONE-16",
    name: "Apple",
    desc:
      "This Apple smartphone represents a blend of elegant industrial design and high-end performance. it reflects Apple’s commitment to innovation, simplicity, and user-focused technology.",
    img: "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771521087/Rectangle_4_d0doyu.png",
    gradient:
      "radial-gradient(circle at center, #bfe7dc 0.9%, #8fc7b6 50.0%, #2c4e49 100.0%)",
  },
  {
    id: "green",
    bigWord: "PRW-61AN",
    name: "Casio India",
    desc:
      "The Official Website. Find your watch from our abundant lineup such as G-SHOCK, BABY-G, EDIFICE, Pro trek, sheen, vintage, youth, and enticer for men and women.",
    img: "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771521031/image_3_te4hrx.png",
    gradient:
      "radial-gradient(circle at center, #5a7a3a 0.0%, #1a2314 70.0%, #0e0f0c 100.0%)",
  },
];

export default function HeroCarousel() {
  const slides = useMemo(() => SLIDES, []);
  const [index, setIndex] = useState(0);

  // For the “radial gradient opacity dip” effect:
  const [bgA, setBgA] = useState(slides[0].gradient);
  const [bgB, setBgB] = useState(slides[0].gradient);
  const [showB, setShowB] = useState(false);

  const slide = slides[index];

  const go = (dir) => {
    const next = (index + dir + slides.length) % slides.length;

    // Update background layers to crossfade + dip opacity
    setBgA(slides[index].gradient);
    setBgB(slides[next].gradient);
    setShowB(true);

    setIndex(next);

    // after crossfade, lock to new gradient
    setTimeout(() => {
      setBgA(slides[next].gradient);
      setShowB(false);
    }, 520);
  };

  // Auto play (optional). Change 5000 to your preference.
  useEffect(() => {
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Motion variants
  const bigText = {
    initial: { x: -80, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
    exit: { x: -80, opacity: 0, transition: { duration: 0.25 } },
  };

  const productText = {
    initial: { x: -30, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.15, ease: "easeOut" },
    },
    exit: { x: -30, opacity: 0, transition: { duration: 0.2 } },
  };

  const productImg = {
    initial: { y: 70, opacity: 0, scale: 0.98 },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.1 },
    },
    exit: { y: 70, opacity: 0, transition: { duration: 0.25 } },
  };

  return (
    <div className="min-h-screen w-full">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background gradient layers (A + B crossfade) */}
        <motion.div
          className="absolute inset-0 h-full w-full"
          style={{ backgroundImage: bgA }}
          animate={{ opacity: showB ? 0.55 : 1 }} // 👈 opacity dip
          transition={{ duration: 0.28, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 h-full w-full"
          style={{ backgroundImage: bgB }}
          animate={{ opacity: showB ? 1 : 0 }}
          transition={{ duration: 0.52, ease: "easeInOut" }}
        />

        {/* Soft vignette */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-35 pt-6">
          <div className="text-white font-baloo text-2xl tracking-wide">Fonest</div>

          <div className="hidden md:flex items-center gap-2 rounded-full bg-black/30 text-white/90 backdrop-blur">
            {["Home", "Order", "Shop", "Contact"].map((t) => (
              <button
                key={t}
                className="rounded-full px-7 py-4 text-lg hover:bg-white hover:text-black transition"
              >
                {t}
              </button>
            ))}
          </div>

          <button className="grid h-15 w-15 place-items-center  rounded-full bg-black/30 text-white/90 backdrop-blur hover:bg-black/40 transition">
            <User size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-[calc(100vh-80px)] items-center px-35 pt-26">
          <div className="relative w-full">
            {/* BIG WORD */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={slide.id + "-big"}
                {...bigText}
                className="text-center select-none text-white font-extrabold font-sans tracking-tight
                           text-[72px] sm:text-[96px] md:text-[130px] lg:text-[160px]
                           leading-[0.9]"
                style={{ letterSpacing: "-0.04em" }}
              >
                {slide.bigWord}
              </motion.h1>
            </AnimatePresence>

            {/* Product image (center) */}
            <div className="pointer-events-none absolute left-1/2 top-[34%] w-[270px] -translate-x-1/2 -translate-y-1/2 sm:w-[320px] md:w-[360px] lg:w-[540px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={slide.id + "-img"}
                  {...productImg}
                  src={slide.img}
                  alt={slide.name}
                  className="h-auto w-full drop-shadow-[0_30px_35px_rgba(0,0,0,0.35)]"
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            {/* Bottom-left details */}
            <div className="mt-40 max-w-[420px]">
              <AnimatePresence mode="wait">
                <motion.div key={slide.id + "-text"} {...productText}>
                  <h3 className="text-white text-3xl font-baloo">{slide.name}</h3>
                  <p className="mt-3 text-white/75 text-sm leading-relaxed">
                    {slide.desc}
                  </p>
                </motion.div>             
              </AnimatePresence>
            </div>

            {/* Arrows bottom-right */}
            <div className="absolute bottom-0 right-0 flex items-center gap-3">
              <button
                onClick={() => go(-1)}
                className="grid h-15 w-15 place-items-center rounded-full border border-white border-4 font-bold text-white hover:bg-white/10 transition"
              >
                <ArrowLeft size={24} strokeWidth={3} />
              </button>
              <button
                onClick={() => go(1)}
                className="grid h-15 w-15 place-items-center rounded-full border border-white border-4  text-white hover:bg-white/10 transition"
              >
                <ArrowRight size={24} strokeWidth={3} />
              </button>
            </div>

            {/* Dots (optional) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (i === index) return;
                    // simulate same transition behavior as arrows
                    const next = i;
                    setBgA(slides[index].gradient);
                    setBgB(slides[next].gradient);
                    setShowB(true);
                    setIndex(next);
                    setTimeout(() => {
                      setBgA(slides[next].gradient);
                      setShowB(false);
                    }, 520);
                  }}
                  className={`h-2 w-2 rounded-full transition ${
                    i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to ${s.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
