import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand Info */}
          <div>
            <h2 className="text-3xl font-playfair font-bold text-white mb-6">
              POWERPLAY <span className="text-green-600">TURF</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Midnapore's premier sports destination. Book your slot for
              Cricket, Football, and Badminton today. Experience world-class
              facilities and pro-level turf.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wider">
              QUICK LINKS
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-green-500 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/facilities"
                  className="hover:text-green-500 transition-colors duration-300"
                >
                  Our Facilities
                </Link>
              </li>
              <li>
                <Link
                  to="/reviews"
                  className="hover:text-green-500 transition-colors duration-300"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-green-500 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white tracking-wider">
              GET IN TOUCH
            </h3>
            <div className="text-gray-400 text-sm space-y-4">
              <p className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-600 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  Jamunabali, Abash, Midnapore,
                  <br />
                  West Bengal, 721101
                </span>
              </p>
              <p className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+91 9153760277</span>
              </p>
              <p className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>powerplayturf@gmail.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Divider & Bottom Bar */}
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} PowerPlay Turf. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-500 hover:text-green-500 transition-colors"
            >
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-green-500 transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.409-.06 3.809-.06zm0-1.565c-2.644 0-2.963.01-4.029.058-1.096.05-1.844.225-2.527.49-1.056.41-1.952.906-2.846 1.8-1.314 1.314-1.928 2.37-2.338 3.426-.265.683-.44 1.431-.49 2.527-.048 1.066-.058 1.385-.058 4.029 0 2.644.01 2.963.058 4.029.05 1.096.225 1.844.49 2.527.49.41 1.056.906 1.952 1.8 2.846 1.314 1.314 2.37 1.928 3.426 2.338.683.265 1.431.44 2.527.49 1.066.048 1.385.058 4.029.058 2.644 0 2.963-.01 4.029-.058 1.096-.05 1.844-.225 2.527-.49 1.056-.41 1.952-.906 2.846-1.8 1.314-1.314 1.928-2.37 2.338-3.426.265-.683.44-1.431.49-2.527.048-1.066.058-1.385.058-4.029 0-2.644-.01-2.963-.058-4.029-.05-1.096-.225-1.844-.49-2.527-.41-1.056-.906-1.952-1.8-2.846-1.314-1.314-2.37-1.928-3.426-2.338-.683-.265-.44-1.431-.49-2.527-.048-1.066-.058-1.385-.058-4.029zM12.315 12a4.535 4.535 0 110-9.07 4.535 4.535 0 010 9.07zm0-7.404a2.87 2.87 0 100 5.74 2.87 2.87 0 000-5.74zm5.742-1.092a1.066 1.066 0 11-2.132 0 1.066 1.066 0 012.132 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
