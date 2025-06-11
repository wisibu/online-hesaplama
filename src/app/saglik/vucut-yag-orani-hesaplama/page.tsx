import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const getBodyFatCategory = (fatPercentage: number, gender: 'erkek' | 'kadin'): { category: string, color: string } => {
    if (gender === 'kadin') {
        if (fatPercentage < 14) return { category: "Sporcu", color: "text-blue-600" };
        if (fatPercentage < 21) return { category: "Fitness", color: "text-green-600" };
        if (fatPercentage < 25) return { category: "Kabul Edilebilir", color: "text-yellow-600" };
        if (fatPercentage < 32) return { category: "Fazla Kilolu", color: "text-orange-600" };
        return { category: "Obez", color: "text-red-600" };
    } else { // erkek
        if (fatPercentage < 6) return { category: "Sporcu", color: "text-blue-600" };
        if (fatPercentage < 14) return { category: "Fitness", color: "text-green-600" };
        if (fatPercentage < 18) return { category: "Kabul Edilebilir", color: "text-yellow-600" };
        if (fatPercentage < 25) return { category: "Fazla Kilolu", color: "text-orange-600" };
        return { category: "Obez", color: "text-red-600" };
    }
};


const pageConfig = {
  title: "Vücut Yağ Oranı Hesaplama (U.S. Navy Metodu)",
  description: "Boy, bel, boyun ve kalça çevresi ölçümlerinizi kullanarak ABD Donanması metodu ile vücut yağ oranınızı (%) ve sağlık kategorinizi hesaplayın.",
  keywords: ["vücut yağ oranı hesaplama", "yağ oranı", "us navy metodu", "vücut kompozisyonu"],
  calculator: {
    title: "Vücut Yağ Oranı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Mezura ile alacağınız ölçümleri girerek vücut kompozisyonunuz hakkında bilgi edinin.
      </p>
    ),
    inputFields: [
      { id: 'cinsiyet', label: 'Cinsiyet', type: 'select', options: [{ value: 'kadin', label: 'Kadın' }, { value: 'erkek', label: 'Erkek' }], defaultValue: 'erkek' },
      { id: 'boy', label: 'Boy (cm)', type: 'number', placeholder: '175' },
      { id: 'bel', label: 'Bel Çevresi (cm)', type: 'number', placeholder: '85', note: 'Göbek deliği hizasından ölçün.' },
      { id: 'boyun', label: 'Boyun Çevresi (cm)', type: 'number', placeholder: '40', note: 'Adem elmasının altından ölçün.' },
      { id: 'kalca', label: 'Kalça Çevresi (cm)', type: 'number', placeholder: '95', displayCondition: (inputs) => inputs.cinsiyet === 'kadin', note: 'En geniş noktadan ölçün.' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { cinsiyet, boy, bel, boyun, kalca } = inputs as { cinsiyet: 'kadin' | 'erkek', boy: number, bel: number, boyun: number, kalca?: number };

        if (!boy || !bel || !boyun || boy <= 0 || bel <= 0 || boyun <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen boy, bel ve boyun için geçerli değerler girin.' } } };
        }
        
        let fatPercentage = 0;

        if (cinsiyet === 'erkek') {
            fatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(bel - boyun) + 0.15456 * Math.log10(boy)) - 450;
        } else {
            if (!kalca || kalca <= 0) {
                return { summary: { error: { label: 'Hata', value: 'Lütfen kalça çevresi için geçerli bir değer girin.' } } };
            }
            fatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(bel + kalca - boyun) + 0.22100 * Math.log10(boy)) - 450;
        }
        
        if (fatPercentage < 2 || fatPercentage > 50) {
             return { summary: { error: { label: 'Hata', value: 'Girdiğiniz ölçümlerle geçerli bir sonuç hesaplanamadı. Lütfen ölçümlerinizi kontrol edin.' } } };
        }

        const { category, color } = getBodyFatCategory(fatPercentage, cinsiyet);

        const summary: CalculationResult['summary'] = {
            fatPercentage: { label: 'Vücut Yağ Oranınız', value: `% ${formatNumber(fatPercentage, 1)}`, isHighlighted: true },
            category: { label: 'Sağlık Kategorisi', value: category, className: color },
        };
          
        return { summary, disclaimer: "Bu hesaplama bir tahmin yöntemidir ve tıbbi bir teşhis yerine geçmez. Kesin sonuçlar için DEXA gibi profesyonel yöntemler kullanılır." };
    },
  },
  content: {
    sections: [
      {
        title: "Vücut Yağ Oranı Nedir ve Neden Önemlidir?",
        content: (
          <>
            <p>
             Vücut yağ oranı, toplam vücut ağırlığınızın ne kadarının yağdan oluştuğunu yüzde olarak ifade eder. Bu metrik, sadece kilo veya VKİ'den daha anlamlı bir sağlık göstergesi olabilir. Çünkü kaslı bir birey ile aynı kiloda ama daha yüksek yağ oranına sahip bir bireyin sağlık riskleri farklıdır. Yüksek vücut yağ oranı, kalp hastalıkları, diyabet ve diğer kronik rahatsızlıklar için artmış riskle ilişkilidir.
            </p>
            <h4 className="font-semibold mt-3">Ölçümler Nasıl Alınır?</h4>
            <ul className="list-disc list-inside space-y-2 mt-2 bg-gray-50 p-4 rounded-lg">
                <li><strong>Boyun:</strong> Gırtlağın (Adem elması) hemen altından, yere paralel şekilde ölçün.</li>
                <li><strong>Bel:</strong> Erkekler göbek deliği hizasından, kadınlar ise en ince noktadan ölçmelidir. Karın kaslarınızı sıkmayın, rahat bırakın.</li>
                <li><strong>Kalça (Sadece Kadınlar):</strong> Ayaklar bitişikken, kalçanın en geniş, en çıkıntılı olduğu noktadan yere paralel şekilde ölçün.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Bu yöntem ne kadar doğrudur?",
        answer: "ABD Donanması metodu, mezura ile yapılan en güvenilir yöntemlerden biri olarak kabul edilir. Genellikle %1-3'lük bir hata payına sahiptir. Ancak unutmayın ki bu, profesyonel ölçüm yöntemlerinin (DEXA, su altı tartımı) yerini tutmaz, pratik bir tahmin sunar."
      },
      {
        question: "VKİ mi, Vücut Yağ Oranı mı daha önemlidir?",
        answer: "İkisi de farklı şeyler söyler ve birbirini tamamlar. VKİ, genel bir kilo kategorizasyonu için hızlı bir tarama aracıdır. Vücut yağ oranı ise vücut kompozisyonu hakkında daha detaylı bilgi verir. Sağlığın bütüncül bir değerlendirmesi için her iki metriğe de bakmak faydalı olabilir."
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
        resultTitle="Vücut Kompozisyonu Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}