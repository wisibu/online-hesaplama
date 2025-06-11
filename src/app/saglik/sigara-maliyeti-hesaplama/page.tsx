import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Sigara Maliyeti Hesaplama | Ne Kadar Tasarruf Edebilirsiniz?",
  description: "Günde kaç adet sigara içtiğinizi ve paket fiyatını girerek sigaranın size olan haftalık, aylık ve yıllık maliyetini hesaplayın. Bırakarak ne kadar tasarruf edebileceğinizi görün.",
  keywords: ["sigara maliyeti hesaplama", "sigarayı bırakma", "tasarruf hesaplama", "sigara parası"],
  calculator: {
    title: "Sigara Maliyeti Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Bu alışkanlığın bütçenize olan etkisini net rakamlarla görün.
      </p>
    ),
    inputFields: [
      { id: 'gunlukSigara', label: 'Günde İçilen Sigara Sayısı (Adet)', type: 'number', placeholder: '15' },
      { id: 'paketFiyati', label: 'Bir Paket Sigaranın Fiyatı (TL)', type: 'number', placeholder: '60' },
      { id: 'pakettekiSigara', label: 'Paketteki Sigara Sayısı (Adet)', type: 'number', defaultValue: '20' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { gunlukSigara, paketFiyati, pakettekiSigara } = inputs as { gunlukSigara: number, paketFiyati: number, pakettekiSigara: number };

        if (!gunlukSigara || !paketFiyati || !pakettekiSigara || gunlukSigara <= 0 || paketFiyati <= 0 || pakettekiSigara <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanlara geçerli pozitif değerler girin.' } } };
        }

        const tekSigaraFiyati = paketFiyati / pakettekiSigara;
        const gunlukMaliyet = gunlukSigara * tekSigaraFiyati;
        const haftalikMaliyet = gunlukMaliyet * 7;
        const aylikMaliyet = gunlukMaliyet * 30.44; // Ortalama ay günü
        const yillikMaliyet = gunlukMaliyet * 365.25; // Ortalama yıl günü

        const summary: CalculationResult['summary'] = {
            gunluk: { label: "Günlük Maliyet", value: formatCurrency(gunlukMaliyet) },
            haftalik: { label: "Haftalık Maliyet", value: formatCurrency(haftalikMaliyet) },
            aylik: { label: "Aylık Maliyet", value: formatCurrency(aylikMaliyet), isHighlighted: true },
            yillik: { label: "Yıllık Maliyet", value: formatCurrency(yillikMaliyet), isHighlighted: true },
            besYillik: { label: "5 Yılda Tasarruf", value: formatCurrency(yillikMaliyet * 5) },
            onYillik: { label: "10 Yılda Tasarruf", value: formatCurrency(yillikMaliyet * 10) },
        };
          
        return { summary, disclaimer: "Bu hesaplama, ortalama değerlere dayanmaktadır ve enflasyon gibi faktörleri içermez. Gerçek maliyetler değişiklik gösterebilir." };
    },
  },
  content: {
    sections: [
      {
        title: "Sigaranın Maliyeti Sadece Cüzdanınıza Değil, Sağlığınıza da Yansır",
        content: (
          <>
            <p>
              Sigara içmek, sadece pahalı bir alışkanlık değil, aynı zamanda sağlığınız için de ödediğiniz büyük bir bedeldir. Hesaplayıcımızla ortaya çıkan rakamlar, bu alışkanlığın sadece bütçenizi nasıl etkilediğini gösterir. Ancak asıl maliyet, sigaranın neden olduğu veya riskini artırdığı sayısız sağlık sorunudur.
            </p>
            <p className="mt-2">
              Sigarayı bırakarak elde edeceğiniz tasarrufu bir araba peşinatı, harika bir tatil veya bir yatırım başlangıcı olarak düşünebilirsiniz. En önemlisi, bu parayı sağlığınızı geri kazanmak ve daha uzun, daha kaliteli bir yaşam sürmek için kullanabilirsiniz.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Sigarayı bırakmak için nereden yardım alabilirim?",
        answer: "Türkiye'de sigarayı bırakma konusunda birçok destek mekanizması bulunmaktadır. Sağlık Bakanlığı'nın ALO 171 Sigara Bırakma Danışma Hattı'nı arayabilir, Aile Sağlığı Merkezinizdeki doktorunuzdan veya yakınınızdaki Sigara Bırakma Polikliniklerinden profesyonel destek ve ücretsiz ilaç tedavisi hakkında bilgi alabilirsiniz."
      },
      {
        question: "İlk denemede başaramadım, tekrar denemeli miyim?",
        answer: "Kesinlikle evet. Sigarayı bırakma süreci çoğu kişi için zordur ve birkaç deneme gerektirebilir. Her deneme bir tecrübedir. Neden yeniden başladığınızı analiz etmek ve bir sonraki denemenizde bu tetikleyicilerden kaçınmak, başarı şansınızı artıracaktır. Asla pes etmeyin!"
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
        resultTitle="Finansal ve Sağlık Tasarrufunuz"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}