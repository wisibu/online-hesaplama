'use client';

import { useState, useMemo } from 'react';

export interface Lise {
  id: number;
  il: string;
  ilce: string;
  adi: string;
  turu: string;
  yuzdelik: number;
  puan: number;
}

interface Props {
  liseler: Lise[];
}

const LiseTabanPuanlariClient = ({ liseler }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [il, setIl] = useState('Tümü');
  
  const iller = useMemo(() => ['Tümü', ...Array.from(new Set(liseler.map(l => l.il))).sort()], [liseler]);

  const filteredLiseler = useMemo(() => {
    return liseler
      .filter(l => il === 'Tümü' || l.il === il)
      .filter(l => 
        l.adi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.ilce.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [liseler, searchTerm, il]);

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Lise Taban Puanları ve Yüzdelik Dilimleri Arama</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input 
                type="text"
                placeholder="Lise adı veya ilçe ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
            <select value={il} onChange={e => setIl(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
                {iller.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Lise Adı / İlçe</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm hidden sm:table-cell">Türü</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Taban Puan (2023)</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Yüzdelik Dilim (2023)</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLiseler.length > 0 ? filteredLiseler.map(l => (
                        <tr key={l.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <p className="font-bold text-gray-800">{l.adi}</p>
                                <p className="text-sm text-gray-600">{l.il} / {l.ilce}</p>
                            </td>
                            <td className="text-left py-3 px-4 text-sm text-gray-700 hidden sm:table-cell">{l.turu}</td>
                            <td className="text-center py-3 px-4 text-sm font-bold text-blue-600">{l.puan}</td>
                            <td className="text-center py-3 px-4 text-sm font-bold text-green-600">%{l.yuzdelik}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                {liseler.length === 0 ? "Taban puan verileri yükleniyor..." : "Arama kriterlerinize uygun lise bulunamadı."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default LiseTabanPuanlariClient; 