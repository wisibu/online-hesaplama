import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const KURUMLAR_VERGISI_ORANI = 0.25;

const pageConfig = {
  title: "Kurumlar Vergisi Hesaplama (2024) | OnlineHesaplama",
  description: "Şirketinizin 2024 yılı kurumlar vergisi matrahı üzerinden ödemesi gereken %25'lik vergiyi kolayca hesaplayın.",
  keywords: ["kurumlar vergisi hesaplama", "şirket vergisi", "2024 kurumlar vergisi oranı", "kurumlar vergisi matrahı"],
  calculator: {
    title: "Kurumlar Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Kurumun vergiye tabi matrahını girerek ödemeniz gereken vergiyi hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'taxableIncome', label: 'Kurumlar Vergisi Matrahı (TL)', type: 'number', placeholder: '1000000' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const taxableIncome = Number(inputs.taxableIncome);

        if (isNaN(taxableIncome) || taxableIncome < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir matrah girin.' } } };
        }

        const taxAmount = taxableIncome * KURUMLAR_VERGISI_ORANI;
        const netProfit = taxableIncome - taxAmount;

        const summary = {
            taxableIncome: { label: 'Vergi Matrahı', value: formatCurrency(taxableIncome) },
            taxRate: { label: 'Kurumlar Vergisi Oranı', value: `%${KURUMLAR_VERGISI_ORANI * 100}` },
            taxAmount: { label: 'Hesaplanan Kurumlar Vergisi', value: formatCurrency(taxAmount), isHighlighted: true },
            netProfit: { label: 'Vergi Sonrası Net Kar', value: formatCurrency(netProfit) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Kurumlar Vergisi Nedir?",
        content: (
          <p>
            Kurumlar vergisi, sermaye şirketleri (anonim şirket, limited şirket vb.), kooperatifler, iktisadi kamu kuruluşları gibi kurumların bir hesap dönemi içinde elde ettikleri safi kazançları üzerinden hesaplanan bir vergi türüdür. Gelir vergisinin aksine, bu vergi doğrudan kurumun tüzel kişiliği adına ödenir. <strong>2024 yılı için genel kurumlar vergisi oranı %25'tir.</strong>
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Kurumlar vergisi ne zaman beyan edilir ve ödenir?",
        answer: "Kurumlar vergisi, ilgili hesap dönemini takip eden yılın Nisan ayının sonuna kadar beyan edilir ve aynı süre içinde ödenir. Ancak, kurumlar yıl içinde 'Geçici Vergi' adı altında üçer aylık dönemler halinde vergi ödemesi yaparlar. Yıl sonunda hesaplanan nihai vergiden, yıl içinde ödenen geçici vergiler mahsup edilir."
      },
      {
        question: "Kurumlar vergisi matrahı nasıl bulunur?",
        answer: "Kurumlar vergisi matrahı, kurumun ticari faaliyetlerinden elde ettiği hasılattan, bu faaliyetler için yaptığı giderlerin (maliyetler, maaşlar, amortismanlar vb.) indirilmesiyle bulunan 'ticari bilanço karı' üzerinden hesaplanır. Bu kara, kanunen kabul edilmeyen giderler eklenir ve istisnalar ile geçmiş yıl zararları düşülerek vergiye tabi matraha ulaşılır."
      },
       {
        question: "Banka ve finans kurumları için oran farklı mı?",
        answer: "Evet. Bankalar, finansal kiralama, faktoring, elektronik ödeme şirketleri gibi finans sektöründe faaliyet gösteren kurumlar için 2024 yılında kurumlar vergisi oranı %30 olarak uygulanmaktadır."
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
        resultTitle="Kurumlar Vergisi Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}