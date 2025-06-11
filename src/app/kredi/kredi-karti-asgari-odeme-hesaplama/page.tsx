import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Kredi Kartı Asgari Ödeme Hesaplama | OnlineHesaplama",
  description: "Kredi kartı dönem borcunuz için ödemeniz gereken yasal asgari ödeme tutarını limitinize ve borcunuza göre anında öğrenin.",
  keywords: ["kredi kartı asgari ödeme hesaplama", "asgari ödeme tutarı", "kredi kartı borcu", "asgari hesaplama"],
  calculator: {
    title: "Kredi Kartı Asgari Ödeme Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kredi kartı dönem borcunuza göre ödemeniz gereken minimum tutarı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'limit', label: 'Kredi Kartı Limiti (₺)', type: 'number', placeholder: 'Örn: 25000' },
      { id: 'debt', label: 'Dönem Borcu (₺)', type: 'number', placeholder: 'Örn: 5000' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const limit = Number(inputs.limit);
      const debt = Number(inputs.debt);

      if (limit <= 0 || debt <= 0) {
        return null;
      }
      
      if (debt > limit) {
        // Borç limitten büyük olamaz, ama kullanıcı hatasına karşı bir kontrol
        return {
          summary: {
            minPayment: { label: 'Asgari Ödeme Tutarı', value: formatCurrency(debt) },
            info: { label: 'Not', value: 'Dönem borcu, limitin tamamıdır.' },
          }
        };
      }

      let rate = 0;
      // 25.000 TL altı limitler için %20, üstü için %40
      if (limit < 25000) {
        rate = 0.20;
      } else {
        rate = 0.40;
      }

      let minPayment = debt * rate;
      
      // Asgari ödeme tutarı borçtan büyük olamaz.
      if (minPayment > debt) {
          minPayment = debt;
      }

      const summary = {
        minPayment: { label: `Asgari Ödeme Tutarı (%${rate * 100})`, value: formatCurrency(minPayment) },
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