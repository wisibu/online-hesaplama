'use client';

import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

const YuzdeHesaplamaClient = () => {

    const inputFields: InputField[] = [
      { 
        id: 'calculationType', 
        label: 'Hesaplama Türü', 
        type: 'select', 
        options: [
            { value: 'percentOf', label: 'Bir Sayının Yüzdesini Bulma (Örn: 100\'ün %20\'si)' },
            { value: 'whatPercent', label: 'Bir Sayı Diğerinin Yüzde Kaçıdır? (Örn: 20, 100\'ün % kaçıdır?)' },
            { value: 'increase', label: 'Yüzde Artış Hesaplama (Örn: 100\'ü %20 artır)' },
            { value: 'decrease', label: 'Yüzde Azalış Hesaplama (Örn: 100\'ü %20 azalt)' },
        ], 
        defaultValue: 'percentOf'
      },
      // Fields for 'percentOf'
      { id: 'percentOf_A', label: 'Sayı', type: 'number', placeholder: '100', displayCondition: { field: 'calculationType', value: 'percentOf' } },
      { id: 'percentOf_B', label: 'Yüzde Oranı (%)', type: 'number', placeholder: '20', displayCondition: { field: 'calculationType', value: 'percentOf' } },

      // Fields for 'whatPercent'
      { id: 'whatPercent_A', label: 'Pay (Küçük Sayı)', type: 'number', placeholder: '20', displayCondition: { field: 'calculationType', value: 'whatPercent' } },
      { id: 'whatPercent_B', label: 'Payda (Büyük Sayı)', type: 'number', placeholder: '100', displayCondition: { field: 'calculationType', value: 'whatPercent' } },

      // Fields for 'increase'
      { id: 'increase_A', label: 'Sayı', type: 'number', placeholder: '100', displayCondition: { field: 'calculationType', value: 'increase' } },
      { id: 'increase_B', label: 'Yüzde Oranı (%)', type: 'number', placeholder: '20', displayCondition: { field: 'calculationType', value: 'increase' } },

      // Fields for 'decrease'
      { id: 'decrease_A', label: 'Sayı', type: 'number', placeholder: '100', displayCondition: { field: 'calculationType', value: 'decrease' } },
      { id: 'decrease_B', label: 'Yüzde Oranı (%)', type: 'number', placeholder: '20', displayCondition: { field: 'calculationType', value: 'decrease' } },
    ];

    const calculate = async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      const type = inputs.calculationType as string;
      const valueA = Number(inputs[`${type}_A`]);
      const valueB = Number(inputs[`${type}_B`]);

      if (isNaN(valueA) || isNaN(valueB)) {
        // This case is usually handled by CalculatorUI's validation, but as a fallback.
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
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Payda sıfır olamaz.' } } };
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

      const summary: CalculationResult['summary'] = {
        result: { type: 'result', label: resultLabel, value: typeof resultValue === 'number' ? formatNumber(resultValue) : resultValue, isHighlighted: true },
      };

      return { summary };
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
            calculate={calculate}
            resultTitle="Yüzde Hesaplama Sonucu"
        />
    );
};

export default YuzdeHesaplamaClient; 