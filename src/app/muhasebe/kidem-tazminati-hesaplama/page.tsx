import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı Parametreleri (1 Ocak 2024 - 30 Haziran 2024 arası için geçerli)
const KIDEM_TAVANI = 35058.58;
const DAMGA_VERGISI_ORANI = 0.00759;

const pageConfig = {
  title: "Kıdem Tazminatı Hesaplama (2024 Tavanı) | OnlineHesaplama",
  description: "İşe giriş ve çıkış tarihinize göre, 2024 yılı güncel kıdem tazminatı tavanını dikkate alarak brüt ve net kıdem tazminatı tutarınızı anında hesaplayın.",
  keywords: ["kıdem tazminatı hesaplama", "kıdem tazminatı tavanı 2024", "net kıdem tazminatı", "işten ayrılma", "tazminat hesaplama"],
  calculator: {
    title: "Kıdem Tazminatı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hizmet sürenizi ve giydirilmiş brüt ücretinizi girerek net kıdem tazminatınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'startDate', label: 'İşe Giriş Tarihi', type: 'date', defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split('T')[0] },
      { id: 'endDate', label: 'İşten Çıkış Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { id: 'brutUcret', label: 'Son Giydirilmiş Brüt Ücret (TL)', type: 'number', placeholder: '40000' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { startDate: startStr, endDate: endStr, brutUcret } = inputs as { startDate: string, endDate: string, brutUcret: number };

        if (!startStr || !endStr || !brutUcret || brutUcret <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
        }

        const startDate = new Date(startStr);
        const endDate = new Date(endStr);
        const hizmetSuresiMs = endDate.getTime() - startDate.getTime();
        const hizmetSuresiGun = Math.floor(hizmetSuresiMs / (1000 * 60 * 60 * 24)) + 1; // +1 gün dahil edilir
        
        if (hizmetSuresiGun < 365) {
            return { summary: { info: { label: 'Bilgi', value: 'Kıdem tazminatına hak kazanmak için en az 1 yıl çalışmış olmak gerekir.' } } };
        }

        const hizmetYili = Math.floor(hizmetSuresiGun / 365);
        const kalanGun = hizmetSuresiGun % 365;

        const esasUcret = Math.min(brutUcret, KIDEM_TAVANI);
        
        const yillikTazminat = esasUcret * hizmetYili;
        const kusuratTazminat = (esasUcret / 365) * kalanGun;
        
        const brutKidemTazminati = yillikTazminat + kusuratTazminat;
        
        // Kesintiler
        const damgaVergisi = brutKidemTazminati * DAMGA_VERGISI_ORANI;
        const netKidemTazminati = brutKidemTazminati - damgaVergisi;

        const summary = {
            hizmetSuresi: { label: 'Hizmet Süresi', value: `${hizmetYili} yıl, ${kalanGun} gün` },
            esasUcret: { label: 'Hesaplamaya Esas Ücret', value: formatCurrency(esasUcret) },
            brutTazminat: { label: 'Brüt Kıdem Tazminatı', value: formatCurrency(brutKidemTazminati) },
            damgaVergisi: { label: 'Damga Vergisi Kesintisi', value: formatCurrency(damgaVergisi) },
            netTazminat: { label: 'Net Kıdem Tazminatı', value: formatCurrency(netKidemTazminati) },
            tavanBilgisi: { label: `2024 Kıdem Tavanı (Ocak-Haziran)`, value: formatCurrency(KIDEM_TAVANI) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Kıdem Tazminatı Nedir?",
        content: (
          <p>
            Kıdem tazminatı, belirli şartlar altında iş sözleşmesi sona eren bir işçiye, iş yerindeki çalışma süresi (kıdemi) oranında işvereni tarafından ödenen bir tazminattır. İşçinin en az bir yıl çalışmış olması ve iş sözleşmesinin kanunda belirtilen nedenlerden biriyle sona ermesi gerekir. Her tam çalışma yılı için işçiye 30 günlük giydirilmiş brüt ücreti tutarında tazminat ödenir. Bir yıldan artan süreler de oranlanarak hesaba katılır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Kıdem tazminatı tavanı nedir?",
        answer: "Devlet, kıdem tazminatı hesaplamasında kullanılacak olan aylık brüt ücret için bir üst sınır belirler. Buna kıdem tazminatı tavanı denir. İşçinin giydirilmiş brüt ücreti bu tavanın üzerinde olsa bile, hesaplama bu tavan ücret üzerinden yapılır. Tavan tutarı, Memur Maaş Katsayısı'na endeksli olduğu için her yıl Ocak ve Temmuz aylarında olmak üzere iki kez güncellenir."
      },
      {
        question: "Kıdem tazminatından hangi kesintiler yapılır?",
        answer: "Kıdem tazminatı gelir vergisinden istisnadır, bu nedenle gelir vergisi kesintisi yapılmaz. Ancak, brüt kıdem tazminatı tutarı üzerinden sadece binde 7,59 (%0.759) oranında Damga Vergisi kesintisi yapılır."
      },
       {
        question: "Hangi durumlarda kıdem tazminatı alınır?",
        answer: "İşçinin kıdem tazminatına hak kazanabilmesi için iş sözleşmesinin; işveren tarafından haklı bir neden olmaksızın feshedilmesi, işçi tarafından haklı bir nedenle (sağlık sorunları, işverenin ahlak ve iyiniyet kurallarına uymaması vb.) feshedilmesi, erkek çalışanların askerlik nedeniyle, kadın çalışanların evlilik nedeniyle (evlendikten sonra 1 yıl içinde) işten ayrılması veya emeklilik hakkının elde edilmesi gibi durumlarla sona ermesi gerekir."
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
        resultTitle="Kıdem Tazminatı Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}