import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı Parametreleri (1 Ocak - 31 Aralık 2024 arası)
const ASGARI_UCRET_GUNLUK = 666.75;
const ASGARI_UCRET_AYLIK = 20002.50;
const BORCLANMA_ORANI = 0.32;

const EN_DUSUK_GUNLUK_BORCLANMA = ASGARI_UCRET_GUNLUK * BORCLANMA_ORANI;
const EN_YUKSEK_GUNLUK_BORCLANMA = EN_DUSUK_GUNLUK_BORCLANMA * 7.5;


const pageConfig = {
  title: "Emeklilik Borçlanması Hesaplama (Askerlik, Doğum) | 2024",
  description: "2024 yılı güncel asgari ücret verilerine göre askerlik, doğum veya yurtdışı borçlanması için ödemeniz gereken en düşük ve en yüksek tutarları hesaplayın.",
  keywords: ["emeklilik borçlanması hesaplama", "askerlik borçlanması", "doğum borçlanması", "sgk borçlanma", "prim borçlanması"],
  calculator: {
    title: "Emeklilik Borçlanması Tutarı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Borçlanmak istediğiniz gün sayısını girerek ödeyeceğiniz toplam prim tutarını öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'days', label: 'Borçlanılacak Gün Sayısı', type: 'number', placeholder: '540' },
      { id: 'rateMultiplier', label: 'Seçilecek Kazanç Düzeyi', type: 'select', options: [
        { value: 1, label: 'En Düşük (Asgari Ücret Tabanı)' },
        { value: 2, label: '2 Katı' },
        { value: 3, label: '3 Katı' },
        { value: 4, label: '4 Katı' },
        { value: 5, label: '5 Katı' },
        { value: 6, label: '6 Katı' },
        { value: 7.5, label: 'En Yüksek (Tavan)' },
      ], defaultValue: '1' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const days = Number(inputs.days);
        const rateMultiplier = Number(inputs.rateMultiplier);
        
        if (!days || days <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir gün sayısı girin.' } } };
        }

        const selectedDailyRate = ASGARI_UCRET_GUNLUK * rateMultiplier * BORCLANMA_ORANI;
        const totalAmountSelected = selectedDailyRate * days;
        const totalAmountLowest = EN_DUSUK_GUNLUK_BORCLANMA * days;
        const totalAmountHighest = EN_YUKSEK_GUNLUK_BORCLANMA * days;

        const summary: CalculationResult['summary'] = {
            selectedAmount: { type: 'result', label: 'Seçtiğiniz Düzeye Göre Toplam Ödeme', value: formatCurrency(totalAmountSelected), isHighlighted: true },
            lowestAmount: { type: 'info', label: `En Düşük Toplam Ödeme (${formatCurrency(EN_DUSUK_GUNLUK_BORCLANMA)}/gün)`, value: formatCurrency(totalAmountLowest) },
            highestAmount: { type: 'info', label: `En Yüksek Toplam Ödeme (${formatCurrency(EN_YUKSEK_GUNLUK_BORCLANMA)}/gün)`, value: formatCurrency(totalAmountHighest) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Emeklilik İçin Borçlanma Nedir?",
        content: (
          <p>
            Emeklilik borçlanması, sigortalıların emeklilik için gerekli olan prim ödeme gün sayılarını tamamlamak amacıyla, kanunen belirlenmiş bazı süreleri (örneğin askerlik hizmeti, doğum sonrası ücretsiz izin süreleri, yurtdışında geçen süreler vb.) sonradan primlerini ödeyerek hizmetlerine ekletmeleridir. Bu işlem, eksik prim günlerini tamamlayarak daha erken emekli olmaya veya daha yüksek emekli maaşı almaya olanak tanıyabilir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Borçlanma tutarı neye göre belirlenir?",
        answer: "Borçlanma tutarı, başvurunun yapıldığı tarihte geçerli olan brüt asgari ücrete göre belirlenir. Günlük borçlanma bedeli, brüt asgari ücretin günlük tutarının %32'sinden az, bu tutarın 7.5 katından fazla olamaz. Sigortalılar, bu iki limit arasında diledikleri bir tutar üzerinden borçlanma yapabilirler. Daha yüksek tutardan borçlanmak, ileride alınacak emekli maaşını olumlu etkiler."
      },
      {
        question: "Kimler doğum borçlanması yapabilir?",
        answer: "Doğum borçlanması, sigortalı olarak çalışırken doğum yapan ve bu sebeple ücretsiz izin kullanan kadın sigortalıların, en fazla üç çocuk için ve her çocuk için ikişer yılı (toplamda 6 yıl / 2160 gün) geçmemek üzere yapabildikleri bir borçlanma türüdür. Çocuğun doğumdan sonra yaşaması şarttır."
      },
      {
        question: "Askerlik borçlanması nasıl yapılır?",
        answer: "Er veya erbaş olarak silah altında geçen veya yedek subay okulunda geçen süreler için askerlik borçlanması yapılabilir. Sigortalı olmadan önce yapılan askerlik hizmeti borçlanıldığında, sigortalılık başlangıç tarihi borçlanılan gün sayısı kadar geriye çekilir, bu da daha erken emekli olma imkanı sağlayabilir."
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
        resultTitle="Borçlanma Tutarı Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}