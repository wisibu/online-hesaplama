import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Sayı Yuvarlama Hesaplama | OnlineHesaplama",
  description: "Bir ondalık sayıyı istediğiniz basamağa göre en yakına, yukarıya veya aşağıya kolayca yuvarlayın. Yuvarlama mantığını öğrenin.",
  keywords: ["sayı yuvarlama", "ondalık yuvarlama", "en yakına yuvarlama", "yukarı yuvarlama", "aşağı yuvarlama"],
  calculator: {
    title: "Sayı Yuvarlama Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yuvarlamak istediğiniz sayıyı, ondalık basamak sayısını ve yuvarlama türünü seçin.
      </p>
    ),
    inputFields: [
      { id: 'number', label: 'Sayı', type: 'number', placeholder: 'Örn: 123.456' },
      { id: 'digits', label: 'Ondalık Basamak Sayısı', type: 'number', placeholder: 'Örn: 2' },
      { id: 'method', label: 'Yuvarlama Yöntemi', type: 'select', options: [
        { value: 'nearest', label: 'En Yakına Yuvarla' },
        { value: 'up', label: 'Yukarı Yuvarla' },
        { value: 'down', label: 'Aşağı Yuvarla' },
      ]},
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const num = Number(inputs.number);
        const digits = Number(inputs.digits);
        const method = inputs.method as 'nearest' | 'up' | 'down';

        if (isNaN(num) || isNaN(digits) || !Number.isInteger(digits) || digits < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir sayı ve ondalık basamak sayısı girin.' } } };
        }

        const factor = Math.pow(10, digits);
        let result: number;

        switch(method) {
            case 'up':
                result = Math.ceil(num * factor) / factor;
                break;
            case 'down':
                result = Math.floor(num * factor) / factor;
                break;
            case 'nearest':
            default:
                result = Math.round(num * factor) / factor;
                break;
        }

        const summary = {
            original: { label: 'Orijinal Sayı', value: String(num) },
            result: { label: 'Yuvarlanmış Sonuç', value: formatNumber(result, digits) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Sayı Yuvarlama Nasıl Yapılır?",
        content: (
          <p>
            Sayı yuvarlama, bir sayıyı daha kısa ve daha basit bir temsile dönüştürme işlemidir. Genellikle ondalık sayılarla çalışırken kullanılır. Üç temel yöntem vardır: <br/>
            <strong>En Yakına Yuvarlama:</strong> Sayı, en yakın tam sayıya veya ondalık değere yuvarlanır. Atılacak ilk rakam 5 veya daha büyükse, önceki rakam bir artırılır. <br/>
            <strong>Yukarı Yuvarlama (Ceiling):</strong> Sayı, kendisinden büyük veya kendisine eşit olan en yakın tam sayıya/değere yuvarlanır. <br/>
            <strong>Aşağı Yuvarlama (Floor):</strong> Sayı, kendisinden küçük veya kendisine eşit olan en yakın tam sayıya/değere yuvarlanır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Finansal işlemlerde hangi yuvarlama kullanılır?",
        answer: "Finansal hesaplamalarda genellikle 'en yakına yuvarlama' yöntemi kullanılır. Özellikle para birimleri söz konusu olduğunda, genellikle iki ondalık basamağa (kuruşlara) yuvarlama yapılır."
      },
      {
        question: "Neden ondalık basamak sayısı belirtmem gerekiyor?",
        answer: "Ondalık basamak sayısı, yuvarlamanın hassasiyetini belirler. Örneğin, bir sayıyı 0 ondalık basamağa yuvarlamak, onu en yakın tam sayıya yuvarlamak anlamına gelirken, 2 ondalık basamağa yuvarlamak, virgülden sonra iki rakam kalacak şekilde yuvarlamak demektir."
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
        resultTitle="Yuvarlama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 