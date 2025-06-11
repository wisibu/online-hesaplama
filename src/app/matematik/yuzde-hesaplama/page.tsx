import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Yüzde Hesaplama Aracı | Kapsamlı ve Kolay",
  description: "Farklı senaryolar için yüzde hesaplamaları yapın: Bir sayının yüzdesini bulma, yüzde olarak ifade etme, artış ve azalış oranlarını hesaplama.",
  keywords: ["yüzde hesaplama", "indirim hesaplama", "zam hesaplama", "oran hesaplama", "yüzde bulma"],
  calculator: {
    title: "Kapsamlı Yüzde Hesaplama Aracı",
    description: (
      <p className="text-sm text-gray-600">
        Yapmak istediğiniz yüzde hesaplama türünü seçin ve değerleri girin.
      </p>
    ),
    inputFields: [
      { 
        id: 'calculationType', 
        label: 'Hesaplama Türü', 
        type: 'select', 
        options: [
          { value: 'percentOf', label: 'Bir Sayının Yüzdesini Bulma (Örn: 200\'ün %25\'i kaçtır?)' },
          { value: 'whatPercent', label: 'Bir Sayı Diğerinin Yüzde Kaçıdır? (Örn: 50, 200\'ün yüzde kaçıdır?)' },
          { value: 'increase', label: 'Yüzdelik Artış/Azalış Hesaplama (Örn: 200\'den 250\'ye değişim yüzde kaçtır?)' },
        ], 
        defaultValue: 'percentOf' 
      },
      // Scenario 1: percentOf
      { id: 'baseValue1', label: 'Sayı', type: 'number', placeholder: '200', displayCondition: (inputs) => inputs.calculationType === 'percentOf' },
      { id: 'percentage1', label: 'Yüzde Oranı (%)', type: 'number', placeholder: '25', displayCondition: (inputs) => inputs.calculationType === 'percentOf' },
      // Scenario 2: whatPercent
      { id: 'partValue', label: 'Parça Değer', type: 'number', placeholder: '50', displayCondition: (inputs) => inputs.calculationType === 'whatPercent' },
      { id: 'totalValue', label: 'Bütün Değer', type: 'number', placeholder: '200', displayCondition: (inputs) => inputs.calculationType === 'whatPercent' },
      // Scenario 3: increase
      { id: 'initialValue', label: 'Başlangıç Değeri', type: 'number', placeholder: '200', displayCondition: (inputs) => inputs.calculationType === 'increase' },
      { id: 'finalValue', label: 'Son Değer', type: 'number', placeholder: '250', displayCondition: (inputs) => inputs.calculationType === 'increase' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { calculationType, baseValue1, percentage1, partValue, totalValue, initialValue, finalValue } = inputs as any;

        let summary: CalculationResult['summary'] = {};

        switch (calculationType) {
            case 'percentOf':
                if (!baseValue1 || !percentage1) return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları doldurun.' } } };
                const result = (baseValue1 * percentage1) / 100;
                summary = {
                    result: { label: `${baseValue1} sayısının %${percentage1}'i`, value: formatNumber(result, 2), isHighlighted: true },
                    increased: { label: `%${percentage1} artırılmış hali`, value: formatNumber(Number(baseValue1) + result, 2) },
                    decreased: { label: `%${percentage1} azaltılmış hali`, value: formatNumber(Number(baseValue1) - result, 2) },
                };
                break;
            case 'whatPercent':
                if (!partValue || !totalValue || totalValue === 0) return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli değerler girin (Bütün Değer 0 olamaz).' } } };
                const percentage = (partValue / totalValue) * 100;
                summary = {
                    result: { label: `${partValue}, ${totalValue} sayısının`, value: `%${formatNumber(percentage, 2)}`, isHighlighted: true },
                };
                break;
            case 'increase':
                if (!initialValue || !finalValue || initialValue === 0) return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli değerler girin (Başlangıç Değeri 0 olamaz).' } } };
                const change = finalValue - initialValue;
                const changePercentage = (change / initialValue) * 100;
                const changeType = change > 0 ? 'Artış' : 'Azalış';
                summary = {
                    result: { label: `Yüzdelik Değişim`, value: `%${formatNumber(changePercentage, 2)}`, isHighlighted: true, className: change > 0 ? 'text-green-600' : 'text-red-600' },
                    changeType: { label: 'Değişim Türü', value: changeType }
                };
                break;
            default:
                return { summary: { error: { label: 'Hata', value: 'Geçersiz hesaplama türü.' } } };
        }
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yüzde Hesaplama Nasıl Yapılır?",
        content: (
          <>
            <p>Yüzde, bir bütünün 100 eşit parçasından biridir ve "%" sembolü ile gösterilir. Gündelik hayatta ve finansta sıkça kullanılır. Temel yüzde hesaplama formülleri şunlardır:</p>
            <ul className="list-disc list-inside space-y-2 mt-2">
                <li><strong>Bir Sayının Yüzdesini Bulma:</strong> <code>(Sayı × Yüzde Oranı) / 100</code></li>
                <li><strong>Bir Sayının Başka Bir Sayıya Yüzdesini Bulma:</strong> <code>(Parça / Bütün) × 100</code></li>
                <li><strong>Yüzdelik Değişimi Bulma:</strong> <code>((Son Değer - İlk Değer) / İlk Değer) × 100</code></li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "İndirim hesaplamasını nasıl yapabilirim?",
        answer: "Bir ürünün indirimli fiyatını bulmak için, 'Bir Sayının Yüzdesini Bulma' seçeneğini kullanın. Ürün fiyatını ve indirim oranını girin. Hesaplanan sonuç, indirim tutarıdır. Bu tutarı ürün fiyatından çıkararak son fiyatı bulabilirsiniz. Ya da 'azaltılmış hali' sonucuna doğrudan bakabilirsiniz."
      },
      {
        question: "Maaş zammı oranını nasıl hesaplarım?",
        answer: "'Yüzdelik Artış/Azalış Hesaplama' seçeneğini kullanın. 'Başlangıç Değeri' olarak eski maaşınızı, 'Son Değer' olarak yeni maaşınızı girin. Sonuç, maaş zammı oranınızı yüzde olarak verecektir."
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
        resultTitle="Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
