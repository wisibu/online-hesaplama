import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "İhbar Tazminatı Hesaplama | OnlineHesaplama",
  description: "Çalışma sürenize ve brüt maaşınıza göre net ihbar tazminatı tutarını hesaplayın. Gelir ve damga vergisi kesintileri dahil.",
  keywords: ["ihbar tazminatı hesaplama", "ihbar süresi", "net ihbar tazminatı", "brütten nete ihbar"],
  calculator: {
    title: "İhbar Tazminatı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hizmet süresi ve giydirilmiş brüt ücret bilgilerinizi girerek brüt ve net ihbar tazminatı tutarını kolayca hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'startDate', label: 'İşe Giriş Tarihi', type: 'date' },
      { id: 'endDate', label: 'İşten Ayrılış Tarihi', type: 'date' },
      { id: 'grossSalary', label: 'Son Brüt Maaş', type: 'number', placeholder: '20002.50' },
      { id: 'additionalPayments', label: 'Aylık Ek Ödemeler Toplamı (Brüt)', type: 'number', placeholder: 'Yol, yemek, prim vb.' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';

      const startDate = new Date(inputs.startDate as string);
      const endDate = new Date(inputs.endDate as string);
      const grossSalary = Number(inputs.grossSalary);
      const additionalPayments = Number(inputs.additionalPayments || 0);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli başlangıç ve bitiş tarihleri girin.' } } };
      }
      if (isNaN(grossSalary) || grossSalary <= 0) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir brüt maaş girin.' } } };
      }
      
      const serviceInMs = endDate.getTime() - startDate.getTime();
      const serviceInDays = serviceInMs / (1000 * 60 * 60 * 24);
      const serviceInYears = serviceInDays / 365.25;

      let noticePeriodWeeks: number;
      if (serviceInDays < 180) { // 6 ay
        noticePeriodWeeks = 2;
      } else if (serviceInYears < 1.5) {
        noticePeriodWeeks = 4;
      } else if (serviceInYears < 3) {
        noticePeriodWeeks = 6;
      } else {
        noticePeriodWeeks = 8;
      }
      
      const noticePeriodDays = noticePeriodWeeks * 7;
      const totalGrossPay = grossSalary + additionalPayments;
      const grossSeverancePay = (totalGrossPay / 30) * noticePeriodDays;

      // Vergi Hesaplamaları (Damga ve Gelir Vergisi)
      const stampDuty = grossSeverancePay * 0.00759;
      // Gelir vergisi dilimleri (2024 için) - Basit bir yapı varsayılmıştır. Gerçekte kümülatif matrah önemlidir.
      // Bu hesaplayıcı, basitlik adına sadece ilk dilimi kullanır.
      const incomeTax = (grossSeverancePay - stampDuty) * 0.15; // Örnek %15
      const totalDeductions = stampDuty + incomeTax;
      const netSeverancePay = grossSeverancePay - totalDeductions;

      const summary: CalculationResult['summary'] = {
        netSeverance: { type: 'result', label: 'Net İhbar Tazminatı', value: formatCurrency(netSeverancePay), isHighlighted: true },
        serviceDuration: { type: 'info', label: 'Hizmet Süresi', value: `${Math.floor(serviceInYears)} yıl ${Math.floor((serviceInYears % 1) * 12)} ay` },
        noticePeriod: { type: 'info', label: 'İhbar Süresi', value: `${noticePeriodWeeks} Hafta (${noticePeriodDays} Gün)` },
        totalGrossPay: { type: 'info', label: 'Giydirilmiş Brüt Ücret', value: formatCurrency(totalGrossPay) },
        grossSeverance: { type: 'info', label: 'Brüt İhbar Tazminatı', value: formatCurrency(grossSeverancePay) },
        stampDuty: { type: 'info', label: 'Damga Vergisi Kesintisi', value: formatCurrency(stampDuty) },
        incomeTax: { type: 'info', label: 'Gelir Vergisi Kesintisi', value: formatCurrency(incomeTax) },
        totalDeductions: { type: 'info', label: 'Toplam Kesinti', value: formatCurrency(totalDeductions) },
      };

      return { summary };
    },
  },
   content: {
    sections: [
      {
        title: "İhbar Tazminatı Nedir?",
        content: (
          <p>
            İhbar tazminatı, belirsiz süreli iş sözleşmesini haklı bir neden olmaksızın ve bildirim süresine uymadan fesheden tarafın, karşı tarafa ödemesi gereken bir tazminattır. İş Kanunu'nda belirtilen ihbar sürelerine uymayan işçi veya işveren bu tazminatı ödemekle yükümlü olur. Amaç, karşı tarafın iş veya işçi arayabilmesi için ona bir süre tanımaktır.
          </p>
        )
      },
       {
        title: "İhbar Süreleri Nasıl Belirlenir?",
        content: (
          <>
            <p>
             İş Kanunu'nun 17. maddesine göre ihbar süreleri, işçinin kıdemine (hizmet süresine) göre şu şekilde belirlenir:
            </p>
            <ul className="list-disc list-inside mt-2 pl-4">
              <li>İşi 6 aydan az sürmüş olan işçi için: <strong>2 hafta</strong></li>
              <li>İşi 6 aydan 1.5 yıla kadar sürmüş olan işçi için: <strong>4 hafta</strong></li>
              <li>İşi 1.5 yıldan 3 yıla kadar sürmüş olan işçi için: <strong>6 hafta</strong></li>
              <li>İşi 3 yıldan fazla sürmüş işçi için: <strong>8 hafta</strong></li>
            </ul>
            <p className="mt-2">
              Bu süreler asgari olup, sözleşmelerle artırılabilir ancak azaltılamaz.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "İhbar tazminatından hangi kesintiler yapılır?",
        answer: "Brüt ihbar tazminatı üzerinden SGK primi kesilmez. Sadece Gelir Vergisi ve Damga Vergisi kesintisi yapılır."
      },
      {
        question: "Kendi isteğiyle ayrılan (istifa eden) işçi ihbar tazminatı alır mı?",
        answer: "Hayır. İşçi, kanunda belirtilen ihbar sürelerine uymadan işten ayrılırsa, ihbar tazminatı alamaz; aksine işverene ihbar tazminatı ödemek durumunda kalabilir."
      },
      {
        question: "Giydirilmiş brüt ücret nedir?",
        answer: "İhbar tazminatı hesabında kullanılan ücret, işçinin son aldığı brüt maaşa ek olarak, düzenli olarak sağlanan yol, yemek, prim, ikramiye gibi yan hakların aylık brüt tutarlarının eklenmesiyle bulunan 'giydirilmiş brüt ücret'tir."
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
        resultTitle="İhbar Tazminatı Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 