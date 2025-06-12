import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const stopajRates = {
    'rent': 0.20,             // İşyeri Kira Ödemeleri
    'freelance': 0.20,        // Serbest Meslek Ödemeleri (Doktor, avukat, danışman vb.)
    'construction': 0.05,     // Yıllara Yaygın İnşaat ve Onarım İşleri
    'dividend': 0.10,         // Kâr Payları (Temettü) - Gerçek Kişilere
    'other': 0.20             // Genel Oran
};

const pageConfig = {
  title: "Stopaj Vergisi Hesaplama | OnlineHesaplama",
  description: "Brütten nete veya netten brüte stopaj hesaplaması yapın. Kira, serbest meslek ve diğer ödemeler için vergi kesintisini anında öğrenin.",
  keywords: ["stopaj hesaplama", "brütten nete", "netten brüte", "kira stopajı", "serbest meslek makbuzu"],
  calculator: {
    title: "Stopaj Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hesaplama türünü, tutarı ve stopaj oranını seçerek vergi kesintisini bulun.
      </p>
    ),
    inputFields: [
      { id: 'calculationType', label: 'Hesaplama Yönü', type: 'select', options: [
        { value: 'grossToNet', label: 'Brütten Nete' },
        { value: 'netToGross', label: 'Netten Brüte' },
      ]},
      { id: 'amount', label: 'Tutar (TL)', type: 'number', placeholder: '10000' },
      { id: 'rateType', label: 'Stopaj Türü', type: 'select', options: [
        { value: 'rent', label: 'İşyeri Kirası (%20)' },
        { value: 'freelance', label: 'Serbest Meslek (%20)' },
        { value: 'construction', label: 'Yıllara Yaygın İnşaat (%5)' },
        { value: 'dividend', label: 'Temettü (%10)' },
      ]},
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const calculationType = inputs.calculationType as 'grossToNet' | 'netToGross';
        const amount = Number(inputs.amount);
        const rateType = inputs.rateType as keyof typeof stopajRates;

        if (isNaN(amount) || amount <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir tutar girin.' } } };
        }

        const rate = stopajRates[rateType];
        let grossAmount: number, netAmount: number, taxAmount: number;

        if (calculationType === 'grossToNet') {
            grossAmount = amount;
            taxAmount = grossAmount * rate;
            netAmount = grossAmount - taxAmount;
        } else { // netToGross
            netAmount = amount;
            grossAmount = netAmount / (1 - rate);
            taxAmount = grossAmount - netAmount;
        }

        const summary: CalculationResult['summary'] = {
            gross: { type: 'result', label: 'Brüt Tutar', value: formatCurrency(grossAmount) },
            tax: { type: 'info', label: `Stopaj Kesintisi (%${rate * 100})`, value: formatCurrency(taxAmount) },
            net: { type: 'result', label: 'Net Tutar', value: formatCurrency(netAmount), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Stopaj (Vergi Kesintisi) Nedir?",
        content: (
          <p>
            Stopaj, gelir veya kurumlar vergisine tabi bir kazanç tutarının, bu geliri elde eden kişiye ödenmesi sırasında, ödemeyi yapan tarafça kanunen belirlenmiş oranlar üzerinden kesilerek vergi dairesine yatırılmasıdır. Yani, vergi kaynağında kesilir. Bu yöntemle devlet, vergi tahsilatını garantilemiş olur. En yaygın stopaj uygulamaları kira gelirleri ve serbest meslek kazançları üzerinden yapılır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Brütten nete ve netten brüte hesaplama ne demektir?",
        answer: "<strong>Brütten nete:</strong> Elinizdeki brüt (kesinti yapılmamış) tutar üzerinden ne kadar vergi kesileceğini ve ele net ne kadar geçeceğini hesaplamaktır. <strong>Netten brüte:</strong> Ele geçmesi istenen net tutar için brüt tutarın ne olması gerektiğini ve ne kadar vergi kesintisi yapılacağını bulmaktır. Bu, genellikle '10.000 TL net elime geçsin' gibi anlaşmalarda kullanılır."
      },
      {
        question: "Konut kiralarında stopaj var mıdır?",
        answer: "Hayır. Stopaj uygulaması sadece işyeri olarak kiralanan gayrimenkuller için geçerlidir. Konutlarını kiraya veren kişiler, elde ettikleri geliri yıllık gelir vergisi beyannamesi ile beyan ederler, bu gelir üzerinden stopaj yapılmaz."
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
        resultTitle="Stopaj Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 