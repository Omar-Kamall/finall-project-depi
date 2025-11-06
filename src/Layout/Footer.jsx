import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlinePhone,
  HiMail,
} from "react-icons/hi";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700">
      {/* Middle Section - Information Columns */}
      <div className="bg-gray-100 !py-8 !px-4 border-t border-gray-200">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !gap-8 lg:!gap-6">
            {/* Do You Need Help? */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 !mb-4">
                Do You Need Help?
              </h3>
              <p className="text-sm text-gray-600 !mb-4">
                If you have any question or want us to help you with anything contact us and we will help you.
              </p>
              <div className="!mb-4">
                <div className="flex items-start !gap-2 !mb-2">
                  <HiOutlinePhone className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Monday-Friday: 08am-9pm</p>
                    <p className="text-lg font-bold text-gray-800">0 800 300-353</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-start gap-2">
                  <HiMail className="text-gray-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-600">Need help with your order?</p>
                    <Link
                      to="mailto:info@example.com"
                      className="text-gray-800 hover:text-purple-600"
                    >
                      info@example.com
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Make Money with Us */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 !mb-4">
                Make Money with Us
              </h3>
              <ul className="!space-y-2">
                <li>
                  <Link
                    to="/sell"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Sell on Grogin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sell-services"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Sell Your Services on Grogin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sell-business"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Sell on Grogin Business
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sell-apps"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Sell Your Apps on Grogin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/affiliate"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Become an Affiliate
                  </Link>
                </li>
                <li>
                  <Link
                    to="/advertise"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Advertise Your Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/publish"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Sell-Publish with Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vendor"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Become an Blowwe Vendor
                  </Link>
                </li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 !mb-4">
                Let Us Help You
              </h3>
              <ul className="!space-y-2">
                <li>
                  <Link
                    to="/accessibility"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Accessibility Statement
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Your Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Returns & Replacements
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Shipping Rates & Policies
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Refund and Returns Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Cookie Settings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get to Know Us */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 !mb-4">
                Get to Know Us
              </h3>
              <ul className="!space-y-2 !mb-6">
                <li>
                  <Link
                    to="/careers"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Careers for Grogin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    About Grogin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/investor"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Investor Relations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/devices"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Grogin Devices
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reviews"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Customer reviews
                  </Link>
                </li>
                <li>
                  <Link
                    to="/responsibility"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Social Responsibility
                  </Link>
                </li>
                <li>
                  <Link
                    to="/locations"
                    className="text-sm text-gray-600 hover:text-purple-600"
                  >
                    Store Locations
                  </Link>
                </li>
              </ul>

              {/* Social Media */}
              <div>
                <p className="text-sm text-gray-600 !mb-3">Follow us on social media:</p>
                <div className="flex !gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-gray-300 rounded bg-white flex items-center justify-center hover:border-purple-600 transition-colors"
                  >
                    <FaFacebook className="text-gray-700 text-lg" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-gray-300 rounded bg-white flex items-center justify-center hover:border-purple-600 transition-colors"
                  >
                    <FaTwitter className="text-gray-700 text-lg" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-gray-300 rounded bg-white flex items-center justify-center hover:border-purple-600 transition-colors"
                  >
                    <FaInstagram className="text-gray-700 text-lg" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-gray-300 rounded bg-white flex items-center justify-center hover:border-purple-600 transition-colors"
                  >
                    <FaLinkedin className="text-gray-700 text-lg" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
