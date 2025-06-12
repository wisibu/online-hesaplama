import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "YÖKDİL Puan Hesaplama | OnlineHesaplama",
  description: "Yükseköğretim Kurumları Yabancı Dil Sınavı (YÖKDİL) için doğru cevap sayınızı girerek Fen, Sosyal ve Sağlık Bilimleri alanlarındaki puanınızı hesaplayın.",
  keywords: ["yökdil puan hesaplama", "yökdil fen bilimleri", "yökdil sosyal bilimleri", "yökdil sağlık bilimleri", "e-yökdil"],
  calculator: {
    title: "YÖKDİL Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Toplam 80 soruluk sınavda yaptığınız doğru sayısını girin.
      </p>
    ),
    inputFields: [
      { id: 'correct', label: 'Doğru Cevap Sayısı', type: 'number', placeholder: '70' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const correct = Number(inputs.correct);
      const totalQuestions = 80;
      
      if (isNaN(correct) || correct < 0 || correct > totalQuestions) {
        return { summary: { error: { type: 'error', label: 'Hata', value: `Doğru sayısı 0 ile ${totalQuestions} arasında olmalıdır.` } } };
      }

      const score = correct * 1.25;
      
      const summary: CalculationResult['summary'] = {
        score: { type: 'result', label: 'YÖKDİL Puanınız', value: formatNumber(score), isHighlighted: true },
        correct: { type: 'info', label: 'Doğru Cevap Sayısı', value: formatNumber(correct) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "YÖKDİL Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Yükseköğretim Kurumları Yabancı Dil Sınavı (YÖKDİL), adayların kendi akademik alanlarındaki (Fen Bilimleri, Sosyal Bilimler, Sağlık Bilimleri) dil yeterliliklerini ölçmek amacıyla düzenlenen bir sınavdır. Puanlama sistemi YDS ile birebir aynıdır.
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Sınavda toplam <strong>80 soru</strong> bulunur.</li>
              <li>Her bir doğru cevap <strong>1.25 puan</strong> değerindedir.</li>
              <li>Yanlış cevaplar doğru cevapları <strong>etkilemez</strong>.</li>
              <li>Puanınız, <strong>Doğru Sayısı x 1.25</strong> formülü ile hesaplanır.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "YÖKDİL puanının geçerlilik süresi nedir?",
        answer: "YÖKDİL sonuçları, yapıldığı tarihten itibaren 5 yıl süreyle geçerlidir. Ancak, yükseköğretim kurumları kendi yönetmeliklerinde farklı geçerlilik süreleri belirleyebilir."
      },
      {
        question: "YÖKDİL hangi alanlarda yapılıyor?",
        answer: "YÖKDİL; Fen Bilimleri, Sosyal Bilimler ve Sağlık Bilimleri olmak üzere üç temel alanda yapılır. Adaylar, kendi akademik disiplinlerine uygun olan alandan sınava girerler."
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