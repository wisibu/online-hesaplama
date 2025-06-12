import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Sigara Parası Biriktirme Hesaplama | OnlineHesaplama",
  description: "Sigarayı bırakarak ne kadar tasarruf edebileceğinizi görün. Günlük, haftalık, aylık ve yıllık birikiminizi anında hesaplayın.",
  keywords: ["sigara parası hesaplama", "sigara tasarruf", "sigarayı bırakma", "birikim hesaplama"],
  calculator: {
    title: "Sigara Parası Biriktirme Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Sigarayı bırakarak elde edeceğiniz birikimi görmek için bilgileri doldurun.
      </p>
    ),
    inputFields: [
      { id: 'packsPerDay', label: 'Günde İçilen Paket Sayısı', type: 'number', placeholder: '1' },
      { id: 'pricePerPack', label: 'Paket Fiyatı (TL)', type: 'number', placeholder: '60' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const packsPerDay = Number(inputs.packsPerDay);
        const pricePerPack = Number(inputs.pricePerPack);

        if (isNaN(packsPerDay) || isNaN(pricePerPack) || packsPerDay <= 0 || pricePerPack <= 0) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli değerler girin.' } } };
        }

        const dailyCost = packsPerDay * pricePerPack;
        const weeklyCost = dailyCost * 7;
        const monthlyCost = dailyCost * 30; // Ortalama ay 30 gün
        const yearlyCost = dailyCost * 365;

        const summary: CalculationResult['summary'] = {
            daily: { type: 'info', label: 'Günlük Tasarruf', value: formatCurrency(dailyCost) },
            weekly: { type: 'info', label: 'Haftalık Tasarruf', value: formatCurrency(weeklyCost) },
            monthly: { type: 'result', label: 'Aylık Tasarruf', value: formatCurrency(monthlyCost) },
            yearly: { type: 'result', label: 'Yıllık Tasarruf', value: formatCurrency(yearlyCost), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Sigarayı Bırakmak Sadece Sağlığınıza Değil, Cebinize de İyi Gelir",
        content: (
          <p>
            Sigara içmek, ciddi sağlık sorunlarının yanı sıra önemli bir finansal yüktür. Her gün sigaraya harcanan para, küçük gibi görünse de, haftalar, aylar ve yıllar boyunca biriktiğinde şaşırtıcı derecede büyük bir meblağa ulaşır. Bu hesaplayıcı, sigara harcamalarınızı somut tasarruf rakamlarına dönüştürerek size finansal bir motivasyon sağlamayı amaçlar. Yıllık tasarrufunuzla neler yapabileceğinizi hayal edin: güzel bir tatil, yeni bir teknolojik cihaz veya bir yatırımın başlangıcı... Karar sizin.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Bu hesaplama sadece finansal motivasyon mu sağlar?",
        answer: "Hesaplamanın temel amacı finansal farkındalık yaratmaktır. Ancak, ortaya çıkan rakamlar aynı zamanda sağlığınızı ne kadar büyük bir yükten kurtardığınızın da bir göstergesi olabilir. Tasarruf ettiğiniz her kuruş, sağlığınıza yaptığınız bir yatırımdır."
      },
      {
        question: "Sigarayı bırakmak için nereden yardım alabilirim?",
        answer: "Sağlık Bakanlığı'nın ALO 171 Sigara Bırakma Danışma Hattı'nı arayabilir, aile hekiminizden veya göğüs hastalıkları uzmanlarından profesyonel destek alabilirsiniz. Sigarayı bırakma sürecinde yalnız değilsiniz."
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
        resultTitle="Sigara Tasarrufunuz"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 