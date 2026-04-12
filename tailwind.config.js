/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          600: "#145faf",
          900: "#1e40af",
        },
        accent: {
          50: "#fdf2f8",
          100: "#fce7f3",
          600: "#D93A6A",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          600: "#16a34a",
          900: "#15803d",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef9c3",
          600: "#f59e0b",
          900: "#92400e",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          600: "#ef4444",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,.07)",
        md: "0 4px 16px rgba(0,0,0,.1)",
        lg: "0 20px 60px rgba(0,0,0,.2)",
        xl: "0 8px 32px rgba(0,0,0,.3)",
      },
      letterSpacing: {
        wider: "0.1em",
        widest: ".04em",
      },
      zIndex: {
        50: "50",
        200: "200",
        500: "500",
      },
    },
  },
  plugins: [],
};
