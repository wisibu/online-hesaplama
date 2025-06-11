import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatNumber } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Lise Sınıf Geçme Hesaplama | OnlineHesaplama",
  description: "Yıl sonu ortalamanızı ve zayıf ders sayınızı girerek lisede sınıfı doğrudan geçme, sorumlu geçme veya tekrar etme durumunuzu anında öğrenin.",
  keywords: ["sınıf geçme hesaplama", "lise sınıf geçme", "sorumlu geçme", "sınıfta kalma", "lise ortalama"],
  calculator: {
    title: "Lise Sınıf Geçme Durumu Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yıl sonu başarı puanınızı (YBP) ve zayıf (50'nin altında) ders sayınızı girerek sınıf geçme durumunuzu öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'average', label: 'Yıl Sonu Başarı Puanı (YBP)', type: 'number', placeholder: '75.50' },
      { id: 'failedCourses', label: 'Zayıf Ders Sayısı', type: 'number', placeholder: '2' },
      { id: 'isFirstLanguageFailed', label: 'Birinci Yabancı Dil (Edebiyat) Dersi Zayıf mı?', type: 'select', options: [
        { value: 'no', label: 'Hayır' },
        { value: 'yes', label: 'Evet' },
      ]},
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const average = Number(inputs.average);
        const failedCourses = Number(inputs.failedCourses);
        const isFirstLanguageFailed = inputs.isFirstLanguageFailed === 'yes';

        if (isNaN(average) || isNaN(failedCourses) || average < 0 || average > 100 || failedCourses < 0) {
            return null;
        }

        let status = "";
        let explanation = "";

        if (isFirstLanguageFailed) {
            status = "Sınıf Tekrarı (Baraj Ders)";
            explanation = "Türk Dili ve Edebiyatı dersi 'baraj ders' (sorumlu geçilemeyen ders) olduğu için bu dersten başarısız olan öğrenciler, ortalamaları ne olursa olsun doğrudan sınıf tekrarı yaparlar.";
        } else if (average >= 50 && failedCourses === 0) {
            status = "Doğrudan Geçtiniz";
            explanation = "Tebrikler! Yıl sonu başarı puanınız 50'nin üzerinde ve hiç zayıf dersiniz olmadığı için sınıfı doğrudan geçtiniz.";
        } else if (average >= 50 && failedCourses >= 1 && failedCourses <= 3) {
            status = "Sorumlu Geçtiniz";
            explanation = "Yıl sonu başarı puanınız 50'nin üzerinde olduğu için sınıfı geçtiniz, ancak en fazla 3 dersten zayıfınız olduğu için bu derslerden sorumlu olarak bir üst sınıfa geçersiniz. Sorumluluk sınavlarında bu dersleri vermeniz gerekir.";
        } else if (average >= 50 && failedCourses > 3) {
            status = "Sınıf Tekrarı (Çok Sayıda Zayıf)";
            explanation = "Yıl sonu başarı puanınız 50'nin üzerinde olsa bile, 3'ten fazla zayıf dersiniz olduğu için yönetmelik gereği sınıf tekrarı yapmanız gerekir.";
        } else { // average < 50
            status = "Sınıf Tekrarı (Düşük Ortalama)";
            explanation = "Yıl sonu başarı puanınız 50'nin altında olduğu için, zayıf sayınıza bakılmaksızın sınıf tekrarı yapmanız gerekir.";
        }

        const summary = {
            status: { label: 'Sonuç', value: status },
            explanation: { label: 'Açıklama', value: explanation },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Lisede Sınıf Geçme ve Kalma Yönetmeliği",
        content: (
          <p>
            Milli Eğitim Bakanlığı Ortaöğretim Kurumları Yönetmeliği'ne göre bir öğrencinin sınıfı geçmesi için temel şart, yıl sonu başarı puanının en az 50 olmasıdır. Ancak bu tek başına yeterli değildir. Ortalama 50'nin üzerinde olsa bile, zayıf ders sayısı ve bu derslerin niteliği de önemlidir. Özellikle Türk Dili ve Edebiyatı dersi 'baraj ders' olarak kabul edilir ve bu dersten başarısız olan öğrenciler, ortalamaları ne olursa olsun sınıfı geçemezler.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Sorumlu geçmek ne demektir?",
        answer: "Sorumlu geçmek, belirli derslerden başarısız olmanıza rağmen bir üst sınıfa devam etmeniz, ancak başarısız olduğunuz dersleri sonraki eğitim-öğretim yılı içinde verilen 'sorumluluk sınavları' ile başarma zorunluluğunuz olduğu anlamına gelir. Lise mezuniyeti için tüm sorumluluk sınavlarının verilmiş olması gerekir."
      },
      {
        question: "En fazla kaç dersten sorumlu geçilebilir?",
        answer: "Yıl sonu ortalamanız 50 ve üzeri ise, en fazla 3 dersten sorumlu olarak bir üst sınıfa geçebilirsiniz. 3'ten fazla zayıf dersiniz varsa, ortalamanız tutsa bile sınıfta kalırsınız."
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
        resultTitle="Sınıf Geçme Durumunuz"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}