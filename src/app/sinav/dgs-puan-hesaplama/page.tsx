import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// ÖSYM'nin kılavuzlarından alınan yaklaştırılmış katsayılar ve sabitler
const DGS_CONSTANTS = {
    SAY: { say_k: 0.6, soz_k: 0.12, obp_k: 0.8, base: 38.6 },
    SOZ: { say_k: 0.12, soz_k: 0.6, obp_k: 0.8, base: 28.4 },
    EA: { say_k: 0.36, soz_k: 0.36, obp_k: 0.8, base: 33.5 },
};

const pageConfig = {
  title: "DGS Puan Hesaplama 2024 | OnlineHesaplama",
  description: "DGS Sayısal, Sözel ve Eşit Ağırlık puan türleri için doğru, yanlış ve ÖBP bilgilerinizi girerek tahmini 2024 DGS puanınızı hesaplayın.",
  keywords: ["dgs puan hesaplama", "dgs hesaplama", "dikey geçiş sınavı", "dgs sayısal puan", "dgs sözel puan", "dgs eşit ağırlık puan"],
  calculator: {
    title: "DGS Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Doğru, yanlış ve ön lisans başarı puanınızı girerek tahmini DGS puanınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'say_dogru', label: 'Sayısal Doğru Sayısı', type: 'number', placeholder: '30' },
      { id: 'say_yanlis', label: 'Sayısal Yanlış Sayısı', type: 'number', placeholder: '10' },
      { id: 'soz_dogru', label: 'Sözel Doğru Sayısı', type: 'number', placeholder: '35' },
      { id: 'soz_yanlis', label: 'Sözel Yanlış Sayısı', type: 'number', placeholder: '5' },
      { id: 'obp', label: 'Ön Lisans Başarı Puanı (ÖBP)', type: 'number', placeholder: '75.5' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { say_dogru, say_yanlis, soz_dogru, soz_yanlis, obp } = inputs;
        const obp_val = Number(obp);

        if ( (Number(say_dogru) + Number(say_yanlis) > 50) || (Number(soz_dogru) + Number(soz_yanlis) > 50) ) {
            return { summary: { error: { label: 'Hata', value: 'Bir testteki doğru ve yanlış sayısı toplamı 50\'yi geçemez.' } } };
        }
        if ( isNaN(obp_val) || obp_val < 0 || obp_val > 100) {
            return { summary: { error: { label: 'Hata', value: 'ÖBP, 0 ile 100 arasında bir değer olmalıdır.' } } };
        }

        const sayNet = Number(say_dogru) - (Number(say_yanlis) / 4);
        const sozNet = Number(soz_dogru) - (Number(soz_yanlis) / 4);
        
        const puanSAY = DGS_CONSTANTS.SAY.say_k * sayNet + DGS_CONSTANTS.SAY.soz_k * sozNet + DGS_CONSTANTS.SAY.obp_k * obp_val + DGS_CONSTANTS.SAY.base;
        const puanSOZ = DGS_CONSTANTS.SOZ.say_k * sayNet + DGS_CONSTANTS.SOZ.soz_k * sozNet + DGS_CONSTANTS.SOZ.obp_k * obp_val + DGS_CONSTANTS.SOZ.base;
        const puanEA = DGS_CONSTANTS.EA.say_k * sayNet + DGS_CONSTANTS.EA.soz_k * sozNet + DGS_CONSTANTS.EA.obp_k * obp_val + DGS_CONSTANTS.EA.base;

        const summary = {
            puanSAY: { label: 'Sayısal Puan (DGS-SAY)', value: formatNumber(puanSAY) },
            puanSOZ: { label: 'Sözel Puan (DGS-SÖZ)', value: formatNumber(puanSOZ) },
            puanEA: { label: 'Eşit Ağırlık Puan (DGS-EA)', value: formatNumber(puanEA) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "DGS Puanı Nasıl Hesaplanır?",
        content: (
          <p>
            Dikey Geçiş Sınavı (DGS) puanı, adayların sayısal ve sözel testlerdeki netlerine ve Ön Lisans Başarı Puanlarına (ÖBP) göre hesaplanır. Her testteki net sayısı (Doğru Sayısı - Yanlış Sayısı / 4) bulunduktan sonra, bu netler ve ÖBP, her puan türü (SAY, SÖZ, EA) için özel olarak belirlenmiş katsayılarla çarpılır. Bu çarpımların toplamına bir taban puan eklenerek adayın yerleştirme puanı oluşturulur. Katsayılar ve taban puan, her yıl sınavın istatistiklerine göre ÖSYM tarafından yeniden belirlenir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Ön Lisans Başarı Puanı (ÖBP) nedir, nasıl hesaplanır?",
        answer: "ÖBP, adayın ön lisans programındaki akademik başarısını gösteren bir puandır. Adayın mezuniyet notu (100'lük sistemde) 0.8 ile çarpılarak ham ÖBP elde edilir. Bu puan daha sonra belirli bir formülle 100 ile 500 arasında bir puana dönüştürülür. Ancak DGS puan hesaplamasında genellikle mezuniyet notunun 0.8 ile çarpılmış hali direkt kullanılır."
      },
      {
        question: "DGS ile her lisans bölümüne geçiş yapabilir miyim?",
        answer: "Hayır. DGS adayları sadece mezun oldukları ön lisans programının devamı niteliğindeki lisans programlarını tercih edebilirler. Hangi ön lisans programından mezun olanların hangi lisans programlarını tercih edebileceği her yıl ÖSYM tarafından yayımlanan DGS kılavuzunda belirtilir."
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
        resultTitle="Tahmini DGS Puan Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}