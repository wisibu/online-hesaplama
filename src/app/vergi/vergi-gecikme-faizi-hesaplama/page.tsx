import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const GECIKME_FAIZI_ORANI_AYLIK = 0.045; // Aylık %4.5

const pageConfig = {
  title: "Vergi Gecikme Faizi Hesaplama | OnlineHesaplama",
  description: "Vergi borcunuz için ödemeniz gereken gecikme faizi tutarını, vade ve ödeme tarihlerini girerek kolayca hesaplayın.",
  keywords: ["vergi gecikme faizi hesaplama", "gecikme faizi", "vergi borcu faizi"],
  calculator: {
    title: "Vergi Gecikme Faizi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Vadesi geçen vergi borcunuz için anapara tutarını, vade tarihini ve ödeme yapacağınız tarihi girerek faiz tutarını hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Vergi Anapara Tutarı (TL)', type: 'number', placeholder: '10000' },
      { id: 'dueDate', label: 'Vade Tarihi', type: 'date' },
      { id: 'paymentDate', label: 'Ödeme Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { principal, dueDate, paymentDate } = inputs;
        const amount = Number(principal);

        if (isNaN(amount) || amount <= 0 || !dueDate || !paymentDate) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları eksiksiz doldurun.' } } };
        }

        const start = new Date(dueDate as string);
        const end = new Date(paymentDate as string);

        if (start >= end) {
            return { summary: { info: { type: 'info', label: 'Bilgi', value: 'Vade tarihinde veya öncesinde ödeme yapıldığı için gecikme faizi hesaplanmaz.' } } };
        }
        
        let totalMonths = (end.getFullYear() - start.getFullYear()) * 12;
        totalMonths -= start.getMonth();
        totalMonths += end.getMonth();
        const dayOfStart = start.getDate();
        const dayOfEnd = end.getDate();

        let interest = 0;
        if (totalMonths > 0 || dayOfEnd > dayOfStart) {
            // Basit faiz hesaplama: Ay kesirleri tam ay sayılır.
            const fullMonths = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
            interest = amount * GECIKME_FAIZI_ORANI_AYLIK * fullMonths;
        }

        const totalPayment = amount + interest;

        const summary: CalculationResult['summary'] = {
            principal: { type: 'info', label: 'Vergi Anaparası', value: formatCurrency(amount) },
            interest: { type: 'info', label: 'Hesaplanan Gecikme Faizi', value: formatCurrency(interest) },
            total: { type: 'result', label: 'Toplam Ödenecek Tutar', value: formatCurrency(totalPayment), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Vergi Gecikme Faizi Nedir?",
        content: (
          <p>
            Vergi gecikme faizi, vadesinde ödenmeyen vergiler için vade tarihinden ödeme tarihine kadar geçen süre için hesaplanan bir faiz türüdür. Bu faiz, vergi ziyaı (kaybı) durumlarında veya re'sen, ikmalen yapılan tarhiyatlarda uygulanır. Oranı, gecikme zammı oranından farklı olabilir ve kanunla belirlenir. <strong>Güncel aylık gecikme faizi oranı %4.5'tir.</strong>
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Gecikme faizi ve gecikme zammı arasındaki fark nedir?",
        answer: "Her ikisi de vadesinde ödenmeyen kamu alacakları için uygulansa da, aralarında teknik farklar vardır. Gecikme zammı, normal vade tarihinden sonraki tüm amme alacakları için uygulanırken; gecikme faizi daha çok vergi denetimleri sonucu ortaya çıkan ve ek olarak tarh edilen vergiler için hesaplanır."
      },
      {
        question: "Ay kesirleri için faiz nasıl hesaplanır?",
        answer: "Vergi Usul Kanunu'na göre, gecikme faizi hesaplanırken ay kesirleri (bir aydan az olan süreler) tam ay olarak dikkate alınır. Bu nedenle, bir gün bile gecikme olsa bir aylık faiz hesaplanır."
      }
    ]
  }
};

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Faiz Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}