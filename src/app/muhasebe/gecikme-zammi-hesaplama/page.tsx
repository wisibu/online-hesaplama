import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Gecikme Zammı Hesaplama | OnlineHesaplama",
  description: "Vadesinde ödenmeyen kamu borçları (vergi, SGK primi vb.) için gecikme zammı tutarını ve toplam borcu anında hesaplayın.",
  keywords: ["gecikme zammı hesaplama", "vergi gecikme zammı", "sgk gecikme zammı", "aylık gecikme oranı"],
  calculator: {
    title: "Gecikme Zammı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Borç tutarı, vade ve ödeme tarihlerini girerek, geçerli gecikme zammı oranına göre toplam ödenecek tutarı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Geciken Borç Tutarı (Ana Para)', type: 'number', placeholder: '10000' },
      { id: 'dueDate', label: 'Normal Vade Tarihi', type: 'date' },
      { id: 'paymentDate', label: 'Ödeme Yapılan Tarih', type: 'date' },
      { id: 'rate', label: 'Aylık Gecikme Zammı Oranı (%)', type: 'number', placeholder: '4.5' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';

      const principal = Number(inputs.principal);
      const dueDate = new Date(inputs.dueDate as string);
      const paymentDate = new Date(inputs.paymentDate as string);
      const monthlyRate = Number(inputs.rate) / 100;

      if (isNaN(principal) || principal <= 0) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir borç tutarı girin.' } } };
      }
      if (isNaN(dueDate.getTime()) || isNaN(paymentDate.getTime()) || dueDate > paymentDate) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli vade ve ödeme tarihleri girin. Ödeme tarihi, vadeden sonra olmalıdır.' } } };
      }
       if (isNaN(monthlyRate) || monthlyRate <= 0) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir gecikme zammı oranı girin.' } } };
      }

      let totalMonths = (paymentDate.getFullYear() - dueDate.getFullYear()) * 12;
      totalMonths -= dueDate.getMonth();
      totalMonths += paymentDate.getMonth();
      let remainingDays = paymentDate.getDate() - dueDate.getDate();

      if (remainingDays < 0) {
        totalMonths--;
        const lastDayOfPreviousMonth = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), 0).getDate();
        remainingDays += lastDayOfPreviousMonth;
      }
      
      const fullMonths = Math.max(0, totalMonths);

      const monthlyInterest = principal * monthlyRate * fullMonths;
      const dailyRate = monthlyRate / 30;
      const dailyInterest = principal * dailyRate * remainingDays;
      
      const totalInterest = monthlyInterest + dailyInterest;
      const totalPayable = principal + totalInterest;

      const summary: CalculationResult['summary'] = {
        period: { type: 'info', label: 'Gecikme Süresi', value: `${fullMonths} ay, ${remainingDays} gün` },
        principal: { type: 'info', label: 'Ana Para Borcu', value: formatCurrency(principal) },
        totalInterest: { type: 'info', label: 'Hesaplanan Gecikme Zammı', value: formatCurrency(totalInterest) },
        totalPayable: { type: 'result', label: 'Toplam Ödenecek Tutar', value: formatCurrency(totalPayable), isHighlighted: true },
      };

      return { summary };
    },
  },
   content: {
    sections: [
      {
        title: "Gecikme Zammı Nedir?",
        content: (
          <p>
            Gecikme zammı, 6183 sayılı Amme Alacaklarının Tahsil Usulü Hakkında Kanun'da düzenlenen, vadesinde ödenmeyen kamu alacaklarına (vergi, resim, harç, SGK primi gibi) uygulanan bir faiz türüdür. Amacı, kamu alacağının zamanında ödenmemesinden kaynaklanan kaybı telafi etmektir. Gecikme zammı aylık olarak hesaplanır ve ay kesirleri (günler) için de günlük hesaplama yapılır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Güncel gecikme zammı oranı nedir?",
        answer: "Gecikme zammı oranı, Hazine ve Maliye Bakanlığı tarafından belirlenir ve Resmi Gazete'de yayımlanarak yürürlüğe girer. Bu oran zaman içinde değişiklik gösterebilir. Örneğin, 14 Kasım 2023'ten itibaren aylık %3.5, 21 Şubat 2024'ten itibaren ise aylık %4.5 olarak uygulanmaktadır. Hesaplayıcımızda bu oranı kendiniz belirleyebilirsiniz."
      },
      {
        question: "Gecikme zammı ve gecikme faizi arasındaki fark nedir?",
        answer: "Gecikme zammı, vadesinde ödenmeyen amme alacaklarına uygulanırken; gecikme faizi ise verginin normal vadesinden, tarh edildiği tarihe kadar geçen süre için hesaplanan bir faizdir. İkisi farklı durumlarda ve farklı oranlarda uygulanır."
      },
      {
        question: "Ay kesirleri için hesaplama nasıl yapılır?",
        answer: "Gecikme zammı hesaplanırken tam aylar için aylık oran kullanılır. Vade ile ödeme tarihi arasındaki ay kesirleri, yani günler, için ise aylık oranın 30'a bölünmesiyle bulunan günlük oran üzerinden hesaplama yapılır."
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
        resultTitle="Gecikme Zammı Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}