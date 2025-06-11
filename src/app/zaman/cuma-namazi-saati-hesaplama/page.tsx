import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "Cuma Namazı Saati | OnlineHesaplama",
  description: "Bu hafta Cuma namazı saat kaçta? Bulunduğunuz şehir için en güncel Cuma namazı vaktini öğrenin ve Cuma gününün faziletleri hakkında bilgi edinin.",
  keywords: ["cuma namazı saati", "cuma saati", "cuma namazı vakti", "il il cuma saatleri", "cuma namazı kaçta"],
};

const pageContent = {
  title: "Cuma Namazı Vakitleri",
  description: "Cuma namazı saati, öğle namazı vaktinde kılınır ve Diyanet İşleri Başkanlığı tarafından her hafta il ve ilçelere göre belirlenir. Vakitler, güneşin astronomik konumuna göre hesaplandığı için şehirlere göre küçük farklılıklar gösterebilir.",
  sections: [
    {
      title: "Bu Haftaki Cuma Vaktini Nasıl Öğrenebilirim?",
      content: (
        <div className="space-y-4">
          <p>
            En doğru ve güncel Cuma namazı vaktini öğrenmek için Diyanet İşleri Başkanlığı'nın resmi web sitesini veya mobil uygulamasını kullanmanız en güvenilir yöntemdir.
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
            Yukarıdaki bağlantı üzerinden şehrinizi seçerek hem Cuma namazı vaktini hem de diğer günlük namaz vakitlerini kolayca öğrenebilirsiniz.
          </p>
        </div>
      )
    }
  ],
  faqs: [
    {
      question: "Cuma namazı farz mıdır?",
      answer: "Evet, Cuma namazı akıllı, ergenlik çağına ulaşmış, sağlıklı ve hür olan Müslüman erkeklere farz-ı ayındır. Kur'an-ı Kerim'de Cuma Suresi'nde bu namaz emredilmektedir."
    },
    {
      question: "Cuma namazı kaç rekattır?",
      answer: "Cuma namazı, dört rekat ilk sünnet, iki rekat farz ve dört rekat son sünnet olmak üzere toplam on rekattır. Cemaatle kılınan ve hutbenin dinlendiği kısım iki rekatlık farz bölümüdür."
    },
    {
      question: "Cuma günü neden önemlidir?",
      answer: "Cuma, Müslümanlar için haftalık bir bayram ve toplanma günüdür. Hz. Muhammed (s.a.v.), 'Üzerine güneşin doğduğu en hayırlı gün Cuma günüdür.' buyurmuştur. Bu günde yapılan ibadetlerin ve duaların kabul edileceğine inanılır."
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