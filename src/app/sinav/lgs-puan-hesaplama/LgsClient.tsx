'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

const LGS_KATSAYILAR = {
    turkce: 4,
    mat: 4,
    fen: 4,
    inkilap: 1,
    din: 1,
    dil: 1
};

const LGS_MAX_PUAN = 500;
const LGS_MIN_PUAN = 100;
const LGS_MAX_HAM_PUAN = (20 * 4) + (20 * 4) + (20 * 4) + (10 * 1) + (10 * 1) + (10 * 1); // 270

const LgsClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const dersler = [
        { id: 'turkce', label: 'Türkçe', max: 20 },
        { id: 'mat', label: 'Matematik', max: 20 },
        { id: 'fen', label: 'Fen Bilimleri', max: 20 },
        { id: 'inkilap', label: 'T.C. İnkılap Tarihi', max: 10 },
        { id: 'din', label: 'Din Kültürü', max: 10 },
        { id: 'dil', label: 'Yabancı Dil', max: 10 },
    ];

    const inputFields: InputField[] = dersler.flatMap(ders => [
        { id: `${ders.id}_dogru`, label: `${ders.label} Doğru`, type: 'number' as const, placeholder: '0', belongsTo: ders.id },
        { id: `${ders.id}_yanlis`, label: `${ders.label} Yanlış`, type: 'number' as const, placeholder: '0', belongsTo: ders.id },
    ]);

    const calculate = async (inputs: { [key: string]: any }): Promise<CalculationResult | null> => {
        const nets: { [key: string]: number } = {};
        let totalHamPuan = 0;

        for (const ders of dersler) {
            const dogru = Number(inputs[`${ders.id}_dogru`]) || 0;
            const yanlis = Number(inputs[`${ders.id}_yanlis`]) || 0;
            if (dogru + yanlis > ders.max) {
                 return { summary: { error: { label: 'Hata', value: `${ders.label} dersindeki doğru ve yanlış toplamı ${ders.max} sayısını geçemez.` } } };
            }
            nets[ders.id] = dogru - (yanlis / 3);
        }
        
        Object.entries(nets).forEach(([key, netValue]) => {
            const katsayi = LGS_KATSAYILAR[key as keyof typeof LGS_KATSAYILAR];
            totalHamPuan += Math.max(0, netValue) * katsayi;
        });

        // Ham puanı 100-500 arasına ölçeklendiren basitleştirilmiş formül
        const lgsPuani = ((totalHamPuan / LGS_MAX_HAM_PUAN) * (LGS_MAX_PUAN - LGS_MIN_PUAN)) + LGS_MIN_PUAN;

        const summary = {
            lgsPuani: { label: 'Tahmini LGS Puanınız', value: formatNumber(lgsPuani, 3), isHighlighted: true },
            totalHamPuan: { label: 'Ağırlıklı Ham Puanınız', value: formatNumber(totalHamPuan, 2) },
            turkceNet: { label: 'Türkçe Net', value: formatNumber(nets.turkce, 2) },
            matNet: { label: 'Matematik Net', value: formatNumber(nets.mat, 2) },
            fenNet: { label: 'Fen Bilimleri Net', value: formatNumber(nets.fen, 2) },
        };
        
        return { summary };
    };
    
    return (
        <CalculatorUI
            title="LGS Puan Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    Sözel ve sayısal derslerdeki doğru/yanlış sayılarınızı girerek tahmini LGS puanınızı hesaplayın.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="Tahmini LGS Puan Sonucunuz"
        />
    );
};

export default LgsClient; 