'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

// 2023 kılavuzuna dayalı tahmini katsayılar
const MSU_KATSAYILAR = {
    SAY: { tur: 3.3, mat: 3.3, fen: 3.4, sos: 0 },
    SOZ: { tur: 3.3, mat: 0, fen: 0, sos: 3.4 },
    EA:  { tur: 3.3, mat: 3.3, fen: 0, sos: 3.4 },
    GENEL: { tur: 2.5, mat: 2.5, fen: 2.5, sos: 2.5 }
};
const MSU_BASE_PUAN = 100;

const MsuClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const dersler = [
        { id: 'tur', label: 'Türkçe', max: 40 },
        { id: 'sos', label: 'Sosyal Bilimler', max: 20 },
        { id: 'mat', label: 'Temel Matematik', max: 40 },
        { id: 'fen', label: 'Fen Bilimleri', max: 20 },
    ];

    const inputFields: InputField[] = dersler.flatMap(ders => [
        { id: `${ders.id}_dogru`, label: `${ders.label} Doğru`, type: 'number' as const, placeholder: '0', belongsTo: ders.id },
        { id: `${ders.id}_yanlis`, label: `${ders.label} Yanlış`, type: 'number' as const, placeholder: '0', belongsTo: ders.id },
    ]);

    const calculate = async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        const nets: { [key: string]: number } = {};
        for (const ders of dersler) {
            const dogru = Number(inputs[`${ders.id}_dogru`]) || 0;
            const yanlis = Number(inputs[`${ders.id}_yanlis`]) || 0;
            if(dogru + yanlis > ders.max) {
                 return { summary: { error: { type: 'error', label: 'Hata', value: `${ders.label} dersindeki doğru ve yanlış toplamı ${ders.max} sayısını geçemez.` } } };
            }
            nets[ders.id] = dogru - (yanlis / 4);
        }
        
        const hamPuanlar = {
            SAY: MSU_BASE_PUAN + (nets.tur * MSU_KATSAYILAR.SAY.tur) + (nets.mat * MSU_KATSAYILAR.SAY.mat) + (nets.fen * MSU_KATSAYILAR.SAY.fen),
            SOZ: MSU_BASE_PUAN + (nets.tur * MSU_KATSAYILAR.SOZ.tur) + (nets.sos * MSU_KATSAYILAR.SOZ.sos),
            EA:  MSU_BASE_PUAN + (nets.tur * MSU_KATSAYILAR.EA.tur) + (nets.mat * MSU_KATSAYILAR.EA.mat) + (nets.sos * MSU_KATSAYILAR.EA.sos),
            GENEL: MSU_BASE_PUAN + (nets.tur * MSU_KATSAYILAR.GENEL.tur) + (nets.mat * MSU_KATSAYILAR.GENEL.mat) + (nets.fen * MSU_KATSAYILAR.GENEL.fen) + (nets.sos * MSU_KATSAYILAR.GENEL.sos)
        };
        
        const summary: CalculationResult['summary'] = {
            say: { type: 'result', label: 'MSÜ-SAYISAL Puanı', value: formatNumber(hamPuanlar.SAY), isHighlighted: true },
            soz: { type: 'result', label: 'MSÜ-SÖZEL Puanı', value: formatNumber(hamPuanlar.SOZ), isHighlighted: true },
            ea: { type: 'result', label: 'MSÜ-EŞİT AĞIRLIK Puanı', value: formatNumber(hamPuanlar.EA), isHighlighted: true },
            genel: { type: 'result', label: 'MSÜ-GENEL Puan', value: formatNumber(hamPuanlar.GENEL), isHighlighted: true },
        };

        return { summary };
    };
    
    return (
        <CalculatorUI
            title="MSÜ Puan Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Testlerdeki doğru/yanlış sayılarınızı girerek tahmini MSÜ puanlarınızı hesaplayın.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="Tahmini MSÜ Puanlarınız"
        />
    );
};

export default MsuClient; 