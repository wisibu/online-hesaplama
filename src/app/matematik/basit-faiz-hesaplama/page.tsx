import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Basit Faiz Hesaplama | OnlineHesaplama",
  description: "Yatırımınızın veya borcunuzun basit faizini ve vade sonu toplam tutarını anında hesaplayın. Anapara, yıllık faiz oranı ve süreyi girin, sonucu görün.",
  keywords: ["basit faiz hesaplama", "faiz hesaplama", "yatırım getirisi", "vade sonu tutar"],
  calculator: {
    title: "Basit Faiz Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Basit faiz, yatırım veya kredinin ana parası üzerinden hesaplanan faizdir.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Ana Para Tutarı (₺)', type: 'number', placeholder: '10000' },
      { id: 'rate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: '12' },
      { id: 'time', label: 'Süre (Yıl)', type: 'number', placeholder: '2' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const principal = Number(inputs.principal);
      const rate = Number(inputs.rate) / 100;
      const time = Number(inputs.time);

      if (principal <= 0 || rate <= 0 || time <= 0) {
        return null;
      }

      const interest = principal * rate * time;
      const total = principal + interest;

      const summary: CalculationResult['summary'] = {
        total: { type: 'result', label: 'Vade Sonu Toplam Tutar', value: formatCurrency(total), isHighlighted: true },
        interest: { type: 'info', label: 'Toplam Faiz Getirisi', value: formatCurrency(interest) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
        {
            title: "Basit Faiz Nedir?",
            content: (
                <p>
                    Basit faiz, bir borç veya yatırım üzerinden sadece anapara dikkate alınarak hesaplanan faiz türüdür. Bu yöntemde, önceki dönemlerde kazanılan faizler anaparaya eklenmez ve bir sonraki dönemin faiz hesaplamasına dahil edilmez. Bu nedenle, faiz tutarı her dönem sabit kalır. Genellikle kısa vadeli krediler veya yatırımlar için kullanılır.
                </p>
            )
        }
    ],
    faqs: [
        {
            question: "Basit faiz ile bileşik faiz arasındaki fark nedir?",
            answer: "Temel fark, faizin nasıl hesaplandığıdır. Basit faizde faiz sadece anapara üzerinden hesaplanırken, bileşik faizde hem anapara hem de birikmiş faizler üzerinden hesaplanır. Bu da bileşik faizin zamanla katlanarak büyümesine (kartopu etkisi) neden olur."
        },
        {
            question: "Günlük veya aylık faiz nasıl hesaplanır?",
            answer: "Eğer elinizdeki faiz oranı yıllık ise, günlük faiz için bu oranı 365'e, aylık faiz için ise 12'ye bölerek ilgili dönemin faiz oranını bulabilirsiniz. Hesaplamayı yaparken süre (zaman) biriminin de faiz oranıyla uyumlu olduğundan emin olmalısınız."
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
        resultTitle="Faiz Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}