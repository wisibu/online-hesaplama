import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const KIRA_STOPAJ_ORANI = 0.20;

const pageConfig = {
  title: "Kira Stopaj Hesaplama (İşyeri) | OnlineHesaplama",
  description: "İşyeri brüt veya net kira bedeli üzerinden %20 oranındaki kira stopajı kesintisini ve damga vergisini anında hesaplayın.",
  keywords: ["kira stopajı hesaplama", "işyeri kira vergisi", "brütten nete kira", "netten brüte kira"],
  calculator: {
    title: "İşyeri Kira Stopaj Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hesaplama yönünü ve kira bedelini girerek stopaj ve damga vergisi dahil net/brüt tutarları görün.
      </p>
    ),
    inputFields: [
      { id: 'calculationType', label: 'Hesaplama Yönü', type: 'select', options: [
        { value: 'grossToNet', label: 'Brütten Nete' },
        { value: 'netToGross', label: 'Netten Brüte' },
      ]},
      { id: 'rentAmount', label: 'Kira Bedeli (Aylık)', type: 'number', placeholder: '10000' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { calculationType, rentAmount } = inputs;
        const amount = Number(rentAmount);

        if (isNaN(amount) || amount <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir kira bedeli girin.' } } };
        }

        let grossRent: number, netRent: number, stopajAmount: number;
        
        if (calculationType === 'grossToNet') {
            grossRent = amount;
            stopajAmount = grossRent * KIRA_STOPAJ_ORANI;
            netRent = grossRent - stopajAmount;
        } else { // netToGross
            netRent = amount;
            grossRent = netRent / (1 - KIRA_STOPAJ_ORANI);
            stopajAmount = grossRent - netRent;
        }
        
        // Damga vergisi binde 1.89 (Kira sözleşmeleri için)
        const damgaVergisi = grossRent * 0.00189;

        const summary = {
            gross: { label: 'Aylık Brüt Kira', value: formatCurrency(grossRent) },
            stopaj: { label: `Kira Stopajı (%${KIRA_STOPAJ_ORANI * 100})`, value: formatCurrency(stopajAmount) },
            net: { label: 'Mülk Sahibine Ödenecek Net Kira', value: formatCurrency(netRent) },
            stampDuty: { label: 'Damga Vergisi (Binde 1.89)', value: formatCurrency(damgaVergisi) }
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "İşyeri Kira Stopajı Nedir?",
        content: (
          <p>
            İşyeri kira stopajı, kiralanan bir mülkün işyeri olarak kullanılması durumunda, kiracının brüt kira bedeli üzerinden %20 oranında kesinti yaparak mülk sahibi adına vergi dairesine ödediği bir vergi türüdür. Bu, mülk sahibi için bir ön vergi ödemesidir ve mülk sahibi daha sonra yıllık gelir vergisi beyannamesinde bu kesintiyi ödeyeceği vergiden mahsup eder.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Kira stopajını kim öder?",
        answer: "Stopajı, kiracı, mülk sahibine kira ödemesini yapmadan önce keser ve vergi dairesine 'muhtasar beyanname' ile beyan ederek öder. Dolayısıyla vergiyi ödeme sorumluluğu kiracıya aittir."
      },
      {
        question: "Netten brüte kira nasıl hesaplanır?",
        answer: "Eğer taraflar net kira bedeli üzerinden anlaşmışsa, bu net tutar 0.80'e bölünerek brüt kira bedeli bulunur (Çünkü net kira, brüt kiranın %80'ine eşittir). Stopaj, bu bulunan brüt tutar üzerinden hesaplanır. Hesaplayıcımız bu işlemi sizin için otomatik yapar."
      },
      {
        question: "Konut kiralarında da stopaj var mı?",
        answer: "Hayır, konut olarak kiralanan mülkler için stopaj uygulaması yoktur. Konut kira gelirleri, mülk sahibi tarafından yıllık olarak GMSİ (Gayrimenkul Sermaye İradı) beyannamesi ile beyan edilir."
      }
    ]
  }
};

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Kira Stopaj Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}