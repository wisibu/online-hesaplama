import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Günlük Karbonhidrat İhtiyacı Hesaplama | OnlineHesaplama",
  description: "Günlük kalori ihtiyacınıza ve hedeflerinize göre almanız gereken karbonhidrat miktarını (gram cinsinden) kolayca hesaplayın.",
  keywords: ["karbonhidrat hesaplama", "günlük karbonhidrat ihtiyacı", "makro besin hesaplama", "diyet hesaplama"],
  calculator: {
    title: "Günlük Karbonhidrat İhtiyacı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Vücudunuzun temel enerji kaynağı olan karbonhidrat ihtiyacını öğrenin.
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

        // Mifflin-St Jeor Formülü ile BMH
        let bmh = 0;
        if (cinsiyet === 'erkek') {
            bmh = (10 * kilo) + (6.25 * boy) - (5 * yas) + 5;
        } else { // kadın
            bmh = (10 * kilo) + (6.25 * boy) - (5 * yas) - 161;
        }

        const gunlukKalori = bmh * aktivite;
        
        // Karbonhidrat ihtiyacı (Genel öneri: %45-%65)
        // 1 gr karbonhidrat = 4 kalori
        const minKarbonhidrat = (gunlukKalori * 0.45) / 4;
        const maxKarbonhidrat = (gunlukKalori * 0.65) / 4;

        const summary: CalculationResult['summary'] = {
            gunlukKalori: { label: "Günlük Kalori İhtiyacı", value: `${formatNumber(gunlukKalori, 0)} kcal/gün`, note: "Mevcut kilonuzu korumak için gereken kalori." },
            karbonhidratAraligi: { label: "Önerilen Günlük Karbonhidrat Miktarı", value: `${formatNumber(minKarbonhidrat, 0)} - ${formatNumber(maxKarbonhidrat, 0)} gram`, isHighlighted: true, note: "Sağlıklı bir diyet için önerilen aralık (%45-%65)." },
            sporcularIcin: { label: "Sporcular İçin (Yoğun Antrenman)", value: `${formatNumber((gunlukKalori * 0.60) / 4, 0)} - ${formatNumber((gunlukKalori * 0.70) / 4, 0)} gram`, note:"Performans odaklı öneri."}
        };
          
        return { summary, disclaimer: "Bu sonuçlar genel önerilere dayanmaktadır. Özellikle diyabet gibi kronik bir rahatsızlığınız varsa veya özel bir diyet uyguluyorsanız bir sağlık profesyoneline danışın." };
    },
  },
  content: {
    sections: [
      {
        title: "Günlük Karbonhidrat İhtiyacı Nasıl Belirlenir?",
        content: (
          <>
            <p>
              Karbonhidratlar, vücudun birincil enerji kaynağıdır. Beyin fonksiyonlarından fiziksel aktivitelere kadar birçok işlem için gereklidir. Günlük karbonhidrat ihtiyacı, kişiden kişiye değişir ve toplam kalori alımı, aktivite düzeyi ve sağlık hedeflerine bağlıdır.
            </p>
            <p className="mt-2">
              Genel olarak sağlıklı bireyler için günlük toplam kalori alımının <strong>%45 ila %65</strong>'inin karbonhidratlardan gelmesi önerilir. Hesaplayıcımız, bu aralığı kullanarak size gram cinsinden bir hedef sunar. 1 gram karbonhidrat yaklaşık 4 kalori içerir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Hangi tür karbonhidratları tüketmeliyim?",
        answer: "Basit karbonhidratlar (şeker, beyaz unlu mamuller) yerine kompleks karbonhidratları (tam tahıllar, baklagiller, sebzeler) tercih etmek daha sağlıklıdır. Kompleks karbonhidratlar daha yavaş sindirilir, kan şekerini dengeler ve daha uzun süre tokluk hissi sağlar."
      },
      {
        question: "Kilo vermek için karbonhidratları kesmeli miyim?",
        answer: "Karbonhidratları tamamen kesmek yerine, doğru türleri ve porsiyonları seçmek önemlidir. Düşük karbonhidratlı diyetler kısa vadede etkili olabilse de, sürdürülebilirliği ve uzun vadeli sağlık etkileri tartışmalıdır. Dengeli bir makro besin dağılımı genellikle en iyi yaklaşımdır."
      },
       {
        question: "Spor yapıyorsam daha fazla mı karbonhidrat tüketmeliyim?",
        answer: "Evet. Özellikle dayanıklılık sporları veya yoğun kuvvet antrenmanları yapan sporcuların kas glikojen depolarını doldurmak ve performansı artırmak için daha yüksek oranda karbonhidrata ihtiyacı vardır. Bu oran %60-70'lere kadar çıkabilir."
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
        resultTitle="Makro Besin Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}