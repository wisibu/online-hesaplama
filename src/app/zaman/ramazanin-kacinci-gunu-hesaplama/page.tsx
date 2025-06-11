import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import AdBanner from '@/components/AdBanner';

// Approximate Ramadan start dates for calculation purposes. For exact dates, Diyanet should be consulted.
const ramadanStartDates: { [key: number]: string } = {
  2023: "2023-03-23",
  2024: "2024-03-11",
  2025: "2025-03-01",
  2026: "2026-02-18",
  2027: "2027-02-08",
};

const pageConfig = {
  title: "Ramazan'ın Kaçıncı Günü? & İmsakiye | OnlineHesaplama",
  description: "Bugün Ramazan'ın kaçıncı günü olduğunu öğrenin. Ayrıca bulunduğunuz şehir için güncel imsak, iftar ve sahur vakitlerini gösteren Diyanet imsakiyesine ulaşın.",
  keywords: ["ramazanın kaçıncı günü", "imsakiye", "imsak vakti", "iftar saati", "sahur vakti", "ramazan 2024"],
  calculator: {
    title: "Bugün Ramazan'ın Kaçıncı Günü?",
    description: (
      <p className="text-sm text-gray-600">
        Hesaplama bugünün tarihine göre otomatik olarak yapılır.
      </p>
    ),
    inputFields: [] as InputField[],
    calculate: async (inputs: { [key:string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to beginning of the day
        const year = today.getFullYear();
        
        const ramadanStartStr = ramadanStartDates[year];

        if (!ramadanStartStr) {
            return { summary: { info: { label: 'Bilgi', value: `Bu yılki Ramazan başlangıç tarihi sistemde kayıtlı değil. Lütfen Diyanet takvimini kontrol edin.` } } };
        }

        const ramadanStartDate = new Date(ramadanStartStr);
        const ramadanEndDate = new Date(ramadanStartDate);
        ramadanEndDate.setDate(ramadanEndDate.getDate() + 29); // Ramadan is 29 or 30 days
        
        if (today < ramadanStartDate) {
             return { summary: { info: { label: 'Durum', value: `Ramazan'a henüz gelinmedi.` } } };
        }

        if (today > ramadanEndDate) {
            return { summary: { info: { label: 'Durum', value: `Ramazan ayı sona erdi.` } } };
        }

        const diffTime = Math.abs(today.getTime() - ramadanStartDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const summary = {
            day: { label: `Bugün ${year} Ramazan'ının`, value: `${diffDays}. Günü` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
        {
            title: "Güncel İmsak ve İftar Vakitleri",
            content: (
              <div className="space-y-4 text-center">
                <p>
                  İmsak, sahur, iftar ve teravih namazı vakitleri her şehir için farklılık göstermektedir. En doğru ve güncel bilgi için Diyanet İşleri Başkanlığı tarafından yayınlanan imsakiyeyi kullanmanız önemlidir.
                </p>
                <a 
                  href="https://namazvakitleri.diyanet.gov.tr/tr-TR/imsakiye" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-lg"
                >
                  Diyanet İmsakiye Sayfasına Git
                </a>
                <p className="text-sm text-gray-600">
                  Yukarıdaki bağlantıdan şehrinizi seçerek tüm Ramazan ayı boyunca günlük vakitlere ulaşabilirsiniz.
                </p>
              </div>
            )
          }
    ],
    faqs: [
      {
        question: "Ramazan neden her yıl 10-11 gün önce başlar?",
        answer: "Çünkü İslami takvim (Hicri takvim) Ay'ın hareketlerine göre, Miladi takvim ise Güneş'in hareketlerine göre düzenlenir. Bir Ay yılı, bir Güneş yılından yaklaşık 10-11 gün daha kısadır. Bu fark nedeniyle Ramazan ayı her yıl Miladi takvimde daha erken bir tarihe denk gelir."
      },
      {
        question: "İmsak nedir? Sahur ne zamana kadar yapılır?",
        answer: "İmsak, orucun başladığı vakittir ve tan yerinin ağarmasıyla başlar. Teknik olarak sabah ezanının okunduğu vakittir. Sahur ise imsak vaktine kadar olan süre içinde oruca niyetlenerek yemek yenen zamandır. Orucu riske atmamak için sahurun imsak vaktinden birkaç dakika önce bitirilmesi tavsiye edilir."
      }
    ]
  }
};

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
  openGraph: {
    title: pageConfig.title,
    description: pageConfig.description,
  },
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Ramazan Günü Bilgisi"
      />
      <AdBanner className="my-8" />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}