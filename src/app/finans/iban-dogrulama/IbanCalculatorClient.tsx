'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';

const IbanCalculatorClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const inputFields: InputField[] = [
        { id: 'iban', label: 'IBAN', type: 'text', placeholder: 'TR00 0000 0000 0000 0000 0000 00' },
    ];

    const calculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      const iban = String(inputs.iban).toUpperCase().replace(/\s/g, '');

      if (!iban.startsWith('TR') || iban.length !== 26) {
        return { 
            summary: { result: { label: 'Durum', value: 'Geçersiz IBAN Formatı' } },
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

        const summary = {
            status: { label: 'Durum', value: isValid ? '✅ Geçerli IBAN' : '❌ Geçersiz IBAN', isHighlighted: true },
            iban: { label: 'Girilen IBAN', value: String(inputs.iban) }
        };

        return { summary };

      } catch (e) {
        return { 
            summary: { result: { label: 'Hata', value: 'Geçersiz karakterler içeriyor.' } },
        };
      }
    };

    const handleCalculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        const calculationResult = await calculate(inputs);
        setResult(calculationResult);
        return calculationResult;
    };

    const getResultTitle = () => {
        if (!result) return "Doğrulama Sonucu";
        const statusValue = result.summary.status?.value;
        if (typeof statusValue === 'string' && statusValue.includes("Geçerli")) {
            return "IBAN Geçerli";
        }
        return "IBAN Geçersiz";
    }

    return (
        <CalculatorUI 
            title="IBAN Doğrulama Aracı"
            description={<p className="text-sm text-gray-600">Lütfen doğrulamak istediğiniz Türkiye'ye ait IBAN'ı (TR ile başlayan 26 karakter) girin.</p>}
            inputFields={inputFields} 
            calculate={handleCalculate}
            resultTitle={getResultTitle()}
        />
    );
};

export default IbanCalculatorClient; 