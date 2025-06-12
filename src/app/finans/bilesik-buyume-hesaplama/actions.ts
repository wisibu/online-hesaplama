'use server';

import { CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';

export const calculate = async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {

  const { calculationType, initialValue, finalValue, growthRate, periods } = inputs;
  const numInitial = Number(initialValue);
  const numFinal = Number(finalValue);
  const numRate = Number(growthRate);
  const numPeriods = Number(periods);

  if ((calculationType === 'futureValue' && (isNaN(numInitial) || isNaN(numRate) || isNaN(numPeriods))) ||
    (calculationType === 'cagr' && (isNaN(numInitial) || isNaN(numFinal) || isNaN(numPeriods))) ||
    numPeriods <= 0 || numInitial <= 0) {
    return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru doldurun.' } } };
  }
  
  let summary: CalculationResult['summary'] = {};

  if (calculationType === 'futureValue') {
    const fv = numInitial * Math.pow(1 + (numRate / 100), numPeriods);
    summary = {
      futureValue: { type: 'result', label: 'Gelecekteki Değer', value: formatCurrency(fv), isHighlighted: true },
      totalGrowth: { type: 'info', label: 'Toplam Büyüme', value: formatCurrency(fv - numInitial) },
    };
  } else { // cagr
    if (numFinal < numInitial) {
      return { summary: { error: { type: 'error', label: 'Hata', value: 'Bitiş değeri başlangıçtan küçük olamaz.' } } };
    }
    const cagr = (Math.pow(numFinal / numInitial, 1 / numPeriods) - 1) * 100;
    summary = {
      cagr: { type: 'result', label: 'Yıllık Bileşik Büyüme Oranı (CAGR)', value: `%${formatNumber(cagr, 2)}`, isHighlighted: true },
    };
  }

  return { summary };
}; 