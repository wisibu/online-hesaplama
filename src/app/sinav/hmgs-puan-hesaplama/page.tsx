import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

// Katsayılar ve taban puan ÖSYM/Bakanlık kılavuzlarına göre tahminidir.
const GUY_KATSAYILARI = {
    GY: 0.2, 
    GK: 0.2,
    ALAN: 0.6,
    BASE: 35
};

const pageConfig = {
  title: "Gelir Uzman Yardımcılığı (GUY) Sınavı Puan Hesaplama | OnlineHesaplama",
  description: "Gelir Uzman Yardımcılığı (GUY) sınavı için Genel Yetenek, Genel Kültür ve Alan Bilgisi testlerindeki doğru ve yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.",
  keywords: ["guy puan hesaplama", "gelir uzman yardımcılığı sınavı", "hmgs puan hesaplama", "guy sınavı"],
  calculator: {
    title: "Gelir Uzman Yardımcılığı (GUY) Sınavı Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Testlerdeki doğru ve yanlış sayılarınızı girerek tahmini GUY puanınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'gy_dogru', label: 'Genel Yetenek Doğru', type: 'number', placeholder: '20' },
      { id: 'gy_yanlis', label: 'Genel Yetenek Yanlış', type: 'number', placeholder: '5' },
      { id: 'gk_dogru', label: 'Genel Kültür Doğru', type: 'number', placeholder: '15' },
      { id: 'gk_yanlis', label: 'Genel Kültür Yanlış', type: 'number', placeholder: '5' },
      { id: 'alan_dogru', label: 'Alan Bilgisi Doğru', type: 'number', placeholder: '55' },
      { id: 'alan_yanlis', label: 'Alan Bilgisi Yanlış', type: 'number', placeholder: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      
      const { gy_dogru, gy_yanlis, gk_dogru, gk_yanlis, alan_dogru, alan_yanlis } = inputs;

      if ( (Number(gy_dogru) + Number(gy_yanlis) > 30) || (Number(gk_dogru) + Number(gk_yanlis) > 20) || (Number(alan_dogru) + Number(alan_yanlis) > 80) ) {
          return { summary: { error: { label: 'Hata', value: 'Soru sayılarını aştınız. (GY:30, GK:20, Alan:80)' } } };
      }

      const gyNet = Number(gy_dogru) - (Number(gy_yanlis) / 4);
      const gkNet = Number(gk_dogru) - (Number(gk_yanlis) / 4);
      const alanNet = Number(alan_dogru) - (Number(alan_yanlis) / 4);
      
      const puan = GUY_KATSAYILARI.BASE + (gyNet * GUY_KATSAYILARI.GY) + (gkNet * GUY_KATSAYILARI.GK) + (alanNet * GUY_KATSAYILARI.ALAN);

      const summary = {
        puan: { label: 'Tahmini GUY Puanı', value: formatNumber(puan, 2), isHighlighted: true },
        status: { label: 'Durum', value: puan >= 70 ? 'Başarılı (70 Puan Barajı Geçildi) ✅' : 'Başarısız (70 Puan Barajı Geçilemedi) ❌' },
        alanNet: { label: 'Alan Bilgisi Neti', value: formatNumber(alanNet, 2) },
      };
        
      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "GUY (Gelir Uzman Yardımcılığı) Sınav Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Gelir Uzman Yardımcılığı Giriş Sınavı, Hazine ve Maliye Bakanlığı'na bağlı Gelir İdaresi Başkanlığı'nın (GİB) ihtiyaç duyduğu kadrolar için yaptığı bir kariyer meslek sınavıdır. Puan, yazılı sınavdaki Genel Yetenek, Genel Kültür ve Alan Bilgisi testlerinin sonuçlarına göre hesaplanır.
            </p>
            <p className="mt-2">
             Puanlama 100 tam puan üzerinden yapılır. Her test bölümünün ağırlığı farklıdır. Alan Bilgisi testi, puanın büyük bir bölümünü oluşturur. Atama yapılacak kadro sayısının iki katına kadar aday, sözlü sınava çağrılmak üzere bu yazılı sınav puanına göre sıralanır. Sınavda başarılı sayılmak için en az 70 puan alınması zorunludur.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Sınavda hangi alan bilgisi konuları yer alır?",
        answer: "Alan bilgisi testi genellikle; Muhasebe, İktisat, Maliye ve Hukuk (Anayasa, İdare, Medeni, Borçlar, Ticaret, İcra-İflas) gibi derslerin konularını içerir."
      },
      {
        question: "70 puan almak sözlü sınava girmek için yeterli mi?",
        answer: "70 puan asgari başarı şartıdır. Ancak sözlü sınava, ilan edilen kadro sayısının en fazla iki katı kadar aday çağrılır. Bu nedenle, sıralamaya girebilmek için genellikle 70'in üzerinde bir puan almak gerekir. Bu sıralama puanı, her il için ayrı ayrı belirlenir."
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
        resultTitle="Tahmini GUY Sınav Puan Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}