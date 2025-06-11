'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

// Katsayılar, öğrenim düzeyine ve engel grubuna göre değişir. 
// Bunlar ÖSYM'nin geçmiş yıllardaki verilerine dayalı TAHMİNİ değerlerdir.
const EKPSS_CONSTANTS = {
    LISANS: { GY_K: 0.6, GK_K: 0.4, BASE: 40 },
    ONLISANS: { GY_K: 0.5, GK_K: 0.5, BASE: 40 },
    ORTAOGRETIM: { GY_K: 0.4, GK_K: 0.6, BASE: 40 },
};

const EkpssClient = () => {
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
        { id: 'gy_dogru', label: 'Genel Yetenek Doğru', type: 'number', placeholder: '25' },
        { id: 'gy_yanlis', label: 'Genel Yetenek Yanlış', type: 'number', placeholder: '5' },
        { id: 'gk_dogru', label: 'Genel Kültür Doğru', type: 'number', placeholder: '30' },
        { id: 'gk_yanlis', label: 'Genel Kültür Yanlış', type: 'number', placeholder: '10' },
    ];

    const calculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        const { level, gy_dogru, gy_yanlis, gk_dogru, gk_yanlis } = inputs;
        const levelKey = level as keyof typeof EKPSS_CONSTANTS;

        const gyNet = Number(gy_dogru) - (Number(gy_yanlis) / 4);
        const gkNet = Number(gk_dogru) - (Number(gk_yanlis) / 4);
        
        // Her test 60 sorudan oluşur
        if ( (Number(gy_dogru) + Number(gy_yanlis) > 60) || (Number(gk_dogru) + Number(gk_yanlis) > 60) ) {
            return { summary: { error: { label: 'Hata', value: 'Bir testteki doğru ve yanlış sayısı toplamı 60\'ı geçemez.' } } };
        }

        const constants = EKPSS_CONSTANTS[levelKey];
        if (!constants) return null; // Geçersiz seviye

        // Gerçek hesaplama standart sapma ve ortalamaya dayalıdır. Bu basitleştirilmiş bir modeldir.
        // Ham puanlar netlerin katsayılarla çarpılmasıyla bulunur.
        const gyPuan = gyNet * constants.GY_K;
        const gkPuan = gkNet * constants.GK_K;
        
        const ekpssPuani = constants.BASE + gyPuan + gkPuan;
        
        const puanTuru = levelKey === 'LISANS' ? 'P3' : (levelKey === 'ONLISANS' ? 'P2' : 'P1');

        const summary = {
            ekpssPuani: { label: `Tahmini EKPSS Puanınız (${puanTuru})`, value: formatNumber(ekpssPuani, 2), isHighlighted: true },
            gyNet: { label: 'Genel Yetenek Neti', value: formatNumber(gyNet, 2) },
            gkNet: { label: 'Genel Kültür Neti', value: formatNumber(gkNet, 2) },
        };
        
        return { summary };
    };

    return (
        <CalculatorUI
            title="EKPSS Puan Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Öğrenim düzeyinizi seçip testlerdeki doğru/yanlış sayılarınızı girin.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="Tahmini EKPSS Puan Sonucu"
        />
    );
};

export default EkpssClient; 