import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Ehliyet Sınavı Puan Hesaplama | OnlineHesaplama",
  description: "Elektronik ehliyet sınavı (e-sınav) için doğru cevap sayınızı girerek anında puanınızı hesaplayın ve geçip geçmediğinizi öğrenin.",
  keywords: ["ehliyet sınavı puan hesaplama", "e-sınav puan hesaplama", "direksiyon sınavı", "mtsks puan hesaplama"],
  calculator: {
    title: "Ehliyet Sınavı Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Toplam 50 soruluk sınavda yaptığınız doğru sayısını girin.
      </p>
    ),
    inputFields: [
      { id: 'correct', label: 'Doğru Cevap Sayısı', type: 'number', placeholder: '40' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const correct = Number(inputs.correct);
      const totalQuestions = 50;
      const passingScore = 70;
      
      if (isNaN(correct) || correct < 0 || correct > totalQuestions) {
        return { summary: { error: { label: 'Hata', value: `Doğru sayısı 0 ile ${totalQuestions} arasında olmalıdır.` } } };
      }

      // Her soru 2 puandır. Yanlışlar doğruyu götürmez.
      const score = correct * 2;
      
      const summary = {
        score: { label: 'Ehliyet Sınav Puanınız', value: formatNumber(score), isHighlighted: true },
        status: { label: 'Sınav Sonucu', value: score >= passingScore ? 'Başarılı, direksiyon sınavına girebilirsiniz! ✅' : 'Başarısız, tekrar denemelisiniz. ❌' },
        minCorrect: { label: 'Geçmek için gereken min. doğru', value: `${passingScore / 2}` },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Ehliyet Sınavı Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Motorlu Taşıt Sürücü Kursiyerleri e-Sınavı (MTSKS), sürücü adaylarının teorik bilgilerini ölçen ilk aşamadır. Bu sınavda başarılı olan adaylar, direksiyon sınavına girmeye hak kazanır.
            </p>
            <p className="mt-2">
              Puanlama sistemi oldukça basittir:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Sınavda toplam <strong>50 soru</strong> bulunur.</li>
              <li>Her bir doğru cevap <strong>2 puan</strong> değerindedir.</li>
              <li>Yanlış cevaplar doğru cevapları <strong>etkilemez</strong> (yanlışlar doğruyu götürmez).</li>
              <li>Sınavdan başarılı sayılmak için 100 üzerinden en az <strong>70 puan</strong> almak gerekir. Bu da en az <strong>35 doğru</strong> cevap yapmanız gerektiği anlamına gelir.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Sınavda hangi derslerden soru çıkıyor?",
        answer: "Ehliyet sınavında 'İlk Yardım' (12 soru), 'Trafik ve Çevre' (23 soru), 'Araç Tekniği' (9 soru) ve 'Trafik Adabı' (6 soru) konularından sorular yer alır."
      },
      {
        question: "Teorik sınavdan kaldım, ne yapmalıyım?",
        answer: "Teorik sınavdan başarısız olan adayların toplam 4 sınav hakkı bulunur. Bir sonraki e-sınav için en erken 15 gün sonra yeni bir randevu alarak tekrar sınava girebilirsiniz."
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