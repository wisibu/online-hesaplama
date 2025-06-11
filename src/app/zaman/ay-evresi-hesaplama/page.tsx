import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const moonPhases: { name: string, emoji: string }[] = [
    { name: "Yeni Ay", emoji: "🌑" },
    { name: "Hilal", emoji: "🌒" },
    { name: "İlk Dördün", emoji: "🌓" },
    { name: "Büyüyen Kambur Ay", emoji: "🌔" },
    { name: "Dolunay", emoji: "🌕" },
    { name: "Küçülen Kambur Ay", emoji: "🌖" },
    { name: "Son Dördün", emoji: "🌗" },
    { name: "Küçülen Ay", emoji: "🌘" },
];

// Algorithm adapted from https://gist.github.com/endel/dfe6bb2fbe679781948c
const getMoonPhase = (date: Date): { phase: number, age: number } => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1; // JS months are 0-11
    const day = date.getDate();

    if (month < 3) {
        year--;
        month += 12;
    }

    const c = 365.25 * year;
    const e = 30.6 * month;
    let jd = c + e + day - 694039.09; // Julian date
    jd /= 29.5305882; // Divide by the moon cycle
    let b = Math.floor(jd); // Integer part
    jd -= b; // Fractional part
    b = Math.round(jd * 8); 

    if (b >= 8) {
        b = 0; // 0 and 8 are the same phase
    }
    
    const age = jd * 29.53;

    return { phase: b, age };
};


const pageConfig = {
  title: "Ay Evresi Hesaplama | OnlineHesaplama",
  description: "Belirli bir tarih için Ay'ın evresini (Yeni Ay, Hilal, Dolunay vb.) ve aydınlanma oranını anında öğrenin. Astronomi meraklıları için pratik bir araç.",
  keywords: ["ay evresi hesaplama", "ayın evreleri", "yeni ay ne zaman", "dolunay ne zaman", "ay takvimi"],
  calculator: {
    title: "Ay Evresi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Ay'ın hangi evrede olduğunu görmek istediğiniz tarihi seçin.
      </p>
    ),
    inputFields: [
      { id: 'date', label: 'Tarih', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const dateStr = inputs.date as string;
        if (!dateStr) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir tarih girin.' } } };
        }
        
        const date = new Date(dateStr);
        // Adjust for timezone offset to prevent off-by-one day errors
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const correctedDate = new Date(date.getTime() + userTimezoneOffset);


        const { phase, age } = getMoonPhase(correctedDate);
        const phaseInfo = moonPhases[phase];

        const summary = {
            phaseName: { label: 'Ay\'ın Evresi', value: `${phaseInfo.name} ${phaseInfo.emoji}` },
            moonAge: { label: 'Ay\'ın Yaşı', value: `${age.toFixed(1)} gün` },
            illumination: { label: 'Aydınlanma (Yaklaşık)', value: `${(age <= 14.765 ? (age / 14.765) * 100 : 100 - ((age - 14.765) / 14.765) * 100).toFixed(0)}%` },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Ay'ın Evreleri Nedir?",
        content: (
          <p>
            Ay'ın evreleri, Ay'ın Dünya etrafındaki yörüngesi boyunca Güneş'e göre konumunun değişmesiyle ortaya çıkan, Ay'ın aydınlık yüzünün Dünya'dan farklı şekillerde görülmesidir. Ay, kendisi ışık üretmez, sadece Güneş'ten aldığı ışığı yansıtır. Döngü, Güneş ve Dünya arasındayken oluşan ve Dünya'dan görülmeyen "Yeni Ay" evresiyle başlar, "Dolunay" ile zirveye ulaşır ve tekrar Yeni Ay'a dönerek yaklaşık 29.5 günde tamamlanır.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Ay'ın evreleri neden olur?",
        answer: "Bu tamamen Güneş, Dünya ve Ay'ın birbirlerine göre konumlarıyla ilgilidir. Ay, Dünya'nın etrafında döndükçe, Güneş tarafından aydınlatılan yarım küresinin farklı bir bölümünü görürüz. Bu da bizim Ay'ı hilal, dördün veya dolunay gibi farklı şekillerde algılamamıza neden olur."
      },
      {
        question: "Ay'ın bir tam döngüsü ne kadar sürer?",
        answer: "Ay'ın bir Yeni Ay evresinden bir sonraki Yeni Ay evresine kadar geçen süre, yani tam bir evre döngüsü, yaklaşık 29.53 gün sürer. Bu süreye 'sinodik dönem' denir."
      },
      {
        question: "Bu hesaplama ne kadar doğrudur?",
        answer: "Bu hesaplayıcı, genel amaçlı kullanım için oldukça doğru ve güvenilir bir astronomik algoritma kullanır. Ancak, Ay'ın yörüngesindeki küçük değişimler (pertürbasyonlar) nedeniyle bilimsel veya hassas gözlemler için milimetrik sonuçlar vermeyebilir. Günlük kullanım için sonuçlar yeterince hassastır."
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
        resultTitle="Ay Evresi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}