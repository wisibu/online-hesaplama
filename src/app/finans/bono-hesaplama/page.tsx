import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency, formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Bono Getirisi Hesaplama | OnlineHesaplama",
  description: "Yatırım yapmayı düşündüğünüz Hazine Bonosu veya Özel Sektör Bonosu'nun vade sonu net getirisini ve toplam değerini kolayca hesaplayın.",
  keywords: ["bono hesaplama", "bono getirisi", "hazine bonosu", "devlet tahvili", "net getiri hesaplama", "stopaj"],
  calculator: {
    title: "Bono Getirisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Bono yatırımınızın vade sonundaki net getirisini hesaplamak için gerekli bilgileri girin.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Anapara (₺)', type: 'number', placeholder: '10000' },
      { id: 'interestRate', label: 'Yıllık Basit Faiz Oranı (%)', type: 'number', placeholder: '25' },
      { id: 'days', label: 'Vade (Gün)', type: 'number', placeholder: '90' },
      { id: 'taxRate', label: 'Stopaj Oranı (%)', type: 'number', placeholder: '10', defaultValue: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const principal = Number(inputs.principal);
      const interestRate = Number(inputs.interestRate);
      const days = Number(inputs.days);
      const taxRate = Number(inputs.taxRate);

      if ([principal, interestRate, days, taxRate].some(v => isNaN(v) || v < 0)) {
        return null;
      }

      const dailyRate = interestRate / 100 / 365;
      const grossInterest = principal * dailyRate * days;
      const taxAmount = grossInterest * (taxRate / 100);
      const netInterest = grossInterest - taxAmount;
      const totalValue = principal + netInterest;
      
      const summary = {
        totalValue: { label: 'Vade Sonu Toplam Net Tutar', value: formatCurrency(totalValue), isHighlighted: true },
        netInterest: { label: 'Net Faiz Getirisi', value: formatCurrency(netInterest) },
        grossInterest: { label: 'Brüt Faiz Getirisi', value: formatCurrency(grossInterest) },
        taxAmount: { label: 'Stopaj Kesintisi', value: formatCurrency(taxAmount) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Bono Nedir ve Getirisi Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Bonolar, devletin (Hazine Bonosu) veya özel şirketlerin (Özel Sektör Bonosu) fon sağlamak amacıyla çıkardıkları, vadesi genellikle bir yıldan kısa olan borçlanma senetleridir. Yatırımcılar için sabit getirili bir menkul kıymet olarak kabul edilirler.
            </p>
            <p className="mt-2">
              Bono getirisini hesaplarken temel mantık basittir: Anaparanız, belirtilen yıllık faiz oranı üzerinden vade gün sayısı kadar işletilir. Bulunan brüt faiz gelirinden, yine belirtilen oran üzerinden stopaj (gelir vergisi kesintisi) düşülür. Kalan net faiz getirisi anaparanıza eklendiğinde vade sonunda elinize geçecek toplam tutarı bulursunuz. Bu hesaplayıcı, bu süreci sizin için otomatikleştirir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Stopaj oranı nedir ve neden önemlidir?",
        answer: "Stopaj, menkul kıymetlerden elde edilen gelirler üzerinden kaynağında kesilen bir vergidir. Bono faiz gelirleri de stopaja tabidir. Net getiriyi doğrudan etkilediği için yatırım kararı verirken bu oranı göz önünde bulundurmak önemlidir. Oranlar yatırım aracına ve yasal düzenlemelere göre değişebilir."
      },
      {
        question: "Bono ve Tahvil arasındaki fark nedir?",
        answer: "Temel fark vadedir. Bonoların vadesi genellikle bir yıldan kısadır. Vadesi bir yıldan uzun olan devlet veya özel sektör borçlanma senetlerine ise 'Tahvil' denir. İkisi de benzer bir getiri mantığına sahiptir."
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
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}