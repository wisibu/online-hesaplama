import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "EBOB - EKOK Hesaplama | OnlineHesaplama",
  description: "İki veya daha fazla sayının En Büyük Ortak Bölen (EBOB) ve En Küçük Ortak Kat (EKOK) değerlerini anında ve doğru bir şekilde hesaplayın.",
  keywords: ["ebob ekok hesaplama", "en büyük ortak bölen", "en küçük ortak kat", "obeb okek hesaplama"],
  calculator: {
    title: "EBOB ve EKOK Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        EBOB ve EKOK değerlerini bulmak istediğiniz sayıları girin. İkiden fazla sayı için 'Sayı Ekle' butonunu kullanabilirsiniz.
      </p>
    ),
    inputFields: [
      { id: 'note1', label: '1. Sayı', type: 'number', placeholder: 'Örn: 48' },
      { id: 'note2', label: '2. Sayı', type: 'number', placeholder: 'Örn: 60' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';

        const gcd = (a: number, b: number): number => {
            return b === 0 ? a : gcd(b, a % b);
        };
        
        const lcm = (a: number, b: number): number => {
            if (a === 0 || b === 0) return 0;
            return Math.abs(a * b) / gcd(a, b);
        };
        
        const numbers = Object.values(inputs)
            .map(val => Number(val))
            .filter(num => !isNaN(num) && Number.isInteger(num) && num > 0);

        if (numbers.length < 2) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen en az iki pozitif tam sayı girin.' } } };
        }

        const ebob = numbers.reduce((a, b) => gcd(a, b));
        const ekok = numbers.reduce((a, b) => lcm(a, b));

        const summary = {
            ebob: { label: 'EBOB (En Büyük Ortak Bölen)', value: formatNumber(ebob), isHighlighted: true },
            ekok: { label: 'EKOK (En Küçük Ortak Kat)', value: formatNumber(ekok), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "EBOB ve EKOK Nedir?",
        content: (
          <p>
            <strong>EBOB (En Büyük Ortak Bölen):</strong> İki veya daha fazla tam sayıyı aynı anda kalansız olarak bölebilen en büyük pozitif tam sayıdır. Örneğin, 12 ve 18'in ortak bölenleri 1, 2, 3 ve 6'dır. Bunların en büyüğü 6 olduğu için EBOB(12, 18) = 6'dır. <br/><br/>
            <strong>EKOK (En Küçük Ortak Kat):</strong> İki veya daha fazla tam sayının ortak katlarının en küçüğüdür. Örneğin, 4 ve 6'nın katları sırasıyla {'{4, 8, 12, 16, 20, 24...}'} ve {'{6, 12, 18, 24...}'} şeklindedir. Ortak katların en küçüğü 12 olduğu için EKOK(4, 6) = 12'dir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "EBOB ve EKOK nerelerde kullanılır?",
        answer: "EBOB, genellikle rasyonel sayıları sadeleştirme veya nesneleri eşit gruplara ayırma problemlerinde kullanılır. EKOK ise, farklı zaman periyotlarında tekrar eden olayların ne zaman aynı anda gerçekleşeceğini bulma gibi periyodik problemlerin çözümünde kullanılır."
      },
      {
        question: "Aralarında asal sayıların EBOB ve EKOK'u kaçtır?",
        answer: "1'den başka ortak böleni olmayan sayılara aralarında asal sayılar denir. Aralarında asal iki sayının EBOB'u her zaman 1'dir. EKOK'u ise bu iki sayının çarpımına eşittir."
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
        dynamicFieldsConfig={{
          type: 'single',
          buttonLabel: 'Sayı Ekle',
          fieldLabel: 'Sayı',
          fieldPrefix: 'sayi'
        }}
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
