import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency, formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Net Bugünkü Değer (NBD) Hesaplama | OnlineHesaplama",
  description: "Yatırımınızın gelecekteki nakit akışlarının bugünkü değerini (NBD) hesaplayın. Proje ve yatırım karlılığını analiz etmek için NBD'yi kullanın.",
  keywords: ["net bugünkü değer hesaplama", "nbd hesaplama", "npv calculator", "proje değerleme", "nakit akışı iskontolama"],
  calculator: {
    title: "Net Bugünkü Değer (NBD) Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Bir yatırım projesinin bugünkü net değerini, gelecekteki nakit akışlarını ve iskonto oranını kullanarak hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'initialInvestment', label: 'Başlangıç Yatırımı (₺)', type: 'number', placeholder: '100000' },
      { id: 'cashFlows', label: 'Nakit Akışları (Yıllık, virgülle ayırın)', type: 'text', placeholder: '20000, 30000, 40000, 50000' },
      { id: 'discountRate', label: 'İskonto Oranı (%)', type: 'number', placeholder: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const initialInvestment = Number(inputs.initialInvestment);
      const cashFlowsRaw = String(inputs.cashFlows);
      const discountRate = Number(inputs.discountRate) / 100;

      if (initialInvestment < 0 || discountRate <= 0 || !cashFlowsRaw) {
        return null;
      }

      const cashFlows = cashFlowsRaw.split(',').map(cf => parseFloat(cf.trim()));
      if (cashFlows.some(isNaN)) {
          // You can return an error message to be displayed in the UI
          return null;
      }
      
      let npv = -initialInvestment;
      const rows = [[0, 'Başlangıç Yatırımı', '', `-${formatCurrency(initialInvestment)}`, formatCurrency(npv)]];

      cashFlows.forEach((cashFlow, index) => {
        const period = index + 1;
        const presentValue = cashFlow / Math.pow(1 + discountRate, period);
        npv += presentValue;

        rows.push([
            period,
            formatCurrency(cashFlow),
            formatNumber(Math.pow(1 + discountRate, period)),
            formatCurrency(presentValue),
            formatCurrency(npv)
        ]);
      });

      const summary: CalculationResult['summary'] = {
        npv: { type: 'result', label: 'Net Bugünkü Değer (NBD)', value: formatCurrency(npv), isHighlighted: true },
        decision: { type: 'result', label: 'Yatırım Kararı', value: npv > 0 ? 'Kabul Edilebilir ✅' : 'Kabul Edilemez ❌' },
      };
      
      const table = {
        title: "Nakit Akışı Analizi",
        headers: ["Dönem", "Nakit Akışı", "İskonto Faktörü", "Bugünkü Değer", "Kümülatif NBD"],
        rows: rows,
      };

      return { summary, table };
    },
  },
  content: {
    sections: [
      {
        title: "Net Bugünkü Değer (NBD) Nedir?",
        content: (
          <p>
            Net Bugünkü Değer (NBD), bir yatırım projesinin gelecekte sağlaması beklenen net nakit akışlarının, belirli bir iskonto oranıyla bugünkü değerine indirgenmesi ve bu toplamdan başlangıç yatırım maliyetinin çıkarılmasıyla elde edilen bir finansal metriktir. Paranın zaman değerini (bugünkü bir liranın gelecekteki bir liradan daha değerli olduğu prensibi) dikkate alır.
          </p>
        )
      },
      {
        title: "NBD Nasıl Yorumlanır?",
        content: (
          <>
            <p>
              NBD'nin yorumlanması oldukça basittir:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>NBD {'>'} 0:</strong> Proje, beklenen getiri oranından (iskonto oranı) daha fazlasını kazandırmaktadır. Yatırım kabul edilebilir.</li>
              <li><strong>NBD = 0:</strong> Proje, tam olarak beklenen getiri oranını sağlamaktadır. Yatırımcının kararsız kalabileceği bir durumdur.</li>
              <li><strong>NBD {'<'} 0:</strong> Proje, beklenen getiri oranını karşılayamamaktadır. Yatırım reddedilmelidir.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "İskonto oranı ne anlama gelir ve nasıl belirlenir?",
        answer: "İskonto oranı, gelecekteki nakit akışlarının riskini ve paranın zaman değerini yansıtan bir getiri oranıdır. Genellikle şirketin sermaye maliyeti veya yatırımcının benzer riskteki alternatif yatırımlardan beklediği minimum getiri oranı olarak belirlenir."
      },
      {
        question: "NBD'nin İç Verim Oranı (IRR) ile farkı nedir?",
        answer: "NBD, projenin yarattığı mutlak değeri (örneğin, 15.000 ₺) gösterirken, İç Verim Oranı (IRR) projenin oransal getirisini (örneğin, %18) gösterir. NBD, projenin büyüklüğünü dikkate aldığı için genellikle daha üstün bir sermaye bütçeleme tekniği olarak kabul edilir."
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
        resultTitle="Net Bugünkü Değer Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}