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

  // Masaüstü: hover ile alt menü açılır, alt menüye geçince kapanmaz
  // Mobil: kategoriye tıklayınca alt menü açılır

  const handleMouseEnter = (category: string) => {
    setOpenDesktopCategory(category);
  };
  const handleMouseLeave = () => {
    // Sadece alt menüde hover yoksa kapat
    setTimeout(() => {
      if (!isSubMenuHovered) setOpenDesktopCategory(null);
    }, 100);
  };

  // Kategoriye tıklanınca ilgili kategoriye yönlendir
  const getCategoryHref = (categoryName: string) => {
    return '/' + categoryName.toLowerCase();
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">Online Hesaplama</Link>
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
                className="px-3 py-2 font-medium text-gray-700 hover:text-blue-600 focus:outline-none bg-transparent border-none cursor-pointer"
              >
                {turkceBaslik(category.name)}
              </Link>
              {/* Alt Menü */}
              {openDesktopCategory === category.name && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  style={{ maxHeight: '336px', overflowY: 'auto' }} // 7*48px = 336px
                  onMouseEnter={() => setIsSubMenuHovered(true)}
                  onMouseLeave={() => { setIsSubMenuHovered(false); setOpenDesktopCategory(null); }}
                >
                  <ul className="py-2">
                    {category.subLinks.map((link, idx) => (
                      <li key={link.href} style={idx >= 7 ? { display: 'none' } : {}}>
                        <Link
                          href={link.href}
                          className="block px-5 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
                        >
                          {turkceBaslik(link.name)}
                        </Link>
                      </li>
                    ))}
                    {/* Fazla linkler için scroll */}
                    {category.subLinks.length > 7 && (
                      <>
                        {category.subLinks.slice(7).map((link) => (
                          <li key={link.href} style={{ display: 'list-item' }}>
                            <Link
                              href={link.href}
                              className="block px-5 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition"
                            >
                              {turkceBaslik(link.name)}
                            </Link>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>
        {/* Mobil Menü Butonu */}
        <button
          className="md:hidden text-2xl text-gray-700 focus:outline-none"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
          aria-label="Menüyü Aç/Kapat"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>
      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-fade-in px-4 pb-4">
          {navLinksData.categories.map((category) => {
            const isOpen = openMobileCategory === category.name;
            return (
              <div key={category.name}>
                <button
                  className="w-full flex items-center justify-between gap-2 py-3 px-2 font-medium text-gray-700 hover:text-blue-600 focus:outline-none bg-transparent border-none cursor-pointer"
                  onClick={() => setOpenMobileCategory(isOpen ? null : category.name)}
                  aria-expanded={isOpen}
                >
                  <span>{turkceBaslik(category.name)}</span>
                  <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
                </button>
                {/* Alt Menü */}
                {isOpen && (
                  <ul className="pl-6 pb-2" style={{ maxHeight: '336px', overflowY: 'auto' }}>
                    {category.subLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block py-2 text-gray-700 hover:text-blue-600"
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
        </nav>
      )}
    </header>
  );
}
