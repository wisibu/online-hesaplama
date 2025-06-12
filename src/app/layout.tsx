// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css"; // globals.css dosyasını import ediyoruz
import StatsDisplay from "@/components/StatsDisplay";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = localFont({
  src: '../public/fonts/Inter-Regular.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HesaplaOnline - Hızlı ve Güvenilir Hesaplama Araçları",
  description: "Günlük ihtiyaçlarınızdan karmaşık analizlere kadar her türlü hesaplama aracı HesaplaOnline'da. KDV, kredi, maaş ve daha fazlasını kolayca hesaplayın.",
};

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      {/* 
        Google Analytics İzleme Kodu (gtag.js)
        NEXT_PUBLIC_GA_ID'nizi projenizin kök dizinindeki .env.local dosyasına ekleyin.
        Örnek: NEXT_PUBLIC_GA_ID='G-XXXXXXXXXX'
      */}
      {GA_TRACKING_ID && (
        <>
          <Script 
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} 
            strategy="afterInteractive" 
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `}
          </Script>
        </>
      )}

      {/* body etiketi her zaman beyaz arka plan ve koyu gri/siyah metin olacak şekilde ayarlandı */}
      <body className={`${inter.className} bg-white text-gray-800 flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          {/* Ana içerik alanı (children) kendi içinde farklı arka planlara sahip olabilir.
            Eğer spesifik sayfalarda (örneğin src/app/page.tsx veya src/app/toplama/page.tsx) 
            hala koyu arka planlar varsa, o dosyaların içindeki en dış sarmalayıcı 
            elementlerdeki dark:bg-... gibi sınıfları da kaldırmanız gerekebilir.
          */}
          {children}
        </main>
        <StatsDisplay />
        <Footer />
      </body>
    </html>
  );
}
