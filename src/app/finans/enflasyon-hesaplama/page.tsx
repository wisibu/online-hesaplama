import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

const pageConfig = {
  title: "Enflasyon Hesaplama: Paranın Değeri ve Alım Gücü | OnlineHesaplama",
  description: "Yıllar içindeki enflasyona göre paranın alım gücündeki değişimi hesaplayın. Geçmişteki bir paranın bugünkü değerini veya bugünkü paranın gelecekteki değerini öğrenin.",
  keywords: ["enflasyon hesaplama", "paranın bugünkü değeri", "alım gücü hesaplama", "enflasyon oranı", "reel değer"],
  calculator: {
    title: "Enflasyon Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Paranızın zaman içindeki değer değişimini ve alım gücünü hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'tutar', label: 'Para Tutarı (₺)', type: 'number', placeholder: '1000' },
      { id: 'baslangicYili', label: 'Başlangıç Yılı', type: 'number', placeholder: '2010' },
      { id: 'bitisYili', label: 'Bitiş Yılı', type: 'number', placeholder: new Date().getFullYear() },
      { id: 'enflasyonOrani', label: 'Ortalama Yıllık Enflasyon Oranı (%)', type: 'number', placeholder: '25' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      const tutar = Number(inputs.tutar);
      const baslangicYili = Number(inputs.baslangicYili);
      const bitisYili = Number(inputs.bitisYili);
      const yillikEnflasyonOrani = Number(inputs.enflasyonOrani) / 100;

      if (tutar <= 0 || baslangicYili <= 1900 || bitisYili <= 1900 || yillikEnflasyonOrani <= 0) {
        return null;
      }
      
      const yilFarki = bitisYili - baslangicYili;
      if (yilFarki === 0) {
          return { summary: { info: { type: 'info', label: 'Bilgi', value: 'Başlangıç ve bitiş yılı aynı olduğu için değer değişimi olmaz.' } } };
      }

      const gelecekDeger = tutar * Math.pow(1 + yillikEnflasyonOrani, yilFarki);
      const artisMiktari = gelecekDeger - tutar;
      const alimGucuKaybiYuzde = (1 - (tutar / gelecekDeger)) * 100;

      const summary: CalculationResult['summary'] = {
        sonuc: { type: 'result', label: `${baslangicYili} yılındaki ${formatCurrency(tutar)}`, value: `${bitisYili} yılında ${formatCurrency(gelecekDeger)} değerindedir.`, isHighlighted: true },
        artis: { type: 'info', label: 'Değer Artışı (Nominal)', value: formatCurrency(artisMiktari) },
        alimGucu: { type: 'info', label: 'Alım Gücü Kaybı', value: `%${alimGucuKaybiYuzde.toFixed(2)}` },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Enflasyon ve Paranın Zaman Değeri",
        content: (
          <>
            <p>
              Enflasyon, mal ve hizmetlerin fiyatlarının zaman içinde artması ve bunun sonucunda paranın alım gücünün düşmesidir. Bugün 100 TL ile alabildiğiniz ürünleri, bir yıl sonra aynı miktarla alamazsınız. Paranın zaman değeri kavramı da tam olarak bunu ifade eder: Belirli bir miktar paranın bugünkü değeri, gelecekteki aynı miktar paradan daha fazladır, çünkü bugünkü para yatırım yapılarak büyütülebilir.
            </p>
             <p className="mt-2">
              Bu hesaplayıcı, girdiğiniz ortalama yıllık enflasyon oranını kullanarak, belirli bir para miktarının farklı yıllar arasındaki nominal değerini ve alım gücü değişimini gösterir.
            </p>
          </>
        )
      }
    ],
    faqs: [
        {
            question: "Bu hesaplayıcı gerçek TÜİK verilerini mi kullanıyor?",
            answer: "Hayır. Bu araç, kullanıcı tarafından girilen 'ortalama yıllık enflasyon oranı' varsayımına göre matematiksel bir hesaplama yapar. Geçmiş yılların gerçek ve kesin TÜFE (Tüketici Fiyat Endeksi) verilerine dayalı bir hesaplama yapmaz. Farklı yıllar arasındaki gerçek enflasyonu hesaplamak için TÜİK'in resmi verileri kullanılmalıdır. Bu araç, daha çok geleceğe yönelik bir projeksiyon veya paranın değeri kavramını anlamak için bir simülasyon aracıdır."
        },
        {
            question: "Alım gücü kaybı ne anlama geliyor?",
            answer: "Alım gücü kaybı, enflasyon nedeniyle paranızın ne kadar değer kaybettiğini yüzde olarak gösterir. Örneğin, %50 alım gücü kaybı, geçmişte 100 TL'ye alabildiğiniz bir sepeti bugün alabilmek için 200 TL'ye ihtiyacınız olduğu anlamına gelir."
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
        resultTitle="Enflasyon Etkisi Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}
