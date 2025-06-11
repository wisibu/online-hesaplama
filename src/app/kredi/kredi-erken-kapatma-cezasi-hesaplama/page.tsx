import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Kredi Erken Kapatma Cezası Hesaplama | OnlineHesaplama",
  description: "Kredinizi erken kapatmanız durumunda ödemeniz gereken yasal ceza tutarını ve toplam indirim miktarını kolayca hesaplayın.",
  keywords: ["erken kapama cezası hesaplama", "kredi erken kapama", "kredi kapama indirimi", "erken ödeme cezası"],
  calculator: {
    title: "Kredi Erken Kapatma Cezası Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kredinizi vadesinden önce kapatmak istediğinizde ne kadar ceza ödeyeceğinizi veya ne kadar indirim alacağınızı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Kalan Anapara Tutarı (₺)', type: 'number', placeholder: 'Örn: 30000' },
      { id: 'remainingTerm', label: 'Kalan Vade Sayısı', type: 'number', placeholder: 'Örn: 12' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const principal = Number(inputs.principal);
      const remainingTerm = Number(inputs.remainingTerm);

      if (principal <= 0 || remainingTerm <= 0) {
        return null;
      }

      // 36 ay ve altı için %1, 36 ay üstü için %2 ceza oranı uygulanır.
      const penaltyRate = remainingTerm <= 36 ? 0.01 : 0.02;
      const penaltyAmount = principal * penaltyRate;
      
      const summary = {
        penalty: { label: `Erken Kapama Cezası (%${penaltyRate * 100})`, value: formatCurrency(penaltyAmount) },
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