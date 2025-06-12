import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

const pageConfig = {
  title: "Bel Kalça Oranı Hesaplama ve Sağlık Riski Değerlendirmesi",
  description: "Bel ve kalça çevrenizi ölçerek bel/kalça oranınızı hesaplayın. Bu oranın sağlık açısından taşıdığı risk seviyesini (düşük, orta, yüksek) öğrenin.",
  keywords: ["bel kalça oranı hesaplama", "sağlık riski", "vücut yağ dağılımı", "abdominal obezite"],
  calculator: {
    title: "Bel / Kalça Oranı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Cinsiyetinizi seçip ölçümleri girerek sağlık riskinizi değerlendirin.
      </p>
    ),
    inputFields: [
      { id: 'cinsiyet', label: 'Cinsiyet', type: 'select', options: [{ value: 'kadin', label: 'Kadın' }, { value: 'erkek', label: 'Erkek' }], defaultValue: 'kadin' },
      { id: 'belCevresi', label: 'Bel Çevresi (cm)', type: 'number', placeholder: '75' },
      { id: 'kalcaCevresi', label: 'Kalça Çevresi (cm)', type: 'number', placeholder: '95' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { cinsiyet, belCevresi, kalcaCevresi } = inputs as { cinsiyet: 'kadin' | 'erkek', belCevresi: number, kalcaCevresi: number };

        if (!belCevresi || !kalcaCevresi || belCevresi <= 0 || kalcaCevresi <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bel ve kalça çevresi değerleri girin.' } } };
        }

        const oran = belCevresi / kalcaCevresi;
        let risk = '';
        let riskRenk = '';

        if (cinsiyet === 'kadin') {
            if (oran <= 0.80) {
                risk = 'Düşük Risk';
                riskRenk = 'text-green-600';
            } else if (oran <= 0.85) {
                risk = 'Orta Risk';
                riskRenk = 'text-orange-600';
            } else {
                risk = 'Yüksek Risk';
                riskRenk = 'text-red-600';
            }
        } else { // erkek
            if (oran <= 0.95) {
                risk = 'Düşük Risk';
                riskRenk = 'text-green-600';
            } else if (oran <= 1.0) {
                risk = 'Orta Risk';
                riskRenk = 'text-orange-600';
            } else {
                risk = 'Yüksek Risk';
                riskRenk = 'text-red-600';
            }
        }
        
        const summary: CalculationResult['summary'] = {
            oran: { type: 'result', label: 'Bel / Kalça Oranınız', value: formatNumber(oran, 2), isHighlighted: true },
            risk: { type: 'info', label: 'Sağlık Riski Kategorisi', value: risk, className: riskRenk },
        };
          
        return { summary, disclaimer: "Bu hesaplama genel bir göstergedir ve tek başına tıbbi bir teşhis aracı değildir. Sağlığınızla ilgili kesin bir değerlendirme için doktora danışın." };
    },
  },
  content: {
    sections: [
      {
        title: "Bel/Kalça Oranı Nedir ve Neden Önemlidir?",
        content: (
          <>
            <p>
              Bel/kalça oranı, vücuttaki yağ dağılımı hakkında fikir veren basit bir ölçümdür. Özellikle karın bölgesindeki (abdominal) yağlanma, kalp-damar hastalıkları, tip 2 diyabet ve bazı kanser türleri için önemli bir risk faktörü olarak kabul edilir. Bu oranın yüksek olması, sağlık risklerinin de artabileceğine işaret eder.
            </p>
            <h4 className="font-semibold mt-3">Risk Kategorileri (DSÖ'ye göre):</h4>
            <ul className="list-disc list-inside space-y-2 mt-2 bg-gray-50 p-4 rounded-lg">
                <li><strong>Kadınlar için:</strong> 0.80 ve altı düşük risk, 0.81 - 0.85 arası orta risk, 0.85 üzeri yüksek risk.</li>
                <li><strong>Erkekler için:</strong> 0.95 ve altı düşük risk, 0.96 - 1.0 arası orta risk, 1.0 üzeri yüksek risk.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Bel ve kalça ölçüsü nasıl doğru alınır?",
        answer: "<strong>Bel Çevresi:</strong> Ayakta dik dururken, kaburgaların altı ile kalça kemiğinin üstü arasındaki orta noktadan ölçülür. Genellikle göbek deliği hizasıdır. Nefesinizi verdikten sonra ölçüm yapın. <strong>Kalça Çevresi:</strong> Kalçanın en geniş, en çıkıntılı yerinden ölçülür."
      },
      {
        question: "Bu oran Vücut Kitle İndeksi (VKİ) ile aynı şey mi?",
        answer: "Hayır, ikisi farklı ölçümlerdir. VKİ, boy ve kiloya dayalı bir genel ağırlık değerlendirmesidir. Bel/kalça oranı ise vücuttaki yağın nerede toplandığını gösterir. Bir kişinin VKİ'si normal olsa bile bel/kalça oranı yüksek olabilir, bu da 'merkezi obezite' olarak adlandırılır ve sağlık riski taşır."
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
        resultTitle="Oran ve Risk Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}