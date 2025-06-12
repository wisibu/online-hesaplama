import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// Harris-Benedict Denklemi
const calculateBMR = (gender: 'male' | 'female', weight: number, height: number, age: number): number => {
    if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
};

const activityMultipliers = {
    sedentary: 1.2,       // Az veya hiç egzersiz
    light: 1.375,         // Hafif (haftada 1-3 gün)
    moderate: 1.55,       // Orta (haftada 3-5 gün)
    active: 1.725,        // Aktif (haftada 6-7 gün)
    very_active: 1.9,     // Çok aktif (çok ağır egzersiz/iş)
};

const pageConfig = {
  title: "Günlük Kalori İhtiyacı Hesaplama | OnlineHesaplama",
  description: "Yaş, cinsiyet, kilo, boy ve aktivite düzeyinize göre günlük almanız gereken kalori miktarını (BMR ve TDEE) hesaplayın.",
  keywords: ["kalori ihtiyacı hesaplama", "günlük kalori", "bazal metabolizma hızı", "bmr hesaplama", "kalori hesaplama"],
  calculator: {
    title: "Günlük Kalori İhtiyacı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kilo korumak, kilo vermek veya almak için günlük ne kadar kaloriye ihtiyacınız olduğunu öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'gender', label: 'Cinsiyet', type: 'select', options: [{ value: 'male', label: 'Erkek' }, { value: 'female', label: 'Kadın' }] },
      { id: 'age', label: 'Yaş', type: 'number', placeholder: '30' },
      { id: 'weight', label: 'Kilo (kg)', type: 'number', placeholder: '75' },
      { id: 'height', label: 'Boy (cm)', type: 'number', placeholder: '180' },
      { id: 'activityLevel', label: 'Aktivite Seviyesi', type: 'select', options: [
        { value: 'sedentary', label: 'Hareketsiz (Ofis işi)' },
        { value: 'light', label: 'Az Aktif (Haftada 1-3 gün egzersiz)' },
        { value: 'moderate', label: 'Orta Derecede Aktif (Haftada 3-5 gün egzersiz)' },
        { value: 'active', label: 'Çok Aktif (Haftada 6-7 gün egzersiz)' },
        { value: 'very_active', label: 'Aşırı Aktif (Ağır iş/egzersiz)' },
      ]},
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { gender, age, weight, height, activityLevel } = inputs;

        if (!age || !weight || !height || Number(age) <= 0 || Number(weight) <= 0 || Number(height) <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen yaş, kilo ve boy için geçerli pozitif değerler girin.' } } };
        }

        const bmr = calculateBMR(gender as 'male'|'female', Number(weight), Number(height), Number(age));
        const dailyCalories = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

        const summary: CalculationResult['summary'] = {
            bmr: { type: 'info', label: 'Bazal Metabolizma Hızı (BMR)', value: `${formatNumber(bmr, 0)} kcal/gün` },
            maintenance: { type: 'result', label: 'Kilo Korumak İçin (TDEE)', value: `${formatNumber(dailyCalories, 0)} kcal/gün`, isHighlighted: true },
            mildLoss: { type: 'info', label: 'Hafif Kilo Kaybı İçin (~0.25 kg/hafta)', value: `${formatNumber(dailyCalories - 250, 0)} kcal/gün` },
            loss: { type: 'info', label: 'Kilo Kaybı İçin (~0.5 kg/hafta)', value: `${formatNumber(dailyCalories - 500, 0)} kcal/gün` },
            gain: { type: 'info', label: 'Kilo Almak İçin (~0.5 kg/hafta)', value: `${formatNumber(dailyCalories + 500, 0)} kcal/gün` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Bazal Metabolizma Hızı (BMR) ve Günlük Kalori İhtiyacı (TDEE) Nedir?",
        content: (
          <p>
            <strong>Bazal Metabolizma Hızı (BMR):</strong> Vücudunuzun dinlenme halindeyken, hayati fonksiyonlarını (nefes alma, kan dolaşımı, hücre üretimi vb.) sürdürmek için ihtiyaç duyduğu minimum kalori miktarıdır. <br/>
            <strong>Toplam Günlük Enerji Harcaması (TDEE):</strong> BMR'nizin üzerine, günlük fiziksel aktiviteleriniz (yürüme, çalışma, egzersiz) için harcadığınız enerjinin eklenmesiyle bulunan, gün içinde toplamda harcadığınız kalori miktarıdır. Bu hesaplayıcı, BMR'nizi hesapladıktan sonra bunu aktivite seviyenizle çarparak TDEE'nizi bulur ve kilo hedeflerinize yönelik öneriler sunar.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Bu hesaplama ne kadar doğru?",
        answer: "Bu hesaplama, yaygın olarak kullanılan ve genel olarak güvenilir kabul edilen Harris-Benedict formülünü kullanır. Ancak bu sonuçlar birer tahmindir. Kişinin genetik yapısı, vücut kompozisyonu (kas/yağ oranı) gibi faktörler metabolizmayı etkileyebilir. En doğru sonuçlar için bir diyetisyen veya sağlık uzmanına danışmak en iyisidir."
      },
      {
        question: "Kilo vermek için günde kaç kalori kesmeliyim?",
        answer: "Sağlıklı ve sürdürülebilir kilo kaybı için genellikle günlük kalori ihtiyacınızdan (TDEE) 300-500 kalori daha az almanız önerilir. Bu, haftada yaklaşık 0.25-0.5 kg kaybetmenizi sağlar. Çok düşük kalorili şok diyetlerden kaçınmak, sağlığınız için önemlidir."
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
        resultTitle="Günlük Enerji İhtiyacınız"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 