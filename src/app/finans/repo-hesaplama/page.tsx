import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Repo Getirisi Hesaplama (Net/Brüt) | OnlineHesaplama",
  description: "Repo yatırımınızın vade sonu net ve brüt getirisini anında hesaplayın. Anapara, faiz oranı ve vade süresini girerek repo kazancınızı öğrenin.",
  keywords: ["repo hesaplama", "repo getirisi", "gecelik repo", "repo faizi"],
  calculator: {
    title: "Repo Getirisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Repo yatırımınızın vade sonunda ne kadar getiri sağlayacağını hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Anapara Tutarı (₺)', type: 'number', placeholder: '100000' },
      { id: 'interestRate', label: 'Yıllık Faiz Oranı (%)', type: 'number', placeholder: '50' },
      { id: 'term', label: 'Vade (Gün)', type: 'number', placeholder: '7' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const principal = Number(inputs.principal);
      const annualInterestRate = Number(inputs.interestRate) / 100;
      const termDays = Number(inputs.term);

      if (principal <= 0 || annualInterestRate <= 0 || termDays <= 0) {
        return null;
      }
      
      const grossIncome = (principal * annualInterestRate / 365) * termDays;
      // Repo gelirinden %15 stopaj kesilir.
      const taxRate = 0.15;
      const taxAmount = grossIncome * taxRate;
      const netIncome = grossIncome - taxAmount;
      const totalAmount = principal + netIncome;

      const summary: CalculationResult['summary'] = {
        total: { type: 'result', label: 'Vade Sonu Tutar', value: formatCurrency(totalAmount), isHighlighted: true },
        net: { type: 'result', label: 'Net Getiri', value: formatCurrency(netIncome) },
        gross: { type: 'info', label: 'Brüt Getiri', value: formatCurrency(grossIncome) },
        tax: { type: 'info', label: `Stopaj Kesintisi (%${taxRate * 100})`, value: formatCurrency(taxAmount) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Repo Nedir?",
        content: (
          <p>
            Repo (Repurchase Agreement), genellikle kısa vadeli bir menkul kıymetin (örneğin devlet tahvili) geri alım vaadiyle satılmasına dayanan bir yatırım aracıdır. Yatırımcı, menkul kıymeti belirli bir süreliğine bankaya satar ve vade sonunda önceden anlaşılan daha yüksek bir fiyattan geri alır. Aradaki fiyat farkı, yatırımcının faiz gelirini oluşturur. Düşük riskli ve kısa vadeli bir yatırım olarak kabul edilir.
          </p>
        )
      },
      {
        title: "Repo Getirisi Nasıl Hesaplanır?",
        content: (
          <p>
            Repo getirisi, anapara, yıllık faiz oranı ve vade gün sayısı kullanılarak basit faiz formülü ile hesaplanır. Elde edilen brüt getiri üzerinden %15 oranında stopaj (kaynakta kesilen vergi) uygulanır ve kalan tutar net getiriyi oluşturur.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Repo yatırımının riski var mıdır?",
        answer: "Repo, genellikle devlet tahvili gibi düşük riskli menkul kıymetlere dayandığı için en güvenli yatırım araçlarından biri olarak kabul edilir. En büyük risk, işlemi yaptığınız bankanın veya aracı kurumun yükümlülüğünü yerine getirememesidir, ancak bu çok düşük bir ihtimaldir."
      },
      {
        question: "Gecelik repo ne anlama gelir?",
        answer: "Gecelik repo, vadesi sadece bir gün olan repo işlemidir. Genellikle büyük kurumlar ve bankalar tarafından nakit fazlalarını bir geceliğine değerlendirmek için kullanılır. Ertesi iş günü anapara ve faiz geri ödenir."
      },
      {
        question: "Repo getirisinin vergisi ne kadardır?",
        answer: "Repo kazançları üzerinden standart olarak %15 oranında Gelir Vergisi stopajı (kesintisi) yapılır. Bu vergi, faiz geliri hesabınıza yatmadan önce banka tarafından kesilir ve devlete ödenir. Sizin ek bir beyanname vermenize gerek kalmaz."
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
        resultTitle="Repo Getirisi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}