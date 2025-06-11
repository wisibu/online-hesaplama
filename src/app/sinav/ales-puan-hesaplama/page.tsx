import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// ÖSYM'nin kılavuzlarından alınan yaklaştırılmış katsayılar ve sabitler
const ALES_CONSTANTS = {
    SAY: { say_k: 0.44, soz_k: 0.11, base: 43.708 },
    SOZ: { say_k: 0.16, soz_k: 0.42, base: 37.367 },
    EA: { say_k: 0.30, soz_k: 0.28, base: 40.435 },
};

const pageConfig = {
  title: "ALES Puan Hesaplama 2024 | OnlineHesaplama",
  description: "ALES Sayısal, Sözel ve Eşit Ağırlık puan türleri için doğru ve yanlış sayılarınızı girerek tahmini 2024 ALES puanınızı hesaplayın.",
  keywords: ["ales puan hesaplama", "ales hesaplama", "ales sayısal puan", "ales sözel puan", "ales eşit ağırlık puan"],
  calculator: {
    title: "ALES Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Sayısal ve sözel testlerdeki doğru ve yanlış sayılarınızı girerek tahmini ALES puanınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'say_dogru', label: 'Sayısal Doğru Sayısı', type: 'number', placeholder: '30' },
      { id: 'say_yanlis', label: 'Sayısal Yanlış Sayısı', type: 'number', placeholder: '10' },
      { id: 'soz_dogru', label: 'Sözel Doğru Sayısı', type: 'number', placeholder: '35' },
      { id: 'soz_yanlis', label: 'Sözel Yanlış Sayısı', type: 'number', placeholder: '5' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { say_dogru, say_yanlis, soz_dogru, soz_yanlis } = inputs;

        const sayNet = Number(say_dogru) - (Number(say_yanlis) / 4);
        const sozNet = Number(soz_dogru) - (Number(soz_yanlis) / 4);
        
        if ( (Number(say_dogru) + Number(say_yanlis) > 50) || (Number(soz_dogru) + Number(soz_yanlis) > 50) ) {
            return { summary: { error: { label: 'Hata', value: 'Bir testteki doğru ve yanlış sayısı toplamı 50\'yi geçemez.' } } };
        }

        const puanSAY = ALES_CONSTANTS.SAY.say_k * sayNet + ALES_CONSTANTS.SAY.soz_k * sozNet + ALES_CONSTANTS.SAY.base;
        const puanSOZ = ALES_CONSTANTS.SOZ.say_k * sayNet + ALES_CONSTANTS.SOZ.soz_k * sozNet + ALES_CONSTANTS.SOZ.base;
        const puanEA = ALES_CONSTANTS.EA.say_k * sayNet + ALES_CONSTANTS.EA.soz_k * sozNet + ALES_CONSTANTS.EA.base;

        const summary = {
            sayNet: { label: 'Sayısal Net', value: formatNumber(sayNet) },
            sozNet: { label: 'Sözel Net', value: formatNumber(sozNet) },
            puanSAY: { label: 'Sayısal Puan (ALES-SAY)', value: formatNumber(puanSAY) },
            puanSOZ: { label: 'Sözel Puan (ALES-SÖZ)', value: formatNumber(puanSOZ) },
            puanEA: { label: 'Eşit Ağırlık Puan (ALES-EA)', value: formatNumber(puanEA) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "ALES Puanı Nasıl Hesaplanır?",
        content: (
          <p>
            ALES puanı, adayların sayısal ve sözel testlerdeki net sayıları kullanılarak hesaplanır. Her bir puan türü (Sayısal, Sözel, Eşit Ağırlık) için farklı ağırlık katsayıları kullanılır. Öncelikle, her test için doğru sayısından yanlış sayısının dörtte biri çıkarılarak net sayısı bulunur. Daha sonra bu netler, ilgili puan türünün katsayılarıyla çarpılır ve bu çarpımlara bir taban puan eklenerek nihai ALES puanı elde edilir. Bu katsayılar ve taban puanlar her sınavın zorluk derecesine göre ÖSYM tarafından belirlenir, bu nedenle hesaplayıcımızdaki değerler geçmiş sınavlara dayalı tahminlerdir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "ALES puanı kaç yıl geçerlidir?",
        answer: "ALES sonuçları, açıklandığı tarihten itibaren 5 yıl süreyle geçerlidir. Adaylar bu süre içinde puanlarını lisansüstü eğitim başvurularında veya akademik kadro atamalarında kullanabilirler."
      },
      {
        question: "ALES'e kimler girebilir?",
        answer: "ALES'e, bir lisans programından mezun olmuş veya olabilecek durumda olanlar, yurt dışında lisans eğitimi görmüş ve denklik belgesi almış olanlar başvurabilirler. Lisansüstü eğitim (yüksek lisans, doktora) veya akademik kadrolara (öğretim görevlisi, okutman, araştırma görevlisi vb.) başvurmak isteyenler için ALES puanı zorunludur."
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
        resultTitle="Tahmini ALES Puan Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}