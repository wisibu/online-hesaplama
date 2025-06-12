import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Günlük Protein İhtiyacı Hesaplama | OnlineHesaplama",
  description: "Kilonuza ve aktivite hedeflerinize göre günlük almanız gereken ideal protein miktarını gram cinsinden öğrenin.",
  keywords: ["protein hesaplama", "günlük protein ihtiyacı", "kas geliştirme", "diyet", "makro besin"],
  calculator: {
    title: "Günlük Protein İhtiyacı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kas gelişimi, onarımı ve genel sağlık için ne kadar proteine ihtiyacınız olduğunu belirleyin.
      </p>
    ),
    inputFields: [
      { id: 'kilo', label: 'Vücut Ağırlığı (kg)', type: 'number', placeholder: '70' },
      { id: 'hedef', label: 'Hedefiniz / Aktivite Düzeyiniz', type: 'select', options: [
        { value: 'sedanter', label: 'Sedanter (Az veya hiç egzersiz)' },
        { value: 'hafif', label: 'Hafif Aktif (Kilo kontrolü, haftada 1-3 gün egzersiz)' },
        { value: 'orta', label: 'Orta Derecede Aktif (Fitness, haftada 3-5 gün egzersiz)' },
        { value: 'cok', label: 'Çok Aktif (Kas geliştirme, haftada 6-7 gün ağır antrenman)' },
      ], defaultValue: 'hafif' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { kilo, hedef } = inputs as { kilo: number, hedef: string };

        if (!kilo || kilo <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir kilo değeri girin.' } } };
        }

        const proteinRanges = {
            sedanter: { min: 0.8, max: 1.0, note: "Temel vücut fonksiyonları için yeterli miktar." },
            hafif: { min: 1.2, max: 1.5, note: "Kilo kontrolü ve hafif aktivite için ideal." },
            orta: { min: 1.5, max: 1.8, note: "Düzenli spor yapanlar ve kas kütlesini artırmak isteyenler için." },
            cok: { min: 1.8, max: 2.2, note: "Yoğun antrenman yapan sporcular ve maksimum kas gelişimi hedefleyenler için." },
        };
        
        const range = proteinRanges[hedef as keyof typeof proteinRanges];
        const minProtein = kilo * range.min;
        const maxProtein = kilo * range.max;

        const summary: CalculationResult['summary'] = {
            proteinAraligi: { 
                type: 'result',
                label: "Önerilen Günlük Protein Miktarı", 
                value: `${formatNumber(minProtein, 0)} - ${formatNumber(maxProtein, 0)} gram`, 
                isHighlighted: true, 
                note: range.note 
            },
        };
          
        return { summary, disclaimer: "Bu hesaplama genel bir rehberdir. Böbrek rahatsızlığı gibi özel durumlarınız varsa veya profesyonel bir sporcuysanız, bir sağlık uzmanına veya diyetisyene danışın." };
    },
  },
  content: {
    sections: [
      {
        title: "Protein Nedir ve Neden Önemlidir?",
        content: (
          <>
            <p>
              Protein, amino asitlerden oluşan ve vücudumuzun temel yapı taşlarından biridir. Kasların, organların, kemiklerin, cildin ve saçın onarımı ve yenilenmesi için hayati öneme sahiptir. Ayrıca, hormonların ve enzimlerin üretiminde de kilit rol oynar.
            </p>
            <p className="mt-2">
              Protein ihtiyacı, sabit bir değer değildir. Yaş, cinsiyet, kilo, kas kütlesi ve özellikle fiziksel aktivite düzeyi gibi birçok faktöre bağlı olarak değişiklik gösterir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Tek seferde ne kadar protein almalıyım?",
        answer: "Vücudun tek bir öğünde sindirebileceği protein miktarı sınırlıdır. Genel kanı, öğün başına 25-40 gram proteinin ideal olduğudur. Bu nedenle, günlük protein ihtiyacınızı gün içindeki öğünlere yayarak tüketmek en verimli yoldur."
      },
      {
        question: "En iyi protein kaynakları nelerdir?",
        answer: "Hem hayvansal hem de bitkisel kaynaklardan zengin protein alabilirsiniz. Et, tavuk, balık, yumurta ve süt ürünleri yüksek kaliteli hayvansal protein kaynaklarıdır. Baklagiller (mercimek, nohut), kinoa, soya ürünleri (tofu) ve kuruyemişler ise önemli bitkisel protein kaynaklarıdır."
      },
       {
        question: "Fazla protein alımının zararı var mıdır?",
        answer: "Sağlıklı bireyler için yüksek proteinli diyetlerin genellikle ciddi bir riski yoktur. Ancak, özellikle böbrek rahatsızlığı olan kişilerde aşırı protein tüketimi sorun yaratabilir. Herhangi bir sağlık durumunuz varsa, diyetinizi değiştirmeden önce doktorunuza danışmanız önemlidir."
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
        resultTitle="Protein İhtiyacı Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}