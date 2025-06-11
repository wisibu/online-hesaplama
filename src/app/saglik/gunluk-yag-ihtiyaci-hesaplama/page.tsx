import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Günlük Yağ İhtiyacı Hesaplama | OnlineHesaplama",
  description: "Günlük kalori ihtiyacınıza göre sağlıklı bir diyet için almanız gereken yağ miktarını (gram cinsinden) hesaplayın.",
  keywords: ["yağ hesaplama", "günlük yağ ihtiyacı", "sağlıklı yağlar", "diyet", "makro besin"],
  calculator: {
    title: "Günlük Yağ İhtiyacı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hormon dengesi, vitamin emilimi ve genel sağlık için gerekli olan yağ miktarını öğrenin.
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
        
        // Yağ ihtiyacı (Genel öneri: %20-%35)
        // 1 gr yağ = 9 kalori
        const minYag = (gunlukKalori * 0.20) / 9;
        const maxYag = (gunlukKalori * 0.35) / 9;

        const summary: CalculationResult['summary'] = {
            gunlukKalori: { label: "Günlük Kalori İhtiyacınız", value: `${formatNumber(gunlukKalori, 0)} kcal/gün` },
            yagAraligi: { 
                label: "Önerilen Günlük Yağ Miktarı", 
                value: `${formatNumber(minYag, 0)} - ${formatNumber(maxYag, 0)} gram`, 
                isHighlighted: true, 
                note: "Sağlıklı bir diyet için önerilen aralık (%20-%35)." 
            },
        };
          
        return { summary, disclaimer: "Bu sonuçlar genel önerilere dayanmaktadır. Kalp hastalığı veya yüksek kolesterol gibi durumlarınız varsa, bir sağlık profesyoneline danışmanız önemlidir." };
    },
  },
  content: {
    sections: [
      {
        title: "Yağlar Neden Diyetimizin Önemli Bir Parçasıdır?",
        content: (
          <>
            <p>
              Yağlar, genellikle kötü bir üne sahip olsalar da, sağlıklı bir diyetin vazgeçilmez bir parçasıdır. Enerji sağlamanın yanı sıra, yağda çözünen vitaminlerin (A, D, E, K) emilimi, hormon üretimi, hücre zarlarının korunması ve organların yastıklanması gibi kritik görevleri vardır.
            </p>
            <p className="mt-2">
              Önemli olan, tüketilen yağın miktarı ve türüdür. Doymuş ve trans yağlar yerine, doymamış yağ kaynaklarını tercih etmek kalp sağlığı için kritik öneme sahiptir. Amerikan Kalp Derneği gibi sağlık otoriteleri, günlük kalori alımının <strong>%20 ila %35</strong>'inin yağlardan gelmesini önermektedir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Hangi yağları tüketmeliyim?",
        answer: "<strong>Sağlıklı (Doymamış) Yağlar:</strong> Zeytinyağı, avokado, fındık, badem, ceviz gibi kuruyemişler ve tohumlar (chia, keten tohumu), somon gibi yağlı balıklar. <strong>Sınırlandırılması Gerekenler (Doymuş/Trans Yağlar):</strong> İşlenmiş gıdalar, kızartmalar, kırmızı etin yağlı kısımları, tereyağı ve tam yağlı süt ürünleri."
      },
      {
        question: "Kilo vermek için yağı tamamen kesmeli miyim?",
        answer: "Hayır, bu büyük bir hatadır. Yağlar tokluk hissine yardımcı olur ve metabolizmanın düzgün çalışması için gereklidir. Yağı tamamen kesmek yerine, porsiyon kontrolü yapmak ve sağlıksız yağ kaynaklarını sağlıklı olanlarla değiştirmek en doğru yaklaşımdır."
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
        resultTitle="Yağ İhtiyacı Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}