import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const inputFields: InputField[] = [
  { id: 'amount', label: 'Kredi Tutarı (₺)', type: 'number', placeholder: 'Örn: 100000' },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
  'use server';
  const amount = Number(inputs.amount);

  if (amount <= 0) {
    return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir kredi tutarı girin.' } } };
  }

  // Dosya masrafı genellikle kredi tutarının binde 5'i olarak hesaplanır.
  const fileFee = amount * 0.005; 
  
  const summary: CalculationResult['summary'] = {
    fileFee: { type: 'result', label: 'Maksimum Dosya Masrafı (Binde 5)', value: formatCurrency(fileFee), isHighlighted: true },
  };

  return { summary };
}

export const metadata: Metadata = {
  title: "Kredi Dosya Masrafı Hesaplama (Binde 5) | OnlineHesaplama",
  description: "Kredi çekerken ödeyeceğiniz yasal maksimum dosya masrafını (binde 5) kolayca hesaplayın. Kredi tutarını girin, anında öğrenin.",
  keywords: ["kredi dosya masrafı hesaplama", "dosya masrafı ne kadar", "kredi masrafları", "binde 5 dosya masrafı"],
  openGraph: {
    title: "Kredi Dosya Masrafı Hesaplama (Binde 5) | OnlineHesaplama",
    description: "Kredi çekerken ödeyeceğiniz yasal maksimum dosya masrafını (binde 5) kolayca hesaplayın. Kredi tutarını girin, anında öğrenin.",
  },
};

export default function Page() {
  return (
    <CalculatorUI 
      title="Kredi Dosya Masrafı Hesaplama" 
      inputFields={inputFields} 
      calculate={calculate} 
      description={
        <p className="text-sm text-gray-600">
          Çekeceğiniz kredi için yasal olarak alınabilecek maksimum dosya masrafı tutarını (binde 5) hesaplayın.
        </p>
      }
    />
  );
}