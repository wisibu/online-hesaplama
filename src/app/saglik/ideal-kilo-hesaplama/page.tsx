import type { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "İdeal Kilo Hesaplama",
  description: "İdeal kilo hesaplaması artık Vücut Kitle İndeksi (VKİ) aracımızın bir parçasıdır. Boyunuza göre sağlıklı kilo aralığınızı hemen öğrenin.",
  keywords: ["ideal kilo hesaplama", "boy kilo oranı", "sağlıklı kilo", "vki"],
  robots: {
    index: false,
    follow: true,
  },
};

const Page = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">İdeal Kilo Hesaplama Aracımız Yenilendi</h1>
        <p className="text-lg text-gray-600 mb-6">
          İdeal kilo hesaplaması, artık size daha kapsamlı bir sağlık analizi sunan <strong>Vücut Kitle İndeksi (VKİ)</strong> hesaplayıcımızın bir parçasıdır. Yeni aracımız size tek bir rakam yerine, boyunuza uygun sağlıklı kilo aralığını gösterir.
        </p>
        <AdBanner />
        <div className="mt-8">
            <p className="text-gray-700 mb-4">
                Lütfen aşağıdaki butona tıklayarak VKİ'nizi ve ideal kilo aralığınızı öğrenin.
            </p>
            <Link 
              href="/saglik/vucut-kitle-indeksi-hesaplama"
              className="inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-xl"
            >
              VKİ ve İdeal Kilo Hesaplayıcıya Git
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
