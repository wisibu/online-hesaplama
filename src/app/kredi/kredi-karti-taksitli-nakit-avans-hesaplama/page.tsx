import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const inputFields: InputField[] = [
  { id: 'amount', label: 'Nakit Avans Tutarı (₺)', type: 'number', placeholder: '5000' },
  { id: 'interestRate', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: '4.42' },
  { id: 'term', label: 'Vade (Ay)', type: 'number', placeholder: '12' },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
  'use server';
  const amount = Number(inputs.amount);
  const interestRate = Number(inputs.interestRate) / 100;
  const term = Number(inputs.term);

  if (amount <= 0 || interestRate <= 0 || term <= 0) {
    return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanları pozitif değerlerle doldurun.' } } };
  }

  // Calculation is the same as a standard loan
  const monthlyPayment = amount * (interestRate * Math.pow(1 + interestRate, term)) / (Math.pow(1 + interestRate, term) - 1);
  const totalPayment = monthlyPayment * term;
  const totalInterest = totalPayment - amount;
  
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
          title: "Taksitli Nakit Avans Nedir?",
          content: (
              <p>
                  Taksitli nakit avans, kredi kartı limitiniz dahilinde, acil nakit ihtiyaçlarınızı karşılamak için bankanızın sunduğu bir tür anında kredidir. Çektiğiniz tutar, belirlediğiniz taksit sayısına bölünür ve aylık faiz oranı eklenerek kredi kartı ekstrenize taksitler halinde yansıtılır. Faiz oranları genellikle ihtiyaç kredilerinden daha yüksek olabilir.
              </p>
          )
      }
  ],
  faqs: [
      {
          question: "Nakit avans faizi nasıl belirlenir?",
          answer: "Nakit avans faiz oranları, Türkiye Cumhuriyet Merkez Bankası (TCMB) tarafından belirlenen azami akdi faiz oranını geçemez. Bankalar bu tavan oran veya altında bir oran belirlemekte serbesttir."
      },
      {
          question: "Taksitli nakit avans kullanmak kredi notumu etkiler mi?",
          answer: "Taksitli nakit avans kullanmak doğrudan kredi notunuzu düşürmez. Ancak, taksitlerinizi zamanında ve düzenli olarak ödemeniz çok önemlidir. Ödemelerde yaşanacak gecikmeler, kredi kartı borcunuzu geciktirmekle aynı etkiyi yaratır ve kredi notunuzu olumsuz etkiler."
      }
  ]
};

export const metadata: Metadata = {
  title: "Taksitli Nakit Avans Hesaplama | OnlineHesaplama",
  description: "Kredi kartınızdan çekeceğiniz taksitli nakit avansın aylık taksitlerini, toplam geri ödeme tutarını ve faiz maliyetini anında hesaplayın.",
  keywords: ["taksitli nakit avans hesaplama", "nakit avans faizi", "kredi kartı nakit çekim", "aylık taksit hesaplama"],
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="Taksitli Nakit Avans Hesaplama"
        description={
          <p className="text-sm text-gray-600">
            Kredi kartınızdan çekeceğiniz taksitli nakit avansın aylık taksitlerini ve toplam geri ödeme tutarını hesaplayın.
          </p>
        }
        inputFields={inputFields}
        calculate={calculate}
        resultTitle="Nakit Avans Özetiniz"
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}