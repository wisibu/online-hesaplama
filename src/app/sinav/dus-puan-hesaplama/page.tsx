import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

// ÖSYM kılavuzlarına dayalı yaklaştırılmış katsayılar
const DUS_KATSAYI_TEMEL = 0.7;
const DUS_KATSAYI_KLINIK = 0.3;
const DUS_BASE_PUAN = 25; // Tahmini bir taban puan

const pageConfig = {
  title: "DUS Puan Hesaplama (Diş Hekimliğinde Uzmanlık) | OnlineHesaplama",
  description: "DUS için Temel Bilimler ve Klinik Bilimler testlerindeki doğru ve yanlış sayılarınızı girerek tahmini DUS puanınızı hesaplayın.",
  keywords: ["dus puan hesaplama", "diş hekimliğinde uzmanlık sınavı", "dus hesaplama", "dus temel bilimler", "dus klinik bilimler"],
  calculator: {
    title: "DUS Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Testlerdeki doğru ve yanlış sayılarınızı girerek tahmini DUS puanınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'temel_dogru', label: 'Temel Bilimler Doğru Sayısı', type: 'number', placeholder: '80' },
      { id: 'temel_yanlis', label: 'Temel Bilimler Yanlış Sayısı', type: 'number', placeholder: '20' },
      { id: 'klinik_dogru', label: 'Klinik Bilimler Doğru Sayısı', type: 'number', placeholder: '50' },
      { id: 'klinik_yanlis', label: 'Klinik Bilimler Yanlış Sayısı', type: 'number', placeholder: '15' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      
      const temel_dogru = Number(inputs.temel_dogru);
      const temel_yanlis = Number(inputs.temel_yanlis);
      const klinik_dogru = Number(inputs.klinik_dogru);
      const klinik_yanlis = Number(inputs.klinik_yanlis);

      // DUS Temel Bilimler Testi 120, Klinik Bilimler Testi 80 sorudan oluşur.
      if ( (temel_dogru + temel_yanlis > 120) || (klinik_dogru + klinik_yanlis > 80) ) {
          return { summary: { error: { label: 'Hata', value: 'Soru sayılarını aştınız. Temel: 120, Klinik: 80.' } } };
      }

      const temelNet = temel_dogru - (temel_yanlis / 4);
      const klinikNet = klinik_dogru - (klinik_yanlis / 4);
      
      // Standart Puan (SP) hesaplaması daha karmaşıktır, burada basitleştirilmiş bir model kullanılmıştır.
      // Gerçek hesaplama, sınavın ortalaması ve standart sapmasına göre değişir.
      const temelPuan = temelNet * DUS_KATSAYI_TEMEL;
      const klinikPuan = klinikNet * DUS_KATSAYI_KLINIK;
      
      const dusPuani = DUS_BASE_PUAN + temelPuan + klinikPuan;

      const summary = {
        dusPuani: { label: 'Tahmini DUS Puanı', value: formatNumber(dusPuani, 2), isHighlighted: true },
        temelNet: { label: 'Temel Bilimler Neti', value: formatNumber(temelNet, 2) },
        klinikNet: { label: 'Klinik Bilimler Neti', value: formatNumber(klinikNet, 2) },
      };
        
      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "DUS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Diş Hekimliğinde Uzmanlık Eğitimi Giriş Sınavı (DUS) puanı, adayların Temel Bilimler ve Klinik Bilimler testlerinden aldıkları sonuçlara göre hesaplanır. Puanlama, adayların netleri üzerinden yapılır ve her testin ağırlığı farklıdır.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Netlerin Hesaplanması:</strong> Her iki test için de doğru cevap sayısından, yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
                <li><strong>Ağırlıklı Puanların Hesaplanması:</strong> Hesaplanan netler, ÖSYM tarafından belirlenen katsayılarla çarpılır. Genellikle Temel Bilimler testinin ağırlığı daha fazladır.</li>
                <li><strong>Yerleştirme Puanı:</strong> Ağırlıklı puanların toplamına bir taban puan eklenerek adayın DUS puanı oluşturulur. Bu hesaplayıcı, geçmiş yılların verilerine dayalı tahmini katsayılar kullanır ve gerçek sonuçlar ÖSYM'nin açıklamalarıyla kesinleşir.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "DUS puanı ile tercih yapabilmek için baraj puanı var mıdır?",
        answer: "Evet, DUS sonucuna göre yerleştirme işleminin yapılabilmesi için yabancı dil yeterliliği aranır ve DUS'ta meslek bilgisi sınavından en az 45 puan alınması gerekir."
      },
      {
        question: "DUS'a girmek için yabancı dil şartı nedir?",
        answer: "DUS'a girebilmek için adayların YDS, E-YDS veya YÖKDİL gibi sınavlardan belirli bir puan almış olmaları veya ÖSYM tarafından yapılan yabancı dil seviye tespit sınavından başarılı olmaları gerekmektedir. Bu şartı sağlamayanlar sınava giremezler."
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
        resultTitle="Tahmini DUS Puan Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}