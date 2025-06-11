"use server";

import { CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

export const calculateSum = async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
  const numbers = Object.values(inputs).map(Number).filter(n => !isNaN(n));
  
  if (numbers.length < 2) {
    return { summary: { error: { label: 'Hata', value: 'Lütfen en az iki sayı girin.' } } };
  }

  const toplam = numbers.reduce((acc, curr) => acc + curr, 0);

  const summary = {
    result: { label: 'Sayıların Toplamı', value: formatNumber(toplam), isHighlighted: true },
    count: { label: 'Toplanan Sayı Adedi', value: `${numbers.length} adet` },
  };

  return { summary };
}; 