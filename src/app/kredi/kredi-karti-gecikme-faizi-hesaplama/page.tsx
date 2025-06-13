'use client';

import CalculatorUI, { InputField } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  calculator: {
    title: "Kredi Kartı Gecikme Faizi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kredi kartı borcunuzun gecikme faizini hesaplayın. Borç tutarı, gecikme süresi ve faiz oranı ile toplam ödenecek tutarı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'borcTutari', label: 'Borç Tutarı (₺)', type: 'number' as const, placeholder: '1000' },
      { id: 'gecikmeSuresi', label: 'Gecikme Süresi (Gün)', type: 'number' as const, placeholder: '30' },
      { id: 'faizOrani', label: 'Gecikme Faiz Oranı (%)', type: 'number' as const, placeholder: '2.5' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<any> => {
      'use server';
      
      const borcTutari = Number(inputs.borcTutari);
      const gecikmeSuresi = Number(inputs.gecikmeSuresi);
      const faizOrani = Number(inputs.faizOrani);

      if (!borcTutari || !gecikmeSuresi || !faizOrani) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
      }

      const gunlukFaizOrani = faizOrani / 100;
      const gecikmeFaizi = borcTutari * gunlukFaizOrani * gecikmeSuresi;
      const toplamOdenecek = borcTutari + gecikmeFaizi;

      return {
        summary: {
          borcTutari: { type: 'result', label: 'Borç Tutarı', value: borcTutari },
          gecikmeFaizi: { type: 'result', label: 'Gecikme Faizi', value: gecikmeFaizi },
          toplamOdenecek: { type: 'result', label: 'Toplam Ödenecek', value: toplamOdenecek },
        },
      };
    },
  },
  content: {
    sections: [
      {
        title: 'Kredi Kartı Gecikme Faizi Nedir?',
        content: `
          <p>Kredi kartı gecikme faizi, kart sahibinin ödeme tarihinde ödeme yapmaması durumunda uygulanan ek faizdir. 
          Bu faiz, gecikme süresi boyunca günlük olarak hesaplanır ve borç tutarına eklenir.</p>
          <p>Gecikme faizi oranları bankalara göre değişiklik gösterebilir, ancak genellikle aylık %2-3 arasında değişir. 
          Bu oran, yıllık bazda %24-36 aralığına denk gelir.</p>
        `,
      },
      {
        title: 'Gecikme Faizi Nasıl Hesaplanır?',
        content: `
          <p>Gecikme faizi hesaplama formülü:</p>
          <p>Gecikme Faizi = Borç Tutarı × (Günlük Faiz Oranı) × Gecikme Süresi</p>
          <p>Örneğin:</p>
          <ul>
            <li>Borç Tutarı: 1.000 TL</li>
            <li>Günlük Faiz Oranı: %0.083 (Aylık %2.5)</li>
            <li>Gecikme Süresi: 30 gün</li>
          </ul>
          <p>Gecikme Faizi = 1.000 × 0.00083 × 30 = 24.90 TL</p>
          <p>Toplam Ödenecek = 1.000 + 24.90 = 1.024.90 TL</p>
        `,
      },
    ],
    faqs: [
      {
        question: 'Gecikme faizi ne zaman uygulanır?',
        answer: 'Kredi kartı ödeme tarihinden itibaren en az 1 gün gecikme olması durumunda gecikme faizi uygulanmaya başlar. Faiz, gecikme süresi boyunca günlük olarak hesaplanır.',
      },
      {
        question: 'Gecikme faizi oranları sabit midir?',
        answer: 'Hayır, gecikme faizi oranları bankalara göre değişiklik gösterebilir. Her banka kendi belirlediği oranı uygular ve bu oranlar piyasa koşullarına göre güncellenebilir.',
      },
      {
        question: 'Gecikme faizi ödememek için ne yapmalıyım?',
        answer: 'Gecikme faizi ödememek için kredi kartı ödemelerinizi son ödeme tarihinden önce yapmanız gerekir. Ayrıca, ödeme güçlüğü yaşıyorsanız bankanızla iletişime geçerek yapılandırma talep edebilirsiniz.',
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
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}