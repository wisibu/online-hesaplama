// src/components/Header.tsx
"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import navLinks from '@/data/navLinks.json';
import * as Icons from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setActiveCategory(null);
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            HesaplaOnline
          </Link>

          {/* Mobil menü butonu */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Masaüstü menüsü */}
          <div className="hidden md:flex space-x-6">
            {navLinks.categories.map((category) => {
              const Icon = Icons[category.iconName as keyof typeof Icons];
              return (
                <div key={category.name} className="relative group">
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                  >
                    {Icon && <Icon className="mr-1" />}
                    <span>{category.name}</span>
                  </button>
                  
                  {/* Alt menü */}
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {category.subLinks.map((link) => {
                        const LinkIcon = Icons[link.iconName as keyof typeof Icons];
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          >
                            {LinkIcon && <LinkIcon className="mr-2" />}
                            <span>{link.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobil menü */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            {navLinks.categories.map((category) => {
              const Icon = Icons[category.iconName as keyof typeof Icons];
              return (
                <div key={category.name} className="mb-4">
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className="flex items-center w-full text-left text-gray-600 hover:text-blue-600"
                  >
                    {Icon && <Icon className="mr-2" />}
                    <span>{category.name}</span>
                  </button>
                  
                  {/* Mobil alt menü */}
                  {activeCategory === category.name && (
                    <div className="ml-6 mt-2 space-y-2">
                      {category.subLinks.map((link) => {
                        const LinkIcon = Icons[link.iconName as keyof typeof Icons];
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center text-gray-600 hover:text-blue-600"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {LinkIcon && <LinkIcon className="mr-2" />}
                            <span>{link.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
