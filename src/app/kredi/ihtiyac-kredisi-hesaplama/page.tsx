import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult, TableData } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

export const metadata: Metadata = {
  title: "İhtiyaç Kredisi Hesaplama Aracı",
  description: "En uygun ihtiyaç kredisini bulun. Kredi tutarı, faiz oranı ve vade girerek aylık taksit, toplam geri ödeme ve faiz tutarını anında hesaplayın. Detaylı ödeme planınızı görün.",
  keywords: ["ihtiyaç kredisi hesaplama", "kredi hesaplama", "aylık taksit hesaplama", "ödeme planı"],
};

const inputFields: InputField[] = [
  { id: 'loanAmount', label: 'Kredi Tutarı (TL)', type: 'number', placeholder: '50000', defaultValue: 50000 },
  { id: 'interestRate', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: '3.5', defaultValue: 3.5 },
  { id: 'loanTerm', label: 'Vade (Ay)', type: 'number', placeholder: '24', defaultValue: 24 },
];

async function calculate(inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> {
    'use server';
    
    const loanAmount = Number(inputs.loanAmount);
    const monthlyInterestRate = Number(inputs.interestRate) / 100;
    const loanTerm = Number(inputs.loanTerm);

    if (isNaN(loanAmount) || loanAmount <= 0) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir kredi tutarı girin.' } } };
    }
    if (isNaN(monthlyInterestRate) || monthlyInterestRate <= 0) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir faiz oranı girin.' } } };
    }
    if (isNaN(loanTerm) || loanTerm <= 0) {
        return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir vade süresi girin.' } } };
    }

    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
    const totalPayment = monthlyPayment * loanTerm;
    const totalInterest = totalPayment - loanAmount;

    const summary: CalculationResult['summary'] = {
        monthlyPayment: { type: 'result', label: 'Aylık Taksit Tutarı', value: formatCurrency(monthlyPayment), isHighlighted: true },
        totalPayment: { type: 'info', label: 'Toplam Geri Ödeme', value: formatCurrency(totalPayment) },
        totalInterest: { type: 'info', label: 'Toplam Faiz Tutarı', value: formatCurrency(totalInterest) },
        loanAmount: { type: 'info', label: 'Kredi Tutarı', value: formatCurrency(loanAmount) },
    };
    
    const tableData: TableData = {
        headers: ["Taksit No.", "Aylık Taksit", "Anapara", "Faiz", "Kalan Anapara"],
        rows: []
    };
    
    let remainingPrincipal = loanAmount;
    for (let i = 1; i <= loanTerm; i++) {
        const interestPayment = remainingPrincipal * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingPrincipal -= principalPayment;

        tableData.rows.push([
            i,
            formatCurrency(monthlyPayment),
            formatCurrency(principalPayment),
            formatCurrency(interestPayment),
            formatCurrency(remainingPrincipal > 0 ? remainingPrincipal : 0)
        ]);
    }
      
    return { summary, table: tableData };
}

const content = {
  sections: [
    {
      title: "İhtiyaç Kredisi Nedir?",
      content: (
        <p>
          İhtiyaç kredisi, bireylerin eğitim, tatil, evlilik, beyaz eşya, teknoloji gibi çeşitli kişisel harcamalarını finanse etmek amacıyla bankalardan aldıkları bir tüketici kredisi türüdür. Genellikle diğer kredi türlerine göre daha kısa vadelidir ve daha esnek koşullar sunar. Kredi notunuz, gelir durumunuz ve bankanın politikaları, alabileceğiniz kredi miktarını ve faiz oranını doğrudan etkiler.
        </p>
      )
    },
    {
      title: "Kredi Hesaplaması Nasıl Yapılır?",
      content: (
        <p>
          Kredi taksitleri, anapara, faiz oranı ve vadeye göre belirlenen "Eşit Anapara Geri Ödemeli" (annuite) formülü ile hesaplanır. Aracımız bu formülü kullanarak aylık ödemelerinizi, toplam geri ödenecek tutarı ve ödeme planı tablosunu sizin için otomatik olarak oluşturur. Tabloda her ay ne kadar anapara ve ne kadar faiz ödediğinizi şeffaf bir şekilde görebilirsiniz.
        </p>
      )
    }
  ],
  faqs: [
    {
      question: "Aylık faiz oranı yerine yıllık faiz oranı biliyorsam ne yapmalıyım?",
      answer: "Eğer elinizdeki oran yıllık ise, bu oranı 12'ye bölerek yaklaşık aylık faiz oranını bulabilir ve hesaplayıcımıza girebilirsiniz. Ancak en doğru sonuç için bankanızdan aylık faiz oranını öğrenmeniz tavsiye edilir."
    },
    {
      question: "Kredi hesaplamasına hangi masraflar dahil değildir?",
      answer: "Bu hesaplama, kredi tahsis ücreti, hayat sigortası primi veya diğer ek masrafları içermez. Bu masraflar bankadan bankaya değişiklik gösterebilir ve toplam geri ödeme tutarınızı artırabilir. Bu nedenle, bankanızdan alacağınız 'Toplam Yıllık Maliyet Oranı'nı dikkate almanız önemlidir."
    }
  ]
};


export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="İhtiyaç Kredisi Hesaplama"
        description={
          <p className="text-sm text-gray-600">
            Kredi tutarı, aylık faiz oranı ve vade süresini girerek ödeme planınızı anında oluşturun.
          </p>
        }
        inputFields={inputFields} 
        calculate={calculate} 
        resultTitle="Kredi Özetiniz"
        tableTitle="Detaylı Ödeme Planı"
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}
