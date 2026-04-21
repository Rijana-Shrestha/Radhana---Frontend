import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import HotelIdeal from "../../Assets/CompaniesWorkedWith/HotelIdeal.png";
import DevalayaGriha from "../../Assets/CompaniesWorkedWith/devalayaGriha.png";
import HotelHimalayan from "../../Assets/CompaniesWorkedWith/HotelHimalayan.png";
import SharmaMedical from "../../Assets/CompaniesWorkedWith/SharmaMedical.png";
import CarPlus from "../../Assets/CompaniesWorkedWith/CarPlus.png";
import GitanjaliLiquor from "../../Assets/CompaniesWorkedWith/GitanjaliLiquor.png";
import PokhariCottage from "../../Assets/CompaniesWorkedWith/PokhariCottage.png";
import RiseRollBakery from "../../Assets/CompaniesWorkedWith/Rise&RollBakery.png";
import TreadSora from "../../Assets/CompaniesWorkedWith/TreadSora.png";
import KKSport from "../../Assets/CompaniesWorkedWith/KKSport.png";
import Himalayan from "../../Assets/CompaniesWorkedWith/Himalayan.png";
import Sindoor from "../../Assets/CompaniesWorkedWith/Sindoor.png";
import Yamaha from "../../Assets/CompaniesWorkedWith/Yamaha.png";
import AntuCottage from "../../Assets/CompaniesWorkedWith/AntuCottage.png";

const companies = [
  {
    name: "Hotel Ideal",
    type: "Hotel",
    logo: HotelIdeal,
  },
  {
    name: "Devalaya Griha",
    type: "Business",
    logo: DevalayaGriha,
  },
  {
    name: "Hotel Himalayan",
    type: "Hospitality",
    logo: HotelHimalayan,
  },
  {
    name: "Sharma Medical",
    type: "Healthcare",
    logo: SharmaMedical,
  },
  {
    name: "Car Plus",
    type: "Automobile",
    logo: CarPlus,
  },
  {
    name: "Gitanjali Liquor",
    type: "Beverages",
    logo: GitanjaliLiquor,
  },
  {
    name: "Pokhari Cottage",
    type: "Hospitality",
    logo: PokhariCottage,
  },
  {
    name: "Rise & Roll Bakery",
    type: "Bakery",
    logo: RiseRollBakery,
  },
  {
    name: "Tread Sora",
    type: "International",
    logo: TreadSora,
  },
  {
    name: "KK Sports",
    type: "Sports",
    logo: KKSport,
  },
  {
    name: "Himalayan",
    type: "Business",
    logo: Himalayan,
  },
  {
    name: "Sindoor",
    type: "Business",
    logo: Sindoor,
  },
  {
    name: "Yamaha",
    type: "Automobile",
    logo: Yamaha,
  },
  {
    name: "Antu Cottage",
    type: "Hospitality",
    logo: AntuCottage,
  },
];

const galleryImages = [
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=500",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500",
  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=500",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=500",
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=500",
];

