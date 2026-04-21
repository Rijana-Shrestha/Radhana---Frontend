import React, { useState, useEffect, useContext } from "react";
import { GalleryContext } from "../context/GalleryContext";

const Gallery = () => {
  const { fetchGallery } = useContext(GalleryContext);
  const [galleryItems, setGalleryItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [currentView, setCurrentView] = useState("masonry");
  const [visibleCount, setVisibleCount] = useState(12);
  const [error, setError] = useState(false);
  const [serverError, setServerError] = useState("");

  /* lightbox */
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIdx, setLbIdx] = useState(0);

  const loadGallery = async () => {
    try {
      const data = await fetchGallery();
      if (Array.isArray(data) && data.length > 0) {
        setGalleryItems(data);
        setError(false);
        setServerError("");
      } else {
        setGalleryItems([]);
        setError(true);
        setServerError("No gallery items available at the moment.");
      }
    } catch {
      setError(true);
      setGalleryItems([]);
      setServerError(
        "Unable to connect to the server. Please try again later.",
      );
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  useEffect(() => {
    if (galleryItems.length > 0) {
      const unique = [
        "All",
        ...new Set(
          galleryItems.map((i) => i.cat || i.category || "Uncategorized"),
        ),
      ];
      setCategories(unique);
    }
  }, [galleryItems]);

  useEffect(() => {
    const list =
      filter === "All"
        ? galleryItems
        : galleryItems.filter(
            (i) => (i.cat || i.category || "Uncategorized") === filter,
          );
    setFiltered(list);
    setVisibleCount(12);
  }, [filter, galleryItems]);

  const visible = filtered.slice(0, visibleCount);

  /* lightbox helpers */
  const openLB = (idx) => {
    setLbIdx(idx);
    setLbOpen(true);
  };
  const closeLB = () => setLbOpen(false);
  const nextLB = () => setLbIdx((i) => (i + 1) % visible.length);
  const prevLB = () =>
    setLbIdx((i) => (i - 1 + visible.length) % visible.length);

  useEffect(() => {
    const handler = (e) => {
      if (!lbOpen) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowRight") nextLB();
      if (e.key === "ArrowLeft") prevLB();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lbOpen, visible.length]);

  const fallback =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3C/svg%3E";
  const getImg = (item) =>
    item.imageUrls?.[0] || item.images?.[0] || item.img || fallback;
  const getCat = (item) => item.cat || item.category || "Uncategorized";

  const filterPills = [
    { key: "All", label: "All", icon: "fa-images" },
    { key: "wooden", label: "Wooden", icon: "fa-tree" },
    { key: "qr", label: "QR Codes", icon: "fa-qrcode" },
    { key: "award", label: "Awards", icon: "fa-trophy" },
    { key: "keyring", label: "Keyrings", icon: "fa-key" },
    { key: "signboard", label: "Signboards", icon: "fa-sign-hanging" },
    { key: "mug", label: "Mugs", icon: "fa-mug-hot" },
    { key: "numberplate", label: "Number Plates", icon: "fa-car" },
  ];
  const activePills = filterPills.filter(
    (p) => p.key === "All" || categories.includes(p.key),
  );

  return (
    <main className="bg-white">
      {/* Lightbox */}
      {lbOpen && visible[lbIdx] && (
        <div
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4"
          onClick={closeLB}
        >
          {/* close */}
          <button
            onClick={closeLB}
            className="absolute top-5 right-5 text-white w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition z-10"
          >
            <i className="fas fa-times text-xl" />
          </button>
          {/* counter */}
          <span className="absolute top-5 left-5 font-sub text-white/70 text-sm bg-white/10 px-3 py-1.5 rounded-full">
            {lbIdx + 1} / {visible.length}
          </span>
          {/* prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevLB();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
          >
            <i className="fas fa-chevron-left text-xl" />
          </button>
          {/* image */}
          <div
            className="max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImg(visible[lbIdx])}
              alt={visible[lbIdx].title}
              className="max-w-full max-h-[75vh] rounded-2xl object-contain mx-auto shadow-2xl"
            />
            <div className="mt-5 text-center bg-white/10 backdrop-blur-md rounded-xl px-6 py-4">
              <p className="font-main text-white text-lg mb-1">
                {visible[lbIdx].title || "Gallery Item"}
              </p>
              <p className="font-sub text-white/60 text-sm capitalize">
                {getCat(visible[lbIdx])}
              </p>
              {visible[lbIdx].desc && (
                <p className="font-sub text-white/70 text-sm mt-2 max-w-lg mx-auto">
                  {visible[lbIdx].desc}
                </p>
              )}
              <a
                href="https://wa.me/9779823939106"
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 mt-4 bg-green-600 hover:bg-green-700 text-white font-sub text-sm font-medium px-6 py-2.5 rounded-xl transition"
              >
                <i className="fa-brands fa-whatsapp" /> Order This
              </a>
            </div>
          </div>
          {/* next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextLB();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition"
          >
            <i className="fas fa-chevron-right text-xl" />
          </button>
        </div>
      )}

      {/* Page hero */}
      <section className="py-10 md:py-14 px-6 md:px-8 lg:px-12 bg-[#f6f2ee] border-b border-gray-100 text-center">
        <div className="container mx-auto max-w-3xl">
          <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-3 block">
            Our Portfolio
          </span>
          <h1 className="font-main text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4">
            Gallery of Creations
          </h1>
          <p className="font-sub text-gray-400 text-[15px] leading-relaxed max-w-xl mx-auto">
            Browse our collection of laser-engraved masterpieces — from
            personalized gifts to corporate signboards.
          </p>
        </div>
      </section>

      {/* Filter + view toggle */}
      <section className="py-6 px-6 md:px-8 lg:px-12 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* pills */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {activePills.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setFilter(p.key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border font-sub text-xs font-medium transition ${
                    filter === p.key
                      ? "bg-[#145faf] text-white border-[#145faf] shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#145faf] hover:text-[#145faf]"
                  }`}
                >
                  <i className={`fas ${p.icon} text-[10px]`} />
                  {p.label}
                </button>
              ))}
            </div>
            {/* right: count + view toggle */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-sub text-sm text-gray-500">
                <span className="font-semibold text-gray-800">
                  {filtered.length}
                </span>{" "}
                items
              </span>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setCurrentView("masonry")}
                  className={`px-3 py-1.5 font-sub text-xs transition ${currentView === "masonry" ? "bg-[#145faf] text-white" : "bg-white text-gray-600 hover:text-[#145faf]"}`}
                >
                  <i className="fas fa-grip-vertical" /> Masonry
                </button>
                <button
                  onClick={() => setCurrentView("grid")}
                  className={`px-3 py-1.5 font-sub text-xs transition ${currentView === "grid" ? "bg-[#145faf] text-white" : "bg-white text-gray-600 hover:text-[#145faf]"}`}
                >
                  <i className="fas fa-th-large" /> Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="py-10 px-4 md:px-8 lg:px-12">
        <div className="container mx-auto">
          {error ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-3xl text-red-300" />
              </div>
              <h3 className="font-main text-xl text-gray-500 mb-2">
                Server Error
              </h3>
              <p className="font-sub text-gray-400 text-sm">{serverError}</p>
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <i className="fas fa-images text-4xl text-gray-200" />
              </div>
              <h3 className="font-main text-xl text-gray-500 mb-2">
                No items in this category
              </h3>
              <button
                onClick={() => setFilter("All")}
                className="bg-[#145faf] text-white font-sub text-sm px-6 py-2.5 rounded-xl hover:bg-[#D93A6A] transition mt-3"
              >
                View All
              </button>
            </div>
          ) : currentView === "masonry" ? (
            <div
              style={{ columns: "2", columnGap: "14px" }}
              className="masonry-wrap"
            >
              {visible.map((item, idx) => (
                <div
                  key={item._id || item.id}
                  onClick={() => openLB(idx)}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100 mb-3 break-inside-avoid"
                  style={{
                    animation: "fadeInUp 0.4s ease both",
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <img
                    src={getImg(item)}
                    alt={item.title || "Gallery"}
                    onError={(e) => (e.target.src = fallback)}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex flex-col justify-end p-4">
                    <span className="font-sub text-[10px] text-white/70 uppercase tracking-wider mb-1 capitalize">
                      {getCat(item)}
                    </span>
                    <h3 className="font-main text-white text-sm leading-tight mb-2">
                      {item.title || "Gallery Item"}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white font-sub text-xs px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <i className="fas fa-eye text-[9px]" /> View
                      </span>
                      <a
                        href="https://wa.me/9779823939106"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-600/90 text-white font-sub text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-green-600 transition"
                      >
                        <i className="fa-brands fa-whatsapp text-[10px]" />{" "}
                        Order
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map((item, idx) => (
                <div
                  key={item._id || item.id}
                  onClick={() => openLB(idx)}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-100"
                  style={{
                    animation: "fadeInUp 0.4s ease both",
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <img
                    src={getImg(item)}
                    alt={item.title || "Gallery"}
                    onError={(e) => (e.target.src = fallback)}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col justify-end p-4">
                    <h3 className="font-main text-white text-sm mb-1">
                      {item.title || "Gallery Item"}
                    </h3>
                    <span className="font-sub text-white/60 text-xs capitalize">
                      {getCat(item)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load more */}
          {filtered.length > visibleCount && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setVisibleCount((v) => v + 8)}
                className="font-sub bg-[#145faf] hover:bg-[#D93A6A] text-white px-8 py-3.5 rounded-xl transition-all hover:shadow-lg flex items-center gap-2 font-medium hover:-translate-y-0.5"
              >
                Load More <i className="fas fa-arrow-down" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section 
      className="py-14 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(to right, var(--primary), #1d4ed8)",
        }}>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                num: "500+",
                label: "Products Created",
                icon: "fa-boxes-stacked",
              },
              {
                num: "5,000+",
                label: "Happy Customers",
                icon: "fa-face-smile",
              },
              { num: "4.9★", label: "Average Rating", icon: "fa-star" },
              {
                num: "6+",
                label: "Years Experience",
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

      {/* CTA */}
      <section className="py-14 bg-[#f6f2eb] border border-gray-100 px-6 text-center">
        <div className="container mx-auto relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06] text-gray-200 text-[300px] font-main leading-none flex items-center justify-center pointer-events-none select-none">
      
          </div>
          <div className="relative z-10">
            <h2 className="font-main text-gray-900 text-2xl md:text-3xl mb-3">
              Want Your Creation Featured Here?
            </h2>
            <p className="font-sub text-gray-400 text-[15px] mb-7 max-w-lg mx-auto">
              Share your order photos with us on WhatsApp and join our gallery
              of happy customers!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://wa.me/9779823939106"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#D93A6A] font-sub font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition hover:shadow-lg hover:-translate-y-0.5"
              >
                <i className="fa-brands fa-whatsapp text-green-500 text-xl" />{" "}
                Order &amp; Get Featured
              </a>
              <a
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#145faf] border border-[#145faf] text-white font-sub font-semibold px-8 py-3.5 rounded-xl hover:bg-[#D93A6A] transition hover:-translate-y-0.5"
                  >
                 <i className="fas fa-store text-xl" /> Browse Products
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 768px) { .masonry-wrap { columns: 3 !important; } }
        @media (min-width: 1024px) { .masonry-wrap { columns: 4 !important; } }
      `}</style>
    </main>
  );
};

export default Gallery;
