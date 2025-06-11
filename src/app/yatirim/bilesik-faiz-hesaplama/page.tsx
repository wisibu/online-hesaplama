import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Bileşik Faiz Hesaplama | OnlineHesaplama",
  description: "Anapara, faiz oranı, süre ve birikim sıklığı bilgilerini girerek yatırımınızın bileşik faiz gücüyle ne kadar büyüyeceğini hesaplayın.",
  keywords: ["bileşik faiz hesaplama", "faizin faizi", "yatırım büyüme hesaplama", "uzun vadeli yatırım"],
  calculator: {
    title: "Bileşik Faiz Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yatırımınızın gelecekteki değerini "faizin faizi" prensibiyle hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Başlangıç Anapara (TL)', type: 'number', placeholder: '10000' },
      { id: 'rate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: '40' },
      { id: 'years', label: 'Süre (Yıl)', type: 'number', placeholder: '10' },
      { id: 'compoundFrequency', label: 'Faiz Birikim Sıklığı', type: 'select', options: [
        { value: '1', label: 'Yıllık' },
        { value: '2', label: '6 Aylık' },
        { value: '4', label: '3 Aylık (Çeyrek)' },
        { value: '12', label: 'Aylık' },
      ]},
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const principal = Number(inputs.principal);
        const rate = Number(inputs.rate) / 100;
        const years = Number(inputs.years);
        const n = Number(inputs.compoundFrequency);

        if (isNaN(principal) || isNaN(rate) || isNaN(years) || principal <= 0 || rate <= 0 || years <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları pozitif değerlerle doldurun.' } } };
        }

        // Bileşik Faiz Formülü: A = P * (1 + r/n)^(n*t)
        const totalAmount = principal * Math.pow(1 + rate / n, n * years);
        const totalInterest = totalAmount - principal;

        const summary = {
            principal: { label: 'Başlangıç Anapara', value: formatCurrency(principal) },
            totalInterest: { label: 'Toplam Faiz Getirisi', value: formatCurrency(totalInterest) },
            totalAmount: { label: 'Vade Sonu Toplam Tutar', value: formatCurrency(totalAmount) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Bileşik Faiz Nedir? (Faizin Faizi)",
        content: (
          <p>
            Bileşik faiz, bir yatırımın sadece anaparası üzerinden değil, aynı zamanda daha önceki dönemlerde birikmiş olan faizleri üzerinden de faiz kazanması prensibidir. Bu durum, yatırımın zaman içinde katlanarak (üstel olarak) büyümesini sağlar. Albert Einstein'ın "dünyanın sekizinci harikası" olarak tanımladığı bileşik faiz, özellikle uzun vadeli yatırımlarda muazzam bir getiri potansiyeli yaratır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Faiz birikim sıklığı (compounding frequency) neden önemlidir?",
        answer: "Faizin anaparaya ne kadar sık eklendiğini belirtir. Faiz ne kadar sık birikirse (örneğin, yıllık yerine aylık), o kadar çabuk 'faizin faizi' işlemeye başlar ve toplam getiri o kadar yüksek olur. Aynı faiz oranı ve sürede, aylık bileşik faiz, yıllık bileşik faizden daha fazla kazandırır."
      },
      {
        question: "En iyi bileşik faiz yatırımı hangisidir?",
        answer: "Bileşik faiz prensibi, vadeli mevduat hesapları, temettü ödeyen hisse senetleri, yatırım fonları ve tahviller gibi birçok farklı yatırım aracında işler. Hangi aracın 'en iyi' olduğu, kişisel risk toleransınıza, yatırım vadenize ve finansal hedeflerinize bağlıdır. En önemli faktör, mümkün olduğunca erken başlamak ve düzenli olarak yatırım yapmaktır."
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
        resultTitle="Bileşik Getiri Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 