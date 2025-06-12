// src/components/Header.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import navLinksData from '@/data/navLinks.json';
import { createSlug } from '@/utils/slug';
import { iconMap } from '@/utils/iconMap';
import { Metadata } from 'next';

interface NavLinkItem {
  name: string;
  href: string;
}
interface NavLink {
  name:string;
  href?: string;
  subLinks?: NavLinkItem[];
}

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 inline-block ml-1 transition-transform duration-200 ease-in-out group-hover:rotate-180">
    <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const desktopDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navLinks = navLinksData.map(data => {
    // Check if data.links exists and is an array before mapping
    const subLinks = Array.isArray(data.links) ? data.links.map(item => ({
        name: item.title.replace(/ Hesaplama$/, "").replace(/ Hesaplamaları$/, "").replace(/ Hesaplayıcı$/, ""),
        href: item.href
    })) : [];

    return {
      name: data.category,
      href: `/${createSlug(data.category)}`,
      subLinks: subLinks
    };
  });

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDesktopDropdown(null);
    setOpenMobileSubmenu(null);
  }, [pathname]);

  const handleDesktopMouseEnter = (itemName: string) => {
    if (desktopDropdownTimeoutRef.current) {
      clearTimeout(desktopDropdownTimeoutRef.current);
    }
    setOpenDesktopDropdown(itemName);
  };

  const handleDesktopMouseLeave = () => {
    desktopDropdownTimeoutRef.current = setTimeout(() => {
      setOpenDesktopDropdown(null);
    }, 250); 
  };

  const toggleMobileSubmenu = (itemName: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === itemName ? null : itemName);
  };
  
  const siteBasligi = "Online Hesaplama";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0"> 
            <Link 
              href="/" 
              className="text-3xl font-extrabold text-black hover:opacity-75 transition-opacity duration-200"
            >
              {siteBasligi}
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1 xl:space-x-2 ml-auto">
            {navLinks.map((anaItem) => (
                <div 
                  key={anaItem.name} 
                  className="relative"
                  onMouseEnter={anaItem.subLinks ? () => handleDesktopMouseEnter(anaItem.name) : undefined}
                  onMouseLeave={anaItem.subLinks ? handleDesktopMouseLeave : undefined}
                >
                  <Link 
                    href={anaItem.href || '#'}
                    className={`px-2 py-2 rounded-lg text-xs xl:text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-all duration-200 ease-in-out flex items-center
                      ${(pathname === anaItem.href || (anaItem.href && anaItem.href !== "/" && pathname.startsWith(anaItem.href))) && !anaItem.subLinks ? 'bg-gray-100 text-black font-semibold' : ''}
                      ${openDesktopDropdown === anaItem.name && anaItem.subLinks ? 'bg-gray-100 text-black' : ''}
                    `}
                  >
                    {anaItem.name}
                    {anaItem.subLinks && anaItem.subLinks.length > 0 && <ChevronDownIcon />}
                  </Link>
                  {anaItem.subLinks && anaItem.subLinks.length > 0 && openDesktopDropdown === anaItem.name && (
                    <div 
                      className="absolute left-0 mt-2 w-64 origin-top-left bg-white rounded-xl shadow-2xl p-2 z-[60] transition-opacity duration-200 ease-out max-h-96 overflow-y-auto" 
                      // right-0 ve origin-top-right yerine left-0 ve origin-top-left kullanıldı
                      onMouseEnter={() => handleDesktopMouseEnter(anaItem.name)} 
                      onMouseLeave={handleDesktopMouseLeave}
                    >
                      <div className="space-y-0.5" role="menu" aria-orientation="vertical" aria-labelledby={`menu-button-${anaItem.name}`}>
                        {anaItem.subLinks.map((altItem) => (
                          <Link
                            href={altItem.href}
                            key={altItem.name}
                            className="block w-full text-left px-3 py-1.5 text-xs xl:text-sm text-gray-700 hover:bg-gray-100 hover:text-black rounded-md transition-colors duration-150"
                            role="menuitem"
                          >
                            {altItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </nav>

          <div className="md:hidden flex items-center ml-auto">
            <button 
              type="button" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Ana menüyü aç</span>
              {isMobileMenuOpen ? (
                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-lg z-30 border-t border-gray-100 max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-3 py-3 space-y-1">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.subLinks && link.subLinks.length > 0 ? (
                  <div>
                    <button
                      onClick={() => toggleMobileSubmenu(link.name)}
                      className="w-full flex justify-between items-center px-3 py-3 rounded-lg text-base font-medium text-gray-800 hover:bg-gray-100 hover:text-black transition-colors duration-200"
                    >
                      <span>{link.name}</span>
                      <svg className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${openMobileSubmenu === link.name ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {openMobileSubmenu === link.name && (
                      <div className="pl-5 mt-1 space-y-0.5 py-1">
                        {link.subLinks.map((subLink) => (
                          <Link
                            href={subLink.href}
                            key={subLink.name}
                            className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-black transition-colors duration-150"
                          >
                            {subLink.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href!}
                    className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200
                      ${pathname === link.href
                        ? 'bg-gray-100 text-black font-semibold'
                        : 'text-gray-800 hover:bg-gray-100 hover:text-black'
                      }
                    `}
                    aria-current={pathname === link.href ? 'page' : undefined}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
