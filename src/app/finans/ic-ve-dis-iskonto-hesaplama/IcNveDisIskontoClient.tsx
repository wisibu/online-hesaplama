'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

const IcNveDisIskontoClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const inputFields: InputField[] = [
        { 
            id: 'discountType', 
            label: 'İskonto Türü', 
            type: 'select',
            options: [
                { value: 'external', label: 'Dış İskonto' },
                { value: 'internal', label: 'İç İskonto' },
            ],
            defaultValue: 'external'
        },
        { id: 'nominalValue', label: 'Senedin Nominal Değeri (₺)', type: 'number', placeholder: '10000' },
        { id: 'interestRate', label: 'Yıllık İskonto Oranı (%)', type: 'number', placeholder: '25' },
        { id: 'days', label: 'Vadeye Kalan Gün Sayısı', type: 'number', placeholder: '90' },
    ];

    const calculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        const { discountType, nominalValue, interestRate, days } = inputs;
        const S = Number(nominalValue); // Nominal Değer
        const n = Number(interestRate) / 100; // Yıllık Faiz Oranı
        const t = Number(days); // Gün

        if ([S, n, t].some(v => isNaN(v) || v <= 0)) {
            return null;
        }

        let discountAmount = 0;
        let presentValue = 0;

        if (discountType === 'external') {
            // Dış İskonto
            discountAmount = S * n * (t / 360); // Genellikle 360 gün kullanılır
            presentValue = S - discountAmount;
        } else {
            // İç İskonto
            const denominator = 1 + (n * t / 360);
            presentValue = S / denominator;
            discountAmount = S - presentValue;
        }

        const summary = {
            presentValue: { label: 'Senedin Bugünkü Peşin Değeri', value: formatCurrency(presentValue), isHighlighted: true },
            discountAmount: { label: 'İskonto (Kesinti) Tutarı', value: formatCurrency(discountAmount) },
        };

        return { summary };
    };

    const handleCalculate = async (inputs: { [key:string]: string | number}): Promise<CalculationResult | null> => {
        const calculationResult = await calculate(inputs);
        setResult(calculationResult);
        return calculationResult;
    };

    return (
        <CalculatorUI
            title="İç ve Dış İskonto Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Senedin veya çekin değerini, faiz oranını ve vadeye kalan gün sayısını girerek iskonto tutarını hesaplayın.
                </p>
            }
            inputFields={inputFields}
            calculate={handleCalculate}
            resultTitle="İskonto Sonucu"
        />
    );
};

export default IcNveDisIskontoClient; 