import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Huzur Hakkı Brütten Nete Hesaplama | OnlineHesaplama",
  description: "Brüt huzur hakkı tutarından net ele geçecek miktarı, SGK, gelir ve damga vergisi kesintilerini anında hesaplayın.",
  keywords: ["huzur hakkı hesaplama", "brütten nete huzur hakkı", "huzur hakkı vergisi", "huzur hakkı sgk kesintisi"],
  calculator: {
    title: "Huzur Hakkı Brütten Nete Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Brüt huzur hakkı tutarını, sigortalılık durumunu ve gelir vergisi dilimini girerek net ödenecek tutarı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'grossPay', label: 'Brüt Huzur Hakkı Tutarı', type: 'number', placeholder: '15000' },
      { 
        id: 'isSgkExempt', 
        label: 'SGK Durumu', 
        type: 'select', 
        options: [
          { value: 'true', label: 'SGK Muafiyeti Var (Başka yerde 4A\'lı veya şirket ortağı)' },
          { value: 'false', label: 'SGK Muafiyeti Yok (Huzur hakkı alan kişi sigortalı değil)' }
        ] 
      },
       { 
        id: 'taxBracket', 
        label: 'Gelir Vergisi Dilimi', 
        type: 'select', 
        options: [
          { value: '0.15', label: '%15' },
          { value: '0.20', label: '%20' },
          { value: '0.27', label: '%27' },
          { value: '0.35', label: '%35' },
          { value: '0.40', label: '%40' }
        ]
      },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';

      const grossPay = Number(inputs.grossPay);
      const isSgkExempt = inputs.isSgkExempt === 'true';
      const taxRate = Number(inputs.taxBracket);

      if (isNaN(grossPay) || grossPay <= 0) {
        return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir brüt tutar girin.' } } };
      }

      const stampDuty = grossPay * 0.00759;
      
      let sgkWorkerPremium = 0; // %14
      let unemploymentWorkerPremium = 0; // %1
      if (!isSgkExempt) {
        sgkWorkerPremium = grossPay * 0.14;
        unemploymentWorkerPremium = grossPay * 0.01;
      }
      
      const totalSgkDeductions = sgkWorkerPremium + unemploymentWorkerPremium;
      const incomeTaxBase = grossPay - totalSgkDeductions;
      const incomeTax = incomeTaxBase * taxRate;
      
      const totalDeductions = totalSgkDeductions + incomeTax + stampDuty;
      const netPay = grossPay - totalDeductions;

      const summary: CalculationResult['summary'] = {
        grossPay: { label: 'Brüt Huzur Hakkı', value: formatCurrency(grossPay) },
        sgkWorkerPremium: { label: 'SGK İşçi Primi (%14)', value: formatCurrency(sgkWorkerPremium) },
        unemploymentWorkerPremium: { label: 'İşsizlik Sig. Primi (%1)', value: formatCurrency(unemploymentWorkerPremium) },
        incomeTaxBase: { label: 'Gelir Vergisi Matrahı', value: formatCurrency(incomeTaxBase) },
        incomeTax: { label: `Gelir Vergisi (${taxRate * 100}%)`, value: formatCurrency(incomeTax) },
        stampDuty: { label: 'Damga Vergisi (%0.759)', value: formatCurrency(stampDuty) },
        totalDeductions: { label: 'Toplam Kesintiler', value: formatCurrency(totalDeductions) },
        netPay: { label: 'Net Ele Geçen Huzur Hakkı', value: formatCurrency(netPay), isHighlighted: true },
      };

      return { summary };
    },
  },
   content: {
    sections: [
      {
        title: "Huzur Hakkı Nedir?",
        content: (
          <p>
            Huzur hakkı, şirket ortaklarının veya yönetim kurulu üyelerinin, bu sıfatları nedeniyle katıldıkları toplantı, müzakere veya komite çalışmaları gibi sorumlulukları karşılığında aldıkları bir ödemedir. Bu ödeme, onların harcadıkları zaman ve emekten dolayı bir karşılık olarak verilir ve ücret olarak kabul edilir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Huzur hakkı ödemesi zorunlu mudur?",
        answer: "Huzur hakkı ödenmesi yasal bir zorunluluk değildir. Ödenip ödenmeyeceği ve tutarı, şirketin ana sözleşmesinde belirtilerek veya genel kurul kararıyla belirlenir."
      },
      {
        question: "Huzur hakkından hangi vergiler kesilir?",
        answer: "Huzur hakkı, Gelir Vergisi Kanunu'na göre ücret sayıldığından, normal maaş gibi vergilendirilir. Brüt tutar üzerinden Gelir Vergisi ve Damga Vergisi kesintisi yapılır."
      },
       {
        question: "Huzur hakkından SGK primi kesilir mi?",
        answer: "Bu durum, huzur hakkı alan kişinin sigortalılık durumuna bağlıdır. Eğer kişi, şirkette aynı zamanda 4/a (SSK) kapsamında sigortalı olarak çalışmıyorsa veya başka bir yerde sigortalı değilse, huzur hakkı ödemesi prime tabi tutulur ve SGK kesintisi yapılır. Ancak kişi zaten başka bir işten dolayı sigortalıysa veya şirketin ortağı (4/b - Bağ-Kur'lu) ise, huzur hakkı ödemesinden SGK primi kesilmez."
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
        resultTitle="Huzur Hakkı Hesaplama Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}