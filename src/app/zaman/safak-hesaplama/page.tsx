import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Şafak Hesaplama | Askerlik Şafak Sayacı | OnlineHesaplama",
  description: "Askerlik şafak sayacı ile terhisinize kaç gün kaldığını anında hesaplayın. Vatani görevini yapanlar için en kolay şafak hesaplama aracı.",
  keywords: ["şafak hesaplama", "askerlik şafak sayacı", "şafak kaç", "terhise kaç gün var", "askerlik hesaplama"],
  calculator: {
    title: "Askerlik Şafak Sayacı",
    description: (
      <p className="text-sm text-gray-600">
        Askerliğinizin biteceği (terhis) tarihi girerek şafağınızı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'terhisDate', label: 'Terhis Tarihi', type: 'date', defaultValue: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { terhisDate: terhisStr } = inputs as { terhisDate: string };
        if (!terhisStr) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir terhis tarihi girin.' } } };
        }
        
        const terhisDate = new Date(terhisStr);
        const today = new Date();
        
        // Normalize dates to the beginning of the day to count full days
        terhisDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (terhisDate < today) {
            return { summary: { safak: { label: 'Tebrikler!', value: 'Askerlik görevi tamamlandı! 🥳' } } };
        }

        const diffTime = terhisDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const summary = {
            safak: { label: 'Şafak', value: `${formatNumber(diffDays)} Gün` },
            sonuc: { label: 'Durum', value: diffDays > 0 ? 'Daha yolu var, sabır!' : 'Hayırlı teskereler!' },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Şafak Nasıl Hesaplanır?",
        content: (
          <p>
           Şafak, askerlikte terhis gününe kalan gün sayısını ifade eden bir terimdir. Hesaplama oldukça basittir: Terhis tarihinden bugünün tarihi çıkarılır. Ortaya çıkan fark, askerliğin bitmesine kalan gün sayısını, yani şafağı verir. Bu sayaç, askerlik yapanlar ve onların yakınları için zamanı takip etmenin ve motivasyon bulmanın popüler bir yoludur. "Doğan güneş" veya "batan güneş" gibi ifadelerle de kalan gün sayısı esprili bir şekilde ifade edilir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Hesaplama yol iznini içeriyor mu?",
        answer: "Hayır, bu hesaplayıcı standart bir şafak sayacıdır ve kişiye özel yol izinlerini veya diğer izinleri hesaba katmaz. Sadece girdiğiniz terhis tarihi ile bugünün tarihi arasındaki takvim günü farkını hesaplar."
      },
      {
        question: "Şafak 'doğan güneş' olarak mı sayılır?",
        answer: "Halk arasında ve askerlik jargonunda şafak genellikle 'doğan güneş' olarak, yani kalan gün sayısı olarak ifade edilir. Örneğin, 'Şafak 81' demek, terhise 81 gün kaldığı anlamına gelir. Bazı birimlerde veya arkadaş gruplarında farklı gelenekler olabilir, ancak en yaygın kullanım bu şekildedir."
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
        resultTitle="Şafak Sayacı Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}