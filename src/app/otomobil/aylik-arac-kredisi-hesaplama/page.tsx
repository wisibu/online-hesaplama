import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';
import { calculateLoanDetails } from '@/utils/financial';

const pageConfig = {
  title: "Taşıt (Araç) Kredisi Hesaplama | OnlineHesaplama",
  description: "En uygun taşıt kredisini bulun! Kredi tutarı, vade ve faiz oranını girerek aylık taksit, toplam geri ödeme ve faiz maliyetinizi anında hesaplayın.",
  keywords: ["taşıt kredisi hesaplama", "araç kredisi", "otomobil kredisi", "kredi taksit hesaplama"],
  calculator: {
    title: "Taşıt Kredisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Hayalinizdeki araca ne kadar ödeyeceğinizi öğrenmek için kredi bilgilerini girin.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Kredi Tutarı (TL)', type: 'number', placeholder: '500000' },
      { id: 'interestRate', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: '3.5' },
      { id: 'term', label: 'Vade (Ay)', type: 'number', placeholder: '36' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const principal = Number(inputs.principal);
        const interestRate = Number(inputs.interestRate);
        const term = Number(inputs.term);

        if (isNaN(principal) || isNaN(interestRate) || isNaN(term) || principal <= 0 || interestRate <= 0 || term <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları pozitif değerlerle doldurun.' } } };
        }

        const { monthlyPayment, totalPayment, totalInterest, paymentSchedule } = calculateLoanDetails(principal, interestRate, term);

        const summary = {
            monthlyPayment: { label: 'Aylık Taksit Tutarı', value: formatCurrency(monthlyPayment), isHighlighted: true },
            totalPayment: { label: 'Toplam Geri Ödeme', value: formatCurrency(totalPayment) },
            totalInterest: { label: 'Toplam Faiz Tutarı', value: formatCurrency(totalInterest) },
            principal: { label: 'Kredi Tutarı', value: formatCurrency(principal) },
        };
        
        const table = {
            title: "Ödeme Planı",
            headers: ["Ay", "Taksit Tutarı", "Anapara", "Faiz", "Kalan Anapara"],
            rows: paymentSchedule,
        };
          
        return { summary, table };
    },
  },
  content: {
    sections: [
      {
        title: "Taşıt Kredisi Nasıl Hesaplanır?",
        content: (
          <p>
            Taşıt kredisi hesaplaması, standart bir anüite (eşit taksitli) kredi formülü kullanılarak yapılır. Bu formülde, çektiğiniz anapara (kredi tutarı), bankanın uyguladığı aylık faiz oranı ve ödeme yapacağınız ay sayısı (vade) dikkate alınır. Hesaplayıcımız, bu üç temel bilgiyi kullanarak aylık taksitlerinizi, ödeyeceğiniz toplam faizi ve vade sonundaki toplam geri ödeme tutarınızı sizin için otomatik olarak bulur ve detaylı bir ödeme planı tablosu oluşturur.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Taşıt kredisinde vade sınırı var mıdır?",
        answer: "Evet, BDDK (Bankacılık Düzenleme ve Denetleme Kurumu) tarafından belirlenen vade sınırları bulunmaktadır. Bu sınırlar genellikle aracın fatura değerine göre değişir. Örneğin, belirli bir tutarın altındaki araçlar için daha uzun vadeler (örn. 48 ay) mümkünken, daha pahalı araçlar için vadeler kısalmaktadır."
      },
      {
        question: "Kasko ve sigorta masrafları bu hesaba dahil mi?",
        answer: "Hayır, bu hesaplama sadece anapara ve faiz üzerinden yapılan temel kredi geri ödemesini gösterir. Kredi kullanım sürecinde zorunlu tutulabilen kasko, hayat sigortası ve diğer dosya masrafları bankadan bankaya değişiklik gösterebilir ve bu hesaplamaya dahil değildir."
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
        resultTitle="Taşıt Kredisi Detayları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 