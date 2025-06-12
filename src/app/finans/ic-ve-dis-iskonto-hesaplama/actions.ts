'use server';

import { CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';

export const calculate = async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
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

    const summary: CalculationResult['summary'] = {
        presentValue: { type: 'result', label: 'Senedin Bugünkü Peşin Değeri', value: formatCurrency(presentValue), isHighlighted: true },
        discountAmount: { type: 'info', label: 'İskonto (Kesinti) Tutarı', value: formatCurrency(discountAmount) },
    };

    return { summary };
}; 