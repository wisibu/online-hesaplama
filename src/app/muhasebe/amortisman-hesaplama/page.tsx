'use client';

import CalculatorUI from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  calculator: {
    title: "Amortisman Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Sabit kıymetlerinizin amortisman tutarını kolayca hesaplayın. Maliyet bedeli, ekonomik ömür ve diğer detaylar ile amortisman planınızı oluşturun.
      </p>
    ),
    inputFields: [
      { id: 'maliyetBedeli', label: 'Maliyet Bedeli (₺)', type: 'number' as const, placeholder: '100000' },
      { id: 'ekonomikOmur', label: 'Ekonomik Ömür (Yıl)', type: 'number' as const, placeholder: '5' },
      { id: 'kullanimOrani', label: 'Kullanım Oranı (%)', type: 'number' as const, placeholder: '100' },
    ],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<any> => {
      'use server';
      
      const maliyetBedeli = Number(inputs.maliyetBedeli);
      const ekonomikOmur = Number(inputs.ekonomikOmur);
      const kullanimOrani = Number(inputs.kullanimOrani);

      if (!maliyetBedeli || !ekonomikOmur || !kullanimOrani) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
      }

      const yillikAmortisman = maliyetBedeli / ekonomikOmur;
      const aylikAmortisman = yillikAmortisman / 12;
      const gunlukAmortisman = yillikAmortisman / 365;
      const toplamAmortisman = yillikAmortisman * ekonomikOmur;

      return {
        summary: {
          maliyetBedeli: { type: 'result', label: 'Maliyet Bedeli', value: maliyetBedeli },
          yillikAmortisman: { type: 'result', label: 'Yıllık Amortisman', value: yillikAmortisman },
          aylikAmortisman: { type: 'result', label: 'Aylık Amortisman', value: aylikAmortisman },
          gunlukAmortisman: { type: 'result', label: 'Günlük Amortisman', value: gunlukAmortisman },
          toplamAmortisman: { type: 'result', label: 'Toplam Amortisman', value: toplamAmortisman },
        },
      };
    },
  },
  content: {
    sections: [
      {
        title: 'Amortisman Nedir?',
        content: `
          <p>Amortisman, işletmelerin maddi duran varlıklarının değerinin zaman içinde azalmasını ifade eder. 
          Bu azalma, varlığın kullanımı, eskimesi veya teknolojik gelişmeler nedeniyle oluşur.</p>
          <p>Amortisman şu durumlarda uygulanır:</p>
          <ul>
            <li>Maddi duran varlıklar (binalar, makineler, taşıtlar vb.)</li>
            <li>Maddi olmayan duran varlıklar (patentler, lisanslar, telif hakları vb.)</li>
            <li>Özel tükenmeye tabi varlıklar (madenler, petrol yatakları vb.)</li>
          </ul>
        `,
      },
      {
        title: 'Amortisman Nasıl Hesaplanır?',
        content: `
          <p>Amortisman hesaplama formülü:</p>
          <p>Yıllık Amortisman = Maliyet Bedeli / Ekonomik Ömür</p>
          <p>Örneğin:</p>
          <ul>
            <li>Maliyet Bedeli: 100.000 TL</li>
            <li>Ekonomik Ömür: 5 yıl</li>
          </ul>
          <p>Yıllık Amortisman = 100.000 / 5 = 20.000 TL</p>
          <p>Aylık Amortisman = 20.000 / 12 = 1.666.67 TL</p>
          <p>Günlük Amortisman = 20.000 / 365 = 54.79 TL</p>
          <p>Toplam Amortisman = 20.000 × 5 = 100.000 TL</p>
        `,
      },
    ],
    faqs: [
      {
        question: 'Amortisman oranları nasıl belirlenir?',
        answer: 'Amortisman oranları, varlığın ekonomik ömrüne göre belirlenir. Ekonomik ömür, varlığın işletmede kullanılabileceği süreyi ifade eder. Bu süre, varlığın türüne, kullanım şekline ve teknolojik gelişmelere göre değişiklik gösterir.',
      },
      {
        question: 'Amortisman yöntemleri nelerdir?',
        answer: 'En yaygın amortisman yöntemleri şunlardır: Doğrusal amortisman (eşit tutarlı), azalan bakiyeler (hızlandırılmış), üretim miktarına göre ve özel amortisman yöntemleri. Her yöntem, varlığın kullanım şekline ve işletmenin ihtiyaçlarına göre seçilebilir.',
      },
      {
        question: 'Amortisman vergiye tabi midir?',
        answer: 'Evet, amortisman giderleri vergiye tabidir. İşletmeler, amortisman giderlerini gelir vergisi veya kurumlar vergisi matrahından düşebilir. Ancak, amortisman oranları ve yöntemleri vergi mevzuatına uygun olmalıdır.',
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
        resultTitle="Amortisman Hesaplama Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}