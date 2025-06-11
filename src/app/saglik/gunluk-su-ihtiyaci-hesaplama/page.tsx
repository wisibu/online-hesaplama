import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Günlük Su İhtiyacı Hesaplama | OnlineHesaplama",
  description: "Kilonuza ve günlük aktivite düzeyinize göre vücudunuzun ihtiyaç duyduğu günlük su miktarını (litre cinsinden) hesaplayın.",
  keywords: ["su ihtiyacı hesaplama", "günlük su tüketimi", "hidrasyon", "ne kadar su içmeliyim"],
  calculator: {
    title: "Günlük Su İhtiyacı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Sağlıklı bir yaşam için günde ne kadar su içmeniz gerektiğini öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'kilo', label: 'Vücut Ağırlığınız (kg)', type: 'number', placeholder: '70' },
      { id: 'aktivite', label: 'Günlük Egzersiz Süreniz', type: 'select', options: [
        { value: '0', label: 'Egzersiz Yapmıyorum / Masa başı iş' },
        { value: '500', label: 'Hafif Egzersiz (30 dakika yürüyüş vb.)' },
        { value: '1000', label: 'Orta Düzey Egzersiz (1 saat spor)' },
        { value: '1500', label: 'Yoğun Egzersiz (90+ dakika ağır antrenman)' },
      ], defaultValue: '500' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { kilo, aktivite } = inputs as { kilo: number, aktivite: number };

        if (!kilo || kilo <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir kilo değeri girin.' } } };
        }

        const baseIntakeMl = kilo * 35;
        const totalIntakeMl = baseIntakeMl + Number(aktivite);
        const totalIntakeL = totalIntakeMl / 1000;

        const summary: CalculationResult['summary'] = {
            suIhtiyaci: { 
                label: "Önerilen Günlük Su Tüketimi", 
                value: `${formatNumber(totalIntakeL, 2)} litre`, 
                isHighlighted: true, 
                note: `Bu da yaklaşık ${Math.round(totalIntakeL / 0.25)} su bardağı eder (250ml/bardak).`
            },
        };
          
        return { summary, disclaimer: "Bu hesaplama genel bir tavsiyedir. Sıcak hava, nem, yaş ve genel sağlık durumunuz gibi faktörler su ihtiyacınızı etkileyebilir. Özellikle bir sağlık sorununuz varsa doktorunuza danışın." };
    },
  },
  content: {
    sections: [
      {
        title: "Su İçmenin Hayati Önemi",
        content: (
          <>
            <p>
              Vücudumuzun yaklaşık %60'ı sudan oluşur. Su, vücut ısısını düzenlemekten besinleri hücrelere taşımaya, eklemleri kayganlaştırmaktan toksinleri atmaya kadar sayısız hayati fonksiyonda rol oynar. Yetersiz su tüketimi (dehidrasyon), yorgunluk, baş ağrısı, konsantrasyon güçlüğü ve ciddi sağlık sorunlarına yol açabilir.
            </p>
            <h4 className="font-semibold mt-3">Ne Kadar Su Yeterlidir?</h4>
            <p className="mt-2">
              Su ihtiyacı kişiden kişiye değişir. Genel bir kural olarak, kilogram başına yaklaşık 35 ml su tüketilmesi önerilir. Ancak bu miktar, yapılan fiziksel aktivite, iklim ve kişisel sağlık durumu gibi faktörlere bağlı olarak artar. Hesaplayıcımız, bu temel faktörleri göz önünde bulundurarak size kişiselleştirilmiş bir öneri sunar.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Çay, kahve gibi içecekler suyun yerine geçer mi?",
        answer: "Hayır. Çay ve kahve gibi kafeinli içecekler diüretik (idrar söktürücü) etkiye sahip oldukları için vücuttan su atımını artırabilirler. Su ihtiyacını karşılamanın en iyi yolu saf su içmektir. Bitki çayları veya su oranı yüksek meyveler (karpuz, salatalık) su alımına katkı sağlayabilir."
      },
      {
        question: "Susadığımda su içmem yeterli değil mi?",
        answer: "Susama hissi, vücudun dehidrasyon sinyalidir ve genellikle vücut su kaybetmeye başladığında ortaya çıkar. Bu nedenle, susamayı beklemeden gün boyunca düzenli olarak su içmek en iyisidir. İdrar rengini takip etmek iyi bir gösterge olabilir; açık sarı renk yeterli hidrasyonu gösterirken, koyu renk daha fazla su içmeniz gerektiğine işaret eder."
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
        resultTitle="Su Tüketim Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}