const Home = () => {
  const lbRef = useRef(null);
  const lbImgRef = useRef(null);
  const lbIdxRef = useRef(0);

  useEffect(() => {
    // Scroll reveal
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".reveal, .reveal-left, .reveal-right")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const openLB = (idx) => {
    lbIdxRef.current = idx;
    if (lbImgRef.current) lbImgRef.current.src = galleryImages[idx];
    if (lbRef.current) {
      lbRef.current.classList.remove("hidden");
      setTimeout(() => lbRef.current.classList.remove("opacity-0"), 10);
    }
  };
  const closeLB = () => {
    if (lbRef.current) {
      lbRef.current.classList.add("opacity-0");
      setTimeout(() => lbRef.current.classList.add("hidden"), 300);
    }
  };
  const prevLB = (e) => {
    e.stopPropagation();
    const idx =
      (lbIdxRef.current - 1 + galleryImages.length) % galleryImages.length;
    lbIdxRef.current = idx;
    if (lbImgRef.current) lbImgRef.current.src = galleryImages[idx];
  };
  const nextLB = (e) => {
    e.stopPropagation();
    const idx = (lbIdxRef.current + 1) % galleryImages.length;
    lbIdxRef.current = idx;
    if (lbImgRef.current) lbImgRef.current.src = galleryImages[idx];
  };

  return (
    <main>
      {/* ── Lightbox ── */}
      <div
        ref={lbRef}
        onClick={closeLB}
        className="fixed inset-0 bg-black/95 z-[200] hidden items-center justify-center p-4 opacity-0 flex"
        style={{ transition: "opacity 0.3s ease" }}
      >
        <button
          onClick={closeLB}
          className="absolute top-5 right-5 text-white w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
        >
          <i className="fas fa-times text-lg"></i>
        </button>
        <button
          onClick={prevLB}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
        >
          <i className="fas fa-chevron-left text-xl"></i>
        </button>
        <img
          ref={lbImgRef}
          src=""
          alt=""
          className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={nextLB}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
        >
          <i className="fas fa-chevron-right text-xl"></i>
        </button>
      </div>

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-[88vh] flex items-center py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-purple-50 via-violet-50/40 to-indigo-50/30 lotus-bg overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(20,95,175,0.05)" }}
        ></div>
        <div
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "rgba(217,58,106,0.05)" }}
        ></div>
        <div
          className="absolute top-10 right-10 text-[120px] leading-none pointer-events-none select-none font-main"
          style={{ color: "rgba(20,95,175,0.05)" }}
        >
           
        </div>

        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-12 lg:gap-16">
            {/* LEFT */}
            <div className="lg:w-1/2">
              <div
                className="h-anim-1 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-sub font-medium mb-5 border"
                style={{
                  background: "rgba(217,58,106,0.1)",
                  color: "var(--secondary)",
                  borderColor: "rgba(217,58,106,0.2)",
                }}
              >
                <i className="fas fa-om text-xs"></i> Divine Craftsmanship from
                Kathmandu
              </div>
              <h1 className="h-anim-2 font-main text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-bold mb-5 leading-tight text-gray-800">
                Laser Engraving &amp;
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-blue-500 to-pink-500">
                  Customized Gifts
                </span>
              </h1>
              <p className="h-anim-3 font-sub text-gray-500 text-[15px] md:text-[17px] mb-8 leading-relaxed max-w-lg">
                Transform your memories into timeless art. From wooden QR codes
                to personalized photo engravings — each piece crafted with
                divine precision and love.
              </p>
              <div className="h-anim-4 flex flex-col sm:flex-row gap-3 mb-9">
                <Link
                  to="/products"
                  className="font-sub text-white px-7 py-3.5 rounded-xl text-center font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ background: "var(--primary)" }}
                >
                  <i className="fas fa-store"></i> Explore Products
                </Link>
                <Link
                  to="/contact"
                  className="font-sub text-white px-7 py-3.5 rounded-xl text-center font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                  style={{ background: "var(--secondary)" }}
                >
                  <i className="fas fa-envelope"></i> Get Custom Quote
                </Link>
              </div>
              <div className="h-anim-5 flex flex-wrap gap-3">
                {[
                  {
                    icon: "fa-check",
                    bg: "bg-green-100",
                    color: "text-green-600",
                    label: "Premium Quality",
                  },
                  {
                    icon: "fa-truck-fast",
                    bg: "bg-blue-100",
                    color: "text-blue-600",
                    label: "Fast Delivery",
                  },
                  {
                    icon: "fa-heart",
                    bg: "bg-pink-100",
                    color: "text-secondary",
                    label: "Laser Engraved",
                  },
                  {
                    icon: "fa-star",
                    bg: "bg-amber-100",
                    color: "text-amber-500",
                    label: "4.9★ Rated",
                  },
                ].map(({ icon, bg, color, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 text-sm font-sub text-gray-600 bg-white/80 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-gray-100"
                  >
                    <div
                      className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center`}
                    >
                      <i className={`fas ${icon} ${color} text-xs`}></i>
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Floating image */}
            <div className="lg:w-1/2 h-anim-6">
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50 animate-float">
                  <img
                    src="/assets/hero.png"
                    className="w-full h-[380px] md:h-[460px] object-cover"
                    alt="Laser Engraved Products"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                <div
                  className="absolute -bottom-5 -right-5 text-white rounded-2xl shadow-xl p-3.5 text-center min-w-[90px]"
                  style={{ background: "var(--secondary)" }}
                >
                  <div className="font-main text-2xl font-bold">4.9★</div>
                  <div className="font-sub text-xs opacity-90 mt-0.5">
                    Avg Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ SHOP BY CATEGORY ══════════════════ */}
      <section className="py-14 md:py-16 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-10 reveal">
            <span
              className="font-sub text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--secondary)" }}
            >
              Browse By Category
            </span>
            <h2 className="font-main text-2xl md:text-3xl lg:text-4xl mt-2 mb-2 text-gray-800">
              Shop Our Collections
            </h2>
            <p className="font-sub text-gray-400 text-[15px] max-w-lg mx-auto">
              Find the perfect gift for every person, occasion, and budget
            </p>
          </div>

          {/* Main category cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5 stagger">
            {[
              {
                img: "https://images.unsplash.com/photo-1582269847642-87432658c952?q=80&w=800&auto=format&fit=crop",
                badgeBg: "red-500",
                badgeIcon: "fa-heart",
                badge: "Best Seller",
                title: "Personalized Gifts",
                desc: "Wooden engravings, keyrings, mugs & more",
                count: "50+",
                path: "/products",
              },
              {
                img: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800&auto=format&fit=crop",
                badgeBg: "var(--primary)",
                badgeIcon: "fa-home",
                badge: "New Arrivals",
                title: "Home Decor",
                desc: "Wall clocks, neon lights, fridge magnets & more",
                count: "25+",
                path: "/products",
              },
              {
                img: "https://images.unsplash.com/photo-1495121553079-4c61bcce1894?q=80&w=800&auto=format&fit=crop",
                badgeBg: "#f59e0b",
                badgeIcon: "fa-briefcase",
                badge: "Corporate",
                title: "Corporate Gifting",
                desc: "Awards, trophies, QR codes, signboards & more",
                count: "30+",
                path: "/products",
              },
            ].map(
              ({
                img,
                badgeBg,
                badgeIcon,
                badge,
                title,
                desc,
                count,
                path,
              }) => (
                <Link
                  to={path}
                  key={title}
                  className="reveal cat-card rounded-2xl cursor-pointer h-64 md:h-72 block"
                >
                  <img
                    src={img}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={title}
                  />
                  <div className="cat-card-content">
                    <div
                      className="inline-flex items-center gap-1.5 text-white font-sub text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wider"
                      style={{ background: badgeBg }}
                    >
                      <i className={`fas ${badgeIcon} text-[8px]`}></i> {badge}
                    </div>
                    <h3 className="font-main text-white text-xl font-bold leading-tight mb-1">
                      {title}
                    </h3>
                    <p className="font-sub text-white/80 text-xs mb-3">
                      {desc}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-sub text-white text-xs bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {count} Products
                      </span>
                      <span className="font-sub text-white text-xs flex items-center gap-1 hover:gap-2 transition-all">
                        Shop Now{" "}
                        <i className="fas fa-arrow-right text-[10px]"></i>
                      </span>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>

          {/* Sub-category pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 stagger">
            {[
              {
                icon: "fa-heart",
                bg: "bg-pink-50 border-pink-100 hover:bg-pink-100 hover:border-pink-300",
                iconBg: "bg-pink-200 text-pink-600 group-hover:bg-pink-500",
                label: "For Mother",
              },
              {
                icon: "fa-user-tie",
                bg: "bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-300",
                iconBg: "bg-blue-200 text-blue-600 group-hover:bg-blue-500",
                label: "For Father",
              },
              {
                icon: "fa-heart",
                bg: "bg-rose-50 border-rose-100 hover:bg-rose-100 hover:border-rose-300",
                iconBg: "bg-rose-200 text-rose-600 group-hover:bg-rose-500",
                label: "Anniversary",
              },
              {
                icon: "fa-birthday-cake",
                bg: "bg-amber-50 border-amber-100 hover:bg-amber-100 hover:border-amber-300",
                iconBg: "bg-amber-200 text-amber-600 group-hover:bg-amber-500",
                label: "Birthday",
              },
              {
                icon: "fa-qrcode",
                bg: "bg-indigo-50 border-indigo-100 hover:bg-indigo-100 hover:border-indigo-300",
                iconBg:
                  "bg-indigo-200 text-indigo-600 group-hover:bg-indigo-500",
                label: "QR Codes",
              },
              {
                icon: "fa-tag",
                bg: "bg-green-50 border-green-100 hover:bg-green-100 hover:border-green-300",
                iconBg: "bg-green-200 text-green-600 group-hover:bg-green-500",
                label: "Under Rs.500",
              },
            ].map(({ icon, bg, iconBg, label }) => (
              <Link
                to="/products"
                key={label}
                className={`reveal flex flex-col items-center gap-2 border rounded-2xl p-4 transition group ${bg}`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg group-hover:text-white transition ${iconBg}`}
                >
                  <i className={`fas ${icon}`}></i>
                </div>
                <span className="font-sub text-xs font-semibold text-gray-700 text-center">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ HOW IT WORKS ══════════════════ */}
      <section className="py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-gradient-to-br from-indigo-50 to-purple-50 peacock-bg">
        <div className="container mx-auto">
          <div className="text-center mb-12 reveal">
            <span
              className="font-sub text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--secondary)" }}
            >
              Simple Process
            </span>
            <h2 className="font-main text-2xl md:text-3xl lg:text-4xl mt-2 mb-3 text-gray-800">
              How It Works
            </h2>
            <p className="font-sub text-gray-400 text-[15px] max-w-xl mx-auto">
              Ordering your custom engraving is simple — you'll see a design
              preview before we ever craft it
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger">
            {[
              {
                icon: "fa-image",
                color: "text-black",
                hoverBg: "group-hover:bg-black",
                border: "border-primary/15",
                shadowColor: "group-hover:shadow-black/30",
                num: "1",
                numBg: "bg-black",
                title: "Upload Your Photo",
                desc: "Send us your image via WhatsApp or email after placing your order",
              },
              {
                icon: "fa-pencil-ruler",
                color: "text-red-500",
                hoverBg: "group-hover:bg-red-500",
                border: "border-red-500",
                shadowColor: "group-hover:shadow-red-500/30",
                num: "2",
                numBg: "bg-red-500",
                title: "Design Preview",
                desc: "We create and send your preview for approval — unlimited edits included",
              },
              {
                icon: "fa-check-double",
                color: "text-green-600",
                hoverBg: "group-hover:bg-green-600",
                border: "border-green-300/30",
                shadowColor: "group-hover:shadow-green-500/30",
                num: "3",
                numBg: "bg-green-600",
                title: "You Approve",
                desc: "Request changes freely until you're completely happy — no surprises",
              },
              {
                icon: "fa-truck-fast",
                color: "text-amber-500",
                hoverBg: "group-hover:bg-amber-500",
                border: "border-amber-300/30",
                shadowColor: "group-hover:shadow-amber-400/30",
                num: "4",
                numBg: "bg-amber-500",
                title: "Craft & Deliver",
                desc: "We engrave with precision and deliver safely to your door in 2–3 days",
              },
            ].map(
              ({
                icon,
                color,
                hoverBg,
                border,
                shadowColor,
                num,
                numBg,
                title,
                desc,
              }) => (
                <div key={num} className="reveal text-center group">
                  <div className="relative mb-5 inline-block">
                    <div
                      className={`w-20 h-20 bg-white border-2 ${border} rounded-2xl flex items-center justify-center mx-auto shadow-sm ${hoverBg} group-hover:border-transparent group-hover:shadow-lg ${shadowColor} group-hover:-translate-y-1 transition-all duration-400`}
                    >
                      <i
                        className={`fas ${icon} ${color} text-3xl group-hover:text-white transition-colors duration-300`}
                      ></i>
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 w-7 h-7 ${numBg} text-white rounded-full text-xs font-sub font-bold flex items-center justify-center shadow`}
                    >
                      {num}
                    </div>
                  </div>
                  <h3 className="font-main text-gray-800 text-lg mb-2">
                    {title}
                  </h3>
                  <p className="font-sub text-gray-400 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════ WHY CHOOSE US ══════════════════ */}
      <section className="py-16 md:py-20 px-6 md:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"></div>
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "url('/assets/why choose background image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div
          className="absolute inset-0 flex items-center justify-center text-white/[0.03] font-main leading-none pointer-events-none select-none"
          style={{ fontSize: "500px" }}
        >
        
        </div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 reveal">
            <span className="font-sub text-amber-400 text-sm font-semibold uppercase tracking-widest">
              Our Promise
            </span>
            <h2 className="font-main text-white text-2xl md:text-3xl lg:text-4xl mt-2 mb-3">
              Why Choose Radhana Art?
            </h2>
            <p className="font-sub text-gray-300 text-[15px] max-w-xl mx-auto">
              We combine traditional craftsmanship with modern laser technology
              to deliver excellence
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
            {[
              {
                icon: "fa-award",
                iconColor: "text-yellow-400",
                iconBg: "bg-yellow-500/20 group-hover:bg-yellow-500",
                titleColor: "group-hover:text-yellow-600",
                title: "Premium Quality",
                desc: "Precision laser-engraved with sharp details and a flawless finish guaranteed on every piece",
              },
              {
                icon: "fa-sliders",
                iconColor: "text-green-400",
                iconBg: "bg-green-500/20 group-hover:bg-green-500",
                titleColor: "group-hover:text-green-600",
                title: "Fully Customizable",
                desc: "Every item designed exactly the way you want — unlimited edits before we start crafting",
              },
              {
                icon: "fa-hand-holding-dollar",
                iconColor: "text-yellow-400",
                iconBg: "bg-yellow-500/20 group-hover:bg-yellow-500",
                titleColor: "group-hover:text-yellow-600",
                title: "Affordable Pricing",
                desc: "Top craftsmanship at transparent prices — bulk order discounts always available",
              },
              {
                icon: "fa-truck-fast",
                iconColor: "text-green-400",
                iconBg: "bg-green-500/20 group-hover:bg-green-500",
                titleColor: "group-hover:text-green-600",
                title: "Fast & Reliable",
                desc: "2–3 day turnaround with reliable delivery across Kathmandu valley",
              },
            ].map(({ icon, iconColor, iconBg, titleColor, title, desc }) => (
              <div
                key={title}
                className="reveal backdrop-blur-sm border border-white/10 p-7 rounded-2xl hover:bg-gray-100 hover:shadow-2xl transition-all duration-500 group cursor-default"
              >
                <div
                className={`w-14 h-14 ${iconBg} group-hover:bg-green-500 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300`}
                >
                <i
                className={`fas ${icon} ${iconColor} group-hover:text-white text-2xl transition-colors duration-300`}
                ></i>
                </div>
                <h3
                  className={`font-main text-white ${titleColor} text-lg mb-2 transition-colors`}
                >
                  {title}
                </h3>
                <p className="font-sub text-gray-400 group-hover:text-gray-500 text-sm leading-relaxed transition-colors">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ COMPANIES MARQUEE ══════════════════ */}
      <section className="py-12 md:py-14 bg-white border-y border-gray-100">
        <div className="container mx-auto px-6 mb-8 reveal">
          <div className="text-center">
            <span
              className="font-sub text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--secondary)" }}
            >
              Trusted By
            </span>
            <h2 className="font-main text-2xl md:text-3xl text-gray-800 mt-2">
              Companies We've Worked With
            </h2>
            <p className="font-sub text-gray-400 text-sm mt-1 max-w-lg mx-auto">
              From local restaurants to large corporations — trusted by
              businesses across Nepal
            </p>
          </div>
        </div>
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          <div className="marquee-track py-2">
            {[...companies, ...companies].map((c, i) => (
              <div key={i} className="company-card">
                <div className="w-[100px] h-[100px] rounded-xl flex items-center justify-center bg-gray-50">
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div
                    style={{ display: "none" }}
                    className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center"
                  >
                    <span className="text-white font-bold text-xl font-main">
                      {c.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <p className="font-sub font-semibold text-gray-800 text-xs text-center leading-tight">
                  {c.name}
                </p>
                <p className="font-sub text-gray-400 text-[10px]">{c.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS ══════════════════ */}
      <section
        className="py-14 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(to right, var(--primary), #1d4ed8)",
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center font-main leading-none pointer-events-none select-none text-white/5"
          style={{ fontSize: "300px" }}
        >
      
        </div>
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white stagger">
            {[
              { val: "5,000+", label: "Happy Customers" },
              { val: "10,000+", label: "Products Crafted" },
              { val: "4.9★", label: "Average Rating", star: true },
              { val: "5+", label: "Years Experience" },
            ].map(({ val, label }) => (
              <div key={label} className="reveal">
                <div className="font-main text-4xl md:text-5xl font-bold">
                  {val}
                </div>
                <p className="font-sub text-sm mt-2 text-blue-100">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ GALLERY PREVIEW ══════════════════ */}
      <section className="py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 reveal">
            <span
              className="font-sub text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--secondary)" }}
            >
              Our Work
            </span>
            <h2 className="font-main text-2xl md:text-3xl lg:text-4xl mt-2 mb-3 text-gray-800">
              Customer Creations
            </h2>
            <p className="font-sub text-gray-400 text-[15px] max-w-lg mx-auto">
              Real engravings made from our customers' photos and ideas — each
              one unique
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            <div
              className="reveal group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
              onClick={() => openLB(0)}
            >
              <img
                src={galleryImages[0]}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt=""
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-2xl">
                <i className="fas fa-search-plus text-white text-2xl"></i>
              </div>
            </div>
            <div
              className="reveal group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
              onClick={() => openLB(1)}
            >
              <img
                src={galleryImages[1]}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt=""
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-2xl">
                <i className="fas fa-search-plus text-white text-2xl"></i>
              </div>
            </div>
            <div
              className="reveal group relative overflow-hidden rounded-2xl cursor-pointer col-span-2"
              style={{ aspectRatio: "2/1" }}
              onClick={() => openLB(2)}
            >
              <img
                src={galleryImages[2]}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                alt=""
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-2xl">
                <i className="fas fa-search-plus text-white text-2xl"></i>
              </div>
            </div>
            {galleryImages.slice(3).map((src, i) => (
              <div
                key={i}
                className="reveal group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
                onClick={() => openLB(i + 3)}
              >
                <img
                  src={src}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-2xl">
                  <i className="fas fa-search-plus text-white text-2xl"></i>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10 reveal">
            <Link
              to="/gallery"
              className="font-sub border-2 px-8 py-3.5 rounded-xl transition-all duration-300 font-medium flex items-center gap-2 hover:shadow-lg hover:text-white"
              style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--primary)";
              }}
            >
              View Full Gallery <i className="fas fa-images"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════ TESTIMONIALS ══════════════════ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-violet-50 to-indigo-50 peacock-bg px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <div className="text-center mb-12 reveal">
            <span
              className="font-sub text-sm font-semibold uppercase tracking-widest"
              style={{ color: "var(--secondary)" }}
            >
              Happy Customers
            </span>
            <h2 className="font-main text-2xl md:text-3xl lg:text-4xl mt-2 mb-3 text-gray-800">
              What Our Customers Say
            </h2>
            <p className="font-sub text-gray-400 text-[15px]">
              Trusted by businesses and individuals across Kathmandu
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {[
              {
                img: "https://randomuser.me/api/portraits/men/45.jpg",
                name: "Ramesh Shrestha",
                role: "Business Owner",
                text: "The wooden QR code plaques for my restaurant are beautiful and functional. Customers love scanning them. Highly recommended!",
                border: "border-primary/10",
              },
              {
                img: "https://randomuser.me/api/portraits/women/32.jpg",
                name: "Sita Poudel",
                role: "Wedding Planner",
                text: "Custom wooden wedding invitations that were absolutely stunning! Quality exceeded expectations. The design preview made everything perfect!",
                border: "border-secondary/10",
              },
              {
                img: "https://randomuser.me/api/portraits/men/22.jpg",
                name: "Bikram Thapa",
                role: "Corporate Manager",
                text: "Amazing acrylic awards for our company event. Precision engraving and premium finish beyond our expectations!",
                border: "border-green-200",
              },
            ].map(({ img, name, role, text, border }) => (
              <div
                key={name}
                className="reveal bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 relative overflow-hidden group"
              >
                <div
                  className="absolute -top-2 -right-2 text-[90px] font-serif leading-none select-none group-hover:opacity-100 transition"
                  style={{ color: "rgba(217,58,106,0.08)", lineHeight: 1 }}
                >
                  "
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={img}
                    className={`w-14 h-14 rounded-full object-cover border-2 ${border}`}
                    alt={name}
                  />
                  <div>
                    <h3 className="font-sub font-semibold text-gray-800 text-sm">
                      {name}
                    </h3>
                    <p className="font-sub text-xs text-gray-400">{role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i
                      key={i}
                      className="fas fa-star text-amber-400 text-sm"
                    ></i>
                  ))}
                </div>
                <p className="font-sub text-gray-500 text-sm leading-relaxed">
                  "{text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section
        className="py-16 px-6 md:px-8 lg:px-12"
        style={{
          background:
            "linear-gradient(to right, var(--primary), var(--secondary))",
        }}
      >
        <div className="container mx-auto text-center">
          <h2 className="font-main text-white text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="font-sub text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Start your custom order today and get a design preview within 24
            hours
          </p>
          <Link
            to="/contact"
            className="font-sub inline-block bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition"
            style={{ color: "var(--primary)" }}
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
