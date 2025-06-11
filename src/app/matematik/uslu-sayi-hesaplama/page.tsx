import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Üslü Sayı Hesaplama (Kuvvet Alma) | OnlineHesaplama",
  description: "Bir sayının üssünü (kuvvetini) anında hesaplayın. Taban ve üs değerlerini girerek sonucu kolayca bulun.",
  keywords: ["üslü sayı hesaplama", "kuvvet alma", "sayının üssü", "a üssü b"],
  calculator: {
    title: "Üslü Sayı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Taban sayıyı ve üs değerini girerek hesaplama yapın.
      </p>
    ),
    inputFields: [
      { id: 'base', label: 'Taban (a)', type: 'number', placeholder: 'Örn: 2' },
      { id: 'exponent', label: 'Üs (b)', type: 'number', placeholder: 'Örn: 10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const base = Number(inputs.base);
        const exponent = Number(inputs.exponent);

        if (isNaN(base) || isNaN(exponent)) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir taban ve üs değeri girin.' } } };
        }
        
        // Büyük sayılar için BigInt kullanalım
        const result = BigInt(base) ** BigInt(exponent);

        const summary = {
            result: { label: `${base} ^ ${exponent} Sonucu`, value: result.toString() },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Üslü Sayı Nedir?",
        content: (
          <p>
            Üslü sayı, bir sayının (taban) kendisi ile belirli bir sayıda (üs veya kuvvet) çarpılmasını ifade eden matematiksel bir kavramdır. Örneğin, 2<sup>3</sup> (2 üssü 3) ifadesi, 2 sayısının 3 kez kendisiyle çarpılmasını (2 x 2 x 2) belirtir ve sonucu 8'dir. Üslü sayılar, çok büyük veya çok küçük sayıları daha kompakt bir şekilde göstermek için kullanılır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Bir sayının sıfırıncı kuvveti neden 1'dir?",
        answer: "Sıfır hariç herhangi bir sayının sıfırıncı kuvvetinin 1 olması, matematiksel bir kuraldır ve üslü sayıların bölme kuralından (aⁿ / aᵐ = aⁿ⁻ᵐ) gelir. aⁿ / aⁿ = 1 olmalıdır. Kurala göre bu aynı zamanda aⁿ⁻ⁿ = a⁰'a eşittir. Dolayısıyla, a⁰ = 1 olarak tanımlanır."
      },
      {
        question: "Negatif üs ne anlama gelir?",
        answer: "Negatif üs, sayının çarpma işlemine göre tersini (çarpmaya göre tersini) almayı ifade eder. Örneğin, a⁻ⁿ = 1 / aⁿ'dir. Yani, 5⁻² = 1 / 5² = 1 / 25'tir."
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
        resultTitle="Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 