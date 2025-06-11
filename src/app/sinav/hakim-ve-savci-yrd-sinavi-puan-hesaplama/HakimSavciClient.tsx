'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

// Katsayılar ÖSYM kılavuzlarına göre tahminidir.
const SINAV_KATSAYILARI = {
    ADLI: { gy: 0.2, gk: 0.2, alan: 0.6, BASE: 30 },
    IDARI: { gy: 0.2, gk: 0.2, alan: 0.6, BASE: 30 },
    AVUKAT: { gy: 0.2, gk: 0.2, alan: 0.6, BASE: 30 },
};

const HakimSavciClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const inputFields: InputField[] = [
        { 
            id: 'examType', 
            label: 'Sınav Türü', 
            type: 'select',
            options: [
                { value: 'ADLI', label: 'Adli Yargı' },
                { value: 'IDARI', label: 'İdari Yargı' },
                { value: 'AVUKAT', label: 'Adli Yargı - Avukat' },
            ],
            defaultValue: 'ADLI'
        },
        { id: 'gy_dogru', label: 'GY Doğru (30 Soru)', type: 'number', placeholder: '20' },
        { id: 'gy_yanlis', label: 'GY Yanlış', type: 'number', placeholder: '5' },
        { id: 'gk_dogru', label: 'GK Doğru (35 Soru)', type: 'number', placeholder: '25' },
        { id: 'gk_yanlis', label: 'GK Yanlış', type: 'number', placeholder: '5' },
        { id: 'alan_dogru', label: 'Alan Bilgisi Doğru (35 Soru)', type: 'number', placeholder: '28' },
        { id: 'alan_yanlis', label: 'Alan Bilgisi Yanlış', type: 'number', placeholder: '4' },
    ];

    const calculate = async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        const { examType, gy_dogru, gy_yanlis, gk_dogru, gk_yanlis, alan_dogru, alan_yanlis } = inputs;
        const typeKey = examType as keyof typeof SINAV_KATSAYILARI;
        
        if (Number(gy_dogru) + Number(gy_yanlis) > 30 || Number(gk_dogru) + Number(gk_yanlis) > 35 || Number(alan_dogru) + Number(alan_yanlis) > 35) {
            return { summary: { error: { label: 'Hata', value: 'Soru sayılarını aştınız. (GY:30, GK:35, Alan:35)' } } };
        }

        const gyNet = Number(gy_dogru) - (Number(gy_yanlis) / 4);
        const gkNet = Number(gk_dogru) - (Number(gk_yanlis) / 4);
        const alanNet = Number(alan_dogru) - (Number(alan_yanlis) / 4);

        const constants = SINAV_KATSAYILARI[typeKey];
        if (!constants) return null;

        // Gerçek hesaplama standart sapma ve ortalamaya dayalıdır. Bu basitleştirilmiş bir modeldir.
        const puan = constants.BASE + (gyNet * constants.gy) + (gkNet * constants.gk) + (alanNet * constants.alan) * 2; // Alan bilgisi daha değerli

        const summary = {
            puan: { label: 'Tahmini Puanınız', value: formatNumber(puan, 2), isHighlighted: true },
            status: { label: 'Durum', value: puan >= 70 ? 'Başarılı (70 Puan Barajı Geçildi) ✅' : 'Başarısız (70 Puan Barajı Geçilemedi) ❌' },
            netler: { label: 'Netler (GY / GK / Alan)', value: `${formatNumber(gyNet)} / ${formatNumber(gkNet)} / ${formatNumber(alanNet)}`}
        };
        
        return { summary };
    };

    return (
        <CalculatorUI
            title="Hakim ve Savcı Yardımcılığı Sınavı Puan Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Sınav türünü seçip testlerdeki doğru/yanlış sayılarınızı girin.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="Tahmini Sınav Puan Sonucu"
        />
    );
};

export default HakimSavciClient; 