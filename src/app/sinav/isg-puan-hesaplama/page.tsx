import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "İSG Sınavı Puan Hesaplama | OnlineHesaplama",
  description: "İş Sağlığı ve Güvenliği (İSG) sınavları (İş Güvenliği Uzmanlığı, İşyeri Hekimliği, DSP) için doğru ve yanlış sayılarınızı girerek puanınızı ve başarı durumunuzu hesaplayın.",
  keywords: ["isg puan hesaplama", "iş güvenliği uzmanlığı sınavı", "işyeri hekimliği sınavı", "dsp sınavı puan hesaplama"],
  calculator: {
    title: "İSG Sınavı Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Toplam 50 soruluk sınavda yaptığınız doğru ve yanlış sayılarını girin.
      </p>
    ),
    inputFields: [
      { id: 'correct', label: 'Doğru Sayısı', type: 'number', placeholder: '38' },
      { id: 'incorrect', label: 'Yanlış Sayısı', type: 'number', placeholder: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const correct = Number(inputs.correct);
      const incorrect = Number(inputs.incorrect);
      const totalQuestions = 50;
      const passingScore = 70;
      
      if (isNaN(correct) || isNaN(incorrect) || correct < 0 || incorrect < 0 || (correct + incorrect > totalQuestions)) {
        return { summary: { error: { label: 'Hata', value: `Doğru ve yanlış sayıları toplamı ${totalQuestions} arasında olmalıdır.` } } };
      }

      // Her soru 2 puandır. Yanlışlar doğruyu götürmez.
      const score = correct * 2;
      
      const summary = {
        score: { label: 'İSG Sınav Puanınız', value: formatNumber(score), isHighlighted: true },
        status: { label: 'Sınav Sonucu', value: score >= passingScore ? 'Başarılı ✅' : 'Başarısız ❌' },
        minCorrect: { label: 'Geçmek için gereken min. doğru', value: `${passingScore / 2}` },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "İSG Sınav Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              İş Sağlığı ve Güvenliği (İSG) sınavları, iş güvenliği uzmanı (A, B, C sınıfı), işyeri hekimi veya diğer sağlık personeli (DSP) olmak isteyen profesyonellerin girdiği bir yetkinlik sınavıdır.
            </p>
            <p className="mt-2">
              Puanlama sistemi tüm İSG sınavları için aynı ve oldukça basittir:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Sınavda toplam <strong>50 soru</strong> bulunur.</li>
              <li>Her bir doğru cevap <strong>2 puan</strong> değerindedir.</li>
              <li>Yanlış cevaplar doğru cevapları <strong>etkilemez</strong>.</li>
              <li>Sınavdan başarılı sayılmak için 100 üzerinden en az <strong>70 puan</strong> almak gerekir. Bu da en az <strong>35 doğru</strong> cevap yapmanız gerektiği anlamına gelir.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Sınavlar ne zaman ve ne sıklıkla yapılır?",
        answer: "İSG sınavları ÖSYM tarafından genellikle yılda iki kez, Mayıs ve Aralık aylarında düzenlenir."
      },
      {
        question: "Sınavda başarısız olursam ne olur?",
        answer: "Sınavda başarısız olan adaylar için herhangi bir sınırlama yoktur. Bir sonraki sınav döneminde tekrar sınava girebilirler."
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