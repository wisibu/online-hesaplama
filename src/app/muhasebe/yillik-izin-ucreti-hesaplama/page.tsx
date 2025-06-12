import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const INCOME_TAX_BRACKETS_2024 = [
  { limit: 70000, rate: 0.15 },
  { limit: 150000, rate: 0.20 },
  { limit: 550000, rate: 0.27 },
  { limit: 1900000, rate: 0.35 },
];

const pageConfig = {
  title: "Kullanılmayan Yıllık İzin Ücreti Hesaplama | OnlineHesaplama",
  description: "İşten ayrılırken hak ettiğiniz kullanılmayan yıllık izin günlerinizin brüt ve net ücretini, en güncel vergi dilimlerine göre hesaplayın.",
  keywords: ["yıllık izin ücreti hesaplama", "kullanılmayan izin parası", "brütten nete izin ücreti", "işçilik alacakları"],
  calculator: {
    title: "Yıllık İzin Ücreti Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Son giydirilmiş brüt ücretinizi, kullanılmayan izin günü sayınızı ve mevcut vergi matrahınızı girerek net izin ücretinizi öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'grossSalary', label: 'Giydirilmiş Brüt Aylık Ücret (TL)', type: 'number', placeholder: '25000', note: 'Yol, yemek, ikramiye gibi tüm ek ödemelerin dahil edildiği son brüt maaşınız.' },
      { id: 'unusedDays', label: 'Kullanılmayan İzin Günü Sayısı', type: 'number', placeholder: '20' },
      { id: 'taxBase', label: 'Mevcut Kümülatif Vergi Matrahı (TL)', type: 'number', placeholder: '120000', note: 'İzin ücreti hariç, bu yılki toplam vergiye esas kazancınız.' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const grossSalary = Number(inputs.grossSalary);
        const unusedDays = Number(inputs.unusedDays);
        const taxBase = Number(inputs.taxBase);

        if (!grossSalary || grossSalary <= 0 || !unusedDays || unusedDays < 0 || taxBase < 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli ve pozitif değerler girin.' } } };
        }

        const dailyGrossSalary = grossSalary / 30;
        const grossLeavePay = dailyGrossSalary * unusedDays;

        const sgkPremium = grossLeavePay * 0.14;
        const unemploymentPremium = grossLeavePay * 0.01;
        const incomeTaxBase = grossLeavePay - sgkPremium - unemploymentPremium;

        let totalTax = 0;
        let remainingTaxBase = incomeTaxBase;
        let cumulativeBase = taxBase;

        for (const bracket of INCOME_TAX_BRACKETS_2024) {
            if (remainingTaxBase <= 0) break;

            const bracketLimit = bracket.limit;
            const availableInBracket = bracketLimit - cumulativeBase;

            if (availableInBracket > 0) {
                const taxableInBracket = Math.min(remainingTaxBase, availableInBracket);
                totalTax += taxableInBracket * bracket.rate;
                remainingTaxBase -= taxableInBracket;
            }
            cumulativeBase = Math.max(cumulativeBase, bracketLimit);
        }

        if (remainingTaxBase > 0) {
            totalTax += remainingTaxBase * 0.40;
        }

        const totalDeductions = sgkPremium + unemploymentPremium + totalTax;
        const netLeavePay = grossLeavePay - totalDeductions;

        const summary: CalculationResult['summary'] = {
            netLeavePay: { type: 'result', label: 'Net İzin Ücreti', value: formatCurrency(netLeavePay), isHighlighted: true },
            grossLeavePay: { type: 'info', label: 'Brüt İzin Ücreti', value: formatCurrency(grossLeavePay) },
            sgkCut: { type: 'info', label: 'SGK İşçi Payı (%14)', value: formatCurrency(sgkPremium) },
            unemploymentCut: { type: 'info', label: 'İşsizlik Sig. İşçi Payı (%1)', value: formatCurrency(unemploymentPremium) },
            incomeTax: { type: 'info', label: 'Gelir Vergisi', value: formatCurrency(totalTax) },
            stampDuty: { type: 'info', label: 'Damga Vergisi', value: formatCurrency(0), note: 'Yıllık izin ücretinden damga vergisi kesilmez.' },
            totalDeductions: { type: 'result', label: 'Toplam Kesinti', value: formatCurrency(totalDeductions)},
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yıllık İzin Ücreti Nedir ve Ne Zaman Ödenir?",
        content: (
          <p>
            Yıllık izin ücreti, işçinin hak edip de kullanmadığı yıllık izin sürelerine ait ücretin, iş sözleşmesinin herhangi bir nedenle sona ermesi halinde kendisine ödenmesidir. İş Kanunu'na göre yıllık izin hakkı vazgeçilmez bir haktır ve işçi çalışırken bu haktan feragat edemez veya paraya çeviremez. Bu alacak, yalnızca iş sözleşmesi sona erdiğinde bir ücrete dönüşür.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Giydirilmiş Brüt Ücret nedir?",
        answer: "Giydirilmiş brüt ücret, işçinin asıl çıplak brüt maaşına ek olarak, yol parası, yemek parası, prim, ikramiye gibi süreklilik arz eden yan ödemelerin eklenmesiyle bulunan tutardır. Yıllık izin ücreti, kıdem ve ihbar tazminatı gibi alacaklar bu giydirilmiş ücret üzerinden hesaplanır."
      },
      {
        question: "Kıdeme göre yıllık izin hakları nasıldır?",
        answer: "İşçilerin hizmet sürelerine göre hak ettikleri yıllık ücretli izin süreleri şöyledir: 1 yıldan 5 yıla kadar (beşinci yıl dahil) olanlara 14 gün, 5 yıldan fazla 15 yıldan az olanlara 20 gün, 15 yıl (dahil) ve daha fazla olanlara 26 günden az olamaz. 18 yaşından küçük ve 50 yaşından büyük işçilere verilecek yıllık ücretli izin süresi 20 günden az olamaz."
      },
       {
        question: "Yıllık izin ücreti alacağında zaman aşımı süresi nedir?",
        answer: "İş sözleşmesinin sona erdiği tarihten itibaren yıllık izin ücreti alacağı için zaman aşımı süresi 5 yıldır."
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
        resultTitle="İzin Ücreti Dökümü"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}