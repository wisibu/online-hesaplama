import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const activityLevels = [
    { value: '1.2', label: 'Hareketsiz (Ofis işi, çok az egzersiz)' },
    { value: '1.375', label: 'Hafif Aktif (Haftada 1-3 gün hafif egzersiz)' },
    { value: '1.55', label: 'Orta Derecede Aktif (Haftada 3-5 gün orta düzeyde egzersiz)' },
    { value: '1.725', label: 'Çok Aktif (Haftada 6-7 gün ağır egzersiz)' },
    { value: '1.9', label: 'Ekstra Aktif (Çok ağır egzersiz, fiziksel iş)' },
];

const pageConfig = {
  title: "Günlük Kalori İhtiyacı Hesaplama | OnlineHesaplama",
  description: "Yaş, cinsiyet, kilo, boy ve aktivite seviyenize göre günlük kalori ihtiyacınızı hesaplayın. Kilo almak, vermek veya kilonuzu korumak için kaç kalori almanız gerektiğini öğrenin.",
  keywords: ["kalori hesaplama", "günlük kalori ihtiyacı", "bazal metabolizma hızı", "bmh hesaplama", "kilo verme"],
  calculator: {
    title: "Günlük Kalori İhtiyacı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kişisel bilgilerinizi girerek günlük almanız gereken kalori miktarını ve hedeflerinize yönelik önerileri öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'gender', label: 'Cinsiyet', type: 'select', options: [{value: 'male', label: 'Erkek'}, {value: 'female', label: 'Kadın'}] },
      { id: 'age', label: 'Yaş', type: 'number', placeholder: '30' },
      { id: 'weight', label: 'Kilo (kg)', type: 'number', placeholder: '75' },
      { id: 'height', label: 'Boy (cm)', type: 'number', placeholder: '180' },
      { id: 'activityLevel', label: 'Günlük Aktivite Seviyesi', type: 'select', options: activityLevels },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const { gender, age, weight, height, activityLevel } = inputs;
      const numAge = Number(age);
      const numWeight = Number(weight);
      const numHeight = Number(height);
      const numActivityLevel = Number(activityLevel);

      if (numAge <= 0 || numWeight <= 0 || numHeight <= 0) return null;
      
      let bmr = 0;
      if (gender === 'male') {
        // Mifflin-St Jeor Formülü (Erkek)
        bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge + 5;
      } else {
        // Mifflin-St Jeor Formülü (Kadın)
        bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge - 161;
      }
      
      const tdee = bmr * numActivityLevel; // Toplam Günlük Enerji Harcaması
      
      const summary = {
        bmr: { label: 'Bazal Metabolizma Hızı (BMH)', value: `${formatNumber(bmr)} kcal/gün` },
        maintenance: { label: 'Kilo Korumak İçin', value: `${formatNumber(tdee)} kcal/gün` },
        mildLoss: { label: 'Hafif Kilo Kaybı (0.25 kg/hafta)', value: `${formatNumber(tdee - 250)} kcal/gün` },
        loss: { label: 'Kilo Kaybı (0.5 kg/hafta)', value: `${formatNumber(tdee - 500)} kcal/gün` },
        mildGain: { label: 'Hafif Kilo Alımı (0.25 kg/hafta)', value: `${formatNumber(tdee + 250)} kcal/gün` },
        gain: { label: 'Kilo Alımı (0.5 kg/hafta)', value: `${formatNumber(tdee + 500)} kcal/gün` },
      };
        
      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Bazal Metabolizma Hızı (BMH) ve Kalori İhtiyacı",
        content: (
          <p>
            Bazal Metabolizma Hızı (BMH), vücudunuzun dinlenme halindeyken (uyurken veya uzanırken) hayati fonksiyonlarını sürdürmek için harcadığı minimum enerji miktarıdır. Günlük kalori ihtiyacınız ise BMH'nizin üzerine günlük fiziksel aktiviteleriniz için harcadığınız enerjinin eklenmesiyle bulunur. Bu hesaplayıcı, Mifflin-St Jeor formülünü kullanarak BMH'nizi ve ardından aktivite seviyenize göre toplam günlük enerji harcamanızı (TDEE) tahmin eder.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Kilo vermek için ne kadar kalori açığı oluşturmalıyım?",
        answer: "Sağlıklı ve sürdürülebilir bir kilo kaybı için genellikle günlük 500 kalori civarında bir açık hedeflenir. Bu, haftada yaklaşık 0.5 kg kaybetmenizi sağlar. Çok düşük kalorili şok diyetlerden kaçınmak, metabolizmanızın yavaşlamaması ve kas kaybı yaşamamanız için önemlidir."
      },
      {
        question: "Bu hesaplama ne kadar doğru?",
        answer: "Bu hesaplayıcı, bilimsel olarak kabul görmüş formüller kullanarak çok iyi bir tahmin sunar. Ancak her bireyin metabolizması farklıdır. Sonuçları bir başlangıç noktası olarak kullanın ve vücudunuzun tepkilerine göre kalori alımınızı ayarlayın."
      },
      {
        question: "Sadece kalori saymak kilo kontrolü için yeterli mi?",
        answer: "Kalori dengesi kilo kontrolünün temelidir, ancak tek başına yeterli değildir. Tüketilen kalorinin kalitesi de çok önemlidir. Dengeli bir diyet, yani yeterli protein, sağlıklı yağlar, lifli gıdalar ve vitaminler almak, genel sağlık, tokluk hissi ve enerji seviyeleri için kritik rol oynar."
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
        resultTitle="Günlük Kalori İhtiyacı Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 