'use client';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';

const Page = () => {
  const title = "Bileşik Faiz Hesaplama";
  const inputFields: InputField[] = JSON.parse(`[{"id":"principal","label":"Ana Para Tutarı (₺)","type":"number","placeholder":"Örn: 10000"},{"id":"rate","label":"Yıllık Faiz Oranı (%)","type":"number","placeholder":"Örn: 5"},{"id":"time","label":"Süre (Yıl)","type":"number","placeholder":"Örn: 10"},{"id":"compounding","label":"Faiz İşleme Sıklığı","type":"select","placeholder":"Seçiniz","options":[{"value":1,"label":"Yıllık"},{"value":2,"label":"6 Aylık"},{"value":4,"label":"3 Aylık (Çeyrek)"},{"value":12,"label":"Aylık"},{"value":365,"label":"Günlük"}]}]`);
  const calculate = (inputs: { [key: string]: string | number }): CalculationResult | null => {
    
      const principal = Number(inputs.principal);
      const rate = Number(inputs.rate) / 100;
      const time = Number(inputs.time);
      const n = Number(inputs.compounding);

      if (principal <= 0 || rate <= 0 || time <= 0 || n <= 0) {
        alert('Lütfen tüm alanlara pozitif değerler girin.');
        return null;
      }

      const amount = principal * Math.pow(1 + rate / n, n * time);
      const interest = amount - principal;

      return {
        total: { label: 'Vade Sonu Toplam Tutar', value: amount.toFixed(2), unit: '₺' },
        interest: { label: 'Toplam Faiz Getirisi', value: interest.toFixed(2), unit: '₺' },
      };
    
  };
  const description = <p className="text-sm text-gray-600">Yatırımınızın gelecekteki değerini, ana para üzerinden kazanılan faizin de faiz kazanması prensibine göre hesaplar.</p>;

  return <CalculatorUI title={title} inputFields={inputFields} calculate={calculate} description={description} />;
};

export default Page;
