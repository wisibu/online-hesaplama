import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "YDS Puan Hesaplama (Yabancı Dil Sınavı) | OnlineHesaplama",
  description: "Yabancı Dil Bilgisi Seviye Tespit Sınavı (YDS) için doğru cevap sayınızı girerek anında 100'lük sistemdeki puanınızı hesaplayın.",
  keywords: ["yds puan hesaplama", "yabancı dil sınavı", "yds puanı", "e-yds puan hesaplama"],
  calculator: {
    title: "YDS Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Toplam 80 soruluk sınavda yaptığınız doğru sayısını girin.
      </p>
    ),
    inputFields: [
      { id: 'correct', label: 'Doğru Cevap Sayısı', type: 'number', placeholder: '65' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const correct = Number(inputs.correct);
      const totalQuestions = 80;
      
      if (isNaN(correct) || correct < 0 || correct > totalQuestions) {
        return { summary: { error: { type: 'error', label: 'Hata', value: `Doğru sayısı 0 ile ${totalQuestions} arasında olmalıdır.` } } };
      }

      // Her doğru cevap 1.25 puandır. Yanlışlar doğruyu götürmez.
      const score = correct * 1.25;
      
      const summary: CalculationResult['summary'] = {
        score: { type: 'result', label: 'YDS Puanınız', value: formatNumber(score), isHighlighted: true },
        correct: { type: 'info', label: 'Doğru Cevap Sayısı', value: formatNumber(correct) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "YDS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Yabancı Dil Bilgisi Seviye Tespit Sınavı (YDS), ÖSYM tarafından düzenlenen merkezi bir yabancı dil sınavıdır. Akademik kadro başvurularından kamu personeli dil tazminatına kadar birçok alanda kullanılmaktadır.
            </p>
            <p className="mt-2">
              Puanlama sistemi oldukça basittir ve 100 tam puan üzerinden değerlendirilir:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Sınavda toplam <strong>80 soru</strong> bulunur.</li>
              <li>Her bir doğru cevap <strong>1.25 puan</strong> değerindedir (100 / 80 = 1.25).</li>
              <li>Yanlış cevaplar doğru cevapları <strong>etkilemez</strong> (yanlışlar doğruyu götürmez).</li>
              <li>Puanınız, <strong>Doğru Sayısı x 1.25</strong> formülü ile kolayca hesaplanır.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "YDS puanının geçerlilik süresi ne kadardır?",
        answer: "YDS puanının geçerlilik süresi kurumdan kuruma değişmekle birlikte, akademik kadro başvuruları için süresiz geçerlidir. Ancak, kamu kurum ve kuruluşları genellikle son 5 yıl içinde alınmış puanları kabul etmektedir."
      },
      {
        question: "e-YDS ile YDS arasında puanlama farkı var mı?",
        answer: "Hayır, e-YDS (Elektronik Yabancı Dil Sınavı) ile basılı ortamda yapılan YDS arasında soru sayısı ve puanlama açısından hiçbir fark yoktur. İkisi de aynı format ve değerlendirme sistemine sahiptir."
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