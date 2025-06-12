import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Birikim ve Hedef Hesaplama | OnlineHesaplama",
  description: "Gelecekteki birikim hedefinize ulaşmak için ne kadar süre veya ne kadar aylık ödeme yapmanız gerektiğini hesaplayın. Yatırım getirisiyle birlikte hedeflerinize ulaşın.",
  keywords: ["birikim hesaplama", "hedef hesaplama", "yatırım hedefi", "para biriktirme"],
  calculator: {
    title: "Birikim Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yatırım hedefiniz için ne kadar birikim yapmanız gerektiğini veya birikimlerinizin ne kadar sürede hedefinize ulaşacağını hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'futureValue', label: 'Hedeflenen Tutar (₺)', type: 'number', placeholder: '1000000' },
      { id: 'monthlyInvestment', label: 'Aylık Yatırım Tutarı (₺)', type: 'number', placeholder: '5000' },
      { id: 'annualRate', label: 'Yıllık Ortalama Getiri (%)', type: 'number', placeholder: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const futureValue = Number(inputs.futureValue);
      const monthlyInvestment = Number(inputs.monthlyInvestment);
      const annualRate = Number(inputs.annualRate) / 100;

      if (futureValue <= 0 || monthlyInvestment <= 0 || annualRate <= 0) {
        return null;
      }
      
      const monthlyRate = annualRate / 12;
      const numberOfMonths = Math.log((futureValue * monthlyRate / monthlyInvestment) + 1) / Math.log(1 + monthlyRate);
      const numberOfYears = numberOfMonths / 12;

      const summary: CalculationResult['summary'] = {
        months: { type: 'result', label: 'Hedefe Ulaşma Süresi (Ay)', value: Math.ceil(numberOfMonths).toString(), isHighlighted: true },
        years: { type: 'result', label: 'Hedefe Ulaşma Süresi (Yıl)', value: formatNumber(numberOfYears) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Birikim Hedefleri ve Paranın Zaman Değeri",
        content: (
          <p>
            Birikim yapmak, finansal hedeflere ulaşmanın temelidir. Ancak paranın zaman değeri ve enflasyon nedeniyle, sadece para kenara koymak yeterli olmayabilir. Birikimlerinizi aynı zamanda düzenli olarak yatırım yaparak değerlendirmek, bileşik getirinin gücünden faydalanarak hedeflerinize çok daha hızlı ulaşmanızı sağlar. Bu hesap makinesi, aylık yatırımlarınızın belirli bir getiri oranıyla hedefinize ne kadar sürede ulaşacağını gösterir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Yıllık ortalama getiri oranını nasıl belirlemeliyim?",
        answer: "Bu oran, yapmayı planladığınız yatırımın türüne göre değişir. Düşük riskli mevduat veya fonlar için daha düşük bir oran, hisse senedi gibi daha yüksek riskli yatırımlar için ise daha yüksek bir oran (ancak garantisi olmadan) belirleyebilirsiniz. Geçmiş piyasa verilerini inceleyerek gerçekçi bir oran belirlemek önemlidir."
      },
      {
        question: "Bu hesaplama enflasyonu dikkate alıyor mu?",
        answer: "Bu hesaplama, girdiğiniz nominal getiri oranını kullanır. Enflasyonun etkisini görmek için, 'Yıllık Ortalama Getiri (%)' alanına beklenen reel getiri oranını (nominal getiri - beklenen enflasyon oranı) girebilirsiniz."
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
        resultTitle="Birikim Hedefi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}