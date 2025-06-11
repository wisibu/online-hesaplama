import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Taksitli Nakit Avans Hesaplama - Faiz ve Taksit Tutarı | OnlineHesaplama",
  description: "Kredi kartınızdan kullanacağınız taksitli nakit avansın aylık taksitlerini, toplam geri ödemesini ve faiz tutarını güncel oranlarla hesaplayın.",
  keywords: ["taksitli nakit avans hesaplama", "nakit avans faizi", "kredi kartı nakit avans", "avans hesaplama"],
  calculator: {
    title: "Taksitli Nakit Avans Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kredi kartınızdan çekeceğiniz taksitli nakit avansın geri ödeme planını oluşturun.
      </p>
    ),
    inputFields: [
      { id: 'amount', label: 'Nakit Avans Tutarı (₺)', type: 'number', placeholder: 'Örn: 5000' },
      { id: 'interest', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: 'Örn: 4.42' },
      { id: 'term', label: 'Vade (Ay)', type: 'number', placeholder: 'Örn: 12' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
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
        title: "Nakit Avans Geri Ödeme Planı",
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