import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "İş Yeri Kredisi Hesaplama - Faiz Oranları & Taksitler | OnlineHesaplama",
  description: "İşletmeniz için en uygun iş yeri kredisini anında hesaplayın. 2024 güncel faiz oranlarıyla aylık taksit ve toplam geri ödeme tutarını öğrenin.",
  keywords: ["iş yeri kredisi hesaplama", "ticari kredi hesaplama", "esnaf kredisi", "kobi kredisi", "işletme kredisi faiz oranları"],
  calculator: {
    title: "İş Yeri Kredisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        İşletmenizin ihtiyaçları için kullanacağınız kredinin aylık taksitlerini ve toplam geri ödeme tutarını hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'amount', label: 'Kredi Tutarı (₺)', type: 'number', placeholder: '100000' },
      { id: 'interest', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: '1.89' },
      { id: 'term', label: 'Vade (Ay)', type: 'number', placeholder: '48' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const amount = Number(inputs.amount);
      const interestRate = Number(inputs.interest) / 100;
      const term = Number(inputs.term);

      if (amount <= 0 || interestRate <= 0 || term <= 0) {
        return null;
      }

      const monthlyPayment = amount * (interestRate * Math.pow(1 + interestRate, term)) / (Math.pow(1 + interestRate, term) - 1);
      const totalPayment = monthlyPayment * term;
      const totalInterest = totalPayment - amount;

      const summary = {
        monthlyPayment: { label: 'Aylık Taksit', value: formatCurrency(monthlyPayment) },
        totalPayment: { label: 'Toplam Geri Ödeme', value: formatCurrency(totalPayment) },
        totalInterest: { label: 'Toplam Faiz Tutarı', value: formatCurrency(totalInterest) },
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
        title: "Örnek Ödeme Planı",
        headers: ["Ay", "Taksit Tutarı", "Anapara", "Faiz", "Kalan Anapara"],
        rows: rows,
      };
      
      return { summary, table };
    },
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
    <CalculatorUI 
      title={pageConfig.calculator.title} 
      inputFields={pageConfig.calculator.inputFields} 
      calculate={pageConfig.calculator.calculate} 
      description={pageConfig.calculator.description} 
    />
  );
}