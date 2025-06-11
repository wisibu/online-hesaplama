import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { factorial } from '@/utils/math';

const pageConfig = {
  title: "Faktöriyel Hesaplama (!n) | OnlineHesaplama",
  description: "Bir sayının faktöriyelini anında hesaplayın. Permütasyon ve kombinasyon hesaplamalarının temel taşı olan faktöriyeli kolayca bulun.",
  keywords: ["faktöriyel hesaplama", "n!", "faktöriyel nedir"],
  calculator: {
    title: "Faktöriyel Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Faktöriyelini hesaplamak istediğiniz pozitif tam sayıyı girin.
      </p>
    ),
    inputFields: [
      { id: 'number', label: 'Sayı (n)', type: 'number', placeholder: 'Örn: 5' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const num = Number(inputs.number);

        if (isNaN(num) || !Number.isInteger(num) || num < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen pozitif bir tam sayı girin.' } } };
        }

        if (num > 1000) {
             return { summary: { error: { label: 'Hata', value: 'Sayı çok büyük. Lütfen 1000 veya daha küçük bir sayı girin.' } } };
        }

        const result = factorial(num);

        const summary = {
            result: { label: `${num}! Sonucu`, value: result.toString(), isHighlighted: true },
        };
          
        return { summary, disclaimer: "1000'den büyük sayılar için hesaplama performansı düşebilir ve sonuçlar çok uzun olabilir." };
    },
  },
  content: {
    sections: [
      {
        title: "Faktöriyel Nedir?",
        content: (
          <p>
            Faktöriyel, matematikte, 1'den belirli bir doğal sayıya kadar olan tüm pozitif tam sayıların çarpımıdır ve "!" işaretiyle gösterilir. Örneğin, 5'in faktöriyeli (5!) şu şekilde hesaplanır: 5! = 1 × 2 × 3 × 4 × 5 = 120. Faktöriyel kavramı, özellikle olasılık, permütasyon ve kombinasyon gibi sayma problemlerinde ve matematiksel analizde sıkça kullanılır. 
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "0 faktöriyel (0!) neden 1'e eşittir?",
        answer: "0 faktöriyelin 1'e eşit olması, matematiksel bir kabul ve kolaylıktır. Bu tanım, permütasyon ve kombinasyon formüllerinin (örneğin, n elemanlı bir kümenin n elemanlı permütasyonu P(n,n) = n!) n=0 için de tutarlı çalışmasını sağlar. Ayrıca, boş kümenin (0 elemanlı) sadece bir şekilde sıralanabileceği (hiçbir şey yapmayarak) şeklinde de yorumlanabilir."
      },
      {
        question: "Negatif sayıların faktöriyeli var mıdır?",
        answer: "Faktöriyel, tanımı gereği sadece pozitif tam sayılar ve 0 için tanımlıdır. Negatif sayıların faktöriyeli hesaplanamaz."
      },
      {
        question: "Neden çok büyük sayılar için sonuç alamıyorum?",
        answer: "Faktöriyel değerleri çok hızlı büyür. Örneğin 70! sayısı bile 100 basamaktan uzundur. Hesaplayıcımız çok büyük sayıları (1000'e kadar) `BigInt` teknolojisi kullanarak hesaplayabilse de, tarayıcınızın ve sisteminizin performansını korumak için bir üst limit belirlenmiştir."
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
