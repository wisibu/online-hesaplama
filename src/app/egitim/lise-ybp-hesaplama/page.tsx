import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Yıl Sonu Başarı Puanı (YBP) Hesaplama | OnlineHesaplama",
  description: "Birinci ve ikinci dönem not ortalamalarınızı girerek lise yıl sonu başarı puanınızı (YBP) kolayca hesaplayın.",
  keywords: ["ybp hesaplama", "yıl sonu başarı puanı", "lise yıl sonu ortalaması"],
  calculator: {
    title: "Yıl Sonu Başarı Puanı (YBP) Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Birinci ve ikinci dönem ağırlıklı not ortalamalarınızı girerek o yıla ait Yıl Sonu Başarı Puanınızı (YBP) hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'firstTerm', label: '1. Dönem Ağırlıklı Not Ortalaması', type: 'number', placeholder: '78.50' },
      { id: 'secondTerm', label: '2. Dönem Ağırlıklı Not Ortalaması', type: 'number', placeholder: '85.25' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const firstTerm = Number(inputs.firstTerm);
        const secondTerm = Number(inputs.secondTerm);

        if (isNaN(firstTerm) || isNaN(secondTerm) || firstTerm < 0 || firstTerm > 100 || secondTerm < 0 || secondTerm > 100) {
            return null;
        }

        const ybp = (firstTerm + secondTerm) / 2;

        const summary: CalculationResult['summary'] = {
            ybp: { type: 'result', label: 'Yıl Sonu Başarı Puanı (YBP)', value: formatNumber(ybp), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yıl Sonu Başarı Puanı (YBP) Nedir?",
        content: (
          <p>
            Yıl Sonu Başarı Puanı (YBP), bir öğrencinin bir ders yılındaki akademik performansını gösteren puandır. O ders yılındaki birinci ve ikinci dönem ağırlıklı not ortalamalarının aritmetik ortalaması alınarak hesaplanır. YBP, öğrencinin o yılı başarıyla tamamlayıp tamamlamadığını belirlemede kullanılır ve aynı zamanda lise mezuniyet puanının (diploma notu) hesaplanmasında önemli bir rol oynar.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Dönem ortalamalarımı nereden öğrenebilirim?",
        answer: "Birinci ve ikinci döneme ait ağırlıklı not ortalamalarınızı karnelerinizden veya e-Okul sisteminden öğrenebilirsiniz. Bu ortalamalar, o dönemdeki tüm derslerinizin notlarının ders saatlerine göre ağırlıklandırılmasıyla hesaplanır."
      },
      {
        question: "YBP, sınıf geçmeyi nasıl etkiler?",
        answer: "Yıl Sonu Başarı Puanınızın 50 ve üzerinde olması, sınıfı geçmek için temel şartlardan biridir. Ancak, YBP'niz 50'nin üzerinde olsa bile, zayıf ders sayınız gibi diğer faktörler de sınıf geçme durumunuzu etkileyebilir."
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
        resultTitle="Yıl Sonu Başarı Puanı Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}