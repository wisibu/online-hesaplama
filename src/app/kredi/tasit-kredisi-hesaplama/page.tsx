import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const inputFields: InputField[] = [
  { id: 'loanAmount', label: 'Kredi Tutarı (₺)', type: 'number', placeholder: '250000' },
  { id: 'interestRate', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: '3.49' },
  { id: 'loanTerm', label: 'Vade (Ay)', type: 'number', placeholder: '36' },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
  'use server';
  const loanAmount = Number(inputs.loanAmount);
  const monthlyInterestRate = Number(inputs.interestRate) / 100;
  const loanTerm = Number(inputs.loanTerm);

  if (loanAmount <= 0 || monthlyInterestRate <= 0 || loanTerm <= 0) {
    return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları pozitif değerlerle doldurun.' } } };
  }

  const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
  const totalPayment = monthlyPayment * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  const summary: CalculationResult['summary'] = {
    monthlyPayment: { type: 'result', label: 'Aylık Taksit', value: formatCurrency(monthlyPayment), isHighlighted: true },
    totalPayment: { type: 'info', label: 'Toplam Geri Ödeme', value: formatCurrency(totalPayment) },
    totalInterest: { type: 'info', label: 'Toplam Faiz Tutarı', value: formatCurrency(totalInterest) },
  };

  return { summary };
}

const content = {
  sections: [
    {
      title: "Taşıt Kredisi Nasıl Hesaplanır?",
      content: (
        <p>
          Taşıt kredisi hesaplaması, standart bir tüketici kredisi formülü kullanılarak yapılır. Kredi tutarı, bankanın uyguladığı aylık faiz oranı ve seçtiğiniz vade süresi, aylık ödeyeceğiniz taksitleri ve toplam geri ödeme miktarını belirler. Hesaplama aracımız, bu üç temel bilgiyi kullanarak size net bir ödeme özeti sunar.
        </p>
      )
    }
  ],
  faqs: [
    {
      question: "0 km ve 2. el araçlar için kredi koşulları farklı mı?",
      answer: "Evet, genellikle farklıdır. Bankalar sıfır araçlar için daha uzun vadeler ve daha yüksek kredi tutarları sunabilirken, ikinci el araçlarda vade ve kredi oranı aracın yaşına göre (kasko değeri üzerinden) sınırlandırılabilir."
    },
    {
      question: "Taşıt kredisinde KDV ve ÖTV dahil mi?",
      answer: "Hayır, taşıt kredisi aracın vergiler dahil satış fiyatı üzerinden değil, sizin bankadan talep ettiğiniz anapara tutarı üzerinden hesaplanır. Faturadaki KDV ve ÖTV gibi vergiler, aracın maliyetinin bir parçasıdır ve peşinatla veya kredinin bir kısmıyla karşılanabilir."
    }
  ]
};

export const metadata: Metadata = {
  title: "Taşıt Kredisi Hesaplama (Araba Kredisi) | OnlineHesaplama",
  description: "En uygun taşıt kredisini bulun. 0 ve 2. el araba kredisi için tutar, faiz ve vade girerek aylık taksit ve toplam ödeme planınızı anında görün.",
  keywords: ["taşıt kredisi hesaplama", "araç kredisi", "araba kredisi", "kredi taksit hesaplama", "taşıt kredisi faiz oranları"],
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="Taşıt Kredisi Hesaplama"
        description={
          <p className="text-sm text-gray-600">
            Hayalinizdeki araba için kredi taksitlerinizi ve toplam geri ödeme tutarını kolayca hesaplayın.
          </p>
        }
        inputFields={inputFields}
        calculate={calculate}
        resultTitle="Taşıt Kredisi Özetiniz"
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}
