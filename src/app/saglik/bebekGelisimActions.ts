'use server';

import { boyPercentilesErkek, boyPercentilesKiz, kiloPercentilesErkek, kiloPercentilesKiz, PercentileData } from './dso-data';
import { CalculationResult } from '@/components/CalculatorUI';

type GelisimType = 'boy' | 'kilo';

const pageDetails = {
    boy: {
        unit: "cm",
        data: {
            erkek: boyPercentilesErkek,
            kiz: boyPercentilesKiz
        }
    },
    kilo: {
        unit: "kg",
        data: {
            erkek: kiloPercentilesErkek,
            kiz: kiloPercentilesKiz
        }
    }
}

const findPercentile = (ay: number, cinsiyet: 'erkek' | 'kiz', olcum: number, type: GelisimType) => {
    const data = pageDetails[type].data[cinsiyet].find((d: PercentileData) => d.ay === ay);
    if (!data) return "Veri bulunamadı";

    if (olcum < data.p3) return "3. Persentilin Altında";
    if (olcum >= data.p3 && olcum < data.p15) return "3-15. Persentil Arası";
    if (olcum >= data.p15 && olcum < data.p50) return "15-50. Persentil Arası";
    if (olcum >= data.p50 && olcum < data.p85) return "50-85. Persentil Arası";
    if (olcum >= data.p85 && olcum < data.p97) return "85-97. Persentil Arası";
    if (olcum >= data.p97) return "97. Persentilin Üstünde";
    return "Normal aralıkta";
};

export const calculateBebekGelisim = async (type: GelisimType, inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
    const { birthDate, cinsiyet, olcum } = inputs as { birthDate: string, cinsiyet: 'kiz' | 'erkek', olcum: number };
    if (!birthDate || !cinsiyet || !olcum || olcum <= 0) {
        return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
    }

    const dogum = new Date(birthDate);
    const bugun = new Date();
    // Ay farkını daha hassas hesapla
    let ay = (bugun.getFullYear() - dogum.getFullYear()) * 12;
    ay -= dogum.getMonth();
    ay += bugun.getMonth();
    ay = ay <= 0 ? 0 : ay;
    
    if (dogum > bugun) {
      return { summary: { error: { label: 'Hata', value: 'Doğum tarihi bugünden ileri bir tarih olamaz.' } } };
    }

    if(ay > 36) {
         return { summary: { error: { label: 'Hata', value: 'Hesaplama 0-36 ay arası bebekler için yapılmaktadır.' } } };
    }

    const percentileResult = findPercentile(ay, cinsiyet, olcum, type);
    const details = pageDetails[type];
    const data = details.data[cinsiyet].find((d: PercentileData) => d.ay === ay);

    const summary: CalculationResult['summary'] = {
        yas: { label: "Bebeğin Yaşı", value: `${ay} aylık` },
        percentile: { label: "Persentil Durumu", value: percentileResult, isHighlighted: true },
    };
    
    const table = data ? {
        title: `${ay} Aylık ${cinsiyet === 'kiz' ? 'Kız' : 'Erkek'} Bebek İçin ${type === 'boy' ? 'Boy' : 'Kilo'} Persentil Değerleri`,
        headers: ["Persentil", `Değer (${details.unit})`],
        rows: [
            ['3. Persentil', data.p3],
            ['15. Persentil', data.p15],
            ['50. Persentil (Ortanca)', data.p50],
            ['85. Persentil', data.p85],
            ['97. Persentil', data.p97],
        ]
    } : undefined;

    return { summary, table, disclaimer: "Bu araç tıbbi tavsiye yerine geçmez. Bebeğinizin gelişimiyle ilgili endişeleriniz için mutlaka bir çocuk doktoruna danışın." };
}; 