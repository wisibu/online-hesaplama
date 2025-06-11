import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

const Page = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">BMH Hesaplama Aracımız Geliştirildi</h1>
        <p className="text-lg text-gray-600 mb-6">
          Bazal Metabolizma Hızı (BMH) hesaplaması, artık size aktivite seviyenize göre günlük toplam kalori ihtiyacınızı da gösteren <strong>Günlük Kalori İhtiyacı</strong> hesaplayıcımızın bir parçasıdır.
        </p>
        <AdBanner />
        <div className="mt-8">
            <p className="text-gray-700 mb-4">
                Lütfen aşağıdaki butona tıklayarak hem BMH'nizi hem de günlük kalori ihtiyacınızı öğrenin.
            </p>
            <Link 
              href="/saglik/gunluk-kalori-ihtiyaci-hesaplama"
              className="inline-block bg-green-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-700 transition-colors shadow-lg text-xl"
            >
              Güncel Kalori Hesaplayıcıya Git
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
