import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Takdir Teşekkür Hesaplama (Lise & Ortaokul) | OnlineHesaplama",
  description: "Ders notlarınızı ve haftalık ders saatlerinizi girerek dönem sonu ağırlıklı ortalamanızı hesaplayın ve Takdir ya da Teşekkür Belgesi alıp alamayacağınızı öğrenin.",
  keywords: ["takdir teşekkür hesaplama", "karne ortalaması hesaplama", "belge hesaplama", "ağırlıklı ortalama"],
  calculator: {
    title: "Takdir ve Teşekkür Belgesi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Tüm derslerinizin notlarını ve haftalık ders saatlerini girerek ağırlıklı ortalamanızı ve belge durumunuzu anında öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'note1', label: 'Ders 1 Notu', type: 'number', placeholder: '95' },
      { id: 'weight1', label: 'Ders 1 Saati', type: 'number', placeholder: '6' },
      { id: 'note2', label: 'Ders 2 Notu', type: 'number', placeholder: '85' },
      { id: 'weight2', label: 'Ders 2 Saati', type: 'number', placeholder: '4' },
      { id: 'note3', label: 'Ders 3 Notu', type: 'number', placeholder: '70' },
      { id: 'weight3', label: 'Ders 3 Saati', type: 'number', placeholder: '3' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const courses: { note: number, weight: number }[] = [];
        const inputKeys = Object.keys(inputs);
        let hasFailedCourse = false;
        
        for (let i = 1; ; i++) {
            const noteKey = `note${i}`;
            const weightKey = `weight${i}`;
            if (inputKeys.includes(noteKey) && inputKeys.includes(weightKey)) {
                const note = Number(inputs[noteKey]);
                const weight = Number(inputs[weightKey]);
                if (isNaN(note) || isNaN(weight) || note < 0 || note > 100 || weight <= 0) {
                    continue;
                }
                if (note < 50) {
                    hasFailedCourse = true;
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
        
        let certificateStatus = "Belge Alınamıyor";
        let statusMessage = "";

        if (hasFailedCourse) {
          statusMessage = "Zayıf dersiniz olduğu için belge alamazsınız.";
        } else if (weightedAverage >= 85.00) {
            certificateStatus = "Takdir Belgesi 🎉";
            statusMessage = "Tebrikler, bu ortalama ile Takdir Belgesi almaya hak kazandınız!";
        } else if (weightedAverage >= 70.00) {
            certificateStatus = "Teşekkür Belgesi ✔️";
            statusMessage = "Tebrikler, bu ortalama ile Teşekkür Belgesi almaya hak kazandınız!";
        } else {
            statusMessage = "Ortalamanız belge almak için yeterli değil.";
        }

        const summary = {
            weightedAverage: { label: 'Ağırlıklı Dönem Ortalaması', value: formatNumber(weightedAverage) },
            certificateStatus: { label: 'Belge Durumu', value: certificateStatus },
            statusMessage: { label: 'Açıklama', value: statusMessage },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Takdir ve Teşekkür Belgesi Nasıl Alınır?",
        content: (
          <p>
            Ortaokul ve lise öğrencilerinin dönem sonunda Takdir veya Teşekkür Belgesi alabilmesi için belirli koşulları sağlaması gerekir. Temel koşul, ağırlıklı not ortalamasıdır. Ancak ortalama yeterli olsa bile, herhangi bir dersten zayıf (50'nin altında not) olmaması şartı aranır. Bu hesaplayıcı, hem ortalamanızı hesaplar hem de zayıf ders kontrolü yaparak size en doğru sonucu verir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Belge almak için ortalama kaç olmalı?",
        answer: "Dönem sonu ağırlıklı not ortalaması 70.00 ile 84.99 arasında olanlar Teşekkür Belgesi, 85.00 ve üzeri olanlar ise Takdir Belgesi alır."
      },
      {
        question: "Zayıf dersim varsa belge alabilir miyim?",
        answer: "Hayır. Milli Eğitim Bakanlığı yönetmeliğine göre, Takdir veya Teşekkür belgesi alabilmek için öğrencinin tüm derslerden başarılı olması, yani 50'nin altında notunun bulunmaması gerekir. Ortalamanız 85'in üzerinde bile olsa, tek bir zayıf dersiniz belge almanıza engel olur."
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
        resultTitle="Karne ve Belge Durumu Sonuçları"
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