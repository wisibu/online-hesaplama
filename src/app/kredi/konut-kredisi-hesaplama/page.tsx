import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { calculateLoanDetails } from '@/utils/financial';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const inputFields: InputField[] = [
  { id: 'loanAmount', label: 'Kredi Tutarı (TL)', type: 'number', defaultValue: 2000000, props: { min: "10000" } },
  { id: 'loanTerm', label: 'Vade (Yıl)', type: 'select', options: [
    { value: '5', label: '5 Yıl' },
    { value: '10', label: '10 Yıl' },
    { value: '15', label: '15 Yıl' },
    { value: '20', label: '20 Yıl' },
  ], defaultValue: '10' },
  { id: 'interestRate', label: 'Aylık Faiz Oranı (%)', type: 'number', defaultValue: 3.5, props: { min: "0.1", step: "0.01" } },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
    'use server';
    
    const principal = Number(inputs.loanAmount);
    const termInYears = Number(inputs.loanTerm);
    const monthlyInterestRate = Number(inputs.interestRate) / 100;

    if (isNaN(principal) || isNaN(termInYears) || isNaN(monthlyInterestRate) || principal <= 0 || termInYears <= 0 || monthlyInterestRate <= 0) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanlara geçerli ve pozitif değerler girin.' } } };
    }
    
    const termInMonths = termInYears * 12;
    const { monthlyPayment, totalPayment, totalInterest, paymentSchedule } = calculateLoanDetails(principal, monthlyInterestRate, termInMonths);

    const summary: CalculationResult['summary'] = {
        monthlyPayment: { type: 'result', label: 'Aylık Taksit', value: formatCurrency(monthlyPayment), isHighlighted: true },
        totalPayment: { type: 'info', label: 'Toplam Geri Ödeme', value: formatCurrency(totalPayment) },
        totalInterest: { type: 'info', label: 'Toplam Faiz', value: formatCurrency(totalInterest) },
        loanAmount: { type: 'info', label: 'Kredi Tutarı', value: formatCurrency(principal) },
    };
      
    return { 
      summary, 
      table: {
        headers: ['Ay', 'Taksit Tutarı', 'Anapara', 'Faiz', 'Kalan Anapara'],
        rows: paymentSchedule
      } 
    };
}

const content = {
  sections: [
    {
      title: "Konut Kredisi Nedir?",
      content: (
        <p>
          Konut kredisi (mortgage), bireylerin ev sahibi olmalarını sağlamak amacıyla bankalar tarafından sunulan uzun vadeli bir finansman türüdür. Genellikle satın alınacak evin teminat (ipotek) olarak gösterilmesiyle kullanılır. Konut kredileri, yüksek tutarlı olmaları nedeniyle 5, 10, 15, 20 yıl gibi uzun vadelere yayılır ve bu sayede aylık ödemeler daha yönetilebilir hale gelir. Kredi faiz oranları, vade süresi ve kredi tutarı gibi faktörler, ödenecek toplam tutarı doğrudan etkiler.
        </p>
      )
    }
  ],
  faqs: [
    {
      question: "Konut kredisi başvurusunda genellikle hangi belgeler istenir?",
      answer: "Başvuru sırasında genellikle kimlik belgesi, gelir belgesi (maaş bordrosu, vergi levhası vb.), ikametgah belgesi ve satın alınacak konutun tapu fotokopisi gibi belgeler istenir. Bankalar ek belgeler talep edebilir."
    },
    {
      question: "Ekspertiz (Değerleme) Raporu neden önemlidir?",
      answer: "Ekspertiz raporu, bankanın satın alınacak konutun gerçek değerini belirlemesi için zorunludur. Banka, kredi tutarını bu raporda belirtilen değerin genellikle %75-90'ı arasında bir oranla sınırlar. Ekspertiz ücreti genellikle kredi başvurusunda bulunan kişi tarafından karşılanır."
    },
     {
      question: "Konut kredisinde faiz oranları sabit midir?",
      answer: "Türkiye'de konut kredileri genellikle sabit faizli olarak sunulur. Bu, kredi vadesi boyunca aylık taksitlerinizin ve faiz oranınızın değişmeyeceği anlamına gelir, bu da bütçenizi daha öngörülebilir kılar. Ancak bazı bankalar değişken faizli seçenekler de sunabilir."
    }
  ]
};

export const metadata: Metadata = {
  title: "Konut Kredisi Hesaplama | Kredi Taksit & Faiz Oranları",
  description: "En uygun konut kredisi için taksit, faiz ve toplam geri ödeme tutarını hesaplayın. 10, 15, 20 yıl vade seçenekleriyle ev kredinizi planlayın.",
  keywords: ["konut kredisi hesaplama", "ev kredisi", "kredi taksit hesaplama", "konut kredisi faiz oranları", "mortgage hesaplama"],
  openGraph: {
    title: "Konut Kredisi Hesaplama | Kredi Taksit & Faiz Oranları",
    description: "En uygun konut kredisi için taksit, faiz ve toplam geri ödeme tutarını hesaplayın. 10, 15, 20 yıl vade seçenekleriyle ev kredinizi planlayın.",
  },
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="Konut Kredisi Hesaplama"
        description={
          <p className="text-sm text-gray-600">
            Çekmek istediğiniz kredi tutarını, vadeyi ve aylık faiz oranını girerek ödeme planınızı anında oluşturun.
          </p>
        }
        inputFields={inputFields}
        calculate={calculate}
        resultTitle="Konut Kredisi Ödeme Planı"
        tableTitle="Detaylı Ödeme Tablosu"
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}
