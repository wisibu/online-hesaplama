'use client';

import CalculatorUI from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  calculator: {
    title: "İhbar Tazminatı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        İhbar tazminatınızı kolayca hesaplayın. Brüt maaş, çalışma süresi ve diğer detaylar ile tazminat tutarınızı öğrenin.
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
      const ihbarTazminati = gunlukBrutMaas * ihbarSuresi;

      return {
        summary: {
          brutMaas: { type: 'result', label: 'Brüt Maaş', value: brutMaas },
          gunlukBrutMaas: { type: 'result', label: 'Günlük Brüt Maaş', value: gunlukBrutMaas },
          ihbarTazminati: { type: 'result', label: 'İhbar Tazminatı', value: ihbarTazminati },
        },
      };
    },
  },
  content: {
    sections: [
      {
        title: 'İhbar Tazminatı Nedir?',
        content: `
          <p>İhbar tazminatı, işverenin işçiyi işten çıkarmadan önce belirli bir süre önceden haber vermesi gereken süre için ödenen tazminattır. 
          Bu süre, işçinin işyerinde çalıştığı süreye göre belirlenir.</p>
          <p>İhbar süreleri şu şekildedir:</p>
          <ul>
            <li>6 aydan az çalışmış işçiler için: 2 hafta</li>
            <li>6 ay - 1.5 yıl arası çalışmış işçiler için: 4 hafta</li>
            <li>1.5 yıl - 3 yıl arası çalışmış işçiler için: 6 hafta</li>
            <li>3 yıldan fazla çalışmış işçiler için: 8 hafta</li>
          </ul>
        `,
      },
      {
        title: 'İhbar Tazminatı Nasıl Hesaplanır?',
        content: `
          <p>İhbar tazminatı hesaplama formülü:</p>
          <p>İhbar Tazminatı = (Brüt Maaş / 30) × İhbar Süresi</p>
          <p>Örneğin:</p>
          <ul>
            <li>Brüt Maaş: 10.000 TL</li>
            <li>Günlük Brüt Maaş: 10.000 / 30 = 333.33 TL</li>
            <li>İhbar Süresi: 14 gün</li>
          </ul>
          <p>İhbar Tazminatı = 333.33 × 14 = 4.666.62 TL</p>
        `,
      },
    ],
    faqs: [
      {
        question: 'İhbar tazminatı kimlere ödenir?',
        answer: 'İhbar tazminatı, işveren tarafından işten çıkarılan ve en az 1 yıl çalışmış olan işçilere ödenir. İşçinin kendi isteğiyle işten ayrılması durumunda ihbar tazminatı ödenmez.',
      },
      {
        question: 'İhbar tazminatı vergiye tabi midir?',
        answer: 'Evet, ihbar tazminatı gelir vergisine tabidir. Ancak, işçinin işyerinde çalıştığı süreye göre belirli bir tutara kadar olan kısmı vergiden muaf tutulur.',
      },
      {
        question: 'İhbar tazminatı ne zaman ödenir?',
        answer: 'İhbar tazminatı, işçinin işten çıkarılması durumunda, iş sözleşmesinin sona erdiği tarihte ödenir. İşveren, bu tutarı işçiye nakit olarak veya banka hesabına havale yoluyla ödemek zorundadır.',
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
        resultTitle="İhbar Tazminatı Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 