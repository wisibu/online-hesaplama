import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const inputFields: InputField[] = [
  { id: 'unpaidInstallment', label: 'Ödenmeyen Taksit Tutarı (₺)', type: 'number', placeholder: '1500' },
  { id: 'contractualInterest', label: 'Aylık Akdi Faiz Oranı (%)', type: 'number', placeholder: '3.5' },
  { id: 'daysOverdue', label: 'Gecikme Süresi (Gün)', type: 'number', placeholder: '30' },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
  'use server';
  const unpaidInstallment = Number(inputs.unpaidInstallment);
  const contractualInterest = Number(inputs.contractualInterest) / 100;
  const daysOverdue = Number(inputs.daysOverdue);

  if (unpaidInstallment <= 0 || contractualInterest <= 0 || daysOverdue <= 0) {
    return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanlara pozitif değerler girin.' } } };
  }

  // Gecikme faizi, akdi faizin %30 fazlasını geçemez.
  const maxDelayInterestRate = contractualInterest * 1.30;
  const dailyDelayRate = maxDelayInterestRate / 30; // Günlük faiz
  const delayInterestAmount = unpaidInstallment * dailyDelayRate * daysOverdue;
  
  const summary: CalculationResult['summary'] = {
    delayInterest: { type: 'result', label: 'Hesaplanan Gecikme Faizi', value: formatCurrency(delayInterestAmount), isHighlighted: true },
    delayRate: { type: 'info', label: 'Aylık Gecikme Faizi Oranı', value: `%${(maxDelayInterestRate * 100).toFixed(2)}` },
  };

  return { summary };
}

const content = {
  sections: [
      {
          title: "Kredi Gecikme Faizi Nedir ve Nasıl Hesaplanır?",
          content: (
              <p>
                  Kredi gecikme faizi, vadesi geçmiş kredi borçlarına uygulanan yasal bir faiz türüdür. Tüketici kredilerinde gecikme faizi, sözleşmede belirtilen akdi (normal) faiz oranının en fazla %30 fazlası olabilir. Hesaplama, ödenmeyen taksit tutarı üzerinden, gecikme faizi oranının gün sayısına bölünmesiyle elde edilen günlük oran kullanılarak yapılır. Bu hesaplayıcı, bu yasal sınıra göre maksimum gecikme faizini gösterir.
              </p>
          )
      }
  ],
  faqs: [
      {
          question: "Kredi taksitini bir gün geciktirirsem ne olur?",
          answer: "Bir günlük gecikme için bile yasal olarak gecikme faizi işletilebilir. Ancak bankaların uygulamaları farklılık gösterebilir. Sürekli gecikmeler kredi notunuzu (findeks) ciddi şekilde düşürür."
      },
      {
          question: "Gecikme faizi dışında başka bir ücret alınır mı?",
          answer: "Bankalar, borcun tahsili için yapılan masrafları (örneğin ihtarname gönderme ücreti) talep edebilir. Uzun süreli gecikmelerde ise yasal takip süreci başlayabilir ve bu da ek avukatlık ve icra masraflarına yol açabilir."
      }
  ]
};

export const metadata: Metadata = {
  title: "Kredi Gecikme Faizi Hesaplama | OnlineHesaplama",
  description: "Ödenmeyen kredi taksitleriniz için uygulanacak yasal gecikme faizi tutarını kolayca hesaplayın. Akdi faiz oranını girerek sonucu görün.",
  keywords: ["kredi gecikme faizi hesaplama", "gecikme faizi", "kredi borcu gecikmesi", "akdi faiz"],
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="Kredi Gecikme Faizi Hesaplama"
        description={
          <p className="text-sm text-gray-600">
            Ödemediğiniz kredi taksitleriniz için uygulanacak yasal gecikme faizi tutarını hesaplayın.
          </p>
        }
        inputFields={inputFields} 
        calculate={calculate} 
        resultTitle="Gecikme Faizi Sonucu"
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}