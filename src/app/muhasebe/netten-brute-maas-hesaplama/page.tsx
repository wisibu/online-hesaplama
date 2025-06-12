import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı Parametreleri
const SGK_TABAN = 20002.50;
const SGK_TAVAN = 150018.90;
const SGK_PRIM_ORANI_ISCI = 0.14;
const ISSIZLIK_PRIM_ORANI_ISCI = 0.01;
const DAMGA_VERGISI_ORANI = 0.00759;

const GELIR_VERGISI_DILIMLERI = [
    { limit: 110000, rate: 0.15, previousLimit: 0 },
    { limit: 230000, rate: 0.20, previousLimit: 110000 },
    { limit: 870000, rate: 0.27, previousLimit: 230000 },
    { limit: 3000000, rate: 0.35, previousLimit: 870000 },
    { limit: Infinity, rate: 0.40, previousLimit: 3000000 },
];

const ASGARI_UCRET_GELIR_VERGISI_ISTISNASI = 2550.32;
const ASGARI_UCRET_DAMGA_VERGISI_ISTISNASI = 151.82;

// Brütten net hesaplayan yardımcı fonksiyon
const calculateNetFromBrut = (brut: number, kümülatifVergiMatrahi: number, engellilikOrani: number) => {
    const sgkMatrah = Math.max(SGK_TABAN, Math.min(brut, SGK_TAVAN));
    const sgkPrimi = sgkMatrah * SGK_PRIM_ORANI_ISCI;
    const issizlikPrimi = sgkMatrah * ISSIZLIK_PRIM_ORANI_ISCI;
    const sgkToplamIsciKesintisi = sgkPrimi + issizlikPrimi;
    
    const gelirVergisiMatrahi = brut - sgkToplamIsciKesintisi;

    let engellilikIndirimi = 0;
    if (engellilikOrani === 1) engellilikIndirimi = 6900;
    if (engellilikOrani === 2) engellilikIndirimi = 4000;
    if (engellilikOrani === 3) engellilikIndirimi = 1700;
    
    const vergiMatrahiIndirimli = Math.max(0, gelirVergisiMatrahi - engellilikIndirimi);
    
    let vergi = 0;
    let oncekiDilimMatrahi = 0;
    let toplamMatrah = kümülatifVergiMatrahi;

    for (const dilim of GELIR_VERGISI_DILIMLERI) {
        if(toplamMatrah >= dilim.limit) {
            oncekiDilimMatrahi = dilim.limit;
            continue;
        }

        const dilimdeHesaplanacakMatrah = Math.min(vergiMatrahiIndirimli, dilim.limit - toplamMatrah);
        vergi += dilimdeHesaplanacakMatrah * dilim.rate;
        toplamMatrah += dilimdeHesaplanacakMatrah;
        if(toplamMatrah >= kümülatifVergiMatrahi + vergiMatrahiIndirimli) break;
    }

    const odenecekGelirVergisi = Math.max(0, vergi - ASGARI_UCRET_GELIR_VERGISI_ISTISNASI);
    const damgaVergisi = Math.max(0, (brut * DAMGA_VERGISI_ORANI) - ASGARI_UCRET_DAMGA_VERGISI_ISTISNASI);
    
    const netMaas = brut - sgkToplamIsciKesintisi - odenecekGelirVergisi - damgaVergisi;

    return { netMaas, sgkToplamIsciKesintisi, odenecekGelirVergisi, damgaVergisi };
};

// Netten brüt bulan ana fonksiyon (iterasyon ile)
const findBrutFromNet = (targetNet: number, kümülatifVergiMatrahi: number, engellilikOrani: number) => {
    let brutGuess = targetNet;
    let calculatedNet = 0;
    let iterations = 0;

    while (iterations < 100) { // Sonsuz döngüden kaçınmak için
        calculatedNet = calculateNetFromBrut(brutGuess, kümülatifVergiMatrahi, engellilikOrani).netMaas;
        if (Math.abs(calculatedNet - targetNet) < 0.01) {
            break;
        }
        brutGuess += (targetNet - calculatedNet);
        iterations++;
    }
    return brutGuess;
};

