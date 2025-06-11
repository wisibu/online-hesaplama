import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Yıllık İzin Süresi Hesaplama | OnlineHesaplama",
  description: "İşe giriş tarihinize göre kanunen hak ettiğiniz yıllık ücretli izin günü sayısını kolayca hesaplayın.",
  keywords: ["yıllık izin hesaplama", "yıllık izin süresi", "izin günü hesaplama", "kıdeme göre izin"],
  calculator: {
    title: "Yıllık İzin Süresi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        İşe başlangıç tarihinizi girerek hizmet sürenize (kıdeminize) göre hak kazandığınız yıllık ücretli izin günü sayısını öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'startDate', label: 'İşe Giriş Tarihi', type: 'date' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';

        const startDateStr = inputs.startDate as string;
        if (!startDateStr) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen işe giriş tarihini seçin.' } } };
        }

        const startDate = new Date(startDateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(startDate.getTime()) || startDate > today) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir işe giriş tarihi girin.' } } };
        }

        const differenceInMs = today.getTime() - startDate.getTime();
        const yearsOfService = differenceInMs / (1000 * 60 * 60 * 24 * 365.25);

        if (yearsOfService < 1) {
             return {
                summary: {
                    serviceDuration: { label: 'Hizmet Süreniz', value: `${Math.floor(yearsOfService * 12)} ay ${Math.floor(yearsOfService * 365.25 % 30.44)} gün` },
                    annualLeaveDays: { label: 'Hak Edilen İzin Günü', value: '0 gün' },
                    info: { label: 'Bilgi', value: 'Yıllık izne hak kazanmak için en az 1 yıl çalışmış olmak gerekir.' }
                }
            };
        }

        let leaveDays: number;
        if (yearsOfService >= 1 && yearsOfService < 5) {
            leaveDays = 14;
        } else if (yearsOfService >= 5 && yearsOfService < 15) {
            leaveDays = 20;
        } else {
            leaveDays = 26;
        }

        const serviceYears = Math.floor(yearsOfService);
        const serviceMonths = Math.floor((yearsOfService - serviceYears) * 12);

        const summary: CalculationResult['summary'] = {
            serviceDuration: { label: 'Hizmet Süreniz', value: `${serviceYears} yıl ${serviceMonths} ay` },
            annualLeaveDays: { label: 'Hak Edilen Yıllık İzin Günü', value: `${leaveDays} iş günü` },
        };

        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yıllık İzin Hakkı Nedir ve Süresi Nasıl Belirlenir?",
        content: (
          <>
            <p>
              Yıllık ücretli izin, işçilerin bir yıl boyunca çalışmalarının karşılığı olarak dinlenmeleri için verilen anayasal bir haktır. 4857 sayılı İş Kanunu'na göre, bir işyerinde deneme süresi de dahil olmak üzere en az bir yıl çalışmış olan işçiler yıllık ücretli izne hak kazanır.
            </p>
            <p className="mt-2">
              Hak edilen yıllık izin süresi, işçinin aynı işverene bağlı olarak çalıştığı toplam süreye (kıdemine) göre değişiklik gösterir. Kanunda belirtilen minimum süreler şöyledir:
            </p>
            <ul className="list-disc list-inside mt-2 pl-4">
              <li>1 yıldan 5 yıla kadar (beşinci yıl dahil) olanlara: <strong>14 gün</strong></li>
              <li>5 yıldan fazla 15 yıldan az olanlara: <strong>20 gün</strong></li>
              <li>15 yıl (dahil) ve daha fazla olanlara: <strong>26 gün</strong></li>
            </ul>
            <p className="mt-2">
              Ayrıca, on sekiz ve daha küçük yaştaki işçilerle elli ve daha yukarı yaştaki işçilere verilecek yıllık ücretli izin süresi <strong>20 günden</strong> az olamaz. Bu süreler asgari süreler olup, iş sözleşmeleri veya toplu iş sözleşmeleri ile artırılabilir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "İşe yeni başladım, ne zaman izne hak kazanırım?",
        answer: "Yıllık ücretli izne hak kazanabilmek için, deneme süresi de dahil olmak üzere, işe başladığınız tarihten itibaren en az tam bir yıl çalışmanız gerekmektedir."
      },
      {
        question: "Yıllık izin süreleri iş günü mü, takvim günü mü?",
        answer: "Yıllık izin süreleri iş günü olarak hesaplanır. İzin süresine denk gelen hafta tatili, ulusal bayram ve genel tatil günleri izin süresinden sayılmaz."
      },
      {
        question: "Kullanılmayan yıllık izinler yanar mı?",
        answer: "Kullanılmayan yıllık izin hakları yanmaz. İş sözleşmesi herhangi bir nedenle sona erdiğinde, işçinin hak edip de kullanmadığı yıllık izin sürelerine ait ücret, son ücreti üzerinden kendisine ödenir."
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
        resultTitle="Yıllık İzin Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}