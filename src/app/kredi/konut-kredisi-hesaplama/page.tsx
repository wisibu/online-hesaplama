'use client';

import CalculatorUI from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  calculator: {
    title: "Konut Kredisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        En uygun konut kredisi için taksit, faiz ve toplam geri ödeme tutarını hesaplayın. 10, 15, 20 yıl vade seçenekleriyle ev kredinizi planlayın.
      </p>
    ),
    inputFields: [
      { id: 'krediTutari', label: 'Kredi Tutarı (₺)', type: 'number' as const, placeholder: '1000000' },
      { id: 'faizOrani', label: 'Yıllık Faiz Oranı (%)', type: 'number' as const, placeholder: '2.5' },
      { id: 'vade', label: 'Vade (Yıl)', type: 'number' as const, placeholder: '10' },
    ],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<any> => {
      'use server';
      
      const krediTutari = Number(inputs.krediTutari);
      const faizOrani = Number(inputs.faizOrani);
      const vade = Number(inputs.vade);

      if (!krediTutari || !faizOrani || !vade) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
      }

      const aylikFaizOrani = faizOrani / 12 / 100;
      const toplamVade = vade * 12;
      const aylikTaksit = krediTutari * (aylikFaizOrani * Math.pow(1 + aylikFaizOrani, toplamVade)) / (Math.pow(1 + aylikFaizOrani, toplamVade) - 1);
      const toplamOdeme = aylikTaksit * toplamVade;
      const toplamFaiz = toplamOdeme - krediTutari;

      return {
        summary: {
          krediTutari: { type: 'result', label: 'Kredi Tutarı', value: krediTutari },
          aylikTaksit: { type: 'result', label: 'Aylık Taksit', value: aylikTaksit },
          toplamOdeme: { type: 'result', label: 'Toplam Ödeme', value: toplamOdeme },
          toplamFaiz: { type: 'result', label: 'Toplam Faiz', value: toplamFaiz },
        },
      };
    },
  },
  content: {
    sections: [
      {
        title: 'Konut Kredisi Nedir?',
        content: `
          <p>Konut kredisi, ev satın almak veya mevcut evinizi yenilemek için bankalardan çekebileceğiniz uzun vadeli bir kredidir. 
          Bu kredi türü, genellikle 5 ila 20 yıl arasında değişen vadelerle sunulur ve düşük faiz oranlarıyla avantajlı bir finansman seçeneği sunar.</p>
          <p>Konut kredisi şu durumlarda kullanılabilir:</p>
          <ul>
            <li>Yeni ev satın alma</li>
            <li>İkinci el ev satın alma</li>
            <li>Ev yenileme ve tadilat</li>
            <li>Kredi borcu ödeme</li>
          </ul>
        `,
      },
      {
        title: 'Konut Kredisi Nasıl Hesaplanır?',
        content: `
          <p>Konut kredisi hesaplama formülü:</p>
          <p>Aylık Taksit = Kredi Tutarı × (Aylık Faiz Oranı × (1 + Aylık Faiz Oranı)^Vade) / ((1 + Aylık Faiz Oranı)^Vade - 1)</p>
          <p>Örneğin:</p>
          <ul>
            <li>Kredi Tutarı: 1.000.000 TL</li>
            <li>Yıllık Faiz Oranı: %2.5</li>
            <li>Vade: 10 yıl</li>
          </ul>
          <p>Aylık Faiz Oranı = 2.5 / 12 / 100 = 0.00208</p>
          <p>Toplam Vade = 10 × 12 = 120 ay</p>
          <p>Aylık Taksit = 1.000.000 × (0.00208 × (1 + 0.00208)^120) / ((1 + 0.00208)^120 - 1) = 9.450 TL</p>
          <p>Toplam Ödeme = 9.450 × 120 = 1.134.000 TL</p>
          <p>Toplam Faiz = 1.134.000 - 1.000.000 = 134.000 TL</p>
        `,
      },
    ],
    faqs: [
      {
        question: 'Konut kredisi için gerekli belgeler nelerdir?',
        answer: 'Konut kredisi için genellikle kimlik belgesi, gelir belgesi, vergi levhası, tapu belgesi ve evin değerleme raporu gibi belgeler istenir. Bankalar, kredi başvurunuzu değerlendirirken bu belgeleri inceleyerek kredi limitinizi belirler.',
      },
      {
        question: 'Konut kredisi faiz oranları nasıl belirlenir?',
        answer: 'Konut kredisi faiz oranları, Merkez Bankası\'nın belirlediği politika faizine, piyasa koşullarına ve bankaların kendi politikalarına göre değişiklik gösterir. Genellikle, düşük riskli ve uzun vadeli bir kredi türü olduğu için diğer kredi türlerine göre daha düşük faiz oranları sunulur.',
      },
      {
        question: 'Konut kredisi erken kapatılabilir mi?',
        answer: 'Evet, konut kredisi erken kapatılabilir. Ancak, erken kapatma durumunda bankalar genellikle bir ceza uygular. Bu ceza, kalan anapara üzerinden belirli bir oranda hesaplanır ve erken kapatma tutarına eklenir.',
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
        resultTitle="Kredi Hesaplama Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
