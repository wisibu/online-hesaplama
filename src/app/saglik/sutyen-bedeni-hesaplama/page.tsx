import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const getCupSize = (difference: number): string => {
    if (difference < 12) return 'A';
    if (difference < 14) return 'B';
    if (difference < 16) return 'C';
    if (difference < 18) return 'D';
    if (difference < 20) return 'E';
    if (difference < 22) return 'F';
    return 'G+';
};

const getBandSize = (bandMeasurement: number): number => {
    // Ölçümü en yakın 5'in katına yuvarla
    const rounded = Math.round(bandMeasurement / 5) * 5;
    // Eğer ölçüm tam ortadaysa (örn. 77.5), yukarı yuvarla
    if (bandMeasurement > rounded - 2.5 && bandMeasurement < rounded) {
        return rounded;
    }
    // Geleneksel kural: ölçüme 5 ekleyip yuvarlama da bir yöntemdir, ama direkt yuvarlama daha modern.
    // Biz burada direkt en yakın standarda yuvarlıyoruz. 72->70, 73->75, 77->75, 78->80
    const lowerBound = rounded - 2.5;
    if (bandMeasurement < lowerBound) {
        return rounded - 5;
    }
    return rounded;
};


const pageConfig = {
  title: "Sütyen Bedeni Hesaplama | Doğru Ölçü Nasıl Bulunur?",
  description: "Bant (sırt çevresi) ve kup (göğüs çevresi) ölçülerinizi girerek doğru sütyen bedeninizi ve çapraz bedeninizi (sister size) anında öğrenin.",
  keywords: ["sütyen bedeni hesaplama", "doğru sütyen ölçüsü", "kup hesaplama", "sütyen bedeni nedir"],
  calculator: {
    title: "Sütyen Bedeni Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Doğru ölçüm için mezurayı çok sıkmamaya veya çok bol bırakmamaya dikkat edin.
      </p>
    ),
    inputFields: [
      { id: 'bantOlcusu', label: 'Bant Ölçüsü (cm)', type: 'number', placeholder: '78', note: 'Göğüs kafesinizin hemen altından, sırtınızdan öne doğru ölçün.' },
      { id: 'kupOlcusu', label: 'Kup Ölçüsü (cm)', type: 'number', placeholder: '94', note: 'Göğüslerinizin en dolgun, en uç noktasından ölçün.' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { bantOlcusu, kupOlcusu } = inputs as { bantOlcusu: number, kupOlcusu: number };

        if (!bantOlcusu || !kupOlcusu || bantOlcusu <= 0 || kupOlcusu <= 0 || kupOlcusu <= bantOlcusu) {
            return { summary: { error: { label: 'Hata', value: 'Kup ölçüsü, bant ölçüsünden büyük olmalıdır. Lütfen ölçümlerinizi kontrol edin.' } } };
        }
        
        const beden = getBandSize(bantOlcusu);
        const fark = kupOlcusu - bantOlcusu;
        const kup = getCupSize(fark);
        
        // Çapraz Beden (Sister Size)
        const caprazBedenBant = beden + 5;
        const caprazKup = getCupSize(fark - 2); 
        const caprazBeden = `${caprazBedenBant}${caprazKup}`;


        const summary: CalculationResult['summary'] = {
            beden: { label: 'Hesaplanan Bedeniniz', value: `${beden}${kup}`, isHighlighted: true },
            caprazBeden: { label: 'Olası Çapraz (Kardeş) Beden', value: caprazBeden, note: 'Sırt bandı daha bol, kup kısmı daha dar bir alternatiftir.' },
        };
          
        return { summary, disclaimer: "Bu hesaplama bir başlangıç noktasıdır. Sütyen markaları ve modelleri arasında kalıp farkları olabilir. En doğru sonuç için farklı modeller denemeniz önerilir." };
    },
  },
  content: {
    sections: [
      {
        title: "Doğru Sütyen Bedeni Nasıl Hesaplanır ve Neden Önemlidir?",
        content: (
          <>
            <p>
              Kadınların büyük bir çoğunluğu yanlış beden sütyen kullanmaktadır. Yanlış beden seçimi sırt ve omuz ağrılarına, duruş bozukluklarına ve gün boyu rahatsızlık hissine neden olabilir. Doğru beden, hem sağlık hem de konfor için kritik öneme sahiptir.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Bant (Beden) Ölçüsü:</strong> Sütyenin "80, 85, 90" gibi rakamla ifade edilen kısmıdır. Göğüs kafesinin hemen altından, sırt çevresinin mezura ile ölçülmesiyle bulunur.</li>
                <li><strong>Kup Ölçüsü:</strong> Sütyenin "A, B, C" gibi harfle ifade edilen kısmıdır. Göğüslerin en dolgun kısmından alınan çevre ölçüsüdür.</li>
                <li><strong>Hesaplama:</strong> Kup ölçüsünden bant ölçüsü çıkarılır. Aradaki fark, kup harfini belirler. Bant ölçüsü ise en yakın standart beden numarasına yuvarlanır.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Çapraz (Kardeş) Beden ne demektir?",
        answer: "Çapraz beden, sütyeninizin kup hacmi aynı kalırken bant ölçüsünün değiştiği alternatif bedendir. Örneğin, 85B bir sütyen denediniz ve sırt bandı sıktı ama kup kısmı tam oldu. Bu durumda, bantı bir büyük (90), kup'ı bir küçük (A) olan 90A bedenini deneyebilirsiniz. 90A, 85B ile aynı kup hacmine sahiptir ama daha geniş bir sırt bandı sunar."
      },
      {
        question: "Ölçüm yaparken nelere dikkat etmeliyim?",
        answer: "Desteksiz veya ince destekli bir sütyenle ya da çıplakken ölçüm yapın. Mezurayı yere paralel tutun, çok sıkı veya çok gevşek olmamasına özen gösterin. Nefesinizi normal alıp verirken ölçüm yapın."
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
        resultTitle="Sütyen Bedeni Sonucunuz"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}