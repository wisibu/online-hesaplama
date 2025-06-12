import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const getPrimeFactors = (num: number): number[] => {
    const factors: number[] = [];
    if (num <= 1) return factors;
    let divisor = 2;

    while (num >= 2) {
        if (num % divisor === 0) {
            factors.push(divisor);
            num = num / divisor;
        } else {
            divisor++;
        }
    }
    return factors;
};

const pageConfig = {
  title: "Asal Çarpanlara Ayırma Hesaplama | OnlineHesaplama",
  description: "Bir sayıyı asal çarpanlarına ayırmak için anında sonuç alın. Pozitif bir tam sayıyı girin ve asal çarpanlarını üslü olarak görün.",
  keywords: ["asal çarpanlara ayırma", "asal bölenler", "sayıyı çarpanlarına ayırma"],
  calculator: {
    title: "Asal Çarpanlara Ayırma Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Asal çarpanlarını bulmak istediğiniz pozitif tam sayıyı girin.
      </p>
    ),
    inputFields: [
      { id: 'number', label: 'Sayı', type: 'number', placeholder: 'Örn: 360' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const num = Number(inputs.number);

        if (isNaN(num) || !Number.isInteger(num) || num <= 1) {
            return {
              summary: {
                result: { type: 'error', label: 'Hata', value: 'Lütfen 1\'den büyük bir tam sayı girin.' }
              }
            };
        }

        const factors = getPrimeFactors(num);
        const factorCounts = factors.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        const formattedFactors = Object.entries(factorCounts)
            .map(([base, exp]) => exp > 1 ? `${base}^${exp}` : `${base}`)
            .join(' x ');

        const summary: CalculationResult['summary'] = {
            result: { type: 'result', label: 'Asal Çarpanlar', value: formattedFactors, isHighlighted: true },
            number: { type: 'info', label: 'Sayı', value: num },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Asal Çarpanlara Ayırma Nedir?",
        content: (
          <p>
            Asal çarpanlara ayırma, bir pozitif tam sayıyı, her biri asal sayı olan çarpanlarının çarpımı şeklinde yazma işlemidir. Aritmetiğin temel teoremine göre, 1'den büyük her tam sayı ya bir asal sayıdır ya da asal sayıların çarpımı olarak tek bir şekilde yazılabilir. Örneğin, 12 sayısı 2 x 2 x 3 (veya 2² x 3) şeklinde asal çarpanlarına ayrılır. Bu yöntem, matematikte EBOB, EKOK bulma ve rasyonel sayıları sadeleştirme gibi birçok alanda kullanılır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Asal sayı nedir?",
        answer: "Asal sayı, sadece kendisine ve 1'e kalansız bölünebilen, 1'den büyük doğal sayılardır. Örneğin, 2, 3, 5, 7, 11, 13 gibi sayılar birer asal sayıdır."
      },
      {
        question: "1 neden asal sayı değildir?",
        answer: "Asal sayı tanımı gereği 1'den büyük olmalıdır ve tam olarak iki pozitif böleni (1 ve kendisi) olması gerekir. 1'in ise sadece bir tane pozitif böleni (1) vardır, bu nedenle asal kabul edilmez."
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
        resultTitle="Sayı Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 