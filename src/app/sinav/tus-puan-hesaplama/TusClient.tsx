'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

// Katsayılar ÖSYM kılavuzlarına göre tahminidir ve her sınavda değişebilir.
const TUS_KATSAYILARI = {
    TEMEL: { temel: 0.7, klinik: 0.3, base: 25 },
    KLINIK: { temel: 0.3, klinik: 0.7, base: 25 },
    AGIRLIKLI: { temel: 0.5, klinik: 0.5, base: 25 },
};
const PASSING_SCORE = 45;

const TusClient = () => {
    const inputFields: InputField[] = [
        { id: 'temel_dogru', label: 'Temel Bilimler Doğru', type: 'number', placeholder: '80' },
        { id: 'temel_yanlis', label: 'Temel Bilimler Yanlış', type: 'number', placeholder: '20' },
        { id: 'klinik_dogru', label: 'Klinik Bilimler Doğru', type: 'number', placeholder: '85' },
        { id: 'klinik_yanlis', label: 'Klinik Bilimler Yanlış', type: 'number', placeholder: '15' },
    ];

    const calculate = async (inputs: { [key: string]: any }): Promise<CalculationResult | null> => {
        const { temel_dogru, temel_yanlis, klinik_dogru, klinik_yanlis } = inputs;
        
        // Her test 120 sorudan oluşur
        if ( (Number(temel_dogru) + Number(temel_yanlis) > 120) || (Number(klinik_dogru) + Number(klinik_yanlis) > 120) ) {
            return { summary: { error: { label: 'Hata', value: 'Bir testteki doğru ve yanlış sayısı toplamı 120\'yi geçemez.' } } };
        }

        const temelNet = Number(temel_dogru) - (Number(temel_yanlis) / 4);
        const klinikNet = Number(klinik_dogru) - (Number(klinik_yanlis) / 4);

        const puanlar = {
            temelPuan: (temelNet * TUS_KATSAYILARI.TEMEL.temel) + (klinikNet * TUS_KATSAYILARI.TEMEL.klinik) + TUS_KATSAYILARI.TEMEL.base,
            klinikPuan: (temelNet * TUS_KATSAYILARI.KLINIK.temel) + (klinikNet * TUS_KATSAYILARI.KLINIK.klinik) + TUS_KATSAYILARI.KLINIK.base,
            agirlikliPuan: (temelNet * TUS_KATSAYILARI.AGIRLIKLI.temel) + (klinikNet * TUS_KATSAYILARI.AGIRLIKLI.klinik) + TUS_KATSAYILARI.AGIRLIKLI.base,
        };
        
        const summary: CalculationResult['summary'] = {
            klinikPuan: { label: 'Klinik Tıp Puanı', value: formatNumber(puanlar.klinikPuan, 2), isHighlighted: true },
            temelPuan: { label: 'Temel Tıp Puanı', value: formatNumber(puanlar.temelPuan, 2), isHighlighted: true },
            agirlikliPuan: { label: 'Ağırlıklı Klinik Puan', value: formatNumber(puanlar.agirlikliPuan, 2) },
            status: { label: 'Durum (45 Puan Barajı)', value: puanlar.klinikPuan >= PASSING_SCORE && puanlar.temelPuan >= PASSING_SCORE ? 'Başarılı ✅' : 'Başarısız ❌' },
            nets: { label: 'Netler (Temel / Klinik)', value: `${formatNumber(temelNet, 2)} / ${formatNumber(klinikNet, 2)}` },
        };
        
        return { summary };
    };
    
    return (
        <CalculatorUI
            title="TUS Puan Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Temel ve Klinik bilimler testlerindeki doğru/yanlış sayılarınızı girin.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="Tahmini TUS Puan Sonuçları"
        />
    );
};

export default TusClient; 