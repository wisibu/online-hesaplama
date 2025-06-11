import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "AKS Puan Hesaplama (Adaylık Kaldırma Sınavı) | OnlineHesaplama",
  description: "Adaylık Kaldırma Sınavı (AKS) için doğru ve yanlış sayılarınızı girerek sınav puanınızı ve başarı durumunuzu anında hesaplayın.",
  keywords: ["aks puan hesaplama", "adaylık kaldırma sınavı", "meb aks", "aks sınav puanı"],
  calculator: {
    title: "Adaylık Kaldırma Sınavı (AKS) Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Sınavdaki doğru ve yanlış cevap sayılarınızı girerek puanınızı hesaplayın. (Toplam 100 soru üzerinden)
      </p>
    ),
    inputFields: [
      { id: 'correct', label: 'Doğru Sayısı', type: 'number', placeholder: '75' },
      { id: 'incorrect', label: 'Yanlış Sayısı', type: 'number', placeholder: '15' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const correct = Number(inputs.correct);
      const incorrect = Number(inputs.incorrect);
      const totalQuestions = 100;
      
      if (isNaN(correct) || isNaN(incorrect) || correct < 0 || incorrect < 0 || (correct + incorrect > totalQuestions)) {
        return { summary: { error: { label: 'Hata', value: 'Doğru ve yanlış sayıları toplamı 100\'ü geçemez.' } } };
      }

      // AKS'de 3 yanlış 1 doğruyu götürür.
      const netCorrect = correct - (incorrect / 3);
      // Her soru 1 puandır.
      const score = Math.max(0, netCorrect); 
      const successScore = 60;
      
      const summary = {
        score: { label: 'AKS Puanınız', value: formatNumber(score, 2), isHighlighted: true },
        netCorrect: { label: 'Net Doğru Sayısı', value: formatNumber(netCorrect, 2) },
        status: { label: 'Başarı Durumu', value: score >= successScore ? 'Başarılı ✅' : 'Başarısız ❌' },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "AKS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Adaylık Kaldırma Sınavı (AKS), öğretmen adaylarının asil öğretmenliğe geçişi için girdikleri bir sınavdır. Sınavda toplam 100 soru bulunur ve her soru 1 puan değerindedir.
            </p>
            <p className="mt-2">
              Puan hesaplamasında standart "3 yanlış 1 doğruyu götürür" kuralı uygulanır. Bu kurala göre, net doğru sayınız şu şekilde hesaplanır: <br/>
              <strong>Net Doğru = Toplam Doğru Sayısı - (Toplam Yanlış Sayısı / 3)</strong>
            </p>
            <p className="mt-2">
              Hesaplanan net doğru sayısı, doğrudan sizin sınav puanınızdır. Sınavdan başarılı sayılmak için en az <strong>60 puan</strong> almanız gerekmektedir. Bu hesaplayıcı, tüm bu işlemleri sizin için otomatik olarak yapar.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Boş bıraktığım sorular puanımı etkiler mi?",
        answer: "Hayır, boş bırakılan sorular puan hesaplamasına dahil edilmez. Ne doğru ne de yanlış sayınızı etkilerler."
      },
      {
        question: "Sınavda baraj puanı kaçtır?",
        answer: "Adaylık Kaldırma Sınavı'nda başarılı olmak için adayların 100 tam puan üzerinden en az 60 puan almaları gerekmektedir."
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
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}