import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Bileşik Faiz Hesaplama | OnlineHesaplama",
  description: "Yatırımınızın gelecekteki değerini bileşik faiz formülü ile hesaplayın. Anapara, faiz oranı, süre ve faiz işleme sıklığını girerek anında sonuç alın.",
  keywords: ["bileşik faiz hesaplama", "faiz hesaplama", "yatırım getirisi", "gelecekteki değer", "faiz sıklığı"],
  calculator: {
    title: "Bileşik Faiz Hesaplama",
    description: (
        <p className="text-sm text-gray-600">
            Yatırımınızın gelecekteki değerini, anapara üzerinden kazanılan faizin de faiz kazanması prensibine göre hesaplar.
        </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Ana Para Tutarı (₺)', type: 'number', placeholder: '10000' },
      { id: 'rate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: '12' },
      { id: 'time', label: 'Süre (Yıl)', type: 'number', placeholder: '5' },
      { 
        id: 'compounding', 
        label: 'Faiz İşleme Sıklığı', 
        type: 'select', 
        defaultValue: 12,
        options: [
            { value: 1, label: 'Yıllık' },
            { value: 2, label: '6 Aylık' },
            { value: 4, label: '3 Aylık (Çeyrek)' },
            { value: 12, label: 'Aylık' },
            { value: 365, label: 'Günlük' }
        ]
      },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const principal = Number(inputs.principal);
      const rate = Number(inputs.rate) / 100;
      const time = Number(inputs.time);
      const n = Number(inputs.compounding);

      if (principal <= 0 || rate <= 0 || time <= 0 || n <= 0) {
        return null;
      }

      const amount = principal * Math.pow(1 + rate / n, n * time);
      const interest = amount - principal;

      const summary: CalculationResult['summary'] = {
        total: { type: 'result', label: 'Vade Sonu Toplam Tutar', value: formatCurrency(amount), isHighlighted: true },
        interest: { type: 'info', label: 'Toplam Faiz Getirisi', value: formatCurrency(interest) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
        {
            title: "Bileşik Faiz Nedir?",
            content: (
                <p>
                    Bileşik faiz, bir yatırımın veya borcun sadece anaparası üzerinden değil, aynı zamanda önceki dönemlerde birikmiş olan faizler üzerinden de faiz kazanması veya ödenmesi prensibine dayanır. Bu "faizin faizi" olarak da bilinir ve zamanla yatırımın katlanarak büyümesini sağlar. Bu nedenle uzun vadeli yatırımlarda oldukça güçlü bir etkiye sahiptir.
                </p>
            )
        }
    ],
    faqs: [
        {
            question: "Faiz işleme sıklığı (compounding period) ne anlama gelir?",
            answer: "Faizin ne kadar sıklıkla anaparaya eklendiğini belirtir. Örneğin, 'aylık' faiz işleme sıklığı, kazanılan faizin her ay anaparaya eklenip bir sonraki ay bu yeni toplam üzerinden faiz hesaplanacağı anlamına gelir. Faiz ne kadar sık işlerse, vade sonunda elde edilecek toplam tutar o kadar yüksek olur."
        },
        {
            question: "Bu hesaplama krediler için de geçerli mi?",
            answer: "Evet, bileşik faiz mantığı krediler için de geçerlidir. Özellikle kredi kartı borçları gibi borçlarda, ödenmeyen bakiyeye sürekli olarak bileşik faiz işler, bu da borcun hızla artmasına neden olabilir."
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
        resultTitle="Bileşik Faiz Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
