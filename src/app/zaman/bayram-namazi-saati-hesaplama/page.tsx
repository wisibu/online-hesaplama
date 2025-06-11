import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "Bayram Namazı Saatleri | OnlineHesaplama",
  description: "Ramazan ve Kurban bayramı namazı saatlerini öğrenin. İl il bayram namazı vakitleri ve bayram namazının nasıl kılınacağı hakkında detaylı bilgiler.",
  keywords: ["bayram namazı saati", "bayram namazı vakitleri", "il il bayram namazı", "ramazan bayramı", "kurban bayramı", "bayram namazı nasıl kılınır"],
};

const pageContent = {
  title: "Bayram Namazı Vakitleri",
  description: "Bayram namazı saatleri, her yıl Diyanet İşleri Başkanlığı tarafından il ve ilçelere göre özel olarak hesaplanmaktadır. Vakitler, güneşin doğuşu ve kerahet vaktinin çıkması gibi astronomik hesaplamalara dayandığı için yıldan yıla ve şehirden şehire farklılık gösterir.",
  sections: [
    {
      title: "Güncel Bayram Namazı Saatini Nasıl Öğrenebilirim?",
      content: (
        <div className="space-y-4">
          <p>
            En doğru ve güncel bayram namazı vaktini öğrenmek için Diyanet İşleri Başkanlığı'nın resmi web sitesini veya mobil uygulamasını kullanmanız en güvenilir yöntemdir. Vakitler, bayramdan kısa bir süre önce Diyanet tarafından ilan edilir.
          </p>
          <a 
            href="https://namazvakitleri.diyanet.gov.tr/tr-TR" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Diyanet Namaz Vakitleri Sayfasına Git
          </a>
          <p className="text-sm text-gray-600">
            Yukarıdaki bağlantı üzerinden şehrinizi seçerek hem bayram namazı vaktini hem de diğer günlük namaz vakitlerini kolayca öğrenebilirsiniz.
          </p>
        </div>
      )
    }
  ],
  faqs: [
    {
      question: "Bayram namazı ne zaman kılınır?",
      answer: "Bayram namazı, güneş doğduktan yaklaşık 45-50 dakika sonra, yani kerahet vakti çıktıktan sonra kılınır. Bu vakit, her şehir için farklılık gösterir."
    },
    {
      question: "Bayram namazı vacip midir?",
      answer: "Hanefi mezhebine göre bayram namazı, Cuma namazı farz olan kişilere vaciptir. Diğer Sünni mezheplere göre ise sünnet-i müekkededir (kuvvetli sünnet)."
    },
    {
      question: "Bayram namazı nasıl kılınır?",
      answer: "Bayram namazı iki rekattır ve cemaatle kılınır. Diğer namazlardan farklı olarak her rekatta fazladan üçer tane olmak üzere toplam altı tane ilave tekbir (Zevaid tekbirleri) alınır. İlk rekatta Sübhaneke'den sonra, ikinci rekatta ise Fatiha ve zamm-ı sureden sonra bu tekbirler getirilir. Namazdan sonra imam, bayram hutbesi okur."
    }
  ]
};

export default function Page() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">{pageContent.title}</h1>
        <p className="text-center text-gray-600 mb-6">{pageContent.description}</p>
        <AdBanner />
        <div className="mt-8">
           <RichContent sections={pageContent.sections} faqs={pageContent.faqs} />
        </div>
        <AdBanner className="mt-8" />
      </div>
    </div>
  );
}