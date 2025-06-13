// src/app/page.tsx
"use client";

import Link from 'next/link';
import { useState, useMemo } from 'react';
import type { Metadata } from 'next';
import {
  FaCreditCard, FaUniversity, FaFlask, FaGraduationCap, FaHeartbeat,
  FaCalculator, FaClock, FaCashRegister, FaLandmark, FaCar, FaPercentage, FaMoneyBillWave
} from 'react-icons/fa';
import { GiReceiveMoney } from "react-icons/gi";
import navLinksData from '@/data/navLinks.json';
import { createSlug } from '@/utils/slug';
import { iconMap } from '@/utils/iconMap';
import { generateMetadata } from '@/components/SEO';

export const metadata: Metadata = generateMetadata({
  title: 'Online Hesaplama - Hızlı ve Güvenilir Hesaplama Araçları',
  description: 'Kredi, vergi, matematik, finans ve daha birçok alanda hızlı ve güvenilir hesaplama araçları. Kullanıcı dostu arayüz ile tüm hesaplamalarınızı kolayca yapın.',
  keywords: 'online hesaplama, hesaplama araçları, kredi hesaplama, vergi hesaplama, matematik hesaplama, finans hesaplama, ücretsiz hesaplama',
  path: '/',
});

const allCalculators = navLinksData.categories.flatMap(category =>
  category.subLinks.map(link => ({
    name: link.name,
    category: category.name,
    href: link.href
  }))
);

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalculators = useMemo(() => {
    if (!searchTerm) return [];
    return allCalculators.filter(calculator =>
      calculator.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
            Tüm <span className="text-blue-600">Hesaplama</span> Araçlarınız
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Finans, sağlık, eğitim ve daha fazlası... Aradığınız tüm hesap makineleri bir arada. Hızlı, doğru ve tamamen ücretsiz.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Hesaplama aracı arayın (örn: KDV, Maaş, Kredi...)"
              className="w-full px-5 py-4 text-lg text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition duration-300 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredCalculators.length > 0 && searchTerm && (
              <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                {filteredCalculators.map((calculator, index) => (
                  <li key={index} className="border-b border-gray-100 last:border-b-0">
                    <Link href={calculator.href} className="block px-6 py-3 hover:bg-blue-50 transition duration-150">
                      <p className="font-semibold text-gray-800">{calculator.name}</p>
                      <p className="text-sm text-gray-500">{calculator.category}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Hesaplama Kategorileri
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {navLinksData.categories.map(category => {
              const categorySlug = createSlug(category.name);
              const Icon = iconMap[category.iconName];
              return (
                <Link
                  href={`/${categorySlug}`}
                  key={category.name}
                  className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-200"
                >
                  <div className="text-4xl text-blue-600 mb-4 transition-transform duration-300 group-hover:scale-110">
                    {Icon && <Icon />}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 text-center">{category.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
