import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// 2024 Yılı Harcırah Gündelik Tutarları (Resmi Gazete'ye göre)
const gundelikler = {
  'tbmm': 900.00,
  'general': 900.00,
  'ust_duzey': 480.00, // Ek göstergesi 8000 ve üzeri
  'gosterge_5800_7999': 465.00,
  'gosterge_3000_5799': 455.00,
  'maas_1_4': 440.00, // Aylık/kadro derecesi 1-4
  'maas_5_15': 430.00, // Aylık/kadro derecesi 5-15
};

const pageConfig = {
  title: "Yolluk (Harcırah) Hesaplama | OnlineHesaplama",
  description: "Yurtiçi geçici görevlendirmeler için 2024 yılı güncel verilerine göre alabileceğiniz yolluk (harcırah) tutarını hesaplayın.",
  keywords: ["yolluk hesaplama", "harcırah hesaplama", "geçici görev yolluğu", "gündelik hesaplama"],
  calculator: {
    title: "Yolluk (Harcırah) Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kamu personeli için unvanınıza ve görev sürenize göre net harcırah tutarını hesaplayın.
      </p>
    ),
    inputFields: [
      { 
        id: 'title', 
        label: 'Unvanınız / Kadro Dereceniz', 
        type: 'select', 
        options: [
          { value: 'ust_duzey', label: 'Ek Göstergesi 8000 ve üzeri olanlar' },
          { value: 'gosterge_5800_7999', label: 'Ek Göstergesi 5800 - 7999 arası olanlar' },
          { value: 'gosterge_3000_5799', label: 'Ek Göstergesi 3000 - 5799 arası olanlar' },
          { value: 'maas_1_4', label: 'Aylık/Kadro Derecesi 1-4 olanlar' },
          { value: 'maas_5_15', label: 'Aylık/Kadro Derecesi 5-15 olanlar' },
          { value: 'tbmm', label: 'TBMM Başkanı ve Cumhurbaşkanı Yardımcıları' },
          { value: 'general', label: 'Genelkurmay Başkanı, Bakanlar, Milletvekilleri vb.' },
        ] 
      },
      { id: 'days', label: 'Görev Süresi (Gün)', type: 'number', placeholder: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';

      const titleKey = inputs.title as keyof typeof gundelikler;
      const days = Number(inputs.days);

      if (!titleKey || !gundelikler[titleKey]) {
        return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir unvan seçin.' } } };
      }
       if (isNaN(days) || days <= 0) {
        return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir gün sayısı girin.' } } };
      }

      const dailyAllowance = gundelikler[titleKey];
      const totalAllowance = dailyAllowance * days;

      const summary: CalculationResult['summary'] = {
        dailyAllowance: { label: 'Bir Günlük Yurt İçi Gündelik Tutarı', value: formatCurrency(dailyAllowance) },
        totalDays: { label: 'Görev Süresi', value: `${days} gün` },
        totalAllowance: { label: 'Toplam Harcırah (Yolluk) Tutarı', value: formatCurrency(totalAllowance), isHighlighted: true },
        info: { label: 'Not', value: 'Hesaplama, konaklama ve diğer ek unsurlar hariç temel gündelik üzerinden yapılmıştır. Harcırah ödemeleri damga vergisi hariç gelir vergisinden muaftır.'}
      };

      return { summary };
    },
  },
   content: {
    sections: [
      {
        title: "Yolluk (Harcırah) Nedir?",
        content: (
          <p>
            Harcırah veya yolluk, bir memurun veya kamu görevlisinin, asıl görev yeri dışına geçici olarak gönderildiğinde, bu görevlendirme nedeniyle yapmak zorunda kaldığı ek masraflara (yeme, içme, konaklama, yol gibi) karşılık olarak ödenen paradır. Amaç, personelin görevini yerine getirirken mali bir kayba uğramasını engellemektir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Harcırah tutarları neye göre belirlenir?",
        answer: "Yurtiçi ve yurtdışı gündelik tutarları, her yıl Hazine ve Maliye Bakanlığı tarafından hazırlanan ve Bütçe Kanunu ile Resmi Gazete'de yayımlanan cetvellere göre belirlenir. Bu tutarlar, personelin unvanına, kadro derecesine ve ek göstergesine göre farklılık gösterir."
      },
      {
        question: "Konaklama gideri harcırahı etkiler mi?",
        answer: "Evet. Geçici görevlendirmelerde konaklama için ödenen ücretin belgelendirilmesi (fatura ibrazı) durumunda, personelin konaklama için ödediği ücrete göre gündelik tutarı belirli oranlarda artırımlı olarak ödenebilir. Bu hesaplayıcı, bu detayı içermeyen temel gündelik tutarını hesaplamaktadır."
      },
       {
        question: "Özel sektörde yolluk nasıl hesaplanır?",
        answer: "Özel sektörde yolluk ödemeleri için yasal bir zorunluluk veya standart bir hesaplama yöntemi yoktur. Yolluk tutarları ve ödeme koşulları, tamamen şirketin kendi iç politikaları, yönetmelikleri veya çalışanın iş sözleşmesi ile belirlenir."
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
        resultTitle="Yolluk Hesaplama Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}