import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import Link from 'next/link';
import { calculatePermutation } from '@/utils/math';

const pageConfig = {
  title: "Permütasyon Hesaplama P(n,r) | OnlineHesaplama",
  description: "n elemanlı bir kümenin r elemanlı permütasyonlarının (sıralamalarının) sayısını (P(n,r)) kolayca hesaplayın. Olasılık ve sayma problemlerinizi çözün.",
  keywords: ["permütasyon hesaplama", "P(n,r)", "n'in r'li permütasyonu", "sıralama hesaplama"],
  calculator: {
    title: "Permütasyon Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Toplam eleman sayısını (n) ve sıralanacak eleman sayısını (r) girerek permütasyon sonucunu hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'n', label: 'Toplam Eleman Sayısı (n)', type: 'number', placeholder: 'Örn: 10' },
      { id: 'r', label: 'Sıralanacak Eleman Sayısı (r)', type: 'number', placeholder: 'Örn: 3' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const n = Number(inputs.n);
        const r = Number(inputs.r);

        if (isNaN(n) || isNaN(r) || !Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen negatif olmayan tam sayılar girin.' } } };
        }

        if (r > n) {
            return { summary: { error: { label: 'Hata', value: 'Sıralanacak eleman sayısı (r), toplam eleman sayısından (n) büyük olamaz.' } } };
        }

        if (n > 1000) {
          return { summary: { error: { label: 'Hata', value: 'Çok büyük sayılarla (n > 1000) hesaplama yapılamamaktadır.' } } };
        }

        const result = calculatePermutation(n, r);

        const summary = {
            result: { label: `P(${n}, ${r}) Sonucu`, value: result.toString(), isHighlighted: true },
            formula: { label: 'Formül', value: 'P(n, r) = n! / (n - r)!' }
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Permütasyon Nedir?",
        content: (
          <p>
            Permütasyon, bir nesne grubu içerisinden belirli sayıda nesnenin oluşturabileceği farklı sıralamaların sayısını ifade eder. Matematiksel olarak, 'n' elemanlı bir kümenin 'r' elemanlı sıralı dizilişlerinin sayısı olarak tanımlanır ve P(n, r) şeklinde gösterilir. Kombinasyondan temel farkı, permütasyonda sıranın önemli olmasıdır. Örneğin, 1, 2, 3 rakamlarıyla oluşturulabilecek iki basamaklı farklı sayılar (12, 21, 13, 31, 23, 32) bir permütasyon problemidir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Permütasyon ve Kombinasyon arasındaki fark nedir?",
        answer: "En temel fark 'sıra'dır. Permütasyonda sıralama önemliyken (örn: bir yarışta ilk 3), kombinasyonda önemli değildir (örn: bir menüden 3 çeşit yemek seçmek). Permütasyon sonuçları genellikle kombinasyon sonuçlarından daha fazladır çünkü her farklı sıralama ayrı ayrı sayılır. Kombinasyon hesaplamak için ilgili aracımızı kullanabilirsiniz."
      },
      {
        question: "Bir yarışta ilk üçün sıralaması permütasyon mudur?",
        answer: "Evet, bu klasik bir permütasyon örneğidir. 10 atletin yarıştığı bir maratonda ilk üç derecenin (altın, gümüş, bronz) kaç farklı şekilde oluşabileceği P(10, 3) ile hesaplanır, çünkü kimin birinci, kimin ikinci, kimin üçüncü olduğu önemlidir, yani sıra önemlidir."
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
        <Link href="/matematik/kombinasyon-hesaplama" className="text-blue-600 hover:underline">
          Sıralamanın önemli olmadığı durumlar için Kombinasyon Hesaplayıcı'ya gidin →
        </Link>
      </div>
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}