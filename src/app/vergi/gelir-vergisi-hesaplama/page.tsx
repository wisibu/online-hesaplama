import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// 2024 Gelir Vergisi Dilimleri (Ücretliler için)
const taxBrackets2024 = [
  { limit: 110000, rate: 0.15, base: 0, prevBracketTax: 0 },
  { limit: 230000, rate: 0.20, base: 110000, prevBracketTax: 16500 },
  { limit: 870000, rate: 0.27, base: 230000, prevBracketTax: 40500 },
  { limit: 3000000, rate: 0.35, base: 870000, prevBracketTax: 213300 },
  { limit: Infinity, rate: 0.40, base: 3000000, prevBracketTax: 958800 },
];

const pageConfig = {
  title: "Gelir Vergisi Hesaplama (2024) | OnlineHesaplama",
  description: "2024 yılına ait güncel vergi dilimlerine göre yıllık gelir vergisi tutarınızı kolayca hesaplayın. Ne kadar vergi ödeyeceğinizi anında öğrenin.",
  keywords: ["gelir vergisi hesaplama", "vergi dilimleri 2024", "vergi hesaplama", "yıllık gelir vergisi", "vergi matrahı"],
  calculator: {
    title: "Gelir Vergisi Hesaplama (Ücret Gelirleri)",
    description: (
      <p className="text-sm text-gray-600">
        Yıllık toplam vergi matrahınızı girerek 2024 yılı güncel tarifesine göre ödemeniz gereken gelir vergisini hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'taxableIncome', label: 'Yıllık Toplam Vergi Matrahı (TL)', type: 'number', placeholder: 'Örn: 500000' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const taxableIncome = Number(inputs.taxableIncome);

        if (isNaN(taxableIncome) || taxableIncome < 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir tutar girin.' } } };
        }
        
        if (taxableIncome === 0) {
          return {
            summary: {
              totalTax: { type: 'result', label: 'Toplam Gelir Vergisi', value: formatCurrency(0), isHighlighted: true },
            }
          };
        }

        let totalTax = 0;
        for (const bracket of taxBrackets2024) {
            if (taxableIncome > bracket.base) {
                const taxableAmountInBracket = Math.min(taxableIncome - bracket.base, bracket.limit - bracket.base);
                totalTax = bracket.prevBracketTax + (taxableIncome - bracket.base) * bracket.rate;
            }
            if (taxableIncome <= bracket.limit) {
                break;
            }
        }

        const effectiveRate = (totalTax / taxableIncome) * 100;

        const summary: CalculationResult['summary'] = {
            totalTax: { type: 'result', label: 'Toplam Gelir Vergisi', value: formatCurrency(totalTax), isHighlighted: true },
            netIncome: { type: 'info', label: 'Vergi Sonrası Net Gelir', value: formatCurrency(taxableIncome - totalTax) },
            taxableIncome: { type: 'info', label: 'Vergi Matrahı', value: formatCurrency(taxableIncome) },
            effectiveRate: { type: 'info', label: 'Efektif Vergi Oranı', value: `%${formatNumber(effectiveRate)}` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Gelir Vergisi Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Gelir vergisi, bireylerin bir takvim yılı içinde elde ettikleri kazançlar üzerinden devlete ödedikleri bir vergidir. Türkiye'de ücret gelirleri için artan oranlı bir vergi tarifesi uygulanır. Bu, geliriniz arttıkça daha yüksek bir vergi oranına tabi olmanız anlamına gelir. Hesaplayıcımız, yıllık vergi matrahınızı (brüt gelirinizden SGK ve işsizlik sigortası gibi kesintiler yapıldıktan sonra kalan tutar) kullanarak, 2024 yılı için geçerli olan aşağıdaki vergi dilimlerine göre ödemeniz gereken toplam vergiyi bulur.
            </p>
          </>
        )
      },
       {
        title: "2024 Yılı Gelir Vergisi Dilimleri (Ücret Gelirleri)",
        content: (
           <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Gelir Dilimi</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-600">Vergi Oranı</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr><td className="px-4 py-2">110.000 TL'ye kadar</td><td className="px-4 py-2">%15</td></tr>
                    <tr><td className="px-4 py-2">230.000 TL'nin 110.000 TL'si için 16.500 TL, fazlası</td><td className="px-4 py-2">%20</td></tr>
                    <tr><td className="px-4 py-2">870.000 TL'nin 230.000 TL'si için 40.500 TL, fazlası</td><td className="px-4 py-2">%27</td></tr>
                    <tr><td className="px-4 py-2">3.000.000 TL'nin 870.000 TL'si için 213.300 TL, fazlası</td><td className="px-4 py-2">%35</td></tr>
                    <tr><td className="px-4 py-2">3.000.000 TL'den fazlası için 958.800 TL, fazlası</td><td className="px-4 py-2">%40</td></tr>
                </tbody>
            </table>
           </div>
        )
      }
    ],
    faqs: [
      {
        question: "Vergi Matrahı nedir?",
        answer: "Vergi matrahı, brüt maaşınızdan Sosyal Güvenlik Kurumu (SGK) işçi payı (%14) ve İşsizlik Sigortası işçi payı (%1) gibi yasal kesintiler düşüldükten sonra kalan tutardır. Gelir vergisi bu matrah üzerinden hesaplanır."
      },
      {
        question: "Kümülatif Vergi Matrahı nedir ve neden önemlidir?",
        answer: "Kümülatif vergi matrahı, yılın başından itibaren her ayın vergi matrahının toplanarak ilerlemesidir. Bu toplam tutar, hangi vergi dilimine girdiğinizi belirler. Yıl içinde geliriniz arttıkça kümülatif matrahınız da yükselir ve bir üst vergi dilimine geçerek daha yüksek oranda vergi ödemeye başlarsınız. Her takvim yılının başında (Ocak ayında) bu matrah sıfırlanır."
      },
       {
        question: "Asgari ücret gelir vergisinden muaf mı?",
        answer: "Evet, 2022 yılından itibaren asgari ücret tutarı gelir vergisi ve damga vergisinden istisna edilmiştir. Bu, tüm çalışanların asgari ücrete isabet eden kazançları için gelir vergisi ödemediği anlamına gelir. Hesaplayıcımız bu istisnayı dikkate alarak, matrahınız üzerinden hesaplama yapar."
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
        resultTitle="Gelir Vergisi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
