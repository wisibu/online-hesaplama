import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const hijriMonths = ["Muharrem", "Safer", "Rebiülevvel", "Rebiülahir", "Cemaziyelevvel", "Cemaziyelahir", "Recep", "Şaban", "Ramazan", "Şevval", "Zilkade", "Zilhicce"];

const toHijri = (gregorianDate: Date): string => {
    const formatter = new Intl.DateTimeFormat('tr-SA-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return formatter.format(gregorianDate);
};

const pageConfig = {
  title: "Hicri - Miladi Takvim Dönüştürücü | OnlineHesaplama",
  description: "Miladi bir tarihi Hicri takvime çevirin veya bir Hicri tarihi Miladi takvime dönüştürün. İki takvim arasındaki gün, ay ve yıl farkını kolayca hesaplayın.",
  keywords: ["hicri miladi çevirici", "hicri takvim hesaplama", "miladi takvim çevirme", "islamic calendar converter", "hicri yıl"],
  calculator: {
    title: "Hicri - Miladi Takvim Dönüştürücü",
    description: (
      <p className="text-sm text-gray-600">
        Miladi takvimdeki bir tarihi Hicri karşılığını bulmak için seçin.
      </p>
    ),
    inputFields: [
      { id: 'date', label: 'Miladi Tarih', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const dateStr = inputs.date as string;
        if (!dateStr) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir tarih girin.' } } };
        }
        
        const date = new Date(dateStr);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const correctedDate = new Date(date.getTime() + userTimezoneOffset);

        const hijriDate = toHijri(correctedDate);

        const summary = {
            gregorian: { label: 'Miladi Tarih', value: correctedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) },
            hijri: { label: 'Hicri Karşılığı', value: hijriDate },
            info: { label: 'Not', value: 'Hesaplama, Suudi Arabistan\'ın Umm al-Qura takvimine göredir ve bölgesel ay gözlemlerine göre +/- 1 gün farklılık gösterebilir.'}
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Hicri ve Miladi Takvim Nedir?",
        content: (
          <p>
            <strong>Miladi Takvim (Gregoryen):</strong> Dünya'nın Güneş etrafındaki dönüşünü temel alan bir güneş takvimidir ve uluslararası alanda en yaygın kullanılan takvimdir. Bir yılı 365 veya 366 gündür. <br/><br/>
            <strong>Hicri Takvim (İslami Takvim):</strong> Ay'ın Dünya etrafındaki dönüşünü temel alan bir ay takvimidir. Hz. Muhammed'in (s.a.v) Mekke'den Medine'ye hicretini başlangıç (Yıl 1) olarak kabul eder. Bir Hicri yıl, bir Miladi yıldan yaklaşık 10-11 gün daha kısadır. Bu nedenle İslami bayramlar ve özel günler her yıl Miladi takvimde farklı bir tarihe denk gelir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Hicri takvimde bir ay kaç gün sürer?",
        answer: "Hicri takvimde aylar, Ay'ın evrelerine göre 29 veya 30 gün sürer. Bu, yeni hilalin gözlemlenmesine bağlıdır. Bu nedenle, Hicri takvimin başlangıcı ve bitişi bölgesel olarak farklılık gösterebilir."
      },
      {
        question: "Bu çevirici ne kadar güvenilir?",
        answer: "Bu hesaplayıcı, JavaScript'in yerleşik Uluslararasılaştırma (Intl) API'sini ve Suudi Arabistan'da resmi olarak kullanılan 'Umm al-Qura' takvim standardını kullanır. Bu, algoritmik olarak en tutarlı ve yaygın kabul gören yöntemlerden biridir. Ancak, dini amaçlar için ayın fiili olarak gözlemlenmesi esas olduğundan, özellikle önemli günler için resmi otoritelerin (örn. Diyanet) duyurularını takip etmek en doğrusudur."
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
        resultTitle="Takvim Dönüşüm Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}