import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Oran Orantı Hesaplama (İçler Dışlar Çarpımı)",
  description: "İki oranın eşitliğinde bilinmeyen değeri (x) kolayca bulun. A/B = C/x orantı problemleri için hızlı ve doğru sonuçlar alın.",
  keywords: ["oran orantı hesaplama", "içler dışlar çarpımı", "bilinmeyeni bulma", "orantı hesaplama", "x bulma"],
  calculator: {
    title: "Oran Orantı Hesaplayıcı",
    description: (
      <p className="text-sm text-gray-600">
        Orantıdaki üç bilinen değeri girerek bilinmeyen <strong>x</strong> değerini hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'a', label: 'Değer A', type: 'number', placeholder: '2' },
      { id: 'b', label: 'Değer B', type: 'number', placeholder: '4' },
      { id: 'c', label: 'Değer C', type: 'number', placeholder: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const a = Number(inputs.a);
        const b = Number(inputs.b);
        const c = Number(inputs.c);

        if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanlara geçerli değerler girin (Değer A sıfır olamaz).' } } };
        }

        const x = (c * b) / a;

        const summary: CalculationResult['summary'] = {
            formula: { type: 'info', label: 'Formül', value: `${a} / ${b} = ${c} / x` },
            result: { type: 'result', label: 'Bilinmeyen Değer (x)', value: formatNumber(x), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Oran ve Orantı Nedir?",
        content: (
          <>
            <p>
              <strong>Oran</strong>, iki çokluğun bölünerek karşılaştırılmasıdır. Örneğin, 2 elmanın 4 portakala oranı 2/4'tür. <strong>Orantı</strong> ise iki veya daha fazla oranın eşitliğidir.
            </p>
            <p className="mt-2">
              Hesaplayıcımız, <code>A / B = C / x</code> şeklindeki bir doğru orantı problemini çözer. Bu denklemin temel prensibi "içler dışlar çarpımı"dır. Yani, iç terimlerin (B ve C) çarpımı, dış terimlerin (A ve x) çarpımına eşittir:
            </p>
            <p className="font-mono bg-gray-100 p-3 rounded-md text-center mt-2">
              A * x = B * C
            </p>
            <p className="mt-2">
              Bu denklemden bilinmeyen <strong>x</strong>'i çekmek için, eşitliğin her iki tarafını da A'ya böleriz:
            </p>
             <p className="font-mono bg-gray-100 p-3 rounded-md text-center mt-2">
              x = (B * C) / A
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Bu hesaplayıcıyı hangi durumlarda kullanabilirim?",
        answer: "Tarifleri ölçeklendirirken (örn: 2 kişilik tarif için 4 yumurta gerekiyorsa, 5 kişilik için kaç yumurta gerekir?), harita ölçeklerini dönüştürürken, kimyasal karışım oranlarını ayarlarken veya benzeri herhangi bir doğru orantı probleminde kullanabilirsiniz."
      },
      {
        question: "Ters orantı nasıl hesaplanır?",
        answer: "Bu araç doğru orantı için tasarlanmıştır. Ters orantıda, çokluklardan biri artarken diğeri azalır ve çarpımları sabittir (A * B = C * x). Bu durumda 'x' i bulmak için formül `x = (A * B) / C` şeklinde olur. Gelecekte ters orantı için de bir seçenek ekleyebiliriz."
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
        resultTitle="Orantı Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}