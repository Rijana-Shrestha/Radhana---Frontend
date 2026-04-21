import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import bibek from "../../Assets/bibek.jpeg";
import sujit from "../../Assets/sujit.jpeg";
import ajit from "../../Assets/ajit.jpeg";
/* scroll-reveal hook */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

const Reveal = ({ children, className = "", style = {} }) => {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
};

/* ══════════════════════════════════════════════════════ */
const AboutUs = () => {
  const values = [
    {
      icon: "fa-gem",
      color: "text-[#145faf]",
      bg: "bg-blue-50",
      title: "Premium Quality",
      desc: "Every piece is crafted with meticulous attention to detail using state-of-the-art laser technology.",
    },
    {
      icon: "fa-palette",
      color: "text-[#D93A6A]",
      bg: "bg-pink-50",
      title: "Creative Design",
      desc: "Our designers work closely with you to transform your vision into a beautiful, personalised masterpiece.",
    },
    {
      icon: "fa-clock",
      color: "text-amber-500",
      bg: "bg-amber-50",
      title: "Timely Delivery",
      desc: "We understand deadlines. Standard orders are completed in 2–3 days with rush options available.",
    },
    {
      icon: "fa-heart",
      color: "text-red-500",
      bg: "bg-red-50",
      title: "Made with Love",
      desc: "Every engraving carries the care and passion of our artisans, making each piece truly special.",
    },
    // { icon: 'fa-shield-halved', color: 'text-green-600', bg: 'bg-green-50', title: 'Satisfaction Guaranteed', desc: 'Unlimited revisions until you love it. We're not happy until you are.' },
    // { icon: 'fa-users', color: 'text-purple-600', bg: 'bg-purple-50', title: 'Customer First', desc: 'From first enquiry to delivery, we're with you every step of the way.' },
  ];

  const timeline = [
    {
      year: "2018",
      title: "Founded",
      desc: "Radhana Art begins as a small passion project in Kathmandu.",
    },
    {
      year: "2019",
      title: "First 100 Clients",
      desc: "Reached our first milestone of 100 happy customers.",
    },
    {
      year: "2021",
      title: "Expanded Range",
      desc: "Added corporate gifting, signboards, and neon lighting solutions.",
    },
    {
      year: "2023",
      title: "5,000+ Orders",
      desc: "Scaled to serve thousands of customers across Nepal.",
    },
    {
      year: "2025",
      title: "Digital Launch",
      desc: "Launched our full e-commerce platform for seamless online ordering.",
    },
  ];

  const team = [
    {
      name: "Bibek Shah",
      role: "Founder & Creative Director",
      img: bibek,
      desc: "Founder & MD expertise in laser Technology, custom signage production, & strong customer handling skills.",
    },
    {
      name: "Ajit Sah",
      role: "Lead Engraving Technician",
      img: ajit     ,
      desc: "Business Development Partner Expertise Expands  business through clients and partnerships.",
    },
    {
      name: "Sujit Shretha",
      role: "Designer Expertise ",
      img: sujit,
      desc: "Creates creative designs for engraving, signage, and branding projects",
    },
  ];

  return (
    <main className="bg-white overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="py-20 md:py-28 px-6 text-center bg-white">
        <div className="container mx-auto max-w-3xl">
          <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-4 block">
            Our Story
          </span>
          <h1 className="font-main text-4xl md:text-5xl lg:text-6xl text-gray-800 mb-6 leading-tight">
            Crafting Memories,
            <br />
            <span className="text-[#145faf]">One Engraving</span> at a Time
          </h1>
          <p className="font-sub text-gray-400 text-[15px] max-w-2xl mx-auto mb-8 leading-relaxed">
            Since 2018, Radhana Art has been transforming cherished moments and
            ideas into stunning laser-engraved keepsakes — serving thousands of
            happy customers across Nepal.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-[#145faf] hover:bg-[#D93A6A] text-white font-sub font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <i className="fas fa-store" /> Browse Products
            </Link>
            <a
              href="https://wa.me/9779823939106"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-sub font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-whatsapp text-xl" /> Chat with Us
            </a>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <Reveal className="reveal-left">
              <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-2 block">
                Who We Are
              </span>
              <h2 className="font-main text-3xl md:text-4xl text-[#145faf] mb-6 leading-tight">
                Born from Passion,
                <br />
                Built on Craft
              </h2>
              <p className="font-sub text-gray-500 text-[15px] leading-relaxed mb-4">
                Radhana Art was founded with a simple dream: to help people
                transform their cherished memories and sentiments into
                beautiful, tangible art pieces through laser engraving.
              </p>
              <p className="font-sub text-gray-500 text-[15px] leading-relaxed mb-4">
                What started as a small passion project has grown into a trusted
                name in custom laser engraving across Kathmandu, serving
                thousands of happy customers with personalised gifts for every
                occasion.
              </p>
              <p className="font-sub text-gray-500 text-[15px] leading-relaxed mb-6">
                Today, we combine traditional craftsmanship with cutting-edge
                laser technology to create pieces that last a lifetime.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  ["fa-award", "#145faf", "5+ Years"],
                  ["fa-users", "#D93A6A", "5,000+ Clients"],
                  ["fa-star", "#f59e0b", "4.9 Rating"],
                ].map(([icon, color, label]) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5"
                  >
                    <i className={`fas ${icon} text-sm`} style={{ color }} />
                    <span className="font-sub text-sm font-semibold text-gray-700">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal className="reveal-right">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=700&auto=format&fit=crop"
                    alt="Radhana Art workspace"
                    className="w-full h-80 md:h-[450px] object-cover"
                  />
                </div>
                {/* floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#145faf]/10 rounded-xl flex items-center justify-center">
                    <i className="fas fa-laser-pointer text-[#145faf] text-xl" />
                  </div>
                  <div>
                    <p className="font-main text-[#145faf] text-lg font-bold">
                      500+
                    </p>
                    <p className="font-sub text-gray-400 text-xs">
                      Products Created
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Reveal>
              <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-2 block">
                Purpose
              </span>
              <h2 className="font-main text-3xl md:text-4xl text-gray-800 mb-3">
                Mission &amp; Vision
              </h2>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Reveal>
              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-50 h-full">
                <div className="w-14 h-14 bg-[#145faf]/10 rounded-2xl flex items-center justify-center mb-5">
                  <i className="fas fa-bullseye text-[#145faf] text-2xl" />
                </div>
                <h3 className="font-main text-[#145faf] text-2xl mb-4">
                  Our Mission
                </h3>
                <p className="font-sub text-gray-500 text-[15px] leading-relaxed">
                  To make personalised, high-quality laser engraving accessible
                  to everyone in Nepal — helping people create meaningful,
                  lasting keepsakes that celebrate life's most important
                  moments.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-blue-50 h-full">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                  <i className="fas fa-eye text-[#145faf] text-2xl" />
                </div>
                <h3 className="font-main text-gray-900 text-2xl mb-4">
                  Our Vision
                </h3>
                <p className="font-sub text-gray-500 text-[15px] leading-relaxed">
                  To become Nepal's most loved creative studio — where every
                  idea, memory, and emotion can be beautifully expressed through
                  the art of laser engraving.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Reveal>
              <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-2 block">
                What We Stand For
              </span>
              <h2 className="font-main text-3xl md:text-4xl text-gray-800 mb-3">
                Our Core Values
              </h2>
              <p className="font-sub text-gray-400 text-[15px] max-w-xl mx-auto">
                The principles that guide every product we create and every
                relationship we build.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
            {values.map((v, i) => (
              <Reveal key={v.title} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-400 border border-gray-50 hover:-translate-y-1.5 h-full">
                  <div
                    className={`w-12 h-12 ${v.bg} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <i className={`fas ${v.icon} ${v.color} text-xl`} />
                  </div>
                  <h3 className="font-sub font-semibold text-gray-800 mb-2">
                    {v.title}
                  </h3>
                  <p className="font-sub text-gray-500 text-sm leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section 
      className="py-14 bg-white border border-gray-100 px-6"
        style={{
          background: "linear-gradient(to right, var(--primary), #1d4ed8)",
        }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                num: "5,000+",
                label: "Happy Customers",
                icon: "fa-face-smile",
              },
              {
                num: "500+",
                label: "Products Created",
                icon: "fa-boxes-stacked",
              },
              { num: "4.9★", label: "Average Rating", icon: "fa-star" },
              {
                num: "6+",
                label: "Years of Experience",
                icon: "fa-calendar-check",
              },
            ].map((s) => (
               <div key={s.label}>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <i className={`fas ${s.icon} text-white text-xl`} />
              </div>
              <p className="font-main text-white text-3xl md:text-4xl font-bold mb-1">
            {s.num}
            </p>
          <p className="font-sub text-gray-200 text-sm">{s.label}</p>
          </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <Reveal>
              <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-2 block">
                Journey
              </span>
              <h2 className="font-main text-3xl md:text-4xl text-gray-800">
                Our Milestones
              </h2>
            </Reveal>
          </div>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#145faf] to-[#D93A6A] -translate-x-1/2" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <Reveal
                  key={t.year}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div
                    className={`flex items-center gap-6 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}
                    >
                      <div className="bg-white rounded-2xl p-5 shadow-sm inline-block hover:shadow-md transition">
                        <p className="font-main text-[#145faf] text-lg font-bold mb-1">
                          {t.year}
                        </p>
                        <p className="font-sub font-semibold text-gray-800 text-sm mb-1">
                          {t.title}
                        </p>
                        <p className="font-sub text-gray-400 text-xs">
                          {t.desc}
                        </p>
                      </div>
                    </div>
                    {/* dot */}
                    <div className="relative z-10 w-4 h-4 bg-[#145faf] rounded-full border-4 border-white shadow-md flex-shrink-0" />
                    <div className="flex-1" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-16 md:py-20 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Reveal>
              <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-2 block">
                The People Behind
              </span>
              <h2 className="font-main text-3xl md:text-4xl text-gray-800 mb-3">
                Meet Our Team
              </h2>
              <p className="font-sub text-gray-400 text-[15px] max-w-md mx-auto">
                Passionate artisans who pour their heart into every creation.
              </p>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <Reveal
                key={member.name}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="group text-center bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-50 hover:-translate-y-1">
                  <div className="relative inline-block mb-5">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-24 h-24 rounded-2xl object-cover mx-auto shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#145faf] rounded-full flex items-center justify-center shadow-md">
                      <i className="fas fa-laser-pointer text-white text-xs" />
                    </div>
                  </div>
                  <h3 className="font-main text-[#145faf] text-lg mb-1">
                    {member.name}
                  </h3>
                  <p className="font-sub text-[#D93A6A] text-xs font-semibold uppercase tracking-wider mb-3">
                    {member.role}
                  </p>
                  <p className="font-sub text-gray-400 text-sm">
                    {member.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 bg-white border border-gray-100 px-6 text-center">
        <div className="container mx-auto">
          <h2 className="font-main text-gray-900 text-2xl md:text-3xl mb-3">
            Ready to Create Something Special?
          </h2>
          <p className="font-sub text-gray-500 text-[15px] mb-7 max-w-lg mx-auto">
            Let's bring your ideas to life. Contact us today and let our team
            craft something beautiful for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#D93A6A] font-sub font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition hover:shadow-lg hover:-translate-y-0.5"
            >
              <i className="fas fa-envelope" /> Get in Touch
            </Link>
            <a
              href="https://wa.me/9779823939106"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-sub font-semibold px-8 py-3.5 rounded-xl transition hover:shadow-lg hover:-translate-y-0.5"
            >
              <i className="fa-brands fa-whatsapp text-xl" /> WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
        .reveal.visible { opacity: 1; transform: none; }
        .reveal-left { opacity: 0; transform: translateX(-36px); transition: opacity .7s ease, transform .7s ease; }
        .reveal-right { opacity: 0; transform: translateX(36px); transition: opacity .7s ease, transform .7s ease; }
        .reveal-left.visible, .reveal-right.visible { opacity: 1; transform: none; }
      `}</style>
    </main>
  );
};

export default AboutUs;
