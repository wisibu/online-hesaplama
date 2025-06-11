import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import AdBanner from '@/components/AdBanner';

export const metadata: Metadata = {
  title: "Asgari Geçim İndirimi (AGİ) Nedir? (Kaldırıldı) | OnlineHesaplama",
  description: "Asgari Geçim İndirimi (AGİ) nedir, neden ve ne zaman kaldırıldı? 2022 öncesi AGİ hesaplaması ve mevcut durum hakkında tüm bilgiler.",
  keywords: ["agi hesaplama", "asgari geçim indirimi", "agi nedir", "agi neden kaldırıldı", "agi 2024"],
};

const pageContent = {
  title: "Asgari Geçim İndirimi (AGİ) - Bilgilendirme",
  description: "Asgari Geçim İndirimi (AGİ) uygulaması, 1 Ocak 2022 tarihi itibarıyla yürürlükten kaldırılmıştır. Bu sayfa, AGİ'nin ne olduğu ve mevcut durum hakkında bilgi vermek amacıyla korunmaktadır.",
  sections: [
    {
      title: "Asgari Geçim İndirimi (AGİ) Nedir ve Neden Kaldırıldı?",
      content: (
        <div className="space-y-4">
          <p>
            <strong>Asgari Geçim İndirimi (AGİ)</strong>, medeni durumuna ve çocuk sayısına göre çalışanların elde ettiği gelirin bir kısmının vergi dışı bırakılmasıyla, ödeyecekleri gelir vergisinden yapılan bir indirimdi. Bu indirim, çalışanın kendisine, çalışmayan eşine ve çocuklarına bağlı olarak değişen oranlarda uygulanır ve aylık olarak maaşlara yansıtılırdı.
          </p>
          <p>
            Ancak, <strong>7349 sayılı Kanun</strong> ile Gelir Vergisi Kanunu'nda yapılan değişiklikle, <strong>1 Ocak 2022'den itibaren tüm ücret ve maaşların asgari ücrete kadar olan kısmından gelir vergisi ve damga vergisi istisnası getirilmiştir.</strong> Bu yeni düzenleme, AGİ'nin sağladığı vergi indirimini de kapsadığı ve daha geniş bir kitleye vergi muafiyeti sağladığı için AGİ uygulaması tamamen yürürlükten kaldırılmıştır.
          </p>
           <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                <p className="font-semibold text-yellow-800">Önemli Not:</p>
                <p className="text-yellow-700">
                    2022 yılı ve sonrası için artık AGİ hesaplaması yapılmamaktadır ve çalışanların maaş bordrolarında "AGİ" adıyla bir ödeme kalemi bulunmamaktadır. Mevcut vergi istisnası, AGİ'nin yerini almıştır.
                </p>
            </div>
        </div>
      )
    }
  ],
  faqs: [
    {
      question: "AGİ yerine gelen vergi istisnası kimleri kapsıyor?",
      answer: "Asgari ücretin vergi dışı bırakılması uygulaması, ücretle çalışan herkesi (asgari ücretli veya daha yüksek maaş alanlar) kapsamaktadır. Tüm çalışanların maaşlarının asgari ücret tutarı kadar olan kısmı gelir vergisi ve damga vergisinden muaftır."
    },
    {
      question: "Eski yıllara ait bir AGİ hesaplaması yapabilir miyim?",
      answer: "Bu sayfada aktif bir hesap makinesi bulunmamaktadır. Eski yıllara (2021 ve öncesi) ait bir AGİ tutarını merak ediyorsanız, o yıl için geçerli olan asgari ücret tutarı ve AGİ oranlarını (bekar, evli, çocuklu vb. için farklılaşan) içeren muhasebe kaynaklarına veya arşivlenmiş haberlere başvurmanız gerekmektedir."
    },
    {
      question: "Bu değişiklik net maaşımı nasıl etkiledi?",
      answer: "Bu değişiklik, özellikle asgari ücret ve civarında maaş alan çalışanların net maaşlarında artışa neden olmuştur. Daha yüksek maaş alan çalışanlar için ise en az asgari ücretin vergi tutarı kadar bir vergi avantajı sağlamıştır."
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