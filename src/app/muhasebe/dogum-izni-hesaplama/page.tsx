import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// Yasal Süreler (Gün)
const PRE_BIRTH_LEAVE_SINGLE = 56; // 8 Hafta
const POST_BIRTH_LEAVE_SINGLE = 56; // 8 Hafta
const PRE_BIRTH_LEAVE_MULTIPLE = 70; // 10 Hafta
const RAPOR_GUN_SAYISI_SINGLE = 112; // 16 Hafta
const RAPOR_GUN_SAYISI_MULTIPLE = 126; // 18 Hafta

const formatDate = (date: Date) => {
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const pageConfig = {
  title: "Doğum İzni ve Parası Hesaplama (2024) | OnlineHesaplama",
  description: "Yasal doğum izni sürelerinizi (16 veya 18 hafta) ve SGK'dan alacağınız doğum (rapor) parası tutarını 2024 yılına göre kolayca hesaplayın.",
  keywords: ["doğum izni hesaplama", "doğum parası hesaplama", "rapor parası", "analık izni", "doğum izni kaç gün"],
  calculator: {
    title: "Doğum İzni ve Parası Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Doğum izni başlangıç-bitiş tarihlerinizi ve alacağınız rapor parası tutarını öğrenmek için bilgileri girin.
      </p>
    ),
    inputFields: [
      { id: 'birthDate', label: 'Beklenen Doğum Tarihi', type: 'date', defaultValue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0] },
      { id: 'last3MonthsBrut', label: 'Son 3 Aylık Toplam Brüt Maaş', type: 'number', placeholder: '100000' },
      { id: 'pregnancyType', label: 'Gebelik Türü', type: 'select', options: [
        { value: 'single', label: 'Tekil Gebelik' },
        { value: 'multiple', label: 'Çoğul Gebelik (İkiz vb.)' },
      ], defaultValue: 'single' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const birthDateStr = inputs.birthDate as string;
        const last3MonthsBrut = Number(inputs.last3MonthsBrut);
        const pregnancyType = inputs.pregnancyType as 'single' | 'multiple';
        
        if (!birthDateStr || !last3MonthsBrut || last3MonthsBrut <=0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
        }

        const expectedBirthDate = new Date(birthDateStr);
        
        const preBirthDays = pregnancyType === 'single' ? PRE_BIRTH_LEAVE_SINGLE : PRE_BIRTH_LEAVE_MULTIPLE;
        const postBirthDays = POST_BIRTH_LEAVE_SINGLE;
        const totalReportDays = pregnancyType === 'single' ? RAPOR_GUN_SAYISI_SINGLE : RAPOR_GUN_SAYISI_MULTIPLE;

        const leaveStartDate = new Date(expectedBirthDate);
        leaveStartDate.setDate(leaveStartDate.getDate() - preBirthDays);

        const leaveEndDate = new Date(expectedBirthDate);
        leaveEndDate.setDate(leaveEndDate.getDate() + postBirthDays);

        // Rapor Parası Hesaplama
        const dailyBrutWage = last3MonthsBrut / 90;
        const dailyReportFee = dailyBrutWage * (2 / 3);
        const totalReportFee = dailyReportFee * totalReportDays;

        const summary: CalculationResult['summary'] = {
            totalReportFee: { type: 'result', label: 'Toplam Doğum Parası (Rapor Ücreti)', value: formatCurrency(totalReportFee), isHighlighted: true },
            leaveStartDate: { type: 'info', label: 'Yasal İzin Başlangıç Tarihi', value: formatDate(leaveStartDate) },
            leaveEndDate: { type: 'info', label: 'Yasal İzin Bitiş Tarihi', value: formatDate(leaveEndDate) },
            totalLeave: { type: 'info', label: 'Toplam İzin Süresi', value: `${totalReportDays} gün (${totalReportDays/7} Hafta)` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Doğum İzni ve Doğum Parası Hakkında Bilgiler",
        content: (
          <p>
            Doğum izni (veya analık izni), 4857 sayılı İş Kanunu kapsamında kadın çalışanlara tanınan yasal bir haktır. Bu süre boyunca çalışan, SGK tarafından ödenen geçici iş göremezlik ödeneği (halk arasında doğum veya rapor parası) alır. Standart olarak izin, doğumdan önce 8 hafta ve doğumdan sonra 8 hafta olmak üzere toplam <strong>16 haftadır</strong>. Çoğul gebeliklerde (ikiz, üçüz vb.) doğum öncesi süreye 2 hafta eklenerek toplam izin <strong>18 haftaya</strong> çıkar.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Doğum parası (rapor parası) almanın şartları nelerdir?",
        answer: "Doğum raporu parası alabilmek için; sigortalının doğumdan önceki bir yıl içinde en az 90 gün kısa vadeli sigorta primi bildirilmiş olması, doğum izninin başladığı tarihte sigortalılık durumunun devam etmesi ve bu süre zarfında iş yerinde çalışmıyor olması gerekmektedir. Ödeme, Ziraat Bankası aracılığıyla veya PTT üzerinden çalışanın adına yapılır."
      },
      {
        question: "Doğum öncesi iznimi doğuma son 3 haftaya kadar kullanabilir miyim?",
        answer: "Evet, sağlık durumunuzun ve işin niteliğinin uygun olduğuna dair doktor onayı ile doğumdan önceki 3 haftaya kadar iş yerinizde çalışabilirsiniz. Bu durumda, doğum öncesi kullanmadığınız 5 haftalık (çoğul gebelikte 7 haftalık) izin süreniz, doğum sonrası izin sürenize eklenir. Ancak bu durum, alacağınız toplam rapor parası gün sayısını değiştirmez."
      },
      {
        question: "Doğum parasından vergi kesilir mi?",
        answer: "Hayır, SGK tarafından ödenen geçici iş göremezlik ödeneklerinden (rapor parası, doğum parası vb.) gelir vergisi veya damga vergisi kesintisi yapılmaz. Hesaplanan tutar net olarak çalışana ödenir."
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
        resultTitle="Doğum İzni ve Ödeneği Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}