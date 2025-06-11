import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Günlük Kalori İhtiyacı Hesaplama | OnlineHesaplama",
  description: "Cinsiyet, yaş, boy, kilo ve aktivite seviyenizi girerek bazal metabolizma hızınızı (BMH) ve günlük almanız gereken kalori miktarını hesaplayın.",
  keywords: ["günlük kalori ihtiyacı hesaplama", "kalori hesaplama", "bazal metabolizma hızı", "bmh hesaplama"],
  calculator: {
    title: "Günlük Kalori İhtiyacı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kilo korumak, kilo vermek veya almak için günde kaç kaloriye ihtiyacınız olduğunu öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'cinsiyet', label: 'Cinsiyet', type: 'select', options: [{ value: 'kadin', label: 'Kadın' }, { value: 'erkek', label: 'Erkek' }], defaultValue: 'kadin' },
      { id: 'yas', label: 'Yaş', type: 'number', placeholder: '30' },
      { id: 'boy', label: 'Boy (cm)', type: 'number', placeholder: '165' },
      { id: 'kilo', label: 'Kilo (kg)', type: 'number', placeholder: '60' },
      { id: 'aktivite', label: 'Haftalık Aktivite Seviyesi', type: 'select', options: [
        { value: '1.2', label: 'Sedanter (Masa başı iş, az veya hiç egzersiz)' },
        { value: '1.375', label: 'Hafif Aktif (Haftada 1-3 gün hafif egzersiz)' },
        { value: '1.55', label: 'Orta Derecede Aktif (Haftada 3-5 gün orta düzey egzersiz)' },
        { value: '1.725', label: 'Çok Aktif (Haftada 6-7 gün ağır egzersiz)' },
        { value: '1.9', label: 'Ekstra Aktif (Çok ağır egzersiz, fiziksel iş)' },
      ], defaultValue: '1.375' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { cinsiyet, yas, boy, kilo, aktivite } = inputs as { cinsiyet: 'kadin' | 'erkek', yas: number, boy: number, kilo: number, aktivite: number };

        if (!yas || !boy || !kilo || yas <=0 || boy <= 0 || kilo <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanlara geçerli pozitif değerler girin.' } } };
        }

        // Mifflin-St Jeor Formülü
        let bmh = 0;
        if (cinsiyet === 'erkek') {
            bmh = (10 * kilo) + (6.25 * boy) - (5 * yas) + 5;
        } else { // kadın
            bmh = (10 * kilo) + (6.25 * boy) - (5 * yas) - 161;
        }

        const gunlukKalori = bmh * aktivite;

        const summary: CalculationResult['summary'] = {
            bmh: { label: "Bazal Metabolizma Hızı (BMH)", value: `${formatNumber(bmh, 0)} kcal/gün`, note: "Hiç hareket etmeseniz bile vücudunuzun harcadığı enerji." },
            gunlukKalori: { label: "Günlük Kalori İhtiyacı", value: `${formatNumber(gunlukKalori, 0)} kcal/gün`, isHighlighted: true, note: "Mevcut kilonuzu korumak için gereken kalori." },
            kiloVermek: { label: "Kilo Vermek İçin (Hafif)", value: `${formatNumber(gunlukKalori - 300, 0)} kcal/gün` },
            kiloAlmak: { label: "Kilo Almak İçin (Hafif)", value: `${formatNumber(gunlukKalori + 300, 0)} kcal/gün` },
        };
          
        return { summary, disclaimer: "Bu sonuçlar bir tahmindir. Kişisel sağlık hedefleriniz için bir diyetisyen veya doktora danışmanız önerilir." };
    },
  },
  content: {
    sections: [
      {
        title: "Bazal Metabolizma Hızı (BMH) ve Günlük Kalori İhtiyacı Nedir?",
        content: (
          <>
            <p>
              <strong>Bazal Metabolizma Hızı (BMH)</strong>, vücudunuzun dinlenme halindeyken (uyurken veya uzanırken) hayati fonksiyonlarını (nefes alma, kan dolaşımı, hücre üretimi vb.) sürdürmek için ihtiyaç duyduğu minimum enerji miktarıdır.
            </p>
            <p className="mt-2">
              <strong>Günlük Toplam Kalori İhtiyacı</strong> ise, BMH'nizin üzerine günlük fiziksel aktiviteleriniz (yürüme, spor yapma, çalışma) için harcadığınız enerjinin eklenmesiyle bulunur. Bu hesaplayıcı, bu değeri tahmin etmek için en güncel ve güvenilir kabul edilen <strong>Mifflin-St Jeor</strong> formülünü kullanır.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Kilo vermek için günde kaç kalori kesmeliyim?",
        answer: "Sağlıklı ve sürdürülebilir kilo kaybı için genellikle günlük kalori ihtiyacınızdan 300-500 kalori daha az almanız önerilir. Bu, haftada yaklaşık 0.5 kg kaybetmenize yardımcı olur. Çok düşük kalorili şok diyetlerden kaçınmak önemlidir."
      },
      {
        question: "Bu hesaplama sporcular için de geçerli mi?",
        answer: "Evet, 'Çok Aktif' ve 'Ekstra Aktif' seçenekleri sporcuların ve fiziksel olarak ağır işlerde çalışanların ihtiyaçlarını yansıtmayı hedefler. Ancak, profesyonel sporcuların veya özel beslenme gereksinimleri olanların bir spor diyetisyeni ile çalışması en doğrusudur."
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
        resultTitle="Günlük Enerji İhtiyacı Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}