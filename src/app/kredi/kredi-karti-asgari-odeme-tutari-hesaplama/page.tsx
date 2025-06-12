import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const inputFields: InputField[] = [
  { id: 'statementDebt', label: 'Dönem Borcu (₺)', type: 'number', placeholder: 'Örn: 5000' },
  { id: 'cardLimit', label: 'Kredi Kartı Limiti (₺)', type: 'number', placeholder: 'Örn: 25000' },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
  'use server';
  const statementDebt = Number(inputs.statementDebt);
  const cardLimit = Number(inputs.cardLimit);

  if (statementDebt < 0 || cardLimit <= 0) {
    return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli borç ve limit tutarları girin.' } } };
  }
  if (statementDebt === 0) {
    return { summary: { minPayment: { type: 'result', label: 'Asgari Ödeme Tutarı', value: formatCurrency(0), isHighlighted: true } } };
  }

  // Bankacılık Düzenleme ve Denetleme Kurumu (BDDK) yönetmeliğine göre oranlar.
  const minPaymentRate = cardLimit <= 25000 ? 0.20 : 0.40;
  let minPaymentAmount = statementDebt * minPaymentRate;

  if (minPaymentAmount > statementDebt) {
    minPaymentAmount = statementDebt;
  }
  
  const summary: CalculationResult['summary'] = {
    minPayment: { type: 'result', label: 'Asgari Ödeme Tutarı', value: formatCurrency(minPaymentAmount), isHighlighted: true },
    rateInfo: { type: 'info', label: 'Uygulanan Oran', value: `%${minPaymentRate * 100}` },
  };

  return { summary };
}

const content = {
  sections: [
    {
      title: "Kredi Kartı Asgari Ödeme Tutarı Nasıl Belirlenir?",
      content: (
        <p>
          Kredi kartı asgari ödeme tutarı, Türkiye'de Bankacılık Düzenleme ve Denetleme Kurumu (BDDK) tarafından belirlenen kurallara göre hesaplanır. Bu kurallar, kredi kartı limitine göre farklılık gösterir. Güncel düzenlemeye göre, limiti 25.000 TL'ye kadar olan kredi kartları için dönem borcunun %20'si, limiti 25.000 TL'nin üzerinde olanlar için ise %40'ı asgari ödeme tutarı olarak belirlenmiştir. Hesaplanan tutar, dönem borcunu geçemez.
        </p>
      )
    }
  ],
  faqs: [
    {
      question: "Asgari tutarı ödemezsem ne olur?",
      answer: "Asgari ödeme tutarının altında bir ödeme yaparsanız veya hiç ödeme yapmazsanız, kalan asgari tutar üzerinden gecikme faizi ve asgari tutarı aşan borç kısmı için ise akdi faiz işletilir. Bu durum kredi notunuzu da olumsuz etkiler."
    },
    {
      question: "Asgari tutarı ödemek borcun tamamını kapatır mı?",
      answer: "Hayır, asgari tutarı ödemek sizi yasal olarak temerrüde düşmekten kurtarır ancak kalan borcunuza bir sonraki hesap kesim tarihine kadar akdi faiz işlemeye devam eder. Borcun tamamını kapatmak için dönem borcunun tamamını ödemeniz gerekir."
    }
  ]
};

export const metadata: Metadata = {
  title: "Kredi Kartı Asgari Ödeme Tutarı Hesaplama | OnlineHesaplama",
  description: "Kredi kartı dönem borcunuz için ödemeniz gereken yasal asgari ödeme tutarını güncel oranlara göre anında hesaplayın. Kart limitinize göre sonucu öğrenin.",
  keywords: ["kredi kartı asgari ödeme hesaplama", "asgari ödeme tutarı", "kredi kartı borcu", "yasal asgari ödeme oranı"],
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="Kredi Kartı Asgari Ödeme Tutarı Hesaplama"
        description={
          <p className="text-sm text-gray-600">
            Kredi kartı dönem borcunuz ve limitinize göre ödemeniz gereken yasal asgari tutarı hesaplayın.
          </p>
        }
        inputFields={inputFields} 
        calculate={calculate} 
        resultTitle="Asgari Ödeme Sonucu"
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}