const pageConfig = {
  title: "Netten Brüte Maaş Hesaplama (2024) | OnlineHesaplama",
  description: "Elinize geçecek net maaş tutarını girerek, bu maaş için gereken brüt maaşı ve tüm yasal kesintileri (SGK, vergi) 2024 yılına göre anında öğrenin.",
  keywords: ["netten brüte maaş hesaplama", "brüt maaş bulma", "maaş hesaplama 2024", "net maaş", "brüt maaş"],
  calculator: {
    title: "Netten Brüte Maaş Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hedeflediğiniz net maaşı ve diğer bilgileri girerek brüt maaşı ve kesintileri öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'netMaas', label: 'Ele Geçecek Net Maaş (TL)', type: 'number', placeholder: '30000' },
      { id: 'kumulatifMatrah', label: 'Önceki Aylardan Gelen Kümülatif Vergi Matrahı (TL)', type: 'number', placeholder: '0' },
      { id: 'engellilik', label: 'Engellilik İndirimi', type: 'select', options: [
        { value: 0, label: 'Yok' },
        { value: 1, label: '1. Derece' },
        { value: 2, label: '2. Derece' },
        { value: 3, label: '3. Derece' },
      ], defaultValue: '0' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const netMaas = Number(inputs.netMaas);
        const kumulatif = Number(inputs.kumulatifMatrah) || 0;
        const engellilik = Number(inputs.engellilik);

        if (isNaN(netMaas) || netMaas <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir net maaş girin.' } } };
        }

        const brutMaas = findBrutFromNet(netMaas, kumulatif, engellilik);
        const kesintiler = calculateNetFromBrut(brutMaas, kumulatif, engellilik);

        const summary: CalculationResult['summary'] = {
            brutMaas: { type: 'result', label: 'Gerekli Brüt Maaş', value: formatCurrency(brutMaas), isHighlighted: true },
            netMaas: { type: 'info', label: 'Ele Geçecek Net Maaş', value: formatCurrency(kesintiler.netMaas) },
            sgkKesintisi: { type: 'info', label: 'SGK ve İşsizlik Primi (İşçi)', value: formatCurrency(kesintiler.sgkToplamIsciKesintisi) },
            gelirVergisi: { type: 'info', label: 'Gelir Vergisi', value: formatCurrency(kesintiler.odenecekGelirVergisi) },
            damgaVergisi: { type: 'info', label: 'Damga Vergisi', value: formatCurrency(kesintiler.damgaVergisi) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Netten Brüte Maaş Nasıl Hesaplanır?",
        content: (
          <p>
            Netten brüte maaş hesaplaması, brütten nete hesaplamanın aksine doğrudan bir formülle yapılamaz. Çünkü vergi ve SGK kesintileri brüt maaş üzerinden hesaplanır. Bu hesaplayıcı, hedeflediğiniz net maaşa ulaşmak için gereken brüt maaşı bulana kadar bir dizi deneme-yanılma (iterasyon) işlemi yapar. Bir brüt maaş tahminiyle başlar, kesintileri hesaplar, net maaşı bulur ve bu net maaş sizin hedefinizle eşleşene kadar brüt maaş tahminini akıllıca ayarlar. Bu, karmaşık vergi dilimleri ve SGK tavanı gibi değişkenler nedeniyle en doğru sonucu veren yöntemdir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "İşveren maliyeti bu hesaba dahil mi?",
        answer: "Hayır. Bu hesaplayıcı, sadece çalışanın brüt maaşından yapılan kesintileri ve ele geçen net tutarı gösterir. İşverenin ayrıca ödemesi gereken SGK İşveren Primi ve İşsizlik Sigortası İşveren Primi gibi ek maliyetler bu hesaplamaya dahil değildir."
      },
      {
        question: "Neden hesaplanan net maaş, girdiğim net maaştan kuruş farklı olabilir?",
        answer: "Hesaplama, çok küçük bir hata payı (genellikle 1 kuruştan az) ile hedeflediğiniz net maaşa en yakın brüt maaşı bulana kadar devam eden bir döngü kullanır. Bu nedenle, yuvarlama farklarından kaynaklanan çok küçük kuruş farklılıkları görülebilir. Bu, yöntemin doğası gereğidir ve sonucu etkilemez."
      }
    ]
  }
};

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
  openGraph: {
    title: pageConfig.title,
    description: pageConfig.description,
  },
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Maaş Bordrosu Özeti"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}