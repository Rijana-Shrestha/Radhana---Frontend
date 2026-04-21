import React, { useState, useRef } from "react";
import { axiosInstance } from "../utils/axios";

const Contact = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    attachment: null,
  });
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "message") setCharCount(value.length);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFormData({ ...formData, attachment: file });
      setAttachmentPreview({
        name: file.name,
        size: (file.size / 1024).toFixed(2),
        type: file.type,
      });
      setError("");
    }
  };

  const removeAttachment = () => {
    setFormData({ ...formData, attachment: null });
    setAttachmentPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("subject", formData.subject);
      submitData.append("message", formData.message);
      if (formData.attachment)
        submitData.append("attachment", formData.attachment);
      const res = await axiosInstance.post("/contact/", submitData);
      console.log("Contact form submitted:", res.data);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        attachment: null,
      });
      setAttachmentPreview(null);
      setCharCount(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const subjects = [
    { value: "", label: "Select Subject *" },
    { value: "general", label: "💬 General Inquiry" },
    { value: "custom", label: "🎨 Custom Order" },
    { value: "bulk", label: "📦 Bulk Order" },
    { value: "corporate", label: "🏢 Corporate Gifting" },
    { value: "support", label: "🛠 Support / Issue" },
  ];

  const contactCards = [
    {
      icon: "fas fa-phone",
      color: "text-[#145faf]",
      bg: "bg-blue-50 border-blue-100",
      title: "Phone",
      value: "+977 9823939106"+ "\n" + "+977 9746679242",
      sub: "Monday – Friday, 10 AM – 6 PM",
      href: "tel:+9779823939106",
    },
    {
      icon: "fas fa-envelope",
      color: "text-[#D93A6A]",
      bg: "bg-pink-50 border-pink-100",
      title: "Email",
      value: "info@radhanaart.com",
      sub: "We respond within 24 hours",
      href: "mailto:info@radhanaart.com",
    },
    {
      icon: "fa-brands fa-whatsapp",
      color: "text-green-600",
      bg: "bg-green-50 border-green-100",
      title: "WhatsApp",
      value: "+977 9823939106" + "\n" + "+977 9746679242",
      sub: "Chat with us anytime",
      href: "https://wa.me/9779823939106",
    },
    {
      icon: "fas fa-location-dot",
      color: "text-amber-500",
      bg: "bg-amber-50 border-amber-100",
      title: "Location",
      value: "Kathmandu, Nepal",
      sub: "Metropolitan Area",
      href: "https://maps.google.com/?q=Kathmandu,Nepal",
    },
  ];

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="py-10 md:py-14 px-6 text-center bg-[#f6f2eb] border-b border-gray-100">
        <div className="container mx-auto max-w-2xl">
          <span className="font-sub text-[#D93A6A] text-sm font-semibold uppercase tracking-widest mb-3 block">
            Get in Touch
          </span>
          <h1 className="font-main text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-4">
            We'd Love to Hear From You
          </h1>
          <p className="font-sub text-gray-400 text-[15px] leading-relaxed">
            Have a custom order idea? A question? Or just want to say hi? Our
            team is here to help.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-10 px-6 md:px-8 lg:px-12 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={`${card.bg} border rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block`}
              >
                <div
                  className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm`}
                >
                  <i className={`${card.icon} ${card.color} text-xl`} />
                </div>
                <h3 className="font-sub font-semibold text-gray-800 mb-1">
                  {card.title}
                </h3>
                <p
                  className={`font-sub text-sm font-medium ${card.color} mb-0.5`}
                >
                  {card.value}
                </p>
                <p className="font-sub text-xs text-gray-400">{card.sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + map */}
      <section className="py-12 px-6 md:px-8 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* ── FORM ── */}
            <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm p-8 border border-gray-50">
              <h2 className="font-main text-2xl text-[#145faf] mb-2">
                Send Us a Message
              </h2>
              <p className="font-sub text-gray-400 text-sm mb-7">
                Fill out the form below and we'll get back to you shortly.
              </p>

              {/* success */}
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-check text-green-600 text-lg" />
                  </div>
                  <div>
                    <p className="font-sub font-semibold text-green-800 text-sm">
                      Message Sent!
                    </p>
                    <p className="font-sub text-xs text-green-600">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* error */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-red-600" />
                  </div>
                  <p className="font-sub text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sub text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                      <i className="fas fa-user text-[#145faf] mr-1"></i>Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Sita Rana"
                      className="font-sub w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-[#145faf] focus:bg-white transition text-sm text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="font-sub text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                      <i className="fas fa-phone text-[#145faf] mr-1"></i>Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+977 9800000000"
                      className="font-sub w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-[#145faf] focus:bg-white transition text-sm text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sub text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    <i className="fas fa-envelope text-[#145faf] mr-1"></i>Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="font-sub w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-[#145faf] focus:bg-white transition text-sm text-gray-800"
                  />
                </div>

                <div>
                  <label className="font-sub text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    <i className="fas fa-heading text-[#145faf] mr-1"></i>Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="font-sub w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-[#145faf] focus:bg-white transition text-sm text-gray-700 cursor-pointer"
                  >
                    {subjects.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-sub text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    <i className="fas fa-message text-[#145faf] mr-1"></i>Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your project, what you need, size, quantity, timeline..."
                    className="font-sub w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-[#145faf] focus:bg-white transition resize-none text-sm text-gray-800"
                  />
                  <p className="font-sub text-[10px] text-gray-400 text-right mt-1">
                    {charCount} / 500
                  </p>
                </div>

                {/* file upload */}
                <div>
                  <label className="font-sub text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                    <i className="fas fa-paperclip text-[#145faf] mr-1"></i>Attachment (Optional)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  {!attachmentPreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center gap-2 text-gray-400 hover:border-[#145faf] hover:text-[#145faf] transition cursor-pointer bg-gray-50 hover:bg-blue-50"
                    >
                      <i className="fas fa-cloud-arrow-up text-2xl" />
                      <span className="font-sub text-sm font-medium">
                        Click to attach or drag files here
                      </span>
                      <span className="font-sub text-xs">
                        JPG, PNG, PDF up to 10MB
                      </span>
                    </button>
                  ) : (
                    <div className="border-2 border-gray-100 rounded-xl p-4 bg-gray-50 flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#145faf]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-file text-[#145faf]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sub font-semibold text-gray-800 truncate text-sm">
                          {attachmentPreview.name}
                        </p>
                        <p className="font-sub text-xs text-gray-400">
                          {attachmentPreview.size} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="w-8 h-8 flex items-center justify-center hover:bg-red-100 rounded-lg transition text-red-400"
                      >
                        <i className="fas fa-times" />
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#145faf] hover:bg-[#D93A6A] text-white py-3.5 rounded-xl font-sub font-semibold transition-all hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" /> Send Message
                    </>
                  )}
                </button>

                <p className="font-sub text-xs text-gray-400 text-center">
                  Or reach us directly on{" "}
                  <a
                    href="https://wa.me/9779823939106"
                    target="_blank"
                    rel="noreferrer"
                    className="text-green-600 font-medium hover:underline"
                  >
                    <i className="fa-brands fa-whatsapp" /> WhatsApp
                  </a>
                </p>
              </form>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map placeholder / working hours */}
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-50">
                <h3 className="font-main text-[#145faf] text-xl mb-4">
                  Working Hours
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      day: "Sunday – Friday",
                      time: "10:00 AM – 5:00 PM",
                      open: true,
                    },
                    { day: "Saturday", time: "Closed", open: false },
                  ].map((h) => (
                    <div
                      key={h.day}
                      className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0"
                    >
                      <span className="font-sub text-sm text-gray-600">
                        {h.day}
                      </span>
                      <span
                        className={`font-sub text-sm font-semibold ${h.open ? "text-[#145faf]" : "text-gray-300"}`}
                      >
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location map embed placeholder */}
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-50">
                <div className="bg-gray-50 h-48 flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center">
                    <i className="fas fa-location-dot text-[#D93A6A] text-2xl" />
                  </div>
                  <div className="text-center">
                    <p className="font-main text-gray-700 text-lg">
                      Kathmandu, Nepal
                    </p>
                    <p className="font-sub text-gray-400 text-sm">
                      Metropolitan Area
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com/?q=Kathmandu,Nepal"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#145faf] text-white font-sub text-xs font-medium px-4 py-2 rounded-xl hover:bg-[#D93A6A] transition flex items-center gap-1.5"
                  >
                    <i className="fas fa-map-location-dot" /> Open in Maps
                  </a>
                </div>
              </div>

              {/* Social / payment */}
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-50">
                <h3 className="font-main text-[#145faf] text-lg mb-4">
                  We Accept
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Cash", "Khalti", "FonePay"].map(
                    (pay) => (
                      <span
                        key={pay}
                        className="font-sub text-xs font-medium bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-full"
                      >
                        {pay}
                      </span>
                    ),
                  )}
                </div>
                <div className="border-t border-gray-50 mt-4 pt-4">
                  <h3 className="font-main text-[#145faf] text-lg mb-3">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {[
                      {
                        icon: "fa-brands fa-facebook",
                        color: "text-blue-600",
                        bg: "bg-blue-50",
                        href: "https://www.facebook.com/share/1Go1y2doCB/?mibextid=wwXIfr",
                      },
                      {
                        icon: "fa-brands fa-instagram",
                        color: "text-pink-500",
                        bg: "bg-pink-50",
                        href: "https://www.instagram.com/radhanaart?igsh=NWk0ejEzNmExd3l0",
                      },
                      {
                        icon: "fa-brands fa-tiktok",
                        color: "text-gray-800",
                        bg: "bg-gray-50",
                        href: "https://www.tiktok.com/@radhanaart?_r=1&_t=ZS-95aNwJdy5uj",
                      },
                      {
                        icon: "fa-brands fa-youtube",
                        color: "text-red-600",
                        bg: "bg-red-50",
                        href: "https://youtube.com/@radhanaart?si=CWYFvbR-ZuuIK-bq",
                      },
                    ].map((s, i) => (
                      <a
                        key={i}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center hover:scale-110 transition-transform`}
                      >
                        <i className={`${s.icon} ${s.color}`} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#f6f2ee] border border-gray-100 px-6 text-center mt-4">
        <div className="container mx-auto">
          <h2 className="font-main text-gray-900 text-2xl md:text-3xl mb-3">
            Prefer to Order Directly?
          </h2>
          <p className="font-sub text-gray-500 text-[15px] mb-6 max-w-lg mx-auto">
            Message us on WhatsApp for the fastest response. Share your design
            idea and we'll get started right away!
          </p>
          <a
            href="https://wa.me/9779823939106"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-sub font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <i className="fa-brands fa-whatsapp text-xl" /> Chat on WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
};

export default Contact;
