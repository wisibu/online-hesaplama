import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Döviz Çevirici ve Hesaplama | OnlineHesaplama",
  description: "Döviz hesaplama aracı ile güncel kur üzerinden para birimleri arasında anında çeviri yapın. Dolar, Euro, Sterlin ve diğer para birimlerinin TL karşılığını hesaplayın.",
  keywords: ["döviz hesaplama", "döviz çevirici", "dolar tl çevir", "euro tl hesaplama", "kur hesaplama"],
  calculator: {
    title: "Döviz Çevirici",
    description: (
      <p className="text-sm text-gray-600">
        Çevirmek istediğiniz tutarı ve güncel döviz kurunu girerek hesaplama yapın.
      </p>
    ),
    inputFields: [
      { id: 'tutar', label: 'Tutar', type: 'number', placeholder: '100' },
      { id: 'kur', label: 'Döviz Kuru (Örn: 1 Dolar için 32.5)', type: 'number', placeholder: '32.50' },
      { id: 'yon', label: 'Çeviri Yönü', type: 'select', options: [
            { value: 'dovizden-tl', label: 'Dövizden TL\'ye' },
            { value: 'tlden-dovize', label: 'TL\'den Döviz\'e' },
      ], defaultValue: 'dovizden-tl' }
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { tutar, kur, yon } = inputs as { tutar: number, kur: number, yon: string };

        if (!tutar || tutar <= 0 || !kur || kur <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir tutar ve kur girin.' } } };
        }

        let sonuc = 0;
        let sonucLabel = "";
        let anaParaLabel = "";

        if (yon === 'dovizden-tl') {
            sonuc = tutar * kur;
            sonucLabel = "Tutarın TL Karşılığı";
            anaParaLabel = `Girilen Döviz Tutarı`;
        } else {
            sonuc = tutar / kur;
            sonucLabel = "Tutarın Döviz Karşılığı";
            anaParaLabel = `Girilen TL Tutarı`;
        }
        
        const summary: CalculationResult['summary'] = {
            sonuc: { label: sonucLabel, value: formatCurrency(sonuc), isHighlighted: true },
            anaPara: { label: anaParaLabel, value: formatCurrency(tutar) },
            kur: { label: 'Kullanılan Kur', value: formatCurrency(kur) }
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Döviz Kuru ve Çeviri Nasıl Çalışır?",
        content: (
          <p>
            Döviz çevirici, iki farklı para birimi arasındaki değeri, aralarındaki değişim oranı olan <strong>döviz kuru</strong> üzerinden hesaplar. Örneğin, 1 ABD Doları'nın 32.5 Türk Lirası olduğunu varsayarsak, bu iki para birimi arasındaki döviz kuru 32.5'tir. Bu hesaplayıcı, sizin verdiğiniz kur değerini kullanarak bu matematiksel işlemi gerçekleştirir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Bu hesaplayıcı canlı kurları mı kullanıyor?",
        answer: "Hayır. Bu araç, sizin manuel olarak girdiğiniz döviz kurunu kullanarak bir hesaplama yapar. Canlı ve anlık piyasa kurlarını yansıtmaz. İşlem yapmadan önce bankanızın veya döviz bürosunun anlık alış/satış kurlarını teyit etmeniz önemlidir."
      },
      {
        question: "Alış ve satış kuru arasındaki fark nedir?",
        answer: "<strong>Alış kuru</strong>, bankanın veya döviz bürosunun sizden dövizi satın alacağı fiyattır. <strong>Satış kuru</strong> ise, size dövizi satacağı fiyattır. Genellikle satış kuru, alış kurundan daha yüksektir. Bu aradaki fark, finansal kurumun kar marjını oluşturur."
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
        resultTitle="Döviz Çeviri Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}