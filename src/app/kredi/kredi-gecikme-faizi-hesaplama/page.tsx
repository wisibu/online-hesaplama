'use client';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';

const Page = () => {
  const title = "Kredi Gecikme Faizi Hesaplama";
  
  const inputFields: InputField[] = [
    { id: 'payment', label: 'Ödenmeyen Taksit Tutarı (₺)', type: 'number', placeholder: 'Örn: 1500' },
    { id: 'interest', label: 'Aylık Kredi Faizi (%)', type: 'number', placeholder: 'Örn: 1.5' },
    { id: 'days', label: 'Gecikme Süresi (Gün)', type: 'number', placeholder: 'Örn: 30' },
  ];

  const calculate = (inputs: { [key: string]: string | number }): CalculationResult | null => {
    const payment = Number(inputs.payment);
    const interest = Number(inputs.interest) / 100;
    const days = Number(inputs.days);

    if (payment <= 0 || interest <= 0 || days <= 0) {
      alert('Lütfen tüm alanlara pozitif değerler girin.');
      return null;
    }

    // Gecikme faizi, akdi faizin en fazla %30 fazlası olabilir.
    const maxDelayInterestRate = interest * 1.30;
    const dailyDelayRate = maxDelayInterestRate / 30;
    const delayInterestAmount = payment * dailyDelayRate * days;
    
    return {
      delayInterest: { label: 'Hesaplanan Gecikme Faizi', value: delayInterestAmount.toFixed(2), unit: '₺' },
    };
  };

  const description = (
    <p className="text-sm text-gray-600">
      Ödemediğiniz kredi taksitleriniz için uygulanacak yasal gecikme faizi tutarını hesaplayın.
    </p>
  );

  return <CalculatorUI title={title} inputFields={inputFields} calculate={calculate} description={description} />;
};

export default Page;