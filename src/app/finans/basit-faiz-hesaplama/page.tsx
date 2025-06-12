import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Basit Faiz Hesaplama Aracı | OnlineHesaplama",
  description: "Anapara, faiz oranı ve süre bazında basit faiz getirisi ve toplam birikimi kolayca hesaplayın. Yıllık, aylık veya günlük faiz seçenekleriyle esnek hesaplama yapın.",
  keywords: ["basit faiz hesaplama", "faiz hesaplama", "yatırım getirisi", "mevduat faizi hesaplama", "anapara faiz"],
  calculator: {
    title: "Basit Faiz Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yatırımınızın basit faiz yöntemiyle ne kadar getiri sağlayacağını hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Anapara Tutarı (₺)', type: 'number', placeholder: '10000' },
      { id: 'interestRate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: '45' },
      { id: 'term', label: 'Süre', type: 'number', placeholder: '32' },
      { id: 'termType', label: 'Süre Türü', type: 'select', options: [
            { value: 'days', label: 'Gün' },
            { value: 'months', label: 'Ay' },
            { value: 'years', label: 'Yıl' },
      ], defaultValue: 'days' }
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const principal = Number(inputs.principal);
      const annualRate = Number(inputs.interestRate) / 100;
      const term = Number(inputs.term);
      const termType = inputs.termType;

      if (principal <= 0 || annualRate <= 0 || term <= 0) {
        return null;
      }
      
      let termInYears = term;
      if (termType === 'days') termInYears = term / 365;
      if (termType === 'months') termInYears = term / 12;

      const interestAmount = principal * annualRate * termInYears;
      const totalAmount = principal + interestAmount;

      const summary: CalculationResult['summary'] = {
        totalAmount: { type: 'result', label: 'Dönem Sonu Toplam Tutar', value: formatCurrency(totalAmount), isHighlighted: true },
        totalInterest: { type: 'result', label: 'Toplam Faiz Getirisi', value: formatCurrency(interestAmount) },
        principal: { type: 'info', label: 'Yatırılan Anapara', value: formatCurrency(principal) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Basit Faiz Nedir ve Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Basit faiz, bir yatırımın veya kredinin sadece başlangıçtaki anapara tutarı üzerinden hesaplanan faiz türüdür. Bu yöntemde, kazanılan faizler anaparaya eklenmez ve sonraki dönemlerde bu faizler üzerinden tekrar faiz işletilmez. Bu özelliğiyle, genellikle kısa vadeli hesaplamalar veya temel finansal analizler için kullanılır.
            </p>
            <p className="mt-2">
              Formülü şu şekildedir: <strong>Faiz Tutarı = Anapara x Faiz Oranı x Süre</strong>
            </p>
          </>
        )
      }
    ],
    faqs: [
        {
            question: "Basit faiz ile bileşik faiz arasındaki fark nedir?",
            answer: "Temel fark, faizin nasıl hesaplandığıdır. Basit faizde, faiz sadece ilk anapara üzerinden hesaplanır. Bileşik faizde ise, her dönemin sonunda kazanılan faiz anaparaya eklenir ve bir sonraki dönemde bu yeni toplam tutar üzerinden faiz hesaplanır. Bu nedenle, bileşik faiz 'faizin faizi' olarak da bilinir ve uzun vadede daha yüksek bir getiri sağlar."
        },
        {
            question: "Bu hesaplayıcıda vergi (stopaj) neden dikkate alınmıyor?",
            answer: "Mevduat faizi gibi reel piyasa ürünlerinde, elde edilen faiz getirisi üzerinden devlete stopaj (kaynakta kesinti vergisi) ödenir. Bu oran, yatırımın vadesine ve türüne göre değişebilir. Bu araç, temel bir finansal kavram olan 'basit faizi' hesapladığı için brüt sonuçları göstermektedir ve herhangi bir vergi kesintisi içermemektedir."
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
        resultTitle="Basit Faiz Getirisi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
