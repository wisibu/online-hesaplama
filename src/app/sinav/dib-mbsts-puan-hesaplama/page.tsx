import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "DİB MBSTS Puan Hesaplama | OnlineHesaplama",
  description: "Diyanet İşleri Başkanlığı Mesleki Bilgiler Seviye Tespit Sınavı (MBSTS) için doğru ve yanlış sayılarınızı girerek puanınızı hesaplayın.",
  keywords: ["mbsts puan hesaplama", "dib mbsts", "diyanet mbsts puan", "mbsts 2024"],
  calculator: {
    title: "DİB-MBSTS Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Sınavdaki doğru ve yanlış cevap sayılarınızı girerek puanınızı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'correct', label: 'Doğru Sayısı', type: 'number', placeholder: '40' },
      { id: 'incorrect', label: 'Yanlış Sayısı', type: 'number', placeholder: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const correct = Number(inputs.correct);
      const incorrect = Number(inputs.incorrect);
      // MBSTS'de 50 soru vardır
      const totalQuestions = 50; 
      
      if (isNaN(correct) || isNaN(incorrect) || correct < 0 || incorrect < 0 || (correct + incorrect > totalQuestions)) {
        return { summary: { error: { type: 'error', label: 'Hata', value: `Doğru ve yanlış sayıları toplamı ${totalQuestions} sayısını geçemez.` } } };
      }

      // MBSTS'de yanlışlar doğruyu götürmez. Puan, (Doğru Sayısı / Toplam Soru Sayısı) * 100 formülü ile hesaplanır.
      const score = (correct / totalQuestions) * 100;
      
      const summary: CalculationResult['summary'] = {
        score: { type: 'result', label: 'MBSTS Puanınız', value: formatNumber(score, 2), isHighlighted: true },
        correct: { type: 'info', label: 'Doğru Cevap Sayısı', value: formatNumber(correct) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "MBSTS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Diyanet İşleri Başkanlığı Mesleki Bilgiler Seviye Tespit Sınavı (MBSTS), Diyanet personelinin mesleki bilgi seviyesini ölçmek, görevde yükselme, unvan değişikliği ve yurt dışı görevlendirmeleri gibi süreçlerde kullanılmak üzere yapılan bir sınavdır.
            </p>
            <p className="mt-2">
              Sınavda toplam <strong>50 soru</strong> sorulur ve değerlendirme 100 tam puan üzerinden yapılır. Diğer birçok sınavın aksine, MBSTS'de <strong>yanlış cevaplar doğru cevapları etkilemez</strong>. Puanınız, doğrudan doğru cevap sayınıza göre orantılı bir şekilde hesaplanır.
            </p>
            <p className="mt-2">
              Hesaplama formülü oldukça basittir: <br/>
              <strong>Puan = (Doğru Cevap Sayısı / 50) * 100</strong>
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "MBSTS puanının geçerlilik süresi ne kadardır?",
        answer: "MBSTS sonuçları, sınavın yapıldığı tarihten itibaren üç yıl süreyle geçerlidir."
      },
      {
        question: "Sınavda hangi konulardan soru çıkmaktadır?",
        answer: "Sınavda genellikle Kur'an-ı Kerim, tefsir, hadis, fıkıh, siyer, İslam tarihi, kelam ve mezhepler tarihi gibi temel İslami ilimler alanlarından sorular yer almaktadır."
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