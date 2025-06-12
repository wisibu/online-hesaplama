import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "YÖS Puan Hesaplama (Yabancı Öğrenci Sınavı) | OnlineHesaplama",
  description: "Yabancı Öğrenci Sınavı (YÖS) için Temel Öğrenme Becerileri (Matematik, IQ) ve Türkçe testlerindeki doğru ve yanlışlarınızı girerek tahmini puanınızı hesaplayın.",
  keywords: ["yös puan hesaplama", "iyös puan hesaplama", "yabancı öğrenci sınavı", "tr-yös puan hesaplama"],
  calculator: {
    title: "YÖS Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Testlerdeki doğru ve yanlış sayılarınızı girerek tahmini YÖS puanınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'temel_dogru', label: 'Temel Beceriler Doğru (80 Soru)', type: 'number', placeholder: '60' },
      { id: 'temel_yanlis', label: 'Temel Beceriler Yanlış', type: 'number', placeholder: '15' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      
      const { temel_dogru, temel_yanlis } = inputs;
      
      if ( (Number(temel_dogru) + Number(temel_yanlis) > 80) ) {
          return { summary: { error: { type: 'error', label: 'Hata', value: 'Temel Beceriler testindeki soru sayısını (80) aştınız.' } } };
      }

      const temelNet = Number(temel_dogru) - (Number(temel_yanlis) / 4);
      
      // Puanlama üniversiteden üniversiteye değişir. Bu genel, basitleştirilmiş bir modeldir.
      // Genellikle 500 üzerinden veya 100 üzerinden değerlendirme yapılır. Biz 100'lük sistemi baz alalım.
      const puan = (temelNet / 80) * 100;

      const summary: CalculationResult['summary'] = {
        puan: { type: 'result', label: 'Tahmini YÖS Puanı (100 üzerinden)', value: formatNumber(puan, 2), isHighlighted: true },
        temelNet: { type: 'info', label: 'Temel Beceriler Neti', value: formatNumber(temelNet, 2) },
      };
        
      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "YÖS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Yabancı Öğrenci Sınavı (YÖS), Türkiye'deki üniversitelerde öğrenim görmek isteyen yabancı uyruklu öğrencilerin girdiği bir sınavdır. 2023 yılından itibaren ÖSYM tarafından merkezi olarak <strong>TR-YÖS</strong> adıyla düzenlenmeye başlanmıştır, ancak bazı üniversiteler hala kendi YÖS sınavlarını yapabilmektedir.
            </p>
            <p className="mt-2">
              Puanlama genellikle Temel Öğrenme Becerileri Testi sonucuna göre yapılır. Bu test, adayın soyut ve analitik düşünme gücünü ölçen sorulardan (IQ, Genel Yetenek) ve matematik sorularından oluşur.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Netlerin Hesaplanması:</strong> Genellikle 4 yanlış cevap 1 doğru cevabı götürür. Net sayısı, doğru sayısından yanlış sayısının dörtte birinin çıkarılmasıyla bulunur.</li>
                <li><strong>Puanın Hesaplanması:</strong> Üniversiteler kendi puanlama sistemlerini kullanabilirler. Bazıları 100'lük, bazıları 500'lük sistem kullanır. Bu hesaplayıcı, en yaygın yöntem olan netlerinizi 100'lük puana orantılayan basitleştirilmiş bir hesaplama yapar.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "TR-YÖS nedir? Üniversitelerin kendi YÖS sınavlarından farkı ne?",
        answer: "TR-YÖS, ÖSYM tarafından merkezi olarak yapılan Yabancı Öğrenci Sınavıdır. Birçok üniversite artık sadece TR-YÖS sonucunu kabul etmektedir. Ancak bazı üniversiteler kendi sınavlarını düzenlemeye devam edebilir. Başvuru yapacağınız üniversitenin kabul koşullarını kontrol etmeniz en doğrusudur."
      },
      {
        question: "Türkçe testi puanı etkiliyor mu?",
        answer: "Çoğu üniversite için YÖS puanı sadece Temel Öğrenme Becerileri testinden hesaplanır. Türkçe testi sonuçları, adayın Türkçe yeterliliğini ölçmek için kullanılır ve genellikle üniversiteye kayıt olduktan sonra hazırlık sınıfı okuyup okumayacağını belirler."
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
        resultTitle="Tahmini YÖS Puan Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}