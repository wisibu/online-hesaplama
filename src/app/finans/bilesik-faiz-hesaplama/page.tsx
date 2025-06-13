'use client';

import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
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
      const annualRate = Number(inputs.annualRate);
      const years = Number(inputs.years);
      const compoundFrequency = Number(inputs.compoundFrequency);
      const monthlyContribution = Number(inputs.monthlyContribution);

      if (!principal || !annualRate || !years || !compoundFrequency) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
      }

      const ratePerPeriod = annualRate / 100 / compoundFrequency;
      const periods = years * compoundFrequency;
      const monthlyRate = annualRate / 100 / 12;

      let futureValue = principal * Math.pow(1 + ratePerPeriod, periods);
      
      if (monthlyContribution > 0) {
        const futureValueOfContributions = monthlyContribution * 
          ((Math.pow(1 + monthlyRate, periods * 12) - 1) / monthlyRate);
        futureValue += futureValueOfContributions;
      }

      const totalContributions = principal + (monthlyContribution * 12 * years);
      const totalInterest = futureValue - totalContributions;

      return {
        summary: {
          principal: { type: 'result', label: 'Başlangıç Anaparası', value: principal },
          totalContributions: { type: 'result', label: 'Toplam Yatırım', value: totalContributions },
          totalInterest: { type: 'result', label: 'Toplam Faiz Getirisi', value: totalInterest },
          futureValue: { type: 'result', label: 'Gelecekteki Değer', value: futureValue },
        },
        table: {
          headers: ['Yıl', 'Başlangıç Değeri', 'Yatırımlar', 'Faiz Getirisi', 'Yıl Sonu Değeri'],
          rows: Array.from({ length: years }, (_, i) => {
            const yearStart = i === 0 ? principal : futureValue;
            const yearContributions = monthlyContribution * 12;
            const yearInterest = (yearStart + yearContributions) * (annualRate / 100);
            const yearEnd = yearStart + yearContributions + yearInterest;
            return [
              (i + 1).toString(),
              formatCurrency(yearStart),
              formatCurrency(yearContributions),
              formatCurrency(yearInterest),
              formatCurrency(yearEnd),
            ];
          }),
        },
      };
    },
  },
  content: {
    sections: [
      {
        title: 'Bileşik Faiz Nedir?',
        content: `
          <p>Bileşik faiz, bir yatırımın veya kredinin hem anapara hem de birikmiş faiz üzerinden hesaplanan faiz türüdür. 
          Bu yöntemde, kazanılan faizler anaparaya eklenir ve sonraki dönemlerde bu toplam tutar üzerinden tekrar faiz işletilir.</p>
          <p>Bileşik faiz, uzun vadeli yatırımlarda özellikle güçlü bir etkiye sahiptir. Örneğin, %10 yıllık faiz oranıyla 10.000 TL'lik bir yatırım:</p>
          <ul>
            <li>Basit faizde: 20.000 TL (10.000 TL anapara + 10.000 TL faiz)</li>
            <li>Bileşik faizde: 25.937 TL (10.000 TL anapara + 15.937 TL faiz)</li>
          </ul>
          <p>Bu fark, yatırım süresi uzadıkça daha da belirgin hale gelir.</p>
        `,
      },
      {
        title: 'Bileşik Faiz Nasıl Hesaplanır?',
        content: `
          <p>Bileşik faiz hesaplama formülü:</p>
          <p>A = P(1 + r/n)^(nt)</p>
          <p>Burada:</p>
          <ul>
            <li>A = Gelecekteki değer</li>
            <li>P = Başlangıç anaparası</li>
            <li>r = Yıllık faiz oranı (ondalık olarak)</li>
            <li>n = Yılda faiz eklenme sıklığı</li>
            <li>t = Yıl cinsinden süre</li>
          </ul>
          <p>Örneğin, 10.000 TL'lik bir yatırım için:</p>
          <ul>
            <li>Yıllık %10 faiz oranı</li>
            <li>Aylık faiz eklenmesi (n=12)</li>
            <li>5 yıllık süre</li>
          </ul>
          <p>A = 10.000(1 + 0.10/12)^(12*5) = 16.453 TL</p>
        `,
      },
    ],
    faqs: [
      {
        question: 'Bileşik faiz neden önemlidir?',
        answer: 'Bileşik faiz, uzun vadeli yatırımlarda paranın zaman değerini en iyi şekilde değerlendirmenizi sağlar. Faizin de faiz kazanması sayesinde, yatırımınız üstel olarak büyür ve zamanla daha yüksek getiriler elde edersiniz.',
      },
      {
        question: 'Faiz eklenme sıklığı nasıl etkiler?',
        answer: 'Faiz eklenme sıklığı ne kadar yüksekse (örneğin aylık yerine günlük), o kadar fazla bileşik etki oluşur. Ancak bu fark genellikle küçüktür ve bankaların uyguladığı faiz oranlarına göre değişebilir.',
      },
      {
        question: 'Düzenli ek yatırım yapmak neden önemli?',
        answer: 'Düzenli ek yatırımlar, bileşik faizin etkisini daha da güçlendirir. Her ay yapılan küçük yatırımlar, uzun vadede büyük bir fark yaratabilir. Örneğin, aylık 1.000 TL ek yatırımla 30 yılda milyonlarca TL birikebilir.',
      },
    ],
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
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
