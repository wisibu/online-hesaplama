import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const inputFields: InputField[] = [
  { id: 'amount', label: 'Kredi Tutarı (₺)', type: 'number', placeholder: '100000' },
  { id: 'interest', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: '1.89' },
  { id: 'term', label: 'Vade (Ay)', type: 'number', placeholder: '48' },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
  'use server';
  const amount = Number(inputs.amount);
  const interestRate = Number(inputs.interest) / 100;
  const term = Number(inputs.term);

  if (amount <= 0 || interestRate <= 0 || term <= 0) {
    return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları pozitif değerlerle doldurun.' } } };
  }

  const monthlyPayment = amount * (interestRate * Math.pow(1 + interestRate, term)) / (Math.pow(1 + interestRate, term) - 1);
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - amount;

  const summary: CalculationResult['summary'] = {
    monthlyPayment: { type: 'result', label: 'Aylık Taksit', value: formatCurrency(monthlyPayment), isHighlighted: true },
    totalPayment: { type: 'info', label: 'Toplam Geri Ödeme', value: formatCurrency(totalPayment) },
    totalInterest: { type: 'info', label: 'Toplam Faiz Tutarı', value: formatCurrency(totalInterest) },
  };

  let remainingPrincipal = amount;
  const rows = [];
  for (let i = 1; i <= term; i++) {
    const interestPayment = remainingPrincipal * interestRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingPrincipal -= principalPayment;
    
    rows.push([
      i,
      formatCurrency(monthlyPayment),
      formatCurrency(principalPayment),
      formatCurrency(interestPayment),
      formatCurrency(Math.max(0, remainingPrincipal)),
    ]);
  }

  const table = {
    headers: ["Ay", "Taksit Tutarı", "Anapara", "Faiz", "Kalan Anapara"],
    rows: rows,
  };
  
  return { summary, table };
}

export const metadata: Metadata = {
  title: "İş Yeri Kredisi Hesaplama - Faiz Oranları & Taksitler | OnlineHesaplama",
  description: "İşletmeniz için en uygun iş yeri kredisini anında hesaplayın. 2024 güncel faiz oranlarıyla aylık taksit ve toplam geri ödeme tutarını öğrenin.",
  keywords: ["iş yeri kredisi hesaplama", "ticari kredi hesaplama", "esnaf kredisi", "kobi kredisi", "işletme kredisi faiz oranları"],
  openGraph: {
    title: "İş Yeri Kredisi Hesaplama - Faiz Oranları & Taksitler | OnlineHesaplama",
    description: "İşletmeniz için en uygun iş yeri kredisini anında hesaplayın. 2024 güncel faiz oranlarıyla aylık taksit ve toplam geri ödeme tutarını öğrenin.",
  },
};

export default function Page() {
  return (
    <CalculatorUI 
      title="İş Yeri Kredisi Hesaplama" 
      inputFields={inputFields} 
      calculate={calculate} 
      description={
        <p className="text-sm text-gray-600">
          İşletmenizin ihtiyaçları için kullanacağınız kredinin aylık taksitlerini ve toplam geri ödeme tutarını hesaplayın.
        </p>
      }
      tableTitle="Örnek Ödeme Planı"
    />
  );
}