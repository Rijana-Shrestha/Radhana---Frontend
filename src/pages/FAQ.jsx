import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const FAQ = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const faqs = [
    {
      category: "Orders & Pricing",
      icon: "fa-tag",
      color: "text-[#145faf]",
      bg: "bg-blue-50",
      items: [
        {
          q: "What is the turnaround time for orders?",
          a: "Standard orders are completed within 2–3 days. Express orders (24 hours) are available for an additional charge.",
        },
        {
          q: "Do you offer bulk discounts?",
          a: "Yes! We provide tiered bulk discounts for orders of 50+ items. Contact us on WhatsApp for a custom quote.",
        },
        {
          q: "What are your price ranges?",
          a: "Prices vary by product type. Personal items start from Rs. 300, while custom projects can range from Rs. 500–5,000+. Visit our Products page for detailed pricing.",
        },
        {
          q: "Do you ship outside Kathmandu?",
          a: "Currently, we deliver within Kathmandu valley. For outside shipments, we can arrange through courier services.",
        },
      ],
    },
    {
      category: "Custom Design",
      icon: "fa-palette",
      color: "text-[#D93A6A]",
      bg: "bg-pink-50",
      items: [
        {
          q: "Can I customize the design?",
          a: "Absolutely! We create custom designs based on your requirements. You can provide photos, text, logos, or descriptions.",
        },
        {
          q: "How many design revisions are included?",
          a: "Unlimited design revisions are included until you're 100% satisfied with the preview.",
        },
        {
          q: "What file formats do you accept?",
          a: "We accept JPG, PNG, PDF, SVG, AI, and EPS files. If you don't have a digital file, we can also work from physical photos or sketches.",
        },
        {
          q: "How long does the design process take?",
          a: "Typically, we send the first design preview within 24 hours of receiving your requirements.",
        },
      ],
    },
    {
      category: "Payment & Checkout",
      icon: "fa-credit-card",
      color: "text-green-600",
      bg: "bg-green-50",
      items: [
        {
          q: "What payment methods do you accept?",
          a: "We accept eSewa, Khalti, FonePay, and direct bank transfers. Payment is collected before we start production.",
        },
        {
          q: "Is it safe to pay online through your website?",
          a: "Yes, our payment gateway is encrypted and secure. We never store your card information.",
        },
        {
          q: "Do you offer payment plans for bulk orders?",
          a: "Yes! For large orders, we can arrange installment payment options. Contact us for details.",
        },
        {
          q: "Can I cancel my order?",
          a: "Orders can be cancelled before production starts with a full refund. Once production begins, a 30% cancellation fee applies.",
        },
      ],
    },
    {
      category: "Products & Materials",
      icon: "fa-gem",
      color: "text-amber-500",
      bg: "bg-amber-50",
      items: [
        {
          q: "What materials can be engraved?",
          a: "We work with wood, acrylic, leather, glass, metal, and marble. Each material produces different aesthetic results.",
        },
        {
          q: "Is the engraving permanent?",
          a: "Yes! Laser engraving creates permanent marks that won't fade, peel, or wear off with time.",
        },
        {
          q: "Can you engrave on curved surfaces?",
          a: "Yes, we can engrave on slightly curved surfaces. Please check with us if you have a specific curved item.",
        },
      ],
    },
    {
      category: "Shipping & Delivery",
      icon: "fa-truck",
      color: "text-purple-600",
      bg: "bg-purple-50",
      items: [
        {
          q: "How is the product packaged?",
          a: "All items are carefully packaged in protective boxes with bubble wrap to ensure safe delivery.",
        },
        {
          q: "Can I track my delivery?",
          a: "Yes! You'll receive tracking information and updates via WhatsApp and email.",
        },
        {
          q: "What if my order arrives damaged?",
          a: "Please report any damage within 24 hours. We'll replace or refund the damaged item immediately.",
        },
        {
          q: "Do you offer same-day delivery?",
          a: "Same-day delivery is available for orders placed before 10 AM within Kathmandu valley for an additional fee.",
        },
      ],
    },
  ];

  const allCategories = ["All", ...faqs.map((f) => f.category)];

  const filteredFaqs = useMemo(() => {
    return faqs
      .filter(
        (section) =>
          activeCategory === "All" || section.category === activeCategory,
      )
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            !searchTerm ||
            item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.a.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchTerm, activeCategory]);

  const totalItems = filteredFaqs.reduce((sum, s) => sum + s.items.length, 0);

  const toggleAccordion = (idx) => {
    setOpenAccordion(openAccordion === idx ? null : idx);
  };

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-10 md:py-14 px-6 text-center bg-[#f6f2ee] border-b border-gray-100">
        <div className="container mx-auto max-w-2xl">
          <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-3 block">
            Help Centre
          </span>
          <h1 className="font-main text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="font-sub text-gray-400 text-[15px] leading-relaxed max-w-lg mx-auto">
            Find quick answers to the most common questions about our products,
            ordering process, and delivery.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 px-6 md:px-8 lg:px-12 bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto max-w-xl">
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOpenAccordion(null);
              }}
              placeholder="Search FAQs… e.g. 'delivery', 'payment', 'custom design'"
              className="font-sub w-full border-2 border-gray-100 bg-gray-50 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-[#145faf] focus:bg-white transition text-sm text-gray-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category tabs + content */}
      <section className="py-10 px-6 md:px-8 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          <div className="flex gap-4">
            {/* Left: Category tabs (desktop) */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
                <p className="font-sub text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Categories
                </p>
                {allCategories.map((cat) => {
                  const section = faqs.find((f) => f.category === cat);
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setOpenAccordion(null);
                      }}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-sub text-sm transition mb-1 ${
                        isActive
                          ? "bg-[#145faf] text-white font-semibold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#145faf]"
                      }`}
                    >
                      {section && (
                        <i
                          className={`fas ${section.icon} text-xs ${isActive ? "text-white" : section.color}`}
                        />
                      )}
                      {!section && (
                        <i
                          className={`fas fa-list text-xs ${isActive ? "text-white" : "text-gray-400"}`}
                        />
                      )}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right: FAQ list */}
            <div className="flex-1 min-w-0">
              {/* Mobile category pills */}
              <div className="flex flex-wrap gap-2 mb-6 lg:hidden">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setOpenAccordion(null);
                    }}
                    className={`font-sub text-xs font-medium px-4 py-2 rounded-full border transition ${
                      activeCategory === cat
                        ? "bg-[#145faf] text-white border-[#145faf]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#145faf] hover:text-[#145faf]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* result count */}
              <div className="mb-5 flex items-center justify-between">
                <p className="font-sub text-sm text-gray-400">
                  {totalItems > 0 ? (
                    <>
                      <span className="font-semibold text-gray-700">
                        {totalItems}
                      </span>{" "}
                      answer{totalItems !== 1 ? "s" : ""} found
                    </>
                  ) : (
                    "No results found"
                  )}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="font-sub text-xs text-[#D93A6A] hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {filteredFaqs.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-search text-3xl text-gray-200" />
                  </div>
                  <h3 className="font-main text-xl text-gray-500 mb-2">
                    No results found
                  </h3>
                  <p className="font-sub text-gray-400 text-sm mb-5">
                    Try a different search term or browse all categories
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("All");
                    }}
                    className="bg-[#145faf] text-white font-sub text-sm px-6 py-2.5 rounded-xl hover:bg-[#D93A6A] transition"
                  >
                    View All FAQs
                  </button>
                </div>
              ) : (
                filteredFaqs.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="mb-8">
                    {/* section header */}
                    <div
                      className={`flex items-center gap-3 mb-4 p-3 ${section.bg} rounded-xl`}
                    >
                      <div
                        className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm`}
                      >
                        <i
                          className={`fas ${section.icon} ${section.color} text-sm`}
                        />
                      </div>
                      <h2 className="font-main text-lg text-gray-800">
                        {section.category}
                      </h2>
                      <span className="ml-auto font-sub text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">
                        {section.items.length}
                      </span>
                    </div>

                    {/* items */}
                    <div className="space-y-2">
                      {section.items.map((item, itemIdx) => {
                        const uniqueIdx = `${sectionIdx}-${itemIdx}`;
                        const isOpen = openAccordion === uniqueIdx;
                        return (
                          <div
                            key={uniqueIdx}
                            className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                              isOpen
                                ? "border-[#145faf]/30 shadow-md"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            <button
                              onClick={() => toggleAccordion(uniqueIdx)}
                              className="w-full text-left px-5 py-4 flex items-center justify-between gap-4"
                            >
                              <h3
                                className={`font-sub font-semibold text-sm pr-4 transition-colors ${isOpen ? "text-[#145faf]" : "text-gray-800"}`}
                              >
                                {item.q}
                              </h3>
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                                  isOpen
                                    ? "bg-[#145faf] text-white rotate-180"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                <i className="fas fa-chevron-down text-xs" />
                              </div>
                            </button>
                            {isOpen && (
                              <div className="px-5 pb-5 border-t border-gray-50">
                                <p className="font-sub text-gray-500 text-sm leading-relaxed pt-3">
                                  {item.a}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-12 px-6 md:px-8 lg:px-12 bg-[#f6f2ee] border-t border-gray-100">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="font-main text-2xl md:text-3xl text-gray-800 mb-2">
              Still Have Questions?
            </h2>
            <p className="font-sub text-gray-400 text-[15px]">
              Can't find the answer you're looking for? Our friendly team is
              happy to help.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <a
              href="https://wa.me/9779823939106"
              target="_blank"
              rel="noreferrer"
              className="bg-green-50 border-2 border-green-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 block"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <i className="fa-brands fa-whatsapp text-green-600 text-2xl" />
              </div>
              <h4 className="font-sub font-semibold text-gray-800 mb-1">
                WhatsApp
              </h4>
              <p className="font-sub text-green-600 text-sm font-medium">
                Chat with us anytime
              </p>
              <p className="font-sub text-xs text-gray-400 mt-1">
                +977 9823939106
              </p>
            </a>
            <a
              href="mailto:info@radhanaart.com"
              className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 block"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <i className="fas fa-envelope text-[#145faf] text-2xl" />
              </div>
              <h4 className="font-sub font-semibold text-gray-800 mb-1">
                Email
              </h4>
              <p className="font-sub text-[#145faf] text-sm font-medium">
                Send us an email
              </p>
              <p className="font-sub text-xs text-gray-400 mt-1">
                info@radhanaart.com
              </p>
            </a>
            <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                <i className="fas fa-phone text-amber-500 text-2xl" />
              </div>
              <h4 className="font-sub font-semibold text-gray-800 mb-1">
                Phone
              </h4>
              <p className="font-sub text-amber-500 text-sm font-medium">
                Call us
              </p>
              <p className="font-sub text-xs text-gray-400 mt-1">
                +977 9823939106
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#145faf] hover:bg-[#D93A6A] text-white font-sub font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <i className="fas fa-envelope" /> Go to Contact Page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQ;
