// src/components/Header.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import navLinksData from '@/data/navLinks.json';
import { FaBars, FaTimes } from 'react-icons/fa';
import { iconMap } from '@/utils/iconMap';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);
  const [openDesktopCategory, setOpenDesktopCategory] = useState<string | null>(null);

  // Masaüstü: hover ile alt menü açılır
  // Mobil: kategoriye tıklayınca alt menü açılır

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">HesaplaOnline</Link>
        {/* Masaüstü Menü */}
        <nav className="hidden md:flex gap-6 items-center relative">
          {navLinksData.categories.map((category) => {
            const Icon = iconMap[category.iconName];
            return (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setOpenDesktopCategory(category.name)}
                onMouseLeave={() => setOpenDesktopCategory(null)}
              >
                <button className="flex items-center gap-2 px-3 py-2 font-semibold text-gray-700 hover:text-blue-600 focus:outline-none">
                  {Icon && <Icon className="text-lg" />} {category.name}
                </button>
                {/* Alt Menü */}
                {openDesktopCategory === category.name && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
                    <ul>
                      {category.subLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        {/* Mobil Menü Butonu */}
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label="Menüyü Aç/Kapat"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-fade-in px-4 pb-4">
          {navLinksData.categories.map((category) => {
            const Icon = iconMap[category.iconName];
            const isOpen = openMobileCategory === category.name;
            return (
              <div key={category.name}>
                <button
                  className="w-full flex items-center justify-between gap-2 py-3 px-2 font-semibold text-gray-700 hover:text-blue-600 focus:outline-none"
                  onClick={() => setOpenMobileCategory(isOpen ? null : category.name)}
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2">{Icon && <Icon className="text-lg" />} {category.name}</span>
                  <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                </button>
                {/* Alt Menü */}
                {isOpen && (
                  <ul className="pl-6 pb-2">
                    {category.subLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block py-2 text-gray-700 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      )}
    </header>
  );
}
