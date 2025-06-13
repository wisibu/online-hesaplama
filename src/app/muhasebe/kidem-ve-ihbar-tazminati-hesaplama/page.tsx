'use client';

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
        Kıdem ve ihbar tazminatınızı kolayca hesaplayın. Brüt maaş, çalışma süresi ve diğer detaylar ile tazminat tutarınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'brutMaas', label: 'Brüt Maaş (₺)', type: 'number' as const, placeholder: '10000' },
      { id: 'calismaSuresi', label: 'Çalışma Süresi (Yıl)', type: 'number' as const, placeholder: '3' },
      { id: 'ihbarSuresi', label: 'İhbar Süresi (Gün)', type: 'number' as const, placeholder: '14' },
    ],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<any> => {
      'use server';
      
      const brutMaas = Number(inputs.brutMaas);
      const calismaSuresi = Number(inputs.calismaSuresi);
      const ihbarSuresi = Number(inputs.ihbarSuresi);

      if (!brutMaas || !calismaSuresi || !ihbarSuresi) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
      }

      const gunlukBrutMaas = brutMaas / 30;
      const kidemTazminati = gunlukBrutMaas * 30 * calismaSuresi;
      const ihbarTazminati = gunlukBrutMaas * ihbarSuresi;
      const toplamTazminat = kidemTazminati + ihbarTazminati;

      return {
        summary: {
          brutMaas: { type: 'result', label: 'Brüt Maaş', value: brutMaas },
          gunlukBrutMaas: { type: 'result', label: 'Günlük Brüt Maaş', value: gunlukBrutMaas },
          kidemTazminati: { type: 'result', label: 'Kıdem Tazminatı', value: kidemTazminati },
          ihbarTazminati: { type: 'result', label: 'İhbar Tazminatı', value: ihbarTazminati },
          toplamTazminat: { type: 'result', label: 'Toplam Tazminat', value: toplamTazminat },
        },
      };
    },
  },
  content: {
    sections: [
      {
        title: 'Kıdem ve İhbar Tazminatı Nedir?',
        content: `
          <p>Kıdem tazminatı, işçinin işyerinde belirli bir süre çalıştıktan sonra işten ayrılması durumunda ödenen bir tazminattır. 
          İhbar tazminatı ise, işverenin işçiyi işten çıkarmadan önce belirli bir süre önceden haber vermesi gereken süre için ödenen tazminattır.</p>
          <p>Kıdem tazminatı şu durumlarda ödenir:</p>
          <ul>
            <li>İşveren tarafından işten çıkarılma</li>
            <li>İşçinin kendi isteğiyle işten ayrılması (belirli koşullar altında)</li>
            <li>İş sözleşmesinin sona ermesi</li>
          </ul>
        `,
      },
      {
        title: 'Kıdem ve İhbar Tazminatı Nasıl Hesaplanır?',
        content: `
          <p>Kıdem tazminatı hesaplama formülü:</p>
          <p>Kıdem Tazminatı = (Brüt Maaş / 30) × 30 × Çalışma Süresi</p>
          <p>İhbar tazminatı hesaplama formülü:</p>
          <p>İhbar Tazminatı = (Brüt Maaş / 30) × İhbar Süresi</p>
          <p>Örneğin:</p>
          <ul>
            <li>Brüt Maaş: 10.000 TL</li>
            <li>Günlük Brüt Maaş: 10.000 / 30 = 333.33 TL</li>
            <li>Çalışma Süresi: 3 yıl</li>
            <li>İhbar Süresi: 14 gün</li>
          </ul>
          <p>Kıdem Tazminatı = 333.33 × 30 × 3 = 29.999.70 TL</p>
          <p>İhbar Tazminatı = 333.33 × 14 = 4.666.62 TL</p>
          <p>Toplam Tazminat = 29.999.70 + 4.666.62 = 34.666.32 TL</p>
        `,
      },
    ],
    faqs: [
      {
        question: 'Kıdem ve ihbar tazminatı kimlere ödenir?',
        answer: 'Kıdem tazminatı, en az 1 yıl çalışmış olan işçilere ödenir. İhbar tazminatı ise, işveren tarafından işten çıkarılan tüm işçilere ödenir. İşçinin kendi isteğiyle işten ayrılması durumunda ihbar tazminatı ödenmez.',
      },
      {
        question: 'Kıdem ve ihbar tazminatı vergiye tabi midir?',
        answer: 'Evet, kıdem ve ihbar tazminatı gelir vergisine tabidir. Ancak, işçinin işyerinde çalıştığı süreye göre belirli bir tutara kadar olan kısmı vergiden muaf tutulur.',
      },
      {
        question: 'Kıdem ve ihbar tazminatı ne zaman ödenir?',
        answer: 'Kıdem ve ihbar tazminatı, işçinin işten çıkarılması durumunda, iş sözleşmesinin sona erdiği tarihte ödenir. İşveren, bu tutarı işçiye nakit olarak veya banka hesabına havale yoluyla ödemek zorundadır.',
      },
    ],
  }
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