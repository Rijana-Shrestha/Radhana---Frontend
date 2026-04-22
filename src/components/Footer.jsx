import React from "react";
import { Link } from "react-router-dom";
import { MapPin, PhoneCall, Mail, Clock, ChevronRight } from "lucide-react";

import fonePay from "../../Assets/fonepay.jpeg";
import khalti from "../../Assets/khalti.jpeg";
import cash from "../../Assets/cash1.jpeg";

const Footer = () => {
  return (
    <footer className="bg-[#1a1e29] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/fonts/assets/Logo.png"
                alt="Radhana Art Logo"
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div>
                <h3 className="text-xl font-bold text-yellow-500">
                  Radhana Art
                </h3>
                <p className="text-sm text-gray-400">
                  Laser Engraving • Kathmandu
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Crafting premium laser engravings inspired by the divine love of
              Radha & Krishna.
            </p>

            <div>
              <h4 className="text-xs font-bold text-gray-400 tracking-wider mb-3 uppercase">
                We Accept
              </h4>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white border border-gray-600 px-4 py-3 rounded-lg flex items-center justify-center w-28 h-16">
                  <img
                    src={cash}
                    alt="Cash"
                    className="h-10 w-auto object-contain"
                  />
                </span>
                <span className="bg-white border border-gray-600 px-4 py-3 rounded-lg flex items-center justify-center w-28 h-16">
                  <img
                    src={khalti}
                    alt="Khalti"
                    className="h-10 w-auto object-contain"
                  />
                </span>
                <span className="bg-white border border-gray-600 px-4 py-3 rounded-lg flex items-center justify-center w-28 h-16">
                  <img
                    src={fonePay}
                    alt="Fonepay"
                    className="h-10 w-auto object-contain"
                  />
                </span>
              </div>

              {/* PAN Card Added Here */}
              <div className="mt-4 border border-yellow-500/40 rounded-lg p-3 bg-gray-900/40">
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-wide mb-1">
                  PAN Card Details:
                </p>
                <p className="text-sm font-semibold text-white tracking-widest">
                  {" "}
                  Radhana Enterprises
                </p>
                <p className="text-sm font-semibold text-white tracking-widest">
                  {" "}
                  128464005
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-yellow-500 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Gallery", path: "/gallery" },
                { name: "About Us", path: "/about" },
                { name: "FAQ", path: "/faq" },
                { name: "Contact", path: "/contact" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white flex items-center gap-2 transition"
                  >
                    <ChevronRight size={14} className="text-pink-500" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h3 className="text-lg font-bold text-yellow-500 mb-4">
              Our Products
            </h3>
            <ul className="space-y-2">
              {[
                "Wooden Engravings",
                "Wooden QR Codes",
                "Custom Keyrings",
                "3D Number Plates",
                "Acrylic Awards",
                "ACP Signboards",
                "Neon Lights",
                "Custom Mugs",
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to="/products"
                    className="text-gray-400 hover:text-white flex items-center gap-2 transition"
                  >
                    <ChevronRight size={14} className="text-pink-500" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold text-yellow-500 mb-4">
              Contact Us
            </h3>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="text-green-500 shrink-0 mt-1" size={18} />
                <span className="text-gray-400">
                  Sitapaila, Kathmandu, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall className="text-green-500 shrink-0" size={18} />
                <a
                  href="tel:+9779823939106"
                  className="text-gray-400 hover:text-white transition"
                >
                  +977 9823939106, +977 9746679242
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-green-500 shrink-0" size={18} />
                <a
                  href="mailto:radhanaart@gmail.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  radhanaart@gmail.com
                </a>
              </li>
            </ul>

            <div className="bg-green-600 rounded-lg p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 font-bold mb-3">
                <Clock size={20} />
                Workshop Hours
              </div>
              <div className="text-sm space-y-1 text-green-50">
                <p>Sun - Fri: 10:00 AM - 5:00 PM</p>
                <p>
                  Saturday:{" "}
                  <span className="text-red-500 font-semibold">Closed</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Radhana Art. All rights reserved.
            Inspired by the divine love of Radha & Krishna 🪈
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
