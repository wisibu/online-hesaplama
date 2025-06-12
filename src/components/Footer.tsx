// src/components/Footer.tsx
import Link from 'next/link';
import React from 'react';

// Örnek Sosyal Medya İkonları (SVG olarak)
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const InstagramIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M12.315 2.315a8.884 8.884 0 00-4.266.096C4.73 2.615 2.615 4.73 2.409 8.049A8.884 8.884 0 002.315 12.315c-.003.6.019 1.2.058 1.791.096 3.319 2.211 5.434 5.53 5.64A8.884 8.884 0 0011.685 21.685c.6.003 1.2-.019 1.791-.058 3.319-.096 5.434-2.211 5.64-5.53A8.884 8.884 0 0021.685 12.315c.003-.6-.019-1.2-.058-1.791-.096-3.319-2.211-5.434-5.53-5.64A8.884 8.884 0 0012.315 2.315zm-1.022 3.645a.75.75 0 00-.75.75v1.5a.75.75 0 001.5 0v-1.5a.75.75 0 00-.75-.75zm2.798 1.125a.75.75 0 100-1.5.75.75 0 000 1.5zm-4.493 2.27a3.75 3.75 0 107.5 0 3.75 3.75 0 00-7.5 0zm5.25 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-2.855 3.02a.75.75 0 00-.75.75v3.03a.75.75 0 001.5 0v-3.03a.75.75 0 00-.75-.75zm0 6.062a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);


export default function Footer() {
  const footerLinks = [
    { name: "Hakkımızda", href: "/hakkimizda" },
    { name: "İletişim", href: "/iletisim" },
    { name: "Kullanım Koşulları", href: "/kullanim-kosullari" },
    { name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
    // { name: "Site Haritası", href: "/site-haritasi" }, // İsteğe bağlı
  ];

  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo ve Kısa Açıklama */}
          <div className="md:col-span-1 lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-black hover:opacity-80 transition-opacity">
              OnlineHesaplama.NET {/* Site adı güncellendi */}
            </Link>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              Hayatınızı kolaylaştıran, hızlı ve doğru hesaplama araçları. Finanstan sağlığa, eğitimden matematiğe her türlü ihtiyacınız için buradayız.
            </p>
          </div>

          {/* Faydalı Linkler */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
              Faydalı Linkler
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-gray-600 hover:text-black hover:underline transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase mb-4">
              İletişim
            </h3>
            <p className="text-sm text-gray-600">
              Öneri ve geri bildirimleriniz için: <br />
              <a href="mailto:iletisim@onlinehesaplama.net" className="text-black hover:underline"> {/* E-posta domaini güncellendi */}
                iletisim@onlinehesaplama.net
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} OnlineHesaplama.NET. Tüm hakları saklıdır. {/* Site adı güncellendi */}
          </p>
          <p className="text-xs text-gray-500 mt-2 sm:mt-0">
            Bu sitedeki tüm hesaplamalar bilgilendirme amaçlıdır ve yasal tavsiye niteliği taşımaz.
          </p>
        </div>
      </div>
    </footer>
  );
}
