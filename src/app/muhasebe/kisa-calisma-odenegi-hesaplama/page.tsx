'use client';

import CalculatorUI from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  calculator: {
    title: "Kısa Çalışma Ödeneği Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kısa çalışma ödeneğinizi kolayca hesaplayın. Brüt maaş, çalışma süresi ve diğer detaylar ile ödenecek tutarı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'brutMaas', label: 'Brüt Maaş (₺)', type: 'number' as const, placeholder: '10000' },
      { id: 'calismaSuresi', label: 'Çalışma Süresi (Yıl)', type: 'number' as const, placeholder: '3' },
      { id: 'kisaCalismaSuresi', label: 'Kısa Çalışma Süresi (Gün)', type: 'number' as const, placeholder: '30' },
    ],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<any> => {
      'use server';
      
      const brutMaas = Number(inputs.brutMaas);
      const calismaSuresi = Number(inputs.calismaSuresi);
      const kisaCalismaSuresi = Number(inputs.kisaCalismaSuresi);

      if (!brutMaas || !calismaSuresi || !kisaCalismaSuresi) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
      }

      const gunlukBrutMaas = brutMaas / 30;
      const kisaCalismaOdenegi = gunlukBrutMaas * kisaCalismaSuresi * 0.6; // %60'ı ödenir

      return {
        summary: {
          brutMaas: { type: 'result', label: 'Brüt Maaş', value: brutMaas },
          gunlukBrutMaas: { type: 'result', label: 'Günlük Brüt Maaş', value: gunlukBrutMaas },
          kisaCalismaOdenegi: { type: 'result', label: 'Kısa Çalışma Ödeneği', value: kisaCalismaOdenegi },
        },
      };
    },
  },
  content: {
    sections: [
      {
        title: 'Kısa Çalışma Ödeneği Nedir?',
        content: `
          <p>Kısa çalışma ödeneği, işyerinde geçici olarak çalışma sürelerinin azaltılması veya işin tamamen durdurulması durumunda, 
          işçilere ödenen bir ödemedir. Bu ödeme, işçinin normal maaşının belirli bir yüzdesi olarak hesaplanır.</p>
          <p>Kısa çalışma ödeneği şu durumlarda ödenir:</p>
          <ul>
            <li>Genel ekonomik kriz</li>
            <li>Bölgesel ekonomik kriz</li>
            <li>Sezonluk işler</li>
            <li>İşyerinde geçici olarak çalışma sürelerinin azaltılması</li>
          </ul>
        `,
      },
      {
        title: 'Kısa Çalışma Ödeneği Nasıl Hesaplanır?',
        content: `
          <p>Kısa çalışma ödeneği hesaplama formülü:</p>
          <p>Kısa Çalışma Ödeneği = (Brüt Maaş / 30) × Kısa Çalışma Süresi × 0.6</p>
          <p>Örneğin:</p>
          <ul>
            <li>Brüt Maaş: 10.000 TL</li>
            <li>Günlük Brüt Maaş: 10.000 / 30 = 333.33 TL</li>
            <li>Kısa Çalışma Süresi: 30 gün</li>
          </ul>
          <p>Kısa Çalışma Ödeneği = 333.33 × 30 × 0.6 = 5.999.94 TL</p>
        `,
      },
    ],
    faqs: [
      {
        question: 'Kısa çalışma ödeneği kimlere ödenir?',
        answer: 'Kısa çalışma ödeneği, işyerinde geçici olarak çalışma sürelerinin azaltılması veya işin tamamen durdurulması durumunda, işçilere ödenir. İşçinin en az 450 gün prim ödemiş olması gerekir.',
      },
      {
        question: 'Kısa çalışma ödeneği ne kadar süre ödenir?',
        answer: 'Kısa çalışma ödeneği, en fazla 3 ay süreyle ödenir. Bu süre, gerekli görülmesi halinde 6 aya kadar uzatılabilir.',
      },
      {
        question: 'Kısa çalışma ödeneği vergiye tabi midir?',
        answer: 'Evet, kısa çalışma ödeneği gelir vergisine tabidir. Ancak, işçinin işyerinde çalıştığı süreye göre belirli bir tutara kadar olan kısmı vergiden muaf tutulur.',
      },
    ],
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
        resultTitle="Kısa Çalışma Ödeneği Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}