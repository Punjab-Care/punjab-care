// src/components/Footer.jsx
import React from "react";

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-50 border-t mt-10 py-6 text-center">
      <button
        type="button"
        onClick={() => onNavigate("about")}
        className="text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors underline-offset-4 hover:underline cursor-pointer"
      >
        About Us
      </button>

      <p className="text-xs text-gray-500 mt-4">
        © {new Date().getFullYear()} Punjab Care. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
