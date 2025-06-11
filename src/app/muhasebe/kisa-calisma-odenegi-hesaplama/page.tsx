import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const BRUT_ASKERI_UCRET_2024 = 20002.50;
const KCO_TAVAN_TUTARI = BRUT_ASKERI_UCRET_2024 * 1.5;

const pageConfig = {
  title: "Kısa Çalışma Ödeneği (KÇÖ) Hesaplama | OnlineHesaplama",
  description: "Son 12 aylık brüt maaşınıza göre alabileceğiniz aylık kısa çalışma ödeneği tutarını (brüt ve net) hesaplayın.",
  keywords: ["kısa çalışma ödeneği hesaplama", "kçö hesaplama", "kçö maaşı", "işkur kçö"],
  calculator: {
    title: "Kısa Çalışma Ödeneği Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Sigortalının son 12 aylık prime esas kazançları (brüt maaş) ortalamasına göre ödenecek aylık net tutarı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'avgGrossSalary', label: 'Son 12 Aylık Ortalama Brüt Maaşınız', type: 'number', placeholder: '22500' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';

      const avgGrossSalary = Number(inputs.avgGrossSalary);

      if (isNaN(avgGrossSalary) || avgGrossSalary <= 0) {
        return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir ortalama brüt maaş girin.' } } };
      }

      let monthlyGrossKCO = avgGrossSalary * 0.60;
      let isCapped = false;
      
      if (monthlyGrossKCO > KCO_TAVAN_TUTARI) {
        monthlyGrossKCO = KCO_TAVAN_TUTARI;
        isCapped = true;
      }
      
      const stampDuty = monthlyGrossKCO * 0.00759;
      const netKCO = monthlyGrossKCO - stampDuty;

      const summary: CalculationResult['summary'] = {
        avgGrossSalary: { label: 'Ortalama Brüt Kazanç', value: formatCurrency(avgGrossSalary) },
        monthlyGrossKCO: { label: 'Aylık Brüt Kısa Çalışma Ödeneği', value: formatCurrency(monthlyGrossKCO) },
        ...(isCapped && { capInfo: { label: 'Bilgi', value: `Ödenek, brüt asgari ücretin %150'si olan ${formatCurrency(KCO_TAVAN_TUTARI)} tavanını aşamaz.` } }),
        stampDuty: { label: 'Damga Vergisi Kesintisi', value: formatCurrency(stampDuty) },
        netKCO: { label: 'Aylık Net Kısa Çalışma Ödeneği', value: formatCurrency(netKCO), isHighlighted: true },
      };

      return { summary };
    },
  },
   content: {
    sections: [
      {
        title: "Kısa Çalışma Ödeneği (KÇÖ) Nedir?",
        content: (
          <p>
            Kısa çalışma ödeneği; genel ekonomik, sektörel, bölgesel kriz veya zorlayıcı sebeplerle işyerindeki haftalık çalışma sürelerinin geçici olarak en az üçte bir oranında azaltılması veya süreklilik koşulu aranmaksızın işyerinde faaliyetin tamamen veya kısmen en az dört hafta süreyle durdurulması hallerinde, işyerinde üç ayı aşmamak üzere sigortalılara çalışamadıkları dönem için gelir desteği sağlayan bir uygulamadır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Kısa çalışma ödeneğinden kimler yararlanabilir?",
        answer: "Ödenekten yararlanabilmek için, işçinin kısa çalışmanın başladığı tarihten önceki son 120 gün hizmet akdine tabi olması ve son üç yıl içinde en az 450 gün sigortalı olarak çalışıp işsizlik sigortası primi ödemiş olması gerekmektedir."
      },
      {
        question: "Ödenek nasıl hesaplanır?",
        answer: "Günlük kısa çalışma ödeneği; sigortalının son on iki aylık prime esas kazançları dikkate alınarak hesaplanan günlük ortalama brüt kazancının %60’ıdır. Bu şekilde hesaplanan kısa çalışma ödeneği miktarı, aylık asgari ücretin brüt tutarının %150’sini geçemez."
      },
      {
        question: "KÇÖ'den vergi kesilir mi?",
        answer: "Kısa çalışma ödeneğinden sadece binde 7.59 oranında Damga Vergisi kesilir. Gelir vergisi veya SGK primi kesintisi yapılmaz."
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
        resultTitle="Kısa Çalışma Ödeneği Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}