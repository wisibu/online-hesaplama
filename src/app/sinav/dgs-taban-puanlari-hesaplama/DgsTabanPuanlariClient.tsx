'use client';

import { useState, useMemo } from 'react';

export interface DgsProgram {
  id: number;
  uni: string;
  fakulte: string;
  bolum: string;
  puanTuru: 'SAY' | 'SÖZ' | 'EA';
  kontenjan: number | string;
  puan: number | string;
  siralama: number | string;
  sehir: string;
}

interface Props {
  programs: DgsProgram[];
}

const DgsTabanPuanlariClient = ({ programs }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [puanTuru, setPuanTuru] = useState('Tümü');
  const [sehir, setSehir] = useState('Tümü');
  
  const sehirler = useMemo(() => ['Tümü', ...Array.from(new Set(programs.map(p => p.sehir))).sort()], [programs]);

  const filteredPrograms = useMemo(() => {
    return programs
      .filter(p => puanTuru === 'Tümü' || p.puanTuru === puanTuru)
      .filter(p => sehir === 'Tümü' || p.sehir === sehir)
      .filter(p => 
        p.uni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.bolum.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [programs, searchTerm, puanTuru, sehir]);

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">DGS Taban Puanları ve Başarı Sıralamaları Arama</h2>
        
        {/* Filtreleme Alanları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input 
                type="text"
                placeholder="Üniversite veya bölüm adı ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
            <select value={puanTuru} onChange={e => setPuanTuru(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
                <option value="Tümü">Tüm Puan Türleri</option>
                <option value="SAY">Sayısal (SAY)</option>
                <option value="SÖZ">Sözel (SÖZ)</option>
                <option value="EA">Eşit Ağırlık (EA)</option>
            </select>
            <select value={sehir} onChange={e => setSehir(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow">
                {sehirler.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>

        {/* Sonuç Tablosu */}
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600 text-sm">Üniversite / Bölüm</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Puan Türü</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Kont.</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Taban Puan</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-600 text-sm">Başarı Sırası</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredPrograms.length > 0 ? filteredPrograms.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <p className="font-bold text-gray-800">{p.uni}</p>
                                <p className="text-sm text-gray-600">{p.bolum}</p>
                            </td>
                            <td className="text-center py-3 px-4 text-sm font-medium text-gray-700">{p.puanTuru}</td>
                            <td className="text-center py-3 px-4 text-sm text-gray-700">{p.kontenjan}</td>
                            <td className="text-center py-3 px-4 text-sm font-bold text-blue-600">{p.puan}</td>
                            <td className="text-center py-3 px-4 text-sm font-bold text-green-600">{p.siralama}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="text-center py-8 text-gray-500">
                                {programs.length === 0 ? "Taban puan verileri yükleniyor..." : "Arama kriterlerinize uygun sonuç bulunamadı."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default DgsTabanPuanlariClient; 