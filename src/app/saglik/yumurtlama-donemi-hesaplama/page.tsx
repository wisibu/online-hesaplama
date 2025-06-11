import type { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "Yumurtlama Dönemi Hesaplama",
  description: "Yumurtlama dönemi ve doğurganlık penceresi hesaplaması, artık kapsamlı Adet Günü Hesaplama aracımızın bir parçasıdır.",
  keywords: ["yumurtlama hesaplama", "doğurganlık dönemi", "ovülasyon tarihi", "adet takvimi"],
  robots: {
    index: false,
    follow: true,
  },
};

const Page = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Yumurtlama Hesaplama Aracımız Geliştirildi</h1>
        <p className="text-lg text-gray-600 mb-6">
          Yumurtlama dönemi hesaplaması, artık size bir sonraki adet tarihinizi ve doğurganlık pencerenizi de gösteren <strong>Adet Günü ve Yumurtlama Hesaplama</strong> aracımızın bir parçasıdır.
        </p>
        <AdBanner />
        <div className="mt-8">
            <p className="text-gray-700 mb-4">
                Tüm döngü takviminizi tek bir yerden takip etmek için lütfen aşağıdaki butona tıklayın.
            </p>
            <Link 
              href="/saglik/adet-gunu-hesaplama"
              className="inline-block bg-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-pink-700 transition-colors shadow-lg text-xl"
            >
              Adet Günü ve Yumurtlama Hesaplayıcısına Git
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;