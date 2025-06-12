'use client';

import { useState } from 'react';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

// 2023 YKS kılavuzuna dayalı tahmini katsayılar
const AYT_KATSAYILAR = {
    SAY: { mat: 3.00, fiz: 2.85, kim: 3.07, biy: 3.07, tyt: 1.32 },
    SOZ: { edb: 3.00, tar1: 2.80, cog1: 3.33, tar2: 2.91, cog2: 2.91, fel: 3.00, din: 3.33, tyt: 1.32 },
    EA:  { edb: 3.00, tar1: 2.80, cog1: 3.33, mat: 3.00, tyt: 1.32 },
    DIL: { dil: 3.30, tyt: 1.32 }
};
const TYT_BASE_PUAN = 100;
const AYT_BASE_PUAN = 100;

const AytClient = () => {
    const [result, setResult] = useState<CalculationResult | null>(null);

    const dersler = [
        { id: 'mat', label: 'Matematik', max: 40 },
        { id: 'fiz', label: 'Fizik', max: 14 },
        { id: 'kim', label: 'Kimya', max: 13 },
        { id: 'biy', label: 'Biyoloji', max: 13 },
        { id: 'edb', label: 'Türk Dili ve Edebiyatı', max: 24 },
        { id: 'tar1', label: 'Tarih-1', max: 10 },
        { id: 'cog1', label: 'Coğrafya-1', max: 6 },
        { id: 'tar2', label: 'Tarih-2', max: 11 },
        { id: 'cog2', label: 'Coğrafya-2', max: 11 },
        { id: 'fel', label: 'Felsefe Grubu', max: 12 },
        { id: 'din', label: 'Din Kültürü', max: 6 },
        { id: 'dil', label: 'Yabancı Dil (YDT)', max: 80 },
    ];

    const inputFields: InputField[] = [
        { id: 'tytPuan', label: 'TYT Puanınız', type: 'number', placeholder: '320' },
        { id: 'obp', label: 'Ortaöğretim Başarı Puanı (OBP)', type: 'number', placeholder: '85' },
        ...dersler.flatMap(ders => [
            { id: `${ders.id}_dogru`, label: `${ders.label} Doğru`, type: 'number' as const, placeholder: '0', belongsTo: ders.id },
            { id: `${ders.id}_yanlis`, label: `${ders.label} Yanlış`, type: 'number' as const, placeholder: '0', belongsTo: ders.id },
        ])
    ];

    const calculate = async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        const tytPuan = Number(inputs.tytPuan);
        const obp = Number(inputs.obp);
        
        if (isNaN(tytPuan) || isNaN(obp) || obp > 100 || obp < 50 || tytPuan < 100 ) return null;

        const nets: { [key: string]: number } = {};
        for (const ders of dersler) {
            const dogru = Number(inputs[`${ders.id}_dogru`]) || 0;
            const yanlis = Number(inputs[`${ders.id}_yanlis`]) || 0;
            if(dogru + yanlis > ders.max) {
                 return { summary: { error: { type: 'error', label: 'Hata', value: `${ders.label} dersindeki doğru ve yanlış toplamı ${ders.max} sayısını geçemez.` } } };
            }
            nets[ders.id] = dogru - (yanlis / 4);
        }
        
        const OBP_KATSAYI = 0.12;
        const obpKatki = obp * OBP_KATSAYI;

        const tytYerlestirme = (tytPuan - TYT_BASE_PUAN) * AYT_KATSAYILAR.SAY.tyt; // tyt katsayısı tüm puan türleri için aynı

        const hamPuanlar = {
            SAY: AYT_BASE_PUAN + (nets.mat * AYT_KATSAYILAR.SAY.mat) + (nets.fiz * AYT_KATSAYILAR.SAY.fiz) + (nets.kim * AYT_KATSAYILAR.SAY.kim) + (nets.biy * AYT_KATSAYILAR.SAY.biy),
            SOZ: AYT_BASE_PUAN + (nets.edb * AYT_KATSAYILAR.SOZ.edb) + (nets.tar1 * AYT_KATSAYILAR.SOZ.tar1) + (nets.cog1 * AYT_KATSAYILAR.SOZ.cog1) + (nets.tar2 * AYT_KATSAYILAR.SOZ.tar2) + (nets.cog2 * AYT_KATSAYILAR.SOZ.cog2) + (nets.fel * AYT_KATSAYILAR.SOZ.fel) + (nets.din * AYT_KATSAYILAR.SOZ.din),
            EA: AYT_BASE_PUAN + (nets.edb * AYT_KATSAYILAR.EA.edb) + (nets.tar1 * AYT_KATSAYILAR.EA.tar1) + (nets.cog1 * AYT_KATSAYILAR.EA.cog1) + (nets.mat * AYT_KATSAYILAR.EA.mat),
            DIL: AYT_BASE_PUAN + (nets.dil * AYT_KATSAYILAR.DIL.dil)
        };

        const yerlestirmePuanlari = {
            SAY: hamPuanlar.SAY > 0 ? hamPuanlar.SAY + tytYerlestirme + obpKatki : 0,
            SOZ: hamPuanlar.SOZ > 0 ? hamPuanlar.SOZ + tytYerlestirme + obpKatki : 0,
            EA: hamPuanlar.EA > 0 ? hamPuanlar.EA + tytYerlestirme + obpKatki : 0,
            DIL: hamPuanlar.DIL > 0 ? hamPuanlar.DIL + tytYerlestirme + obpKatki : 0,
        };
        
        const summary: CalculationResult['summary'] = {
            say: { type: 'result', label: 'SAY Yerleştirme Puanı', value: formatNumber(yerlestirmePuanlari.SAY), isHighlighted: true },
            soz: { type: 'result', label: 'SÖZ Yerleştirme Puanı', value: formatNumber(yerlestirmePuanlari.SOZ), isHighlighted: true },
            ea: { type: 'result', label: 'EA Yerleştirme Puanı', value: formatNumber(yerlestirmePuanlari.EA), isHighlighted: true },
            dil: { type: 'result', label: 'DİL Yerleştirme Puanı', value: formatNumber(yerlestirmePuanlari.DIL), isHighlighted: true },
            obpKatki: { type: 'info', label: 'OBP Katkısı (+)', value: formatNumber(obpKatki) },
        };

        return { summary };
    };
    
    return (
        <CalculatorUI
            title="AYT Puan Hesaplama"
            description={
                <p className="text-sm text-gray-600">
                    TYT ve OBP puanınız ile AYT derslerindeki doğru/yanlış sayılarınızı girerek yerleştirme puanınızı hesaplayın.
                </p>
            }
            inputFields={inputFields}
            calculate={calculate}
            resultTitle="Tahmini Yerleştirme Puanlarınız (2024)"
        />
    );
};

export default AytClient; 