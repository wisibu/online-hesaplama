'use client';

import CalculatorUI, { InputField } from '@/components/CalculatorUI';
import { calculate } from './actions';

const IcNveDisIskontoClient = () => {
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

    return (
        <CalculatorUI
            title="İç ve Dış İskonto Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Senedin veya çekin değerini, faiz oranını ve vadeye kalan gün sayısını girerek iskonto tutarını hesaplayın.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="İskonto Sonucu"
        />
    );
};

export default IcNveDisIskontoClient; 