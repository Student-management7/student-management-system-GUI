import React, { useState } from 'react';
import { Menu, X, Home, Info, Contact } from 'lucide-react';

const HeaderLogin = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Navigation items
  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Info, label: 'About Us', href: '/about' },
    { icon: Contact, label: 'Contact', href: '/contact' }
  ];

  return (
    <div className="fixed w-full top-0 z-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center gap-2">
                {/* Replace src with your actual logo */}
                <img
              src="/images/logo.png"
              alt="School Management System "
              className="h-12 w-auto"  
            />
                <span className="text-slate-800 text-lg font-semibold hidden md:block">
                  Easy Way Solution
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-slate-600 hover:text-slate-900 p-2 rounded-md transition-colors"
                aria-label="Toggle navigation"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'max-h-screen opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default HeaderLogin;