'use client';

import { useState } from 'react';
import CalculatorUI, { CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';

interface Ders {
    id: string;
    kredi: number;
    not: number;
}

const harfNotuKatsayilari = [
    { text: 'AA', value: 4.00 }, { text: 'BA', value: 3.50 }, { text: 'BB', value: 3.00 },
    { text: 'CB', value: 2.50 }, { text: 'CC', value: 2.00 }, { text: 'DC', value: 1.50 },
    { text: 'DD', value: 1.00 }, { text: 'FD', value: 0.50 }, { text: 'FF', value: 0.00 },
];

// YÖK 4'lük Sistemden 100'lük Sisteme Dönüşüm Tablosu
const yuzlukKarsiliklari: { [key: string]: number } = {
    "4.00": 100.00, "3.99": 99.76, "3.98": 99.53, "3.97": 99.30, "3.96": 99.06, "3.95": 98.83, "3.94": 98.60,
    "3.93": 98.36, "3.92": 98.13, "3.91": 97.90, "3.90": 97.66, "3.89": 97.43, "3.88": 97.20, "3.87": 96.96,
    "3.86": 96.73, "3.85": 96.50, "3.84": 96.26, "3.83": 96.03, "3.82": 95.80, "3.81": 95.56, "3.80": 95.33,
    "3.50": 88.33, "3.00": 76.66, "2.50": 65.00, "2.00": 53.33, "1.50": 41.66, "1.00": 30.00
};

const generateUniqueId = () => `ders_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const UniversiteOrtalamaClient = () => {
    const [dersler, setDersler] = useState<Ders[]>([{ id: generateUniqueId(), kredi: 5, not: 4.0 }]);
    const [result, setResult] = useState<CalculationResult | null>(null);

    const addDers = () => {
        setDersler([...dersler, { id: generateUniqueId(), kredi: 3, not: 3.0 }]);
    };
    
    const removeDers = (id: string) => {
        setDersler(dersler.filter(d => d.id !== id));
    };

    const updateDers = (id: string, field: keyof Omit<Ders, 'id'>, value: number) => {
        setDersler(dersler.map(d => d.id === id ? { ...d, [field]: value } : d));
    };
    
    const calculate = () => {
        const toplamKredi = dersler.reduce((acc, d) => acc + d.kredi, 0);
        if (toplamKredi === 0) {
            setResult(null);
            return;
        }

        const toplamAgirlikliPuan = dersler.reduce((acc, d) => acc + (d.kredi * d.not), 0);
        const gano4luk = toplamAgirlikliPuan / toplamKredi;
        
        const gano4lukStr = gano4luk.toFixed(2);
        const gano100luk = yuzlukKarsiliklari[gano4lukStr] || (gano4luk * 25);

        const summary: CalculationResult['summary'] = {
            gano4: { type: 'result', label: "Ortalama (4'lük Sistem)", value: formatNumber(gano4luk, 2), isHighlighted: true },
            gano100: { type: 'result', label: "Ortalama (100'lük Sistem)", value: formatNumber(gano100luk, 2) },
            toplamKredi: { type: 'result', label: "Toplam Kredi (AKTS)", value: formatNumber(toplamKredi) },
        };
        
        setResult({ summary });
    };

    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dönem / GANO Hesaplama</h2>
            
            <div className="space-y-3 mb-4">
                {dersler.map((ders, index) => (
                    <div key={ders.id} className="grid grid-cols-12 gap-2 items-center">
                        <span className="col-span-1 text-sm font-medium text-gray-500">{index + 1}.</span>
                        <div className="col-span-5">
                             <label className="text-xs text-gray-500">Kredi (AKTS)</label>
                             <input type="number" value={ders.kredi} onChange={e => updateDers(ders.id, 'kredi', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div className="col-span-5">
                             <label className="text-xs text-gray-500">Harf Notu</label>
                             <select value={ders.not} onChange={e => updateDers(ders.id, 'not', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                {harfNotuKatsayilari.map(n => <option key={n.value} value={n.value}>{n.text} ({n.value.toFixed(2)})</option>)}
                             </select>
                        </div>
                        <div className="col-span-1">
                             <button onClick={() => removeDers(ders.id)} className="text-red-500 hover:text-red-700 mt-5 p-2 rounded-full hover:bg-red-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                             </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={addDers} className="w-full sm:w-auto flex-grow px-5 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                    + Yeni Ders Ekle
                </button>
                <button onClick={calculate} className="w-full sm:w-auto flex-grow px-5 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                    Ortalamayı Hesapla
                </button>
            </div>
            
            {result && (
                 <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Hesaplama Sonucu</h3>
                    <div className="space-y-2">
                        {Object.values(result.summary).map((item, i) => (
                           <div key={i} className={`flex justify-between items-center p-2 rounded-md ${!!item.isHighlighted ? 'bg-blue-100' : ''}`}>
                                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                                <span className={`font-bold text-lg ${!!item.isHighlighted ? 'text-blue-700' : 'text-gray-800'}`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversiteOrtalamaClient; 