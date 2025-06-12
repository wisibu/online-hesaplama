import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Mevduat Faizi Hesaplama (Net/Brüt) - Güncel Oranlar | OnlineHesaplama",
  description: "Vadeli mevduat hesabınızın net ve brüt getirisini anında hesaplayın. Anapara, faiz oranı ve vade süresini girerek kazancınızı öğrenin.",
  keywords: ["mevduat faizi hesaplama", "vadeli hesap faiz hesaplama", "faiz getirisi hesaplama", "net brüt faiz"],
  calculator: {
    title: "Mevduat Faizi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yatırımınızın vade sonunda ne kadar faiz geliri getireceğini hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Anapara Tutarı (₺)', type: 'number', placeholder: 'Örn: 10000' },
      { id: 'interestRate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: 'Örn: 45' },
      { id: 'term', label: 'Vade (Gün)', type: 'number', placeholder: 'Örn: 32' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const principal = Number(inputs.principal);
      const annualInterestRate = Number(inputs.interestRate) / 100;
      const termDays = Number(inputs.term);

      if (principal <= 0 || annualInterestRate <= 0 || termDays <= 0) {
        return null;
      }

      const grossInterest = principal * annualInterestRate * (termDays / 365);
      
      // Mevduat faizinde stopaj oranı %5 olarak varsayılmıştır. Bu oran değişebilir.
      const withholdingRate = 0.05;
      const withholdingAmount = grossInterest * withholdingRate;
      const netInterest = grossInterest - withholdingAmount;
      const totalAmount = principal + netInterest;

      const summary: CalculationResult['summary'] = {
        totalAmount: { type: 'result', label: 'Vade Sonu Toplam Tutar', value: formatCurrency(totalAmount), isHighlighted: true },
        netInterest: { type: 'result', label: 'Net Faiz Getirisi', value: formatCurrency(netInterest) },
        grossInterest: { type: 'info', label: 'Brüt Faiz Getirisi', value: formatCurrency(grossInterest) },
        withholding: { type: 'info', label: `Stopaj Kesintisi (%${withholdingRate * 100})`, value: formatCurrency(withholdingAmount) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Mevduat Faizi Nedir?",
        content: (
          <p>
            Mevduat faizi, bankaya belirli bir vadeyle yatırılan anaparanın, belirlenen faiz oranı üzerinden kazandığı gelirdir. Bankalar, müşterilerinden topladıkları bu paraları kredi olarak kullandırır ve karşılığında para sahiplerine bir getiri sunar. Bu getiri, paranızı enflasyona karşı korumanın ve ek gelir elde etmenin popüler bir yoludur.
          </p>
        )
      },
      {
        title: "Net ve Brüt Faiz Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Hesaplama aracımızda da görebileceğiniz gibi, faiz kazancı iki aşamada değerlendirilir:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Brüt Faiz:</strong> Anaparanın, faiz oranının ve vadenin çarpılmasıyla bulunan, kesintiler yapılmamış ham kazançtır. Formülü: <code className="font-mono bg-gray-200 p-1 rounded">Anapara * (Faiz Oranı / 100) * (Vade Günü / 365)</code></li>
              <li><strong>Net Faiz:</strong> Brüt faiz üzerinden, devlet tarafından belirlenen oranda stopaj (gelir vergisi kesintisi) yapıldıktan sonra elinize geçen net kazançtır.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Vadeli mevduat hesabında stopaj oranı ne kadardır?",
        answer: "Mevduat faizi stopaj oranları, vadenin uzunluğuna ve para birimine göre değişiklik gösterebilir. Örneğin, 6 aya kadar vadeli TL hesaplarda bu oran genellikle %5 civarındadır. Ancak bu oranlar dönemsel olarak güncellenmektedir."
      },
      {
        question: "Paramı vadesinden önce çekersem ne olur?",
        answer: "Vadeli mevduat hesabındaki parayı vadesi dolmadan çekerseniz, genellikle o ana kadar işlemiş olan faiz hakkınızı kaybedersiniz ve sadece anaparanızı geri alabilirsiniz. Buna 'vade bozma' denir."
      },
      {
        question: "En yüksek faizi hangi banka veriyor?",
        answer: "Bankaların sunduğu mevduat faiz oranları sürekli olarak rekabete ve piyasa koşullarına göre değişmektedir. En güncel ve yüksek oranları bulmak için bankaların resmi web sitelerini düzenli olarak karşılaştırmak en doğru yöntemdir."
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
        resultTitle="Mevduat Getirisi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}