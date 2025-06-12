import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Bileşik Faiz Hesaplama (Yıllık Detaylı) | OnlineHesaplama",
  description: "Yatırımınızın bileşik faiz ile gelecekteki değerini hesaplayın. Anapara, faiz oranı, süre ve ek yatırım detayları ile yıllık döküm alın.",
  keywords: ["bileşik faiz hesaplama", "yatırım hesaplama", "faiz getirisi", "gelecekteki değer hesaplama", "faizin faizi"],
  calculator: {
    title: "Bileşik Faiz Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yatırımınızın faizin de faiz kazandığı bileşik getirisini ve yıllık dökümünü hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Başlangıç Anaparası (₺)', type: 'number', placeholder: '10000' },
      { id: 'annualRate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: '50' },
      { id: 'years', label: 'Süre (Yıl)', type: 'number', placeholder: '5' },
      { id: 'compoundFrequency', label: 'Faiz Eklenme Sıklığı (Yılda kaç kez)', type: 'select', options: [
        { value: 1, label: 'Yıllık' },
        { value: 2, label: '6 Aylık' },
        { value: 4, label: 'Çeyreklik (3 Aylık)' },
        { value: 12, label: 'Aylık' },
      ], defaultValue: '1' },
      { id: 'monthlyContribution', label: 'Aylık Ek Yatırım Tutarı (₺)', type: 'number', placeholder: '0' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const principal = Number(inputs.principal);
      const annualRate = Number(inputs.annualRate) / 100;
      const years = Number(inputs.years);
      const compoundFrequency = Number(inputs.compoundFrequency);
      const monthlyContribution = Number(inputs.monthlyContribution) || 0;

      if (principal < 0 || annualRate <= 0 || years <= 0 || compoundFrequency <= 0) {
        return null;
      }

      const ratePerPeriod = annualRate / compoundFrequency;
      const periodsPerYear = compoundFrequency;
      const totalPeriods = years * periodsPerYear;
      
      let futureValue = principal;
      let totalInterest = 0;
      let totalContributions = 0;
      
      const rows = [];
      let currentBalance = principal;

      for (let i = 1; i <= years; i++) {
        const yearStartBalance = currentBalance;
        let interestForYear = 0;
        let contributionForYear = 0;
        for (let j = 0; j < periodsPerYear; j++) {
            if (j % (12 / periodsPerYear) === 0 && monthlyContribution > 0) {
               currentBalance += monthlyContribution * (12 / periodsPerYear);
               contributionForYear += monthlyContribution * (12 / periodsPerYear);
            }
            const interestThisPeriod = currentBalance * ratePerPeriod;
            interestForYear += interestThisPeriod;
            currentBalance += interestThisPeriod;
        }
        rows.push([
          i,
          formatCurrency(yearStartBalance),
          formatCurrency(contributionForYear),
          formatCurrency(interestForYear),
          formatCurrency(currentBalance),
        ]);
      }
      
      futureValue = currentBalance;
      totalContributions = monthlyContribution * 12 * years;
      totalInterest = futureValue - principal - totalContributions;

      const summary: CalculationResult['summary'] = {
        futureValue: { type: 'result', label: 'Yatırımın Gelecekteki Değeri', value: formatCurrency(futureValue), isHighlighted: true },
        totalInterest: { type: 'result', label: 'Toplam Faiz Kazancı', value: formatCurrency(totalInterest) },
        totalContributions: { type: 'info', label: 'Toplam Ek Yatırım Tutarı', value: formatCurrency(totalContributions) },
        principal: { type: 'info', label: 'Başlangıç Anaparası', value: formatCurrency(principal) },
      };

      const table = {
        title: "Yıllık Getiri Dökümü",
        headers: ["Yıl", "Yıl Başı Bakiye", "Yıllık Ek Yatırım", "Yıllık Faiz Kazancı", "Yıl Sonu Bakiye"],
        rows: rows,
      };

      return { summary, table };
    },
  },
  content: {
    sections: [
        {
            title: "Bileşik Faiz: 'Faizin Faizi' Gücü",
            content: (
                 <>
                    <p>
                        Bileşik faiz, bir yatırımın sadece anaparası üzerinden değil, aynı zamanda birikmiş faizleri üzerinden de faiz kazanması prensibine dayanır. Bu, zamanla "kartopu etkisi" yaratarak yatırımın katlanarak büyümesini sağlar. Albert Einstein'ın "dünyanın sekizinci harikası" olarak tanımladığı bileşik getiri, uzun vadeli yatırım stratejilerinin temel taşıdır.
                    </p>
                    <p className='mt-2'>
                        Hesaplama formülü şu şekildedir: <strong>Gelecekteki Değer = Anapara x (1 + Faiz Oranı / Faiz Eklenme Sıklığı) ^ (Süre x Faiz Eklenme Sıklığı)</strong>
                    </p>
                </>
            )
        }
    ],
    faqs: [
        {
            question: "Faiz eklenme sıklığı (Compound Frequency) ne anlama geliyor?",
            answer: "Bu, faizin ne sıklıkla hesaplanıp anaparanıza eklendiğini belirtir. Örneğin, 'Aylık' seçeneği, bankanın her ay sonunda faizi hesaplayıp bakiyenize ekleyeceği anlamına gelir. Bir sonraki ay, bu yeni ve daha yüksek bakiye üzerinden faiz kazanırsınız. Sıklık ne kadar artarsa (örneğin aylık, yıllık yerine), bileşik getirinin etkisi o kadar büyük olur."
        },
        {
            question: "Aylık ek yatırım yapmak sonucu nasıl etkiler?",
            answer: "Düzenli olarak ek yatırım yapmak (tasarruf), bileşik getirinin gücünü katlayarak artırır. Her ay eklediğiniz tutar da faiz kazanmaya başlar ve ana birikiminizin çok daha hızlı büyümesini sağlar. Bu, uzun vadeli finansal hedeflere (emeklilik, ev almak vb.) ulaşmak için en etkili yöntemlerden biridir."
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
        resultTitle="Bileşik Faiz Getirisi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
