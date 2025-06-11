'use client';

import { useState, useMemo } from 'react';
import { formatDate } from '@/utils/formatting';

const asiTakvimi = [
    { ay: 0, adi: 'Hepatit B', doz: 1, aciklama: 'Doğar doğmaz, ilk 72 saat içinde' },
    { ay: 1, adi: 'Hepatit B', doz: 2, aciklama: '1. ayın sonunda' },
    { ay: 2, adi: 'DaBT-İPA-Hib (5\'li Karma)', doz: 1, aciklama: '2. ayın sonunda' },
    { ay: 2, adi: 'KPA (Konjuge Pnömokok Aşısı)', doz: 1, aciklama: '2. ayın sonunda' },
    { ay: 2, adi: 'Rotavirüs', doz: 1, aciklama: 'İsteğe bağlı, 2. ayda' },
    { ay: 4, adi: 'DaBT-İPA-Hib (5\'li Karma)', doz: 2, aciklama: '4. ayın sonunda' },
    { ay: 4, adi: 'KPA', doz: 2, aciklama: '4. ayın sonunda' },
    { ay: 4, adi: 'Rotavirüs', doz: 2, aciklama: 'İsteğe bağlı, 4. ayda' },
    { ay: 6, adi: 'DaBT-İPA-Hib (5\'li Karma)', doz: 3, aciklama: '6. ayın sonunda' },
    { ay: 6, adi: 'KPA', doz: 3, aciklama: '6. ayın sonunda' },
    { ay: 6, adi: 'OPA (Oral Polio Aşısı)', doz: 1, aciklama: '6. ayın sonunda' },
    { ay: 6, adi: 'Hepatit B', doz: 3, aciklama: '6. ayın sonunda' },
    { ay: 12, adi: 'KKK (Kızamık-Kızamıkçık-Kabakulak)', doz: 1, aciklama: '12. ayın sonunda' },
    { ay: 12, adi: 'Suçiçeği', doz: 1, aciklama: '12. ayın sonunda' },
    { ay: 12, adi: 'KPA', doz: 'Rapel', aciklama: '12. ayın sonunda (Pekiştirme dozu)' },
    { ay: 18, adi: 'DaBT-İPA-Hib (5\'li Karma)', doz: 'Rapel', aciklama: '18. ayın sonunda (Pekiştirme dozu)' },
    { ay: 18, adi: 'OPA', doz: 2, aciklama: '18. ayın sonunda' },
    { ay: 24, adi: 'Hepatit A', doz: 1, aciklama: '24. ayın sonunda' },
    { ay: 30, adi: 'Hepatit A', doz: 2, aciklama: '30. ayın sonunda (İlk dozdan 6 ay sonra)' },
    { ay: 48, adi: 'KKK', doz: 'Rapel', aciklama: '48. ayın sonunda (Pekiştirme dozu)' },
    { ay: 48, adi: 'DaBT-İPA (4\'lü Karma)', doz: 'Rapel', aciklama: '48. ayın sonunda (Pekiştirme dozu)' },
];

const AsiTakvimiClient = () => {
    const [birthDate, setBirthDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const aşılar = useMemo(() => {
        if (!birthDate) return [];
        const dogumTarihi = new Date(birthDate);
        return asiTakvimi.map(asi => {
            const asiTarihi = new Date(dogumTarihi);
            asiTarihi.setMonth(asiTarihi.getMonth() + asi.ay);
            return {
                ...asi,
                tarih: asiTarihi,
                durum: asiTarihi < new Date() ? 'Geçmiş' : 'Gelecek'
            };
        });
    }, [birthDate]);

    return (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Aşı Takvimi Hesaplayıcı</h2>
            <p className="text-sm text-gray-600 mb-6">Çocuğunuzun doğum tarihini seçerek kişisel aşı takvimini oluşturun.</p>
            
            <div className="mb-6">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Doğum Tarihi:</label>
                <input
                    type="date"
                    id="birthDate"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Planlanan Tarih</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aşı Adı</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doz</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Açıklama</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {aşılar.map((asi, index) => (
                            <tr key={index} className={asi.durum === 'Geçmiş' ? 'bg-green-50' : ''}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{formatDate(asi.tarih)}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{asi.adi}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{asi.doz}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{asi.aciklama}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${asi.durum === 'Geçmiş' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {asi.durum}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <p className="text-xs text-gray-500 mt-4">
                * Bu takvim, T.C. Sağlık Bakanlığı'nın standart çocukluk dönemi aşı takvimine göre oluşturulmuştur. Özel durumlar veya risk grupları için doktorunuza danışınız. İsteğe bağlı aşılar (Rotavirüs vb.) hakkında bilgi almak için sağlık kuruluşunuzla görüşün.
            </p>
        </div>
    );
};

export default AsiTakvimiClient; 