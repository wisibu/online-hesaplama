import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı Parametreleri (1 Ocak - 30 Haziran 2024 arası)
const KIDEM_TAVANI = 35058.58; 
const DAMGA_VERGISI_ORANI = 0.00759;

// Gelir vergisi dilimleri ihbar tazminatı için gereklidir.
const GELIR_VERGISI_DILIMLERI = [
    { limit: 110000, rate: 0.15, previousLimit: 0 },
    { limit: 230000, rate: 0.20, previousLimit: 110000 },
    { limit: 870000, rate: 0.27, previousLimit: 230000 },
    { limit: 3000000, rate: 0.35, previousLimit: 870000 },
    { limit: Infinity, rate: 0.40, previousLimit: 3000000 },
];

const calculateIncomeTax = (matrah: number) => {
    let toplamVergi = 0;
    let kalanMatrah = matrah;
    for (const dilim of GELIR_VERGISI_DILIMLERI) {
        if (kalanMatrah <= 0) break;
        const dilimeGirenTutar = Math.min(kalanMatrah, dilim.limit - dilim.previousLimit);
        toplamVergi += dilimeGirenTutar * dilim.rate;
        kalanMatrah -= dilimeGirenTutar;
    }
    return toplamVergi;
};

const pageConfig = {
  title: "Kıdem ve İhbar Tazminatı Hesaplama (2024) | OnlineHesaplama",
  description: "Hizmet sürenize, brüt ücretinize ve işten ayrılma şeklinize göre hak ettiğiniz brüt ve net kıdem ve ihbar tazminatı tutarlarını 2024 yılı güncel tavan ve vergi oranlarıyla hesaplayın.",
  keywords: ["kıdem tazminatı hesaplama", "ihbar tazminatı hesaplama", "tazminat hesaplama 2024", "kıdem tavanı", "net tazminat"],
  calculator: {
    title: "Kıdem ve İhbar Tazminatı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        İşe başlangıç/bitiş tarihlerinizi ve son giydirilmiş brüt ücretinizi girerek haklarınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'startDate', label: 'İşe Giriş Tarihi', type: 'date', defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0] },
      { id: 'endDate', label: 'İşten Çıkış Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { id: 'brutUcret', label: 'Son Giydirilmiş Brüt Ücret (TL)', type: 'number', placeholder: '40000' },
      { id: 'istenAyrilis', label: 'İşten Ayrılış Şekli', type: 'select', options: [
            { value: 'istenCikarildi', label: 'İşveren Tarafından Çıkarıldım (Kod 22 hariç)' },
            { value: 'hakliFesih', label: 'Haklı Nedenle Feshettim (Askerlik, Emeklilik, Sağlık vb.)' },
            { value: 'istifa', label: 'İstifa Ettim (Haklı Neden Olmadan)' },
            { value: 'anlasma', label: 'Anlaşarak Ayrıldım (İkale)' },
      ], defaultValue: 'istenCikarildi' }
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const startStr = inputs.startDate as string;
        const endStr = inputs.endDate as string;
        const brutUcret = Number(inputs.brutUcret);
        const istenAyrilis = inputs.istenAyrilis as string;

        if (!startStr || !endStr || !brutUcret || brutUcret <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
        }

        const startDate = new Date(startStr);
        const endDate = new Date(endStr);
        const hizmetSuresiMs = endDate.getTime() - startDate.getTime();
        const hizmetSuresiGun = Math.floor(hizmetSuresiMs / (1000 * 60 * 60 * 24));
        const hizmetSuresiYil = hizmetSuresiGun / 365.25;

        const summary: CalculationResult['summary'] = {};
        
        // Kıdem Tazminatı Hesaplama
        if (hizmetSuresiYil >= 1 && (istenAyrilis === 'istenCikarildi' || istenAyrilis === 'hakliFesih' || istenAyrilis === 'anlasma')) {
            const kidemEsasUcret = Math.min(brutUcret, KIDEM_TAVANI);
            const brutKidemTazminati = kidemEsasUcret * hizmetSuresiYil;
            const damgaVergisiKidem = brutKidemTazminati * DAMGA_VERGISI_ORANI;
            const netKidemTazminati = brutKidemTazminati - damgaVergisiKidem;

            summary.brutKidem = { type: 'info', label: 'Brüt Kıdem Tazminatı', value: formatCurrency(brutKidemTazminati) };
            summary.netKidem = { type: 'result', label: 'Net Kıdem Tazminatı', value: formatCurrency(netKidemTazminati), isHighlighted: true };
        } else {
             summary.kidemDurum = { type: 'info', label: 'Kıdem Tazminatı', value: "Hesaplama koşulları (en az 1 yıl çalışma ve geçerli fesih nedeni) sağlanmıyor." };
        }

        // İhbar Tazminatı Hesaplama
        if(istenAyrilis === 'istenCikarildi' || istenAyrilis === 'istifa') {
            const hizmetSuresiAy = hizmetSuresiGun / 30.44;
            let ihbarSuresiHafta = 0;
            if (hizmetSuresiAy < 6) ihbarSuresiHafta = 2;
            else if (hizmetSuresiAy < 18) ihbarSuresiHafta = 4;
            else if (hizmetSuresiAy < 36) ihbarSuresiHafta = 6;
            else ihbarSuresiHafta = 8;
            
            const brutIhbarTazminati = (brutUcret / 30) * (ihbarSuresiHafta * 7);
            const gelirVergisi = calculateIncomeTax(brutIhbarTazminati);
            const damgaVergisiIhbar = brutIhbarTazminati * DAMGA_VERGISI_ORANI;
            const netIhbarTazminati = brutIhbarTazminati - gelirVergisi - damgaVergisiIhbar;
            
            const odenecekTaraf = istenAyrilis === 'istenCikarildi' ? 'İşveren Tarafından Ödenir' : 'İşçi Tarafından Ödenir';

            summary.ihbarSuresi = { type: 'info', label: 'Yasal İhbar Süresi', value: `${ihbarSuresiHafta} Hafta`};
            summary.brutIhbar = { type: 'info', label: `Brüt İhbar Tazminatı (${odenecekTaraf})`, value: formatCurrency(brutIhbarTazminati) };
            summary.netIhbar = { type: 'result', label: `Net İhbar Tazminatı (${odenecekTaraf})`, value: formatCurrency(netIhbarTazminati), isHighlighted: true };
        } else {
            summary.ihbarDurum = { type: 'info', label: 'İhbar Tazminatı', value: "İhbar tazminatı doğmadı (haklı fesih/anlaşma)." };
        }
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Kıdem ve İhbar Tazminatı Nedir?",
        content: (
          <p>
            İş sözleşmesinin sona ermesi durumunda işçinin veya işverenin belirli yasal hakları doğar. <strong>Kıdem Tazminatı</strong>, en az bir yıl çalışmış bir işçinin, kanunda belirtilen haklı nedenlerle işten ayrılması veya işveren tarafından işten çıkarılması durumunda, çalıştığı her yıl için 30 günlük giydirilmiş brüt ücreti tutarında aldığı bir tazminattır. <strong>İhbar Tazminatı</strong> ise, iş sözleşmesini bildirim sürelerine uymadan fesheden tarafın karşı tarafa ödemesi gereken bedeldir.
          </p>
        )
      }
    ],
    faqs: [
       {
        question: "Kıdem tazminatı tavanı nedir?",
        answer: "Devlet tarafından her 6 ayda bir belirlenen bir üst sınırdır. İşçinin giydirilmiş brüt ücreti ne kadar yüksek olursa olsun, kıdem tazminatı hesaplamasında bu tavan tutarından fazlası dikkate alınamaz. 2024 yılının ilk yarısı için bu tavan 35.058,58 TL'dir."
      },
      {
        question: "Hangi durumlarda hem kıdem hem ihbar tazminatı alınır?",
        answer: "İşçinin, haklı bir nedeni olmaksızın işveren tarafından işten çıkarılması durumunda, hem kıdem tazminatına (1 yıldan fazla çalıştıysa) hem de ihbar tazminatına hak kazanır."
      },
      {
        question: "İstifa edersem tazminat alabilir miyim?",
        answer: "Genellikle, kendi isteğiyle istifa eden (haklı bir nedeni olmayan) bir işçi kıdem tazminatı alamaz. Ayrıca, yasal bildirim sürelerine uymadan istifa ederse, işverene ihbar tazminatı ödemekle yükümlü olur."
      },
       {
        question: "Tazminatlardan hangi vergiler kesilir?",
        answer: "Kıdem tazminatı gelir vergisinden muaftır, sadece damga vergisi kesilir. İhbar tazminatı ise hem gelir vergisine hem de damga vergisine tabidir; SGK primi kesilmez."
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
        resultTitle="Tazminat Hesaplama Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 