'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

// Katsayılar ve taban puanlar ÖSYM verilerine dayalı TAHMİNİ değerlerdir.
const KPSS_CONSTANTS = {
    LISANS: {
        P1: { gy: 0.7, gk: 0.3, base: 41 },
        P2: { gy: 0.6, gk: 0.4, base: 37 },
        P3: { gy: 0.5, gk: 0.5, base: 34 },
    },
    ONLISANS: {
        P93: { gy: 0.5, gk: 0.5, base: 38 },
    },
    ORTAOGRETIM: {
        P94: { gy: 0.5, gk: 0.5, base: 40 },
    }
};

const KpssClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const inputFields: InputField[] = [
        { 
            id: 'level', 
            label: 'Öğrenim Düzeyi', 
            type: 'select',
            options: [
                { value: 'LISANS', label: 'Lisans' },
                { value: 'ONLISANS', label: 'Ön Lisans' },
                { value: 'ORTAOGRETIM', label: 'Ortaöğretim (Lise)' },
            ],
            defaultValue: 'LISANS'
        },
        { id: 'gy_dogru', label: 'Genel Yetenek Doğru', type: 'number', placeholder: '40' },
        { id: 'gy_yanlis', label: 'Genel Yetenek Yanlış', type: 'number', placeholder: '10' },
        { id: 'gk_dogru', label: 'Genel Kültür Doğru', type: 'number', placeholder: '45' },
        { id: 'gk_yanlis', label: 'Genel Kültür Yanlış', type: 'number', placeholder: '5' },
    ];

    const calculate = async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        const { level, gy_dogru, gy_yanlis, gk_dogru, gk_yanlis } = inputs;
        const levelKey = level as keyof typeof KPSS_CONSTANTS;

        if ( (Number(gy_dogru) + Number(gy_yanlis) > 60) || (Number(gk_dogru) + Number(gk_yanlis) > 60) ) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Bir testteki doğru ve yanlış sayısı toplamı 60\'ı geçemez.' } } };
        }

        const gyNet = Number(gy_dogru) - (Number(gy_yanlis) / 4);
        const gkNet = Number(gk_dogru) - (Number(gk_yanlis) / 4);

        const levelConstants = KPSS_CONSTANTS[levelKey];
        if (!levelConstants) return null;

        const summary: CalculationResult['summary'] = {};

        Object.entries(levelConstants).forEach(([puanTuru, katsayilar]) => {
            const puan = (katsayilar.gy * gyNet) + (katsayilar.gk * gkNet) + katsayilar.base;
            summary[puanTuru] = {
                type: 'result',
                label: `KPSS ${puanTuru} Puanı`,
                value: formatNumber(puan, 3),
                isHighlighted: puanTuru === 'P3' || puanTuru === 'P93' || puanTuru === 'P94'
            };
        });
        
        summary.nets = { type: 'info', label: "Netler (GY / GK)", value: `${formatNumber(gyNet, 2)} / ${formatNumber(gkNet, 2)}`};

        return { summary };
    };

    return (
        <CalculatorUI
            title="KPSS Puan Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Öğrenim düzeyinizi seçip, Genel Yetenek ve Genel Kültür testlerindeki doğru/yanlış sayılarınızı girin.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="Tahmini KPSS Puan Sonuçları"
        />
    );
};

export default KpssClient; 