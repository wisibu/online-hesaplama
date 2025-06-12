import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

// Katsayılar ve taban puan ÖSYM kılavuzlarına göre tahminidir.
const EUS_KATSAYI = 0.75; // Her netin puana katkısı (tahmini)
const EUS_BASE_PUAN = 28; // Tahmini taban puan

const pageConfig = {
  title: "EUS Puan Hesaplama (Eczacılıkta Uzmanlık) | OnlineHesaplama",
  description: "Eczacılıkta Uzmanlık Sınavı (EUS) için doğru ve yanlış sayılarınızı girerek tahmini EUS puanınızı kolayca hesaplayın.",
  keywords: ["eus puan hesaplama", "eczacılıkta uzmanlık sınavı", "eus hesaplama", "eus 2024"],
  calculator: {
    title: "EUS Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Sınavdaki 100 soru üzerinden doğru ve yanlış sayılarınızı girin.
      </p>
    ),
    inputFields: [
      { id: 'dogru', label: 'Doğru Sayısı', type: 'number', placeholder: '70' },
      { id: 'yanlis', label: 'Yanlış Sayısı', type: 'number', placeholder: '20' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      
      const dogru = Number(inputs.dogru);
      const yanlis = Number(inputs.yanlis);
      const totalQuestions = 100;

      if ( (dogru + yanlis > totalQuestions) || dogru < 0 || yanlis < 0 || isNaN(dogru) || isNaN(yanlis) ) {
          return { summary: { error: { type: 'error', label: 'Hata', value: `Toplam doğru ve yanlış sayısı ${totalQuestions} sayısını geçemez.` } } };
      }

      const net = dogru - (yanlis / 4);
      
      // Gerçek hesaplama standart sapma ve ortalamaya dayalıdır. Bu basitleştirilmiş bir modeldir.
      const eusPuani = EUS_BASE_PUAN + (net * EUS_KATSAYI);

      const summary: CalculationResult['summary'] = {
        eusPuani: { type: 'result', label: 'Tahmini EUS Puanı', value: formatNumber(eusPuani, 2), isHighlighted: true },
        net: { type: 'info', label: 'Net Sayınız', value: formatNumber(net, 2) },
      };
        
      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "EUS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Eczacılıkta Uzmanlık Eğitimi Giriş Sınavı (EUS), eczacılık fakültesi mezunlarının uzmanlık eğitimi alabilmeleri için girdikleri bir sınavdır. Puan, adayların sınavdaki netleri üzerinden hesaplanır.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Netlerin Hesaplanması:</strong> Sınavdaki toplam doğru cevap sayısından, yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
                <li><strong>Puanın Hesaplanması:</strong> Hesaplanan netler, her sınavın ortalama ve standart sapmasına göre hesaplanan bir katsayı ile çarpılır ve bu sonuca bir taban puan eklenir. Bu hesaplayıcı, geçmiş sınav verilerine dayalı tahmini değerler kullanarak bir sonuç üretir.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "EUS puanı ile tercih yapabilmek için baraj puanı var mıdır?",
        answer: "Evet, EUS sonucuna göre yerleştirme işleminin yapılabilmesi için adayların meslek bilgisi sınavından en az 45 puan almaları ve yabancı dil yeterliliğine sahip olmaları gerekmektedir."
      },
      {
        question: "EUS'a girmek için yabancı dil şartı nedir?",
        answer: "EUS'a girebilmek için adayların YDS, E-YDS veya YÖKDİL (Sağlık) gibi sınavlardan belirli bir baraj puanını geçmiş olmaları gerekmektedir. Bu şartı sağlamayan adayların tercih yapma hakkı bulunmamaktadır."
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
        resultTitle="Tahmini EUS Puan Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}