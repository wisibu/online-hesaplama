'use server';

import { CalculationResult } from '@/components/CalculatorUI';

export const calculate = async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
  const iban = String(inputs.iban).toUpperCase().replace(/\s/g, '');

  if (!iban.startsWith('TR') || iban.length !== 26) {
    return { 
        summary: { result: { type: 'error', label: 'Durum', value: 'Geçersiz IBAN Formatı' } },
    };
  }

  const rearranged = iban.substring(4) + iban.substring(0, 4);
  const numericIban = Array.from(rearranged).map(char => {
      const code = char.charCodeAt(0);
      return code >= 65 && code <= 90 ? (code - 55).toString() : char;
  }).join('');
  
  try {
    const remainder = BigInt(numericIban) % BigInt(97);
    const isValid = remainder === BigInt(1);

    const summary: CalculationResult['summary'] = {
        status: { type: 'result', label: 'Durum', value: isValid ? '✅ Geçerli IBAN' : '❌ Geçersiz IBAN', isHighlighted: true },
        iban: { type: 'info', label: 'Kontrol Edilen IBAN', value: String(inputs.iban) }
    };

    return { summary };

  } catch (e) {
    return { 
        summary: { result: { type: 'error', label: 'Hata', value: 'Geçersiz karakterler içeriyor.' } },
    };
  }
}; 