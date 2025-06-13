// src/components/Header.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import navLinksData from '@/data/navLinks.json';

// Türkçeleştirme ve 'Hesaplama' kelimesini kaldırma fonksiyonu
function turkceBaslik(str: string) {
  return str
    .replace(/Hesaplama/gi, '')
    .replace(/Hesaplayıcı/gi, '')
    .replace(/Hesaplayici/gi, '')
    .replace(/Hesaplaması/gi, '')
    .replace(/Hesaplamasi/gi, '')
    .replace(/Hesaplamaları/gi, '')
    .replace(/Hesaplamalari/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/I/g, 'İ')
    .replace(/i/g, 'i')
    .replace(/C/g, 'Ç')
    .replace(/c/g, 'ç')
    .replace(/G/g, 'Ğ')
    .replace(/g/g, 'ğ')
    .replace(/O/g, 'Ö')
    .replace(/o/g, 'ö')
    .replace(/S/g, 'Ş')
    .replace(/s/g, 'ş')
    .replace(/U/g, 'Ü')
    .replace(/u/g, 'ü')
    .replace(/\b([A-Z])([a-z]+)/g, (m, p1, p2) => p1 + p2.toLowerCase())
    .replace(/Saglik/g, 'Sağlık')
    .replace(/Kredi/g, 'Kredi')
    .replace(/Muhasebe/g, 'Muhasebe')
    .replace(/Finans/g, 'Finans')
    .replace(/Vergi/g, 'Vergi')
    .replace(/Matematik/g, 'Matematik')
    .replace(/Egitim/g, 'Eğitim')
    .replace(/Sinav/g, 'Sınav')
    .replace(/Otomobil/g, 'Otomobil')
    .replace(/Yatirim/g, 'Yatırım')
    .replace(/Tasarruf/g, 'Tasarruf')
    .replace(/Toplama/g, 'Toplama');
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileCategory, setOpenMobileCategory] = useState<string | null>(null);
  const [openDesktopCategory, setOpenDesktopCategory] = useState<string | null>(null);
  const [isSubMenuHovered, setIsSubMenuHovered] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Masaüstü: hover ile alt menü açılır, alt menüye geçince kapanmaz
  // Mobil: kategoriye tıklayınca alt menü açılır

  const handleMouseEnter = (category: string) => {
    if (timeoutId) clearTimeout(timeoutId);
    setOpenDesktopCategory(category);
    setIsSubMenuHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      if (!isSubMenuHovered) {
        setOpenDesktopCategory(null);
      }
    }, 300);
    setTimeoutId(timeout);
  };

  const handleSubMenuMouseLeave = () => {
    setIsSubMenuHovered(false);
    const timeout = setTimeout(() => {
      setOpenDesktopCategory(null);
    }, 300);
    setTimeoutId(timeout);
  };

  // Kategoriye tıklanınca ilgili kategoriye yönlendir
  const getCategoryHref = (categoryName: string) => {
    return '/' + categoryName.toLowerCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          Online Hesaplama
        </Link>
        {/* Masaüstü Menü */}
        <nav className="hidden md:flex gap-6 items-center relative">
          {navLinksData.categories.map((category) => (
            <div
              key={category.name}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(category.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={getCategoryHref(category.name)}
                className="px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition-colors focus:outline-none bg-transparent border-none cursor-pointer"
              >
                {turkceBaslik(category.name)}
              </Link>
              {/* Alt Menü */}
              {openDesktopCategory === category.name && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-white border border-gray-100 rounded-lg shadow-lg z-50"
                  style={{ maxHeight: '400px', overflowY: 'auto' }}
                  onMouseEnter={() => setIsSubMenuHovered(true)}
                  onMouseLeave={handleSubMenuMouseLeave}
                >
                  <ul className="py-2">
                    {category.subLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block px-5 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
                        >
                          {turkceBaslik(link.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
        {/* Mobil Menü Butonu */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none transition-colors"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label="Menüyü Aç/Kapat"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 shadow-sm animate-fade-in">
          <div className="max-w-5xl mx-auto px-4">
            {navLinksData.categories.map((category) => {
              const isOpen = openMobileCategory === category.name;
              return (
                <div key={category.name} className="border-b border-gray-100 last:border-b-0">
                  <button
                    className="w-full flex items-center justify-between gap-2 py-4 px-2 font-medium text-gray-700 hover:text-blue-600 focus:outline-none bg-transparent border-none cursor-pointer transition-colors"
                    onClick={() => setOpenMobileCategory(isOpen ? null : category.name)}
                    aria-expanded={isOpen}
                  >
                    <span>{turkceBaslik(category.name)}</span>
                    <span className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                  </button>
                  {/* Alt Menü */}
                  {isOpen && (
                    <ul className="pl-6 pb-4 space-y-2">
                      {category.subLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="block py-2 text-gray-600 hover:text-blue-600 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {turkceBaslik(link.name)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
