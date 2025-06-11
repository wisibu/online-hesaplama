'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';

const BilesikBuyumeClient = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);

  const inputFields: InputField[] = [
    { 
      id: 'calculationType', 
      label: 'Hesaplama Türü', 
      type: 'select',
      options: [
          { value: 'futureValue', label: 'Gelecekteki Değeri Hesapla' },
          { value: 'cagr', label: 'Yıllık Büyüme Oranını (CAGR) Hesapla' },
      ],
      defaultValue: 'futureValue'
    },
    { id: 'initialValue', label: 'Başlangıç Değeri (₺)', type: 'number', placeholder: '1000', displayCondition: () => true },
    { id: 'finalValue', label: 'Bitiş Değeri (₺)', type: 'number', placeholder: '2000', displayCondition: inputs => inputs.calculationType === 'cagr' },
    { id: 'growthRate', label: 'Yıllık Büyüme Oranı (%)', type: 'number', placeholder: '10', displayCondition: inputs => inputs.calculationType === 'futureValue' },
    { id: 'periods', label: 'Dönem Sayısı (Yıl)', type: 'number', placeholder: '5', displayCondition: () => true },
  ];

  const calculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
    const { calculationType, initialValue, finalValue, growthRate, periods } = inputs;
    const numInitial = Number(initialValue);
    const numFinal = Number(finalValue);
    const numRate = Number(growthRate);
    const numPeriods = Number(periods);

    if ( (calculationType === 'futureValue' && (isNaN(numInitial) || isNaN(numRate) || isNaN(numPeriods))) ||
         (calculationType === 'cagr' && (isNaN(numInitial) || isNaN(numFinal) || isNaN(numPeriods))) ||
         numPeriods <= 0 || numInitial <= 0) {
      return null;
    }

    let summary = {};

    if (calculationType === 'futureValue') {
      const fv = numInitial * Math.pow(1 + (numRate / 100), numPeriods);
      summary = {
        futureValue: { label: 'Gelecekteki Değer', value: formatCurrency(fv), isHighlighted: true },
        totalGrowth: { label: 'Toplam Büyüme', value: formatCurrency(fv - numInitial) },
      };
    } else { // cagr
      if(numFinal < numInitial) return null; // Bitiş değeri başlangıçtan küçük olamaz
      const cagr = (Math.pow(numFinal / numInitial, 1 / numPeriods) - 1) * 100;
      summary = {
        cagr: { label: 'Yıllık Bileşik Büyüme Oranı (CAGR)', value: `%${formatNumber(cagr, 2)}`, isHighlighted: true },
      };
    }
    
    return { summary };
  };

  const handleCalculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
    const calculationResult = await calculate(inputs);
    setResult(calculationResult);
    return calculationResult;
  };

  return (
    <CalculatorUI 
      title="Bileşik Büyüme Hesaplama"
      description={
        <p className="text-sm text-gray-600">
          Hesaplamak istediğiniz değeri seçin ve gerekli alanları doldurun.
        </p>
      }
      inputFields={inputFields} 
      calculate={handleCalculate}
    />
  );
};

export default BilesikBuyumeClient; 