import React from 'react';
import { generateMetadata } from './SEO';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from './Breadcrumb';

interface CalculatorLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  keywords: string;
  path: string;
  category: string;
  relatedTools?: Array<{
    title: string;
    href: string;
  }>;
}

export function generateCalculatorMetadata({
  title,
  description,
  keywords,
  path,
}: Pick<CalculatorLayoutProps, 'title' | 'description' | 'keywords' | 'path'>): Metadata {
  return generateMetadata({
    title,
    description,
    keywords,
    path,
  });
}

export default function CalculatorLayout({
  children,
  title,
  description,
  category,
  relatedTools = [],
}: CalculatorLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Ana Sayfa', href: '/' },
          { label: category, href: `/${category.toLowerCase()}` },
          { label: title, href: '#' },
        ]}
      />

      <article className="mt-8">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-xl text-gray-600">{description}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              {children}
            </div>
          </div>

          <aside className="space-y-6">
            {/* İlgili Hesaplama Araçları */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">İlgili Hesaplama Araçları</h2>
              <ul className="space-y-3">
                {relatedTools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQ Bölümü */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Sıkça Sorulan Sorular</h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="list-none cursor-pointer">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100">
                      <span className="font-medium">Bu hesaplama aracı nasıl kullanılır?</span>
                      <span className="ml-4 transition-transform group-open:rotate-180">↓</span>
                    </div>
                  </summary>
                  <div className="p-4 text-gray-600">
                    Gerekli değerleri ilgili alanlara girin ve "Hesapla" butonuna tıklayın. Sonuçlar otomatik olarak görüntülenecektir.
                  </div>
                </details>
                {/* Daha fazla FAQ eklenebilir */}
              </div>
            </div>

            {/* Paylaş */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-4">Paylaş</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`, '_blank')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="Twitter'da Paylaş"
                >
                  Twitter
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="Facebook'ta Paylaş"
                >
                  Facebook
                </button>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`, '_blank')}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  aria-label="LinkedIn'de Paylaş"
                >
                  LinkedIn
                </button>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
} 