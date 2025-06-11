'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

const YuzdeHesaplamaClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const inputFields: InputField[] = [
      { id: 'calculationType', label: 'Hesaplama Türü', type: 'select', options: [
          { value: 'percentOf', label: 'Bir Sayının Yüzdesini Bulma (Örn: 100\'ün %20\'si)' },
          { value: 'whatPercent', label: 'Bir Sayı Diğerinin Yüzde Kaçıdır? (Örn: 20, 100\'ün % kaçıdır?)' },
          { value: 'increase', label: 'Yüzde Artış Hesaplama (Örn: 100\'ü %20 artır)' },
          { value: 'decrease', label: 'Yüzde Azalış Hesaplama (Örn: 100\'ü %20 azalt)' },
      ], defaultValue: 'percentOf'},
      { 
        id: 'valueA', 
        label: 'Sayı', 
        type: 'number', 
        placeholder: '100',
        displayCondition: (inputs) => {
          const type = inputs.calculationType;
          if (type === 'whatPercent') return { label: 'Pay (Küçük Sayı)' };
          return { label: 'Sayı' };
        }
      },
      { 
        id: 'valueB', 
        label: 'Yüzde Oranı (%)', 
        type: 'number', 
        placeholder: '20',
        displayCondition: (inputs) => {
          const type = inputs.calculationType;
          if (type === 'whatPercent') return { label: 'Payda (Büyük Sayı)' };
          return { label: 'Yüzde Oranı (%)' };
        }
      },
    ];

    const calculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      const type = inputs.calculationType as string;
      const valueA = Number(inputs.valueA);
      const valueB = Number(inputs.valueB);

      if (isNaN(valueA) || isNaN(valueB)) {
        return null;
      }
      
      let resultValue: number | string = 0;
      let resultLabel: string = 'Sonuç';

      switch (type) {
        case 'percentOf':
          resultValue = (valueA * valueB) / 100;
          resultLabel = `${formatNumber(valueA)} sayısının %${formatNumber(valueB)}'i`;
          break;
        case 'whatPercent':
          if (valueB === 0) {
            return { summary: { error: { label: 'Hata', value: 'İkinci sayı (payda) sıfır olamaz.' } } };
          }
          resultValue = `${formatNumber((valueA / valueB) * 100)}%`;
          resultLabel = `${formatNumber(valueA)}, ${formatNumber(valueB)} sayısının yüzde kaçıdır?`;
          break;
        case 'increase':
          resultValue = valueA * (1 + valueB / 100);
          resultLabel = `${formatNumber(valueA)} sayısının %${formatNumber(valueB)} artırılmış hali`;
          break;
        case 'decrease':
          resultValue = valueA * (1 - valueB / 100);
          resultLabel = `${formatNumber(valueA)} sayısının %${formatNumber(valueB)} azaltılmış hali`;
          break;
        default:
          return null;
      }

      const summary = {
        result: { label: resultLabel, value: typeof resultValue === 'number' ? formatNumber(resultValue) : resultValue, isHighlighted: true },
      };

      return { summary };
    };

    const handleCalculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        const calculationResult = await calculate(inputs);
        setResult(calculationResult);
        return calculationResult;
    };

    return (
        <CalculatorUI 
            title="Yüzde Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                  Farklı yüzde hesaplamalarını hızlı ve kolay bir şekilde yapın.
                </p>
            }
            inputFields={inputFields} 
            calculate={handleCalculate}
            resultTitle="Yüzde Hesaplama Sonucu"
        />
    );
};

export default YuzdeHesaplamaClient; 