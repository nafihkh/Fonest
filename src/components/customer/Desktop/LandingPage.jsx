import HeroCarousel from "../../home/HeroCarousel"
import SiteFooter from "../../layout/SiteFooter";
import { Link } from "react-router-dom";
import Reveal from "../../animations/Reveal";
import { motion } from "framer-motion";
import ProductCard from "../../home/_ProductCard";


const categories = [
  { name: "Watches", icon: "ri-time-line", count: 45 },
  { name: "Smart Watch", icon: "ri-smartphone-line", count: 32 },
  { name: "Airpods", icon: "ri-headphone-line", count: 28 },
  { name: "Headphone", icon: "ri-headphone-fill", count: 41 },
  { name: "Charger", icon: "ri-battery-charge-line", count: 67 },
  { name: "Data Cable", icon: "ri-usb-line", count: 53 },
  { name: "Neckband", icon: "ri-music-line", count: 19 },
  { name: "Used Phones", icon: "ri-smartphone-fill", count: 89 },
  { name: "Bluetooth Speaker", icon: "ri-speaker-3-line", count: 24 },
  { name: "Mobile Service", icon: "ri-tools-line", count: 0 },
];
const deals = [
  {
    id: 1,
    title: "Apple Watch Series 9",
    price: "$399",
    oldPrice: "$499",
    discountLabel: "-20%",
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602151/808f1440431c3eb26645528fb9562ef2_1_qqps1q.jpg",
  },
  {
    id: 2,
    title: "AirPods Pro 2nd Gen",
    price: "$249",
    oldPrice: "$299",
    discountLabel: "-17%",
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602195/c110687a124bb9b1dc015e0cf477025f_1_ywnclb.jpg",
  },
  {
    id: 3,
    title: "iPhone 15 Pro Max",
    price: "$1199",
    oldPrice: "$1399",
    discountLabel: "-14%",
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602612/fb319b48989079d1a6d8b5edcddb8c17_1_k05axu.jpg",
  },
  {
    id: 5,
    title: "Samsung Galaxy Watch 6",
    price: "$299",
    oldPrice: "$349",
    discountLabel: "-14%",
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602657/peqiblbo_bs5j1t.png",
  },
];
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const arrivals = [
  {
    id: 1,
    title: "Apple Watch Series 9",
    category: "Smart Watch",
    price: "$399",
    isNew: true,
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602151/808f1440431c3eb26645528fb9562ef2_1_qqps1q.jpg",
  },
  {
    id: 2,
    title: "AirPods Pro 2nd Gen",
    category: "Airpods",
    price: "$249",
    isNew: true,
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602195/c110687a124bb9b1dc015e0cf477025f_1_ywnclb.jpg",
  },
  {
    id: 4,
    title: "Sony WH-1000XM5",
    category: "Headphone",
    price: "$349",
    isNew: true,
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602236/58a53f1b802dcc1ec108f7e308501710_saushh.jpg",
  },
  {
    id: 9,
    title: "JBL Flip 6",
    category: "Bluetooth Speaker",
    price: "$129",
    isNew: true,
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602315/anc0chdd_xybfdy.png",
  },
  {
    id: 11,
    title: "Samsung Galaxy Buds 2 Pro",
    category: "Airpods",
    price: "$199",
    isNew: true,
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602381/b890cb203710de0fc471fdfef808d079_bp9afi.jpg",
  },
  {
    id: 12,
    title: "Garmin Venu 3",
    category: "Watches",
    price: "$449",
    isNew: true,
    image:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602452/xs9zs0i9_pwrcng.png",
  },
];
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Verified Customer",
    text:
      "Amazing quality products! My Apple Watch arrived in perfect condition and the customer service was exceptional.",
    avatar:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602657/peqiblbo_bs5j1t.pnghttps://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602788/57f874a3731a61926d6b998d6809044b_dkprff.jpg",
  },
  {
    name: "Michael Chen",
    role: "Verified Customer",
    text:
      "Fast delivery and authentic products. FONEST is now my go-to store for all tech gadgets.",
    avatar:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602803/5f8942a2ee686571ac332bfe5066de7b_r6oihj.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Verified Customer",
    text:
      "The mobile service pickup and delivery is a game changer. Highly recommend!",
    avatar:
      "https://res.cloudinary.com/dl0wwvy4j/image/upload/v1771602845/12e12fd076ae4ccd43959479f223c8ef_zhlkbw.jpg",
  },
];

