'use client';

import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';

const SimpleInterestPage = () => {
  const title = "Basit Faiz Hesaplama";
  
  const inputFields: InputField[] = [
    { id: 'principal', label: 'Ana Para Tutarı (₺)', type: 'number', placeholder: 'Örn: 10000' },
    { id: 'rate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: 'Örn: 5.5' },
    { id: 'time', label: 'Süre (Yıl)', type: 'number', placeholder: 'Örn: 2' },
  ];

  const calculate = (inputs: { [key: string]: string | number }): CalculationResult | null => {
    const principal = Number(inputs.principal);
    const rate = Number(inputs.rate);
    const time = Number(inputs.time);

    const r = rate / 100;

    if (principal <= 0 || r <= 0 || time <= 0) {
      alert('Lütfen tüm alanlara geçerli pozitif sayılar girin.');
      return null;
    }

    const interest = principal * r * time;
    const total = principal + interest;

    return {
      interest: { label: 'Toplam Faiz Getirisi', value: interest.toFixed(2), unit: '₺' },
      total: { label: 'Vade Sonu Toplam Tutar', value: total.toFixed(2), unit: '₺' },
    };
  };

  const description = (
    <p className="text-sm text-gray-600">
      Basit faiz, yatırım veya kredinin ana parası üzerinden hesaplanan faizdir.
    </p>
  );

  return <CalculatorUI title={title} inputFields={inputFields} calculate={calculate} description={description} />;
};

export default SimpleInterestPage;