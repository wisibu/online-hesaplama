import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import Link from 'next/link';
import { calculateCombination } from '@/utils/math';

const pageConfig = {
  title: "Kombinasyon Hesaplama C(n,r) | OnlineHesaplama",
  description: "n elemanlı bir kümenin r elemanlı kombinasyonlarının sayısını (C(n,r)) kolayca hesaplayın. Olasılık ve sayma problemlerinizi çözün.",
  keywords: ["kombinasyon hesaplama", "C(n,r)", "n'in r'li kombinasyonu", "seçim hesaplama"],
  calculator: {
    title: "Kombinasyon Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Toplam eleman sayısını (n) ve seçilecek eleman sayısını (r) girerek kombinasyon sonucunu hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'n', label: 'Toplam Eleman Sayısı (n)', type: 'number', placeholder: 'Örn: 10' },
      { id: 'r', label: 'Seçilecek Eleman Sayısı (r)', type: 'number', placeholder: 'Örn: 3' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const n = Number(inputs.n);
        const r = Number(inputs.r);

        if (isNaN(n) || isNaN(r) || !Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) {
            return { summary: { result: { type: 'error', label: 'Hata', value: 'Lütfen negatif olmayan tam sayılar girin.' } } };
        }

        if (r > n) {
            return { summary: { result: { type: 'error', label: 'Hata', value: 'Seçilecek eleman sayısı (r), toplam eleman sayısından (n) büyük olamaz.' } } };
        }
        
        if (n > 1000) {
          return { summary: { result: { type: 'error', label: 'Hata', value: 'Çok büyük sayılarla (n > 1000) hesaplama yapılamamaktadır.' } } };
        }

        const result = calculateCombination(n, r);

        const summary: CalculationResult['summary'] = {
            result: { type: 'result', label: `C(${n}, ${r}) Sonucu`, value: result.toString(), isHighlighted: true },
            formula: { type: 'info', label: 'Formül', value: 'C(n, r) = n! / (r! * (n - r)!)' }
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Kombinasyon Nedir?",
        content: (
          <p>
            Kombinasyon, bir nesne grubu içerisinden sıra gözetmeksizin yapılan seçim sayısını ifade eder. Matematiksel olarak, 'n' elemanlı bir kümenin 'r' elemanlı alt kümelerinin sayısı olarak tanımlanır ve C(n, r) şeklinde gösterilir. Örneğin, {'{A, B, C}'} harflerinden 2 tanesini seçmek istediğimizde, seçimlerimiz {'{A, B}'}, {'{A, C}'}, {'{B, C}'} olur. Sıra önemli olmadığı için {'{A, B}'} ile {'{B, A}'} aynı seçimdir. Dolayısıyla C(3, 2) = 3'tür.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Kombinasyon ve Permütasyon arasındaki fark nedir?",
        answer: "En temel fark 'sıra'dır. Permütasyonda seçimlerin sırası önemlidir (örneğin, bir yarışta ilk 3), kombinasyonda ise sıranın önemi yoktur (örneğin, bir loto kuponu doldurmak). Sıralamanın önemli olduğu durumlar için Permütasyon Hesaplayıcı'yı kullanabilirsiniz."
      },
      {
        question: "C(n, r) = C(n, n-r) eşitliği doğru mudur?",
        answer: "Evet, bu eşitlik kombinasyonun temel özelliklerinden biridir ve her zaman doğrudur. n elemanlı bir kümeden r tane eleman seçmek, geriye kalan n-r tane elemanı seçmemekle aynı anlama gelir. Hesaplayıcımız, daha hızlı sonuçlar için bu özelliği kullanır ve C(10, 8) yerine C(10, 2) hesaplar."
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
      <div className="text-center mt-4">
        <Link href="/matematik/permutasyon-hesaplama" className="text-blue-600 hover:underline">
          Sıralamanın önemli olduğu durumlar için Permütasyon Hesaplayıcı'ya gidin →
        </Link>
      </div>
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}