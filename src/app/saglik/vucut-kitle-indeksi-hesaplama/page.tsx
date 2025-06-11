import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const getBmiCategory = (bmi: number): { category: string, color: string } => {
    if (bmi < 18.5) return { category: "Zayıf", color: "text-blue-600" };
    if (bmi < 24.9) return { category: "Normal Kilolu", color: "text-green-600" };
    if (bmi < 29.9) return { category: "Fazla Kilolu", color: "text-yellow-600" };
    if (bmi < 34.9) return { category: "1. Derece Obez", color: "text-orange-600" };
    if (bmi < 39.9) return { category: "2. Derece Obez", color: "text-red-600" };
    return { category: "3. Derece Obez (Morbid Obez)", color: "text-red-800" };
};

const pageConfig = {
  title: "Vücut Kitle İndeksi (VKİ) Hesaplama | OnlineHesaplama",
  description: "Boy ve kilo bilgilerinizi girerek Vücut Kitle İndeksi (VKİ) değerinizi hesaplayın. Sağlık durumunuzu (zayıf, normal, fazla kilolu, obez) anında öğrenin.",
  keywords: ["vki hesaplama", "vücut kitle indeksi", "boy kilo endeksi", "ideal kilo hesaplama", "bmi hesaplama"],
  calculator: {
    title: "Vücut Kitle İndeksi (VKİ) Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Boy (cm) ve Kilo (kg) bilgilerinizi girerek vücut kitle endeksinizi ve hangi kilo aralığında olduğunuzu öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'height', label: 'Boy (cm)', type: 'number', placeholder: '175' },
      { id: 'weight', label: 'Kilo (kg)', type: 'number', placeholder: '70' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const heightCm = Number(inputs.height);
        const weight = Number(inputs.weight);

        if (isNaN(heightCm) || isNaN(weight) || heightCm <= 0 || weight <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen boy ve kilonuzu pozitif değerlerle girin.' } } };
        }

        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);
        const { category, color } = getBmiCategory(bmi);
        
        const idealWeightMin = 18.5 * (heightM * heightM);
        const idealWeightMax = 24.9 * (heightM * heightM);

        const summary = {
            bmi: { label: 'Vücut Kitle İndeksiniz (VKİ)', value: formatNumber(bmi, 1) },
            category: { label: 'Durumunuz', value: category, className: color },
            idealWeight: { label: 'İdeal Kilo Aralığınız', value: `${formatNumber(idealWeightMin, 1)} kg - ${formatNumber(idealWeightMax, 1)} kg` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Vücut Kitle İndeksi (VKİ) Nedir?",
        content: (
          <p>
            Vücut Kitle İndeksi (VKİ), bir kişinin kilosunun, boyunun karesine bölünmesiyle elde edilen bir değerdir. Bu değer, kişinin boyuna göre kilosunun sağlıklı aralıkta olup olmadığını anlamak için kullanılan basit ve yaygın bir tarama yöntemidir. VKİ, doğrudan vücut yağ oranını ölçmez ancak kilo kategorilerini (zayıf, normal, fazla kilolu, obez) belirlemede güvenilir bir göstergedir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "VKİ hesaplaması kimler için yanıltıcı olabilir?",
        answer: "VKİ, kas kütlesi çok yüksek olan sporcular, hamile kadınlar, yaşlılar ve çocuklar için her zaman doğru bir gösterge olmayabilir. Örneğin, bir vücut geliştiricinin yüksek kas kütlesi nedeniyle VKİ'si 'fazla kilolu' çıkabilir, ancak bu durum sağlıksız olduğu anlamına gelmez. Bu nedenle, VKİ'nin bir tarama aracı olduğu ve tek başına bir teşhis yöntemi olmadığı unutulmamalıdır."
      },
      {
        question: "İdeal kilo aralığı ne anlama geliyor?",
        answer: "İdeal kilo aralığı, boyunuza göre sağlıklı kabul edilen minimum ve maksimum kilo değerlerini gösterir. Bu aralık, VKİ'nin 18.5 (normal kilonun alt sınırı) ve 24.9 (normal kilonun üst sınırı) olduğu değerlere karşılık gelen kiloların hesaplanmasıyla bulunur."
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
        resultTitle="VKİ Sonucunuz"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 