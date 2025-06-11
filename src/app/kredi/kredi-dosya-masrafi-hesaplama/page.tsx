import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Kredi Dosya Masrafı Hesaplama (Binde 5) | OnlineHesaplama",
  description: "Kredi çekerken ödeyeceğiniz yasal maksimum dosya masrafını (binde 5) kolayca hesaplayın. Kredi tutarını girin, anında öğrenin.",
  keywords: ["kredi dosya masrafı hesaplama", "dosya masrafı ne kadar", "kredi masrafları", "binde 5 dosya masrafı"],
  calculator: {
    title: "Kredi Dosya Masrafı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Çekeceğiniz kredi için yasal olarak alınabilecek maksimum dosya masrafı tutarını (binde 5) hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'amount', label: 'Kredi Tutarı (₺)', type: 'number', placeholder: 'Örn: 100000' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const amount = Number(inputs.amount);

      if (amount <= 0) {
        return null;
      }

      // Dosya masrafı genellikle kredi tutarının binde 5'i olarak hesaplanır.
      const fileFee = amount * 0.005; 
      
      const summary = {
        fileFee: { label: 'Maksimum Dosya Masrafı (Binde 5)', value: formatCurrency(fileFee) },
      };

      return { summary };
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