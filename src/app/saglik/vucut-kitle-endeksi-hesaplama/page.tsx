import type { Metadata } from 'next';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "Vücut Kitle Endeksi Hesaplama",
  description: "En doğru Vücut Kitle Endeksi (VKE/VKİ) hesaplaması için güncel aracımızı kullanın. İdeal kilo aralığınızı ve sağlık durumunuzu öğrenin.",
  keywords: ["vke hesaplama", "vücut kitle endeksi", "vki hesaplama", "bmi hesaplama", "boy kilo endeksi"],
  robots: {
    index: false,
    follow: true,
  },
};

const Page = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Vücut Kitle Endeksi Hesaplama</h1>
        <p className="text-lg text-gray-600 mb-6">
          Bu araç, daha kapsamlı ve detaylı sonuçlar sunan ana "Vücut Kitle İndeksi Hesaplama" sayfamıza taşınmıştır.
        </p>
        <AdBanner />
        <div className="mt-8">
            <p className="text-gray-700 mb-4">
                Lütfen aşağıdaki butona tıklayarak güncel hesaplayıcımıza ulaşın. Bu sayfa artık kullanılmamaktadır ve yakında kaldırılacaktır.
            </p>
            <Link 
              href="/saglik/vucut-kitle-indeksi-hesaplama"
              className="inline-block bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-xl"
            >
              Güncel VKİ Hesaplayıcıya Git
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
