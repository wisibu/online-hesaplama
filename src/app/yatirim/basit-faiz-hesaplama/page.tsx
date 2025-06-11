import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Basit Faiz Hesaplama | OnlineHesaplama",
  description: "Anapara, yıllık faiz oranı ve süre (gün veya yıl) bilgilerini girerek elde edeceğiniz basit faiz getirisini ve toplam tutarı hesaplayın.",
  keywords: ["basit faiz hesaplama", "faiz getirisi", "anapara faiz hesaplama", "yatırım getirisi"],
  calculator: {
    title: "Basit Faiz Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yatırımınızın basit faiz getirisini hesaplamak için bilgileri girin.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Anapara (TL)', type: 'number', placeholder: '10000' },
      { id: 'rate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: '45' },
      { id: 'time', label: 'Süre', type: 'number', placeholder: '365' },
      { id: 'timeUnit', label: 'Süre Birimi', type: 'select', options: [
        { value: 'days', label: 'Gün' },
        { value: 'years', label: 'Yıl' },
      ]},
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const principal = Number(inputs.principal);
        const rate = Number(inputs.rate) / 100; // Yıllık oran
        const time = Number(inputs.time);
        const timeUnit = inputs.timeUnit as 'days' | 'years';

        if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları pozitif değerlerle doldurun.' } } };
        }

        let timeInYears = time;
        if (timeUnit === 'days') {
            timeInYears = time / 365;
        }

        // Basit Faiz = Anapara * Yıllık Faiz Oranı * Süre (Yıl)
        const interest = principal * rate * timeInYears;
        const totalAmount = principal + interest;

        const summary = {
            principal: { label: 'Anapara', value: formatCurrency(principal) },
            interest: { label: 'Faiz Getirisi', value: formatCurrency(interest) },
            total: { label: 'Vade Sonu Toplam Tutar', value: formatCurrency(totalAmount) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Basit Faiz Nedir?",
        content: (
          <p>
            Basit faiz, bir yatırımın veya kredinin sadece başlangıçtaki anapara tutarı üzerinden hesaplanan faiz türüdür. Bu yöntemde, kazanılan faizler anaparaya eklenmez ve sonraki dönemlerde bu faizler üzerinden tekrar faiz işletilmez. Hesaplaması oldukça basittir ve genellikle kısa vadeli yatırımlar veya krediler için kullanılır. Formülü: <strong>Faiz = Anapara x Yıllık Faiz Oranı x Süre (Yıl olarak)</strong> şeklindedir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Basit faiz ile bileşik faiz arasındaki temel fark nedir?",
        answer: "En temel fark, kazanılan faizin nasıl değerlendirildiğidir. Basit faizde, faiz her zaman başlangıçtaki anapara üzerinden hesaplanır. Bileşik faizde ise, her dönemin sonunda kazanılan faiz anaparaya eklenir ve bir sonraki dönemin faizi bu yeni, daha yüksek anapara üzerinden hesaplanır. Bu nedenle, bileşik faiz 'faizin faizi' olarak da bilinir ve uzun vadede çok daha yüksek getiri sağlar."
      },
      {
        question: "Günlük faiz nasıl hesaplanır?",
        answer: "Yıllık faiz oranını 365'e bölerek günlük faiz oranını bulabilirsiniz. Daha sonra bu günlük oranı, anapara ve gün sayısı ile çarparak toplam basit faizi hesaplayabilirsiniz. Hesaplayıcımız bu işlemi sizin için otomatik olarak yapar."
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
        resultTitle="Yatırım Getirisi Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 