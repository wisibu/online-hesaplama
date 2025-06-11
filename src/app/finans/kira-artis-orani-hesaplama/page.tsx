import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Yasal Kira Artış Oranı Hesaplama (TÜFE) | OnlineHesaplama",
  description: "2024 yılı için yasal kira artış oranını kolayca hesaplayın. Mevcut kira bedelini ve TÜİK tarafından açıklanan 12 aylık TÜFE ortalamasını kullanarak yeni kira tutarınızı öğrenin.",
  keywords: ["kira artış oranı hesaplama", "yasal kira zammı", "TÜFE kira artışı", "ev kirası hesaplama", "iş yeri kira zammı"],
  calculator: {
    title: "Kira Artış Oranı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Yasal olarak belirlenen üst sınıra göre kira artışınızı hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'currentRent', label: 'Mevcut Kira Bedeli (₺)', type: 'number', placeholder: '10000' },
      { id: 'tufeRate', label: '12 Aylık TÜFE Ortalaması (%)', type: 'number', placeholder: 'Örn: 59.64' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
      'use server';
      const currentRent = Number(inputs.currentRent);
      const tufeRate = Number(inputs.tufeRate) / 100;

      if (currentRent <= 0 || tufeRate <= 0) {
        return null;
      }
      
      // Yasal sınır, konutlar için %25, işyerleri için TÜFE'dir. Ancak kanun değişebilir.
      // Şimdilik genel bir TÜFE hesaplaması yapıyoruz ve notlarda bilgi veriyoruz.
      const rentIncreaseAmount = currentRent * tufeRate;
      const newRent = currentRent + rentIncreaseAmount;
      const twentyFivePercentIncrease = currentRent * 0.25;
      const newRentWithCap = currentRent + twentyFivePercentIncrease;

      const summary = {
        increaseAmount: { label: 'Kira Artış Tutarı (TÜFE)', value: formatCurrency(rentIncreaseAmount) },
        newRent: { label: 'Yeni Kira Tutarı (TÜFE)', value: formatCurrency(newRent) },
        increaseAmountCapped: { label: 'Kira Artış Tutarı (%25 Yasal Sınır)', value: formatCurrency(twentyFivePercentIncrease) },
        newRentCapped: { label: 'Yeni Kira Tutarı (%25 Yasal Sınır)', value: formatCurrency(newRentWithCap) },
      };

      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Yasal Kira Artış Oranı Nedir ve Nasıl Hesaplanır?",
        content: (
          <p>
            Türkiye'de kira artış oranları, Borçlar Kanunu tarafından düzenlenmektedir. Konut kiraları için artış oranı, bir önceki kira yılının Tüketici Fiyat Endeksi'nin (TÜFE) on iki aylık ortalaması değişim oranını geçemez. Ancak, hükümet tarafından geçici olarak getirilen ve belirli bir tarihe kadar uzatılan <strong>%25'lik kira artış sınırı</strong> gibi ek düzenlemeler de mevcuttur. İş yerleri için ise bu %25'lik sınır geçerli olmayıp, TÜFE oranı tavan olarak kullanılmaya devam etmektedir. Bu nedenle hesaplama aracımız her iki sonucu da göstermektedir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Ev sahibim %25'ten fazla zam yapabilir mi?",
        answer: "Hayır. Hukuken, konut kiraları için belirlenen yasal sınırın (%25 veya kanunla belirlenen diğer oranlar) üzerinde bir artış yapılması mümkün değildir. Kiracı, bu sınırın üzerindeki bir artışı kabul etmek zorunda değildir."
      },
      {
        question: "12 aylık TÜFE oranını nereden öğrenebilirim?",
        answer: "12 aylık TÜFE ortalaması, her ayın başında Türkiye İstatistik Kurumu (TÜİK) tarafından resmi olarak açıklanmaktadır. Bu veriyi TÜİK'in web sitesinden takip edebilirsiniz."
      },
      {
        question: "Kira sözleşmemizde farklı bir oran yazıyorsa ne olur?",
        answer: "Kira sözleşmesinde belirtilen artış oranı, yasal üst sınırdan (TÜFE veya %25 sınırı) daha yüksekse geçersizdir. Bu durumda yasal üst sınır uygulanır. Eğer sözleşmedeki oran yasal sınırdan daha düşükse, sözleşmedeki düşük oran geçerli olur."
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
        resultTitle="Kira Artış Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}