import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const inputFields: InputField[] = [
  { 
    id: 'shape', 
    label: 'Geometrik Şekil', 
    type: 'select', 
    options: [
      { value: 'rectangle', label: 'Dikdörtgen / Kare' },
      { value: 'circle', label: 'Daire' },
      { value: 'triangle', label: 'Üçgen' },
    ], 
    defaultValue: 'rectangle' 
  },
  // Dikdörtgen
  { id: 'width', label: 'Genişlik (metre)', type: 'number', placeholder: '5', displayCondition: { field: 'shape', value: 'rectangle' } },
  { id: 'height', label: 'Yükseklik (metre)', type: 'number', placeholder: '10', displayCondition: { field: 'shape', value: 'rectangle' } },
  // Daire
  { id: 'radius', label: 'Yarıçap (metre)', type: 'number', placeholder: '3', displayCondition: { field: 'shape', value: 'circle' } },
  // Üçgen
  { id: 'base', label: 'Taban (metre)', type: 'number', placeholder: '6', displayCondition: { field: 'shape', value: 'triangle' } },
  { id: 'triangleHeight', label: 'Yükseklik (metre)', type: 'number', placeholder: '4', displayCondition: { field: 'shape', value: 'triangle' } },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
    'use server';
    
    const { shape, width, height, radius, base, triangleHeight } = inputs as any;

    let area = 0;
    let formula = '';

    switch (shape) {
        case 'rectangle':
            if (!width || !height || Number(width) <= 0 || Number(height) <= 0) return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli genişlik ve yükseklik değerleri girin.' } } };
            area = Number(width) * Number(height);
            formula = `Genişlik × Yükseklik = ${width}m × ${height}m`;
            break;
        case 'circle':
            if (!radius || Number(radius) <= 0) return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir yarıçap değeri girin.' } } };
            area = Math.PI * Math.pow(Number(radius), 2);
            formula = `π × r² = π × ${radius}²`;
            break;
        case 'triangle':
            if (!base || !triangleHeight || Number(base) <= 0 || Number(triangleHeight) <= 0) return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli taban ve yükseklik değerleri girin.' } } };
            area = (Number(base) * Number(triangleHeight)) / 2;
            formula = `(Taban × Yükseklik) / 2 = (${base}m × ${triangleHeight}m) / 2`;
            break;
        default:
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Geçersiz şekil seçimi.' } } };
    }
      
    const summary: CalculationResult['summary'] = {
      result: { type: 'result', label: 'Hesaplanan Alan', value: `${formatNumber(area, 2)} m²`, isHighlighted: true },
      formula: { type: 'info', label: 'Kullanılan Formül', value: formula },
    };

    return { summary };
}

const content = {
  sections: [
    {
      title: "Alan ve Metrekare Nedir?",
      content: (
        <>
          <p><strong>Alan</strong>, bir yüzeyin kapladığı iki boyutlu yer miktarını ölçen bir değerdir. <strong>Metrekare (m²)</strong> ise Uluslararası Birimler Sistemi'nde (SI) temel alan ölçü birimidir ve bir kenarı bir metre olan bir karenin alanına eşittir.</p>
          <h4 className="font-semibold mt-3">Temel Alan Formülleri</h4>
          <ul className="list-disc list-inside space-y-2 mt-2 bg-gray-50 p-4 rounded-lg">
              <li><strong>Dikdörtgen Alanı:</strong> <code>Genişlik × Yükseklik</code></li>
              <li><strong>Daire Alanı:</strong> <code>π × Yarıçap²</code> (π ≈ 3.14159)</li>
              <li><strong>Üçgen Alanı:</strong> <code>(Taban × Yükseklik) / 2</code></li>
          </ul>
        </>
      )
    }
  ],
  faqs: [
    {
      question: "Oda veya arsa alanı nasıl hesaplanır?",
      answer: "Oda veya arsanız çoğunlukla dikdörtgen veya kare şeklindedir. 'Dikdörtgen / Kare' seçeneğini seçin, odanın veya arsanın enini ve boyunu metre cinsinden ölçerek ilgili alanlara girin. Sonuç, mekanın metrekare cinsinden alanını verecektir."
    },
    {
      question: "Farklı birimlerde (cm, km) ölçüm yaptım, ne yapmalıyım?",
      answer: "Bu hesaplayıcı metre cinsinden ölçümlerle çalışır. Hesaplama yapmadan önce ölçümlerinizi metreye çevirmeniz gerekir. Örneğin, 150 cm'lik bir ölçüm için 1.5 değerini girmelisiniz (100 cm = 1 m)."
    }
  ]
};

export const metadata: Metadata = {
  title: "Metrekare (m²) Hesaplama | Alan Hesaplayıcı",
  description: "Dikdörtgen, daire ve üçgen gibi farklı geometrik şekillerin alanını metrekare (m²) cinsinden kolayca hesaplayın. Pratik alan hesaplama aracı.",
  keywords: ["metrekare hesaplama", "alan hesaplama", "m2 hesaplama", "dikdörtgen alan", "daire alan", "üçgen alan"],
  openGraph: {
    title: "Metrekare (m²) Hesaplama | Alan Hesaplayıcı",
    description: "Dikdörtgen, daire ve üçgen gibi farklı geometrik şekillerin alanını metrekare (m²) cinsinden kolayca hesaplayın. Pratik alan hesaplama aracı.",
  },
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="Çok Şekilli Alan (m²) Hesaplayıcı"
        description={
          <p className="text-sm text-gray-600">
            Alanını hesaplamak istediğiniz şekli seçin ve gerekli ölçüleri metre cinsinden girin.
          </p>
        }
        inputFields={inputFields} 
        calculate={calculate}
        resultTitle="Alan Hesaplama Sonucu"
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}