const features = [
  { icon: "ri-shield-check-line", title: "2 Year Warranty", sub: "On all products" },
  { icon: "ri-truck-line", title: "Fast Delivery", sub: "2-3 business days" },
  { icon: "ri-lock-line", title: "Secure Payments", sub: "100% protected" },
  { icon: "ri-customer-service-2-line", title: "24/7 Support", sub: "Always here to help" },
];


export default function Home({
  deals = [],
  arrivals = [],
  loading = false,
  error = "",
}) {
  if (loading) {
    return <div className="min-h-screen grid place-items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen grid place-items-center text-red-600">{error}</div>;
  }
  const handleAddToCart = (p) => {
    // TODO: connect to cart store/context later
    console.log("add to cart", p.id);
  };

  return(
    <>
    <div className="min-h-screen bg-white">
      <HeroCarousel />

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-[15px] text-gray-600">
              Explore our wide range of premium tech products
            </p>
          </div>
          </Reveal>
          <Reveal>
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-5 gap-6"
                  variants={container}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                >
              {categories.map((c) => (
                  <Link
                  key={c.name}
                  to={`/shop?category=${encodeURIComponent(c.name)}`}
                  className="group bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:-translate-y-1 cursor-pointer"
                  >
                  <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      <i className={`${c.icon} text-[24px] text-red-600`} />
                  </div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-1">
                      {c.name}
                  </h3>
                  <p className="text-[13px] text-gray-500">{c.count} products</p>
                  </Link>
              ))}
              </motion.div>
          </Reveal>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <Reveal>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Top Deals</h2>
              <p className="text-[15px] text-gray-600">
                Limited time offers on premium products
              </p>
            </div>

            <Link
              to="/shop"
              className="text-[14px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              View All <i className="ri-arrow-right-line" />
            </Link>
          </div>
          </Reveal>
          <Reveal delay={0.08}>
          <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              >
            {deals.map((p) => (
                  <motion.div key={p.id} variants={item}>
                  <ProductCard product={p} variant="item" onAddToCart={handleAddToCart} />
                  </motion.div>
              ))}
          </motion.div>
          </Reveal>
        </div>
      </section>
       <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-[1400px] mx-auto px-6">
            <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">New Arrivals</h2>
              <p className="text-[15px] text-gray-600">
                Check out the latest additions to our collection
              </p>
            </div>
            </Reveal>
    
            <Reveal>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {arrivals.map((p) => (
                <motion.div key={p.id} variants={item}>
                  <Link to={`/product/${p.id}`} className="block">
                    <ProductCard
                      product={p}
                      variant="arrival"
                      onAddToCart={handleAddToCart}
                    />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
            </Reveal>
          </div>
        </section>
      <section className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-[15px] text-gray-600">
              Join thousands of satisfied customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div
                  key={t.name}
                  variants={item}
                  className="bg-gradient-to-br from-red-50 to-white rounded-2xl p-8 border border-red-100"
                >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className="ri-star-fill text-[16px] text-yellow-400" />
                  ))}
                </div>

                <p className="text-[14px] text-gray-700 leading-relaxed mb-6">
                  {t.text}
                </p>

                <div className="flex items-center gap-3">
                  <img
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                    src={t.avatar}
                  />
                  <div>
                    <h4 className="text-[14px] font-semibold text-gray-900">
                      {t.name}
                    </h4>
                    <p className="text-[13px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-br from-red-600 to-red-800">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f) => (
              <Reveal>
              <div key={f.title} className="text-center">
                <div className="w-16 h-16 flex items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl mx-auto mb-4">
                  <i className={`${f.icon} text-[32px] text-white`} />
                </div>
                <h3 className="text-[15px] font-bold text-white mb-2">{f.title}</h3>
                <p className="text-[13px] text-white/80">{f.sub}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
    </>
  );
}