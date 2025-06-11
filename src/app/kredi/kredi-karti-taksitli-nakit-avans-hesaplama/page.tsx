'use client';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';

const Page = () => {
  const title = "Taksitli Nakit Avans Hesaplama";
  
  const inputFields: InputField[] = [
    { id: 'amount', label: 'Nakit Avans Tutarı (₺)', type: 'number', placeholder: 'Örn: 5000' },
    { id: 'interest', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: 'Örn: 4.5' },
    { id: 'term', label: 'Vade (Ay)', type: 'number', placeholder: '12' },
  ];

  const calculate = (inputs: { [key: string]: string | number }): CalculationResult | null => {
    const amount = Number(inputs.amount);
    const interest = Number(inputs.interest) / 100;
    const term = Number(inputs.term);

    if (amount <= 0 || interest <= 0 || term <= 0) {
      alert('Lütfen tüm alanlara pozitif değerler girin.');
      return null;
    }

    // Taksitli nakit avans hesaplaması standart kredi formülü ile aynıdır.
    const monthlyPayment = amount * (interest * Math.pow(1 + interest, term)) / (Math.pow(1 + interest, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - amount;

    return {
      monthly: { label: 'Aylık Taksit', value: monthlyPayment.toFixed(2), unit: '₺' },
      total: { label: 'Toplam Geri Ödeme', value: totalPayment.toFixed(2), unit: '₺' },
      interest: { label: 'Toplam Faiz Tutarı', value: totalInterest.toFixed(2), unit: '₺' },
    };
  };

  const description = (
    <p className="text-sm text-gray-600">
      Kredi kartınızdan çekeceğiniz taksitli nakit avansın aylık taksitlerini ve toplam geri ödeme tutarını hesaplayın.
    </p>
  );

  return <CalculatorUI title={title} inputFields={inputFields} calculate={calculate} description={description} />;
};

export default Page;