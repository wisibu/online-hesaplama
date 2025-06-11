import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const checkDivisibility = (num: number) => {
    const numStr = String(num);
    const digits = numStr.split('').map(Number);
    const lastDigit = digits[digits.length - 1];
    const sumOfDigits = digits.reduce((a, b) => a + b, 0);

    return [
        {
            divisor: 2,
            isDivisible: lastDigit % 2 === 0,
            rule: "Son rakamı çift (0, 2, 4, 6, 8) olmalıdır.",
        },
        {
            divisor: 3,
            isDivisible: sumOfDigits % 3 === 0,
            rule: "Rakamları toplamı 3 veya 3'ün katı olmalıdır.",
        },
        {
            divisor: 4,
            isDivisible: num % 4 === 0, // veya Number(numStr.slice(-2)) % 4 === 0
            rule: "Son iki basamağı 00 veya 4'ün katı olmalıdır.",
        },
        {
            divisor: 5,
            isDivisible: lastDigit === 0 || lastDigit === 5,
            rule: "Son rakamı 0 veya 5 olmalıdır.",
        },
        {
            divisor: 6,
            isDivisible: (lastDigit % 2 === 0) && (sumOfDigits % 3 === 0),
            rule: "Sayı hem 2'ye hem de 3'e tam bölünmelidir.",
        },
        {
            divisor: 8,
            isDivisible: num % 8 === 0, // veya Number(numStr.slice(-3)) % 8 === 0
            rule: "Son üç basamağı 000 veya 8'in katı olmalıdır.",
        },
        {
            divisor: 9,
            isDivisible: sumOfDigits % 9 === 0,
            rule: "Rakamları toplamı 9 veya 9'ün katı olmalıdır.",
        },
        {
            divisor: 10,
            isDivisible: lastDigit === 0,
            rule: "Son rakamı 0 olmalıdır.",
        },
        {
            divisor: 11,
            isDivisible: num % 11 === 0,
            rule: "Rakamları sağdan sola +,- şeklinde işaretlenip toplandığında sonuç 0 veya 11'in katı olmalıdır.",
        },
    ];
};


const pageConfig = {
  title: "Bölünebilme Kuralları Hesaplama | OnlineHesaplama",
  description: "Bir sayının 2, 3, 4, 5, 6, 8, 9, 10 ve 11'e tam bölünüp bölünmediğini kurallarıyla birlikte anında öğrenin.",
  keywords: ["bölünebilme kuralları", "tam bölünüyor mu", "kalansız bölme", "matematik kuralları"],
  calculator: {
    title: "Bölünebilme Kuralları Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Analiz etmek istediğiniz pozitif tam sayıyı girin.
      </p>
    ),
    inputFields: [
      { id: 'number', label: 'Sayı', type: 'number', placeholder: 'Örn: 12345' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const num = Number(inputs.number);
        if (isNaN(num) || !Number.isInteger(num) || num < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen pozitif bir tam sayı girin.' } } };
        }

        const results = checkDivisibility(num);

        const table = {
          title: "Bölünebilme Sonuçları",
          headers: ["Bölen Sayı", "Bölünüyor Mu?", "Kural"],
          rows: results.map(res => [
              String(res.divisor), 
              res.isDivisible ? 'Evet ✅' : 'Hayır ❌', 
              res.rule
            ])
        };
          
        return { summary: {}, table };
    },
  },
  content: {
    sections: [
      {
        title: "Bölünebilme Kuralları Nedir?",
        content: (
          <p>
            Bölünebilme kuralları, bir sayının başka bir sayıya kalansız olarak (tam) bölünüp bölünmediğini, uzun bölme işlemi yapmadan anlamamızı sağlayan pratik yöntemlerdir. Her sayının kendine özgü bölünebilme kuralları vardır. Bu kurallar, sayıların son basamaklarına, rakamları toplamına veya diğer özelliklerine dayanır. Hesap makinemiz, en sık kullanılan bölünebilme kurallarını sizin için otomatik olarak kontrol eder.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "7 ile bölünebilme kuralı neden listede yok?",
        answer: "7 ile bölünebilme kuralı, diğer kurallara göre daha karmaşık ve uygulaması daha az pratiktir. Genellikle sayıyı 7'ye bölmek, kuralı uygulamaktan daha hızlı olduğu için listeye dahil edilmemiştir."
      },
      {
        question: "Bir sayı 6'ya bölünüyorsa 2 ve 3'e de bölünür mü?",
        answer: "Evet, bu doğrudur. Bir sayının 6'ya tam bölünebilmesi için, aralarında asal çarpanları olan 2 ve 3'e de tam bölünmesi gerekir. Bu mantık, aralarında asal çarpanlara ayrılabilen diğer sayılar için de geçerlidir (örneğin, 12 için 3 ve 4'e bölünme)."
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