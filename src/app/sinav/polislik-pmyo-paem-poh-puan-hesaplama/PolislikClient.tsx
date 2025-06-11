'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

// Katsayılar yönetmeliklere göre belirlenmiştir (PMYO için 2022 Yönetmeliği baz alınmıştır)
const YERLESTIRME_KATSAYILARI = {
    PMYO: { kpss: 0.25, mulakat: 0.50, parkur: 0.25 },
    PAEM: { kpss: 0.25, mulakat: 0.50, parkur: 0.25 }, // PAEM için de benzer oranlar kullanılır
};

// PMYO Erkek Parkur Puanlama (saniye -> puan)
const PMYO_PARKUR_PUANLAMA_ERKEK: { [key: number]: number } = {
    40: 100, 41: 95, 42: 90, 43: 85, 44: 80, 45: 75, 46: 70, 47: 65, 48: 60,
};
// PMYO Kadın Parkur Puanlama
const PMYO_PARKUR_PUANLAMA_KADIN: { [key: number]: number } = {
    42: 100, 43: 95, 44: 90, 45: 85, 46: 80, 47: 75, 48: 70, 49: 65, 50: 60,
};

const PolislikClient = () => {
    const [sinavTuru, setSinavTuru] = useState('PMYO');

    const getParkurPuani = (saniye: number, cinsiyet: 'ERKEK' | 'KADIN'): number => {
        const puanlama = cinsiyet === 'ERKEK' ? PMYO_PARKUR_PUANLAMA_ERKEK : PMYO_PARKUR_PUANLAMA_KADIN;
        const enYakinSaniye = Object.keys(puanlama).map(Number).sort((a,b)=>a-b).find(s => saniye <= s) || 50;
        return puanlama[enYakinSaniye] || 0;
    }

    const calculate = async (inputs: { [key: string]: any }): Promise<CalculationResult | null> => {
        const { sinavTuru, kpssPuani, parkurSaniyesi, mulakatPuani, cinsiyet } = inputs;
        const typeKey = sinavTuru as keyof typeof YERLESTIRME_KATSAYILARI;
        
        const katsayilar = YERLESTIRME_KATSAYILARI[typeKey];
        if (!katsayilar) return null;

        const parkurPuani = getParkurPuani(Number(parkurSaniyesi), cinsiyet);
        
        const yerlestirmePuani = (Number(kpssPuani) * katsayilar.kpss) + (Number(mulakatPuani) * katsayilar.mulakat) + (parkurPuani * katsayilar.parkur);

        const kpssLabel = sinavTuru === 'PMYO' ? 'TYT' : 'KPSS P3';

        const summary: CalculationResult['summary'] = {
            yerlestirmePuani: { label: `${typeKey} Yerleştirme Puanı`, value: formatNumber(yerlestirmePuani, 3), isHighlighted: true },
            parkurPuani: { label: 'Fiziki Yeterlilik Puanı', value: formatNumber(parkurPuani) },
            kpssKatkisi: { label: `${kpssLabel} Katkısı (%${katsayilar.kpss*100})`, value: formatNumber(Number(kpssPuani) * katsayilar.kpss, 3) },
            mulakatKatkisi: { label: `Mülakat Katkısı (%${katsayilar.mulakat*100})`, value: formatNumber(Number(mulakatPuani) * katsayilar.mulakat, 3) },
        };
        
        return { summary };
    };
    
    const inputFields: InputField[] = [
        { 
            id: 'sinavTuru', label: 'Sınav Türü', type: 'select',
            options: [ { value: 'PMYO', label: 'PMYO (TYT ile)' }, { value: 'PAEM', label: 'PAEM (KPSS ile)' } ],
            defaultValue: 'PMYO'
        },
        { 
            id: 'kpssPuani', label: 'Giriş Sınavı Puanı (TYT/KPSS)', 
            type: 'number', placeholder: 'Puanınızı Girin'
        },
        { 
            id: 'cinsiyet', label: 'Cinsiyet', type: 'select',
            options: [ { value: 'ERKEK', label: 'Erkek' }, { value: 'KADIN', label: 'Kadın' } ],
            defaultValue: 'ERKEK'
        },
        { id: 'parkurSaniyesi', label: 'Fiziki Yeterlilik Parkur Süresi (Saniye)', type: 'number', placeholder: '44' },
        { id: 'mulakatPuani', label: 'Mülakat Puanı', type: 'number', placeholder: '85' },
    ];

    return (
        <CalculatorUI
            title="Polislik Puan Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Sınav türünü seçip ilgili puanlarınızı girerek yerleştirme puanınızı hesaplayın.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="Tahmini Polislik Sınav Sonucunuz"
        />
    );
};

export default PolislikClient; 