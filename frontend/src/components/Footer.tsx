import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ServicePro
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Your trusted partner for all home and vehicle services. 
              Book skilled professionals for electricians, carpenters, 
              plumbers, and more with just a few clicks.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Book Service
                </a>
              </li>
              <li>
                <a href="/my-bookings" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  My Bookings
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-600 hover:text-blue-600 text-sm transition-colors">
                  Help & Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600 text-sm">
                📞 +91 98765 43210
              </li>
              <li className="text-gray-600 text-sm">
                ✉️ support@servicepro.com
              </li>
              <li className="text-gray-600 text-sm">
                🕒 24/7 Customer Support
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 ServicePro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
