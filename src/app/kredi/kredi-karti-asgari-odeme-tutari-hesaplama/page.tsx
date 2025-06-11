'use client';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';

const Page = () => {
  const title = "Kredi Kartı Asgari Ödeme Tutarı Hesaplama";
  
  const inputFields: InputField[] = [
    { id: 'statement', label: 'Dönem Borcu (₺)', type: 'number', placeholder: 'Örn: 5000' },
    { id: 'limit', label: 'Kredi Kartı Limiti (₺)', type: 'number', placeholder: 'Örn: 25000' },
  ];

  const calculate = (inputs: { [key: string]: string | number }): CalculationResult | null => {
    const statement = Number(inputs.statement);
    const limit = Number(inputs.limit);

    if (statement < 0 || limit <= 0) {
      alert('Lütfen geçerli borç ve limit tutarları girin.');
      return null;
    }
    if (statement === 0) {
      return { minPayment: { label: 'Asgari Ödeme Tutarı', value: '0.00', unit: '₺' } };
    }

    let minPaymentRate = 0;
    if (limit <= 25000) {
      minPaymentRate = 0.20; // %20
    } else {
      minPaymentRate = 0.40; // %40
    }

    let minPayment = statement * minPaymentRate;
    
    // Asgari ödeme tutarı dönem borcundan yüksek olamaz
    if (minPayment > statement) {
        minPayment = statement;
    }

    return {
      minPayment: { label: 'Asgari Ödeme Tutarı', value: minPayment.toFixed(2), unit: '₺' },
    };
  };

  const description = (
    <p className="text-sm text-gray-600">
      Kredi kartı dönem borcunuz için ödemeniz gereken yasal asgari tutarı hesaplayın. Limit 25.000 TL'ye kadarsa %20, üzerindeyse %40 olarak uygulanır.
    </p>
  );

  return <CalculatorUI title={title} inputFields={inputFields} calculate={calculate} description={description} />;
};

export default Page;