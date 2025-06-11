import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "Geçmiş Altın Fiyatları ve Arşivi | OnlineHesaplama",
  description: "Geçmişe dönük gram, çeyrek, cumhuriyet altını ve diğer altın türlerinin fiyatlarını güvenilir kaynaklardan nasıl bulacağınızı öğrenin.",
  keywords: ["geçmiş altın fiyatları", "altın arşivi", "tarihe göre altın fiyatları", "gram altın fiyatı", "çeyrek altın fiyatı"],
};

const pageContent = {
  title: "Geçmiş Tarihli Altın Fiyatları",
  description: (
    <p className="text-center text-gray-600 mb-6">
      Geçmiş bir tarihteki altın fiyatını öğrenmek, yatırım analizi ve ekonomik değerlendirmeler için önemlidir.
      <br />
      En doğru ve güvenilir verilere ulaşmak için, bu bilgiyi sağlayan resmi ve büyük finans kurumlarının arşivlerini kullanmanızı öneririz.
    </p>
  ),
  sections: [
    {
      title: "Güvenilir Kaynaklardan Veri Sorgulama",
      content: (
        <div className="space-y-4 text-center">
          <p>
            Türkiye Cumhuriyet Merkez Bankası (TCMB) ve diğer büyük finans platformları, geçmişe dönük altın fiyatlarını arşivlemektedir. Aşağıdaki bağlantıları kullanarak güvenilir kaynaklardan sorgulama yapabilirsiniz.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="https://evds2.tcmb.gov.tr/index.php?/evds/dashboard/14" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              TCMB Altın İstatistikleri
            </a>
            <a 
              href="https://www.bloomberght.com/altin/arsiv" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              Bloomberg HT Altın Arşivi
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Bu sitelerden, istediğiniz tarih aralığını seçerek gram, çeyrek, ons ve diğer altın türlerinin kapanış fiyatlarını detaylı olarak görüntüleyebilirsiniz.
          </p>
        </div>
      )
    }
  ],
  faqs: [
    {
      question: "Bu sitede neden bir sorgulama aracı yok?",
      answer: "Geçmişe dönük finansal verilerin doğruluğu ve güvenilirliği kritik öneme sahiptir. Kullanıcılarımıza en doğru bilgiyi sunmak adına, sizi doğrudan bu verileri resmi olarak tutan ve yayınlayan kurumlara yönlendiriyoruz. Üçüncü parti bir araçla sunulacak verilerde yaşanabilecek olası bir hata, yanlış analizlere yol açabilir."
    },
    {
      question: "Altın fiyatları neden sürekli değişir?",
      answer: "Altın fiyatları, küresel ve yerel birçok faktörden etkilenir. Bunlar arasında arz ve talep dengesi, merkez bankalarının politikaları, enflasyon oranları, jeopolitik riskler ve dolar kurundaki değişimler gibi önemli etkenler bulunur."
    }
  ]
};

export default function Page() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">{pageContent.title}</h1>
        {pageContent.description}
        <AdBanner />
        <div className="mt-8">
           <RichContent sections={pageContent.sections} faqs={pageContent.faqs} />
        </div>
      </div>
    </div>
  );
}