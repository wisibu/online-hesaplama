// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // globals.css dosyasını import ediyoruz
import StatsDisplay from "@/components/StatsDisplay";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer";
import Script from "next/script";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: "HesaplaOnline - Hızlı ve Güvenilir Hesaplama Araçları",
  description: "Günlük ihtiyaçlarınızdan karmaşık analizlere kadar her türlü hesaplama aracı HesaplaOnline'da. KDV, kredi, maaş ve daha fazlasını kolayca hesaplayın.",
  keywords: "hesaplama, online hesaplama, kredi hesaplama, vergi hesaplama, matematik hesaplama, finans hesaplama",
  authors: [{ name: "Online Hesaplama" }],
  creator: "Online Hesaplama",
  publisher: "Online Hesaplama",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://onlinehesaplama.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HesaplaOnline - Hızlı ve Güvenilir Hesaplama Araçları",
    description: "Her türlü hesaplama aracı tek bir yerde. Kredi, vergi, matematik ve daha fazlası.",
    url: "https://onlinehesaplama.com",
    siteName: "Online Hesaplama",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HesaplaOnline - Hızlı ve Güvenilir Hesaplama Araçları",
    description: "Her türlü hesaplama aracı tek bir yerde. Kredi, vergi, matematik ve daha fazlası.",
    creator: "@onlinehesaplama",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-icon.png" },
      { url: "/icons/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: "google-site-verification-code", // Google Search Console doğrulama kodu buraya eklenecek
  },
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
      <body className={`${inter.className} bg-gray-50 text-gray-800 flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
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
