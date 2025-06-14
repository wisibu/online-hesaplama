import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult, TableData } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const inputFields: InputField[] = [
  { id: 'amount', label: 'İşlem Tutarı (₺)', type: 'number', placeholder: '1000' },
  { id: 'interestRate', label: 'Aylık Faiz Oranı (%)', type: 'number', placeholder: '3.5' },
  { id: 'installments', label: 'Taksit Sayısı', type: 'number', placeholder: '9' },
];

async function calculate(inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> {
  'use server';
  const amount = Number(inputs.amount);
  const monthlyRate = Number(inputs.interestRate) / 100;
  const installments = Number(inputs.installments);

  if ([amount, monthlyRate, installments].some(v => isNaN(v) || v <= 0)) {
    return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen tüm alanlara pozitif değerler girin.' } } };
  }
  
  // Taksitlendirme genellikle basit faiz üzerinden KKDF ve BSMV eklenerek yapılır.
  // Ancak bankalar genellikle kendi tablolarını yayınlar. Buradaki hesaplama bir yaklaşımdır.
  // Aylık taksit formülü: Anapara * (Faiz * (1 + Faiz)^Taksit) / ((1 + Faiz)^Taksit - 1)
  const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, installments)) / (Math.pow(1 + monthlyRate, installments) - 1);
  const totalPayment = monthlyPayment * installments;
  const totalInterest = totalPayment - amount;

  const summary: CalculationResult['summary'] = {
    monthlyPayment: { type: 'result', label: 'Aylık Taksit Tutarı', value: formatCurrency(monthlyPayment), isHighlighted: true },
    totalPayment: { type: 'info', label: 'Toplam Geri Ödeme', value: formatCurrency(totalPayment) },
    totalInterest: { type: 'info', label: 'Toplam Faiz Maliyeti', value: formatCurrency(totalInterest) },
  };

  const table: TableData = {
    headers: ["Ay", "Aylık Taksit", "Kalan Anapara"],
    rows: []
  };

  let remainingPrincipal = amount;
  for (let i = 1; i <= installments; i++) {
    const interestForMonth = remainingPrincipal * monthlyRate;
    const principalForMonth = monthlyPayment - interestForMonth;
    remainingPrincipal -= principalForMonth;
    table.rows.push([
        i,
        formatCurrency(monthlyPayment),
        formatCurrency(Math.max(0, remainingPrincipal))
    ]);
  }
  
  return { summary, table };
}

const content = {
  sections: [
    {
      title: "Kredi Kartı İşlem Taksitlendirme Nedir?",
      content: (
        <>
          <p>
            Kredi kartı ile yapılan peşin alışverişlerin, işlem sonrasında bankanın belirlediği faiz oranı ve vade seçenekleri ile taksitlere bölünmesi işlemine "sonradan taksitlendirme" veya "işlem taksitlendirme" denir. Bu hizmet, yüksek tutarlı harcamaları bütçenizi zorlamadan ödemenize olanak tanır.
          </p>
          <p className="mt-2">
            Bankalar genellikle mobil uygulamaları veya internet bankacılığı üzerinden bu işlemi yapma imkanı sunar. Taksitlendirme işlemi için genellikle bir alt ve üst harcama limiti bulunur ve her bankanın faiz oranı farklılık gösterebilir. Bu hesaplayıcı, seçeceğiniz koşullara göre oluşacak maliyeti önceden görmenizi sağlar.
          </p>
        </>
      )
    }
  ],
  faqs: [
    {
      question: "Her harcama taksitlendirilebilir mi?",
      answer: "Hayır. Yasal düzenlemeler gereği telekomünikasyon, gıda, akaryakıt, hediye kartı gibi bazı sektörlerde yapılan harcamalar genellikle taksitlendirilemez. Taksitlendirme yapılabilen harcamalar ve güncel koşullar için bankanızla iletişime geçmeniz en doğrusudur."
    },
    {
      question: "İşlem taksitlendirmenin maliyeti nedir?",
      answer: "Taksitlendirmenin maliyeti, bankanızın uyguladığı aylık akdi faiz oranıdır. Bu faiz oranına ek olarak Kaynak Kullanımını Destekleme Fonu (KKDF) ve Banka ve Sigorta Muameleleri Vergisi (BSMV) de aylık taksit tutarına dahil edilir. Hesaplayıcımızdaki faiz oranı tüm bu maliyetleri içeren nihai oran olarak düşünülmelidir."
    }
  ]
};

export const metadata: Metadata = {
  title: "Kredi Kartı İşlem Taksitlendirme Hesaplama | OnlineHesaplama",
  description: "Kredi kartınızla yaptığınız peşin alışverişleri sonradan nasıl taksitlendirebileceğinizi ve maliyetini anında hesaplayın. Aylık taksiti ve toplam geri ödemeyi görün.",
  keywords: ["kredi kartı taksitlendirme", "sonradan taksitlendirme", "işlem taksitlendirme", "ek taksit hesaplama", "kredi kartı faiz"],
  openGraph: {
    title: "Kredi Kartı İşlem Taksitlendirme Hesaplama | OnlineHesaplama",
    description: "Kredi kartınızla yaptığınız peşin alışverişleri sonradan nasıl taksitlendirebileceğinizi ve maliyetini anında hesaplayın. Aylık taksiti ve toplam geri ödemeyi görün.",
  },
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title="Kredi Kartı Alışveriş Taksitlendirme Hesaplama"
        description={
          <p className="text-sm text-gray-600">
            Peşin yaptığınız harcamanın tutarını, bankanın uyguladığı aylık faiz oranını ve istediğiniz taksit sayısını girerek maliyetini hesaplayın.
          </p>
        }
        inputFields={inputFields} 
        calculate={calculate} 
        resultTitle="Taksitlendirme Sonucu"
        tableTitle="Ödeme Planı"
      />
      <RichContent sections={content.sections} faqs={content.faqs} />
    </>
  );
}