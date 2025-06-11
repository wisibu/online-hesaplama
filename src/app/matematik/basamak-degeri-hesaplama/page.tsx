import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Basamak Değeri Hesaplama | OnlineHesaplama",
  description: "Bir sayının içindeki rakamların basamak değerlerini ve sayının basamaklarına ayrılmış halini kolayca bulun. Sayı değeri ve basamak değeri arasındaki farkı öğrenin.",
  keywords: ["basamak değeri hesaplama", "sayı değeri", "basamak analizi", "sayıyı basamaklarına ayırma"],
  calculator: {
    title: "Basamak Değeri Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Analiz etmek istediğiniz tam sayıyı girin.
      </p>
    ),
    inputFields: [
      { id: 'number', label: 'Sayı', type: 'number', placeholder: 'Örn: 1984' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const numStr = String(inputs.number);
        const num = Number(inputs.number);

        if (isNaN(num) || !Number.isInteger(num)) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen bir tam sayı girin.' } } };
        }

        const digits = numStr.split('');
        const power = digits.length - 1;
        
        const breakdown = digits.map((digit, index) => {
            const placeValue = Number(digit) * Math.pow(10, power - index);
            return {
                digit,
                placeName: `${formatNumber(Math.pow(10, power - index))}ler Basamağı`,
                placeValue: formatNumber(placeValue),
            };
        });

        const table = {
          title: "Sayı Çözümlemesi",
          headers: ["Rakam", "Basamak Adı", "Basamak Değeri"],
          rows: breakdown.map(item => [item.digit, item.placeName, item.placeValue])
        };

        const summary = {
          total: { label: "Sayının Okunuşu", value: formatNumber(num) } // A simple representation
        }
          
        return { summary, table };
    },
  },
  content: {
    sections: [
      {
        title: "Sayı Değeri ve Basamak Değeri Nedir?",
        content: (
          <p>
            Matematikte, bir sayıyı oluşturan rakamların iki farklı değeri vardır: sayı değeri ve basamak değeri. <strong>Sayı değeri</strong>, bir rakamın kendi başına ifade ettiği değerdir (örneğin, 7 rakamının sayı değeri her zaman 7'dir). <strong>Basamak değeri</strong> ise, rakamın sayıda bulunduğu yere (konuma) göre aldığı değerdir. Örneğin, 345 sayısında 4 rakamının sayı değeri 4 iken, onlar basamağında olduğu için basamak değeri 4 x 10 = 40'tır. Bu hesaplayıcı, bir sayıyı basamaklarına ayırarak her rakamın basamak değerini açıkça gösterir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Birler, onlar, yüzler basamağı ne anlama gelir?",
        answer: "Bunlar, onluk sayı sistemindeki basamakların isimleridir. Sağdan sola doğru sayının değeri 10'un katları şeklinde artar: birler (10⁰), onlar (10¹), yüzler (10²), binler (10³) vb. Bir rakamın basamak değeri, o rakamın sayı değeri ile bulunduğu basamağın değerinin çarpımına eşittir."
      },
      {
        question: "Bu hesaplama ondalık sayılar için çalışır mı?",
        answer: "Bu araç şu anda sadece pozitif tam sayılar için tasarlanmıştır. Ondalık sayıların basamak değeri analizi, virgülün sağındaki basamakları (onda birler, yüzde birler vb.) da içerir ve farklı bir mantık gerektirir."
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