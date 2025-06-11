import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Lise Ortalama Hesaplama (Ağırlıklı) | OnlineHesaplama",
  description: "Ders notlarınızı ve haftalık ders saatlerinizi girerek lise dönem sonu ağırlıklı not ortalamanızı kolayca hesaplayın. Takdir ve teşekkür belgesi durumunuzu öğrenin.",
  keywords: ["lise ortalama hesaplama", "ağırlıklı ortalama hesaplama", "takdir teşekkür hesaplama", "karne ortalaması hesaplama"],
  calculator: {
    title: "Lise Dönem Sonu Ağırlıklı Ortalama Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Ders notlarınızı ve haftalık ders saatlerini girerek karne ortalamanızı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'note1', label: 'Ders 1 Notu', type: 'number', placeholder: '90' },
      { id: 'weight1', label: 'Ders 1 Saati', type: 'number', placeholder: '6' },
      { id: 'note2', label: 'Ders 2 Notu', type: 'number', placeholder: '80' },
      { id: 'weight2', label: 'Ders 2 Saati', type: 'number', placeholder: '4' },
      { id: 'note3', label: 'Ders 3 Notu', type: 'number', placeholder: '75' },
      { id: 'weight3', label: 'Ders 3 Saati', type: 'number', placeholder: '4' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const courses: { note: number, weight: number }[] = [];
        const inputKeys = Object.keys(inputs);
        
        for (let i = 1; ; i++) {
            const noteKey = `note${i}`;
            const weightKey = `weight${i}`;
            if (inputKeys.includes(noteKey) && inputKeys.includes(weightKey)) {
                const note = Number(inputs[noteKey]);
                const weight = Number(inputs[weightKey]);
                if (isNaN(note) || isNaN(weight) || note < 0 || note > 100 || weight <= 0) {
                    continue;
                }
                courses.push({ note, weight });
            } else {
                break;
            }
        }

        if (courses.length === 0) return null;
        
        let totalWeightedScore = 0;
        let totalWeight = 0;
        courses.forEach(course => {
            totalWeightedScore += course.note * course.weight;
            totalWeight += course.weight;
        });

        if (totalWeight === 0) return null;

        const weightedAverage = totalWeightedScore / totalWeight;
        
        let certificateStatus = "Belge Yok";
        if (weightedAverage >= 85.00) {
            certificateStatus = "Takdir Belgesi";
        } else if (weightedAverage >= 70.00) {
            certificateStatus = "Teşekkür Belgesi";
        }

        const summary = {
            weightedAverage: { label: 'Ağırlıklı Dönem Ortalaması', value: formatNumber(weightedAverage) },
            totalCredit: { label: 'Toplam Ders Saati', value: totalWeight.toString() },
            certificateStatus: { label: 'Belge Durumu', value: certificateStatus },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Lise Ağırlıklı Ortalama Nasıl Hesaplanır?",
        content: (
          <p>
            Lisede dönem sonu veya yıl sonu ağırlıklı ortalama, her bir dersin notu ile o dersin haftalık ders saatinin çarpılması ve bu çarpımların toplamının, toplam haftalık ders saatine bölünmesiyle hesaplanır. Haftalık ders saati daha fazla olan dersler (örneğin Matematik, Edebiyat), ortalamayı daha çok etkiler. Bu ortalama, takdir veya teşekkür belgesi alıp alamayacağınızı ve yıl sonu başarı puanınızı belirler.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Takdir ve Teşekkür belgesi için ortalama kaç olmalı?",
        answer: "Milli Eğitim Bakanlığı yönetmeliğine göre, dönem sonunda 70.00 - 84.99 arası ortalamaya sahip öğrenciler Teşekkür Belgesi, 85.00 ve üzeri ortalamaya sahip öğrenciler ise Takdir Belgesi alırlar. Ayrıca, belge alabilmek için hiçbir dersin zayıf (50'nin altında) olmaması gerekmektedir."
      },
      {
        question: "Haftalık ders saatini nereden öğrenebilirim?",
        answer: "Haftalık ders saatlerini, okulunuzun size verdiği ders programından veya e-Okul sisteminden kolayca öğrenebilirsiniz."
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
        resultTitle="Lise Ortalama Sonuçları"
        dynamicFieldsConfig={{
          type: 'paired',
          buttonLabel: 'Ders Ekle',
          fieldLabel: 'Ders Notu',
          pairedFieldLabel: 'Ders Saati'
        }}
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}