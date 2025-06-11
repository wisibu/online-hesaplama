import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult, TableData } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';
import { calculateIncomeTax, TaxBreakdown } from '../../../utils/tax';

const ISTISNA_2024 = 87000;

const pageConfig = {
  title: "Değer Artış Kazancı Vergisi Hesaplama | OnlineHesaplama",
  description: "Gayrimenkul veya diğer mal ve hakların satışından elde edilen değer artış kazancı vergisini 2024 yılı verilerine göre hesaplayın.",
  keywords: ["değer artış kazancı vergisi", "gayrimenkul satış vergisi", "tapu satış vergisi hesaplama"],
  calculator: {
    title: "Değer Artış Kazancı Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Alış ve satış bilgilerini girerek vergiye tabi kazancı ve ödemeniz gereken gelir vergisini öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'purchasePrice', label: 'Alış Fiyatı (Maliyet Bedeli)', type: 'number', placeholder: '1000000' },
      { id: 'salePrice', label: 'Satış Fiyatı', type: 'number', placeholder: '2000000' },
      { id: 'expenses', label: 'Yapılan Masraflar (Tapu, komisyon vb.)', type: 'number', placeholder: '50000' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';

      const purchasePrice = Number(inputs.purchasePrice);
      const salePrice = Number(inputs.salePrice);
      const expenses = Number(inputs.expenses || 0);

      if (isNaN(purchasePrice) || isNaN(salePrice) || purchasePrice <= 0 || salePrice <= 0) {
        return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli alış ve satış fiyatları girin.' } } };
      }
       if (salePrice < purchasePrice) {
        return { summary: { info: { label: 'Bilgi', value: 'Satış fiyatı alış fiyatından düşük olduğu için değer artış kazancı oluşmamıştır.' } } };
      }

      // ÜFE ile endeksleme bu basit hesaplayıcıda ihmal edilmiştir.
      const grossProfit = salePrice - purchasePrice - expenses;
      
      if (grossProfit <= 0) {
        return { summary: { info: { label: 'Bilgi', value: 'Maliyet ve masraflar düşüldüğünde kar elde edilmediği için vergi oluşmamıştır.' } } };
      }
      
      const taxableProfit = grossProfit - ISTISNA_2024;

       if (taxableProfit <= 0) {
        return { summary: { 
            grossProfit: { label: 'Safi Değer Artışı (Kar)', value: formatCurrency(grossProfit) },
            info: { label: 'Bilgi', value: `Kazancınız ${formatCurrency(ISTISNA_2024)} olan 2024 yılı istisna tutarının altında kaldığı için vergiye tabi değildir.` } 
        } };
      }
      
      const incomeTax = calculateIncomeTax(taxableProfit);

      const summary: CalculationResult['summary'] = {
        salePrice: { label: 'Satış Fiyatı', value: formatCurrency(salePrice) },
        totalCost: { label: 'Toplam Maliyet (Alış + Masraflar)', value: formatCurrency(purchasePrice + expenses) },
        grossProfit: { label: 'Safi Değer Artışı (Kar)', value: formatCurrency(grossProfit) },
        exemption: { label: '2024 Yılı İstisna Tutarı', value: formatCurrency(ISTISNA_2024) },
        taxableProfit: { label: 'Vergiye Tabi Matrah', value: formatCurrency(taxableProfit) },
        incomeTax: { label: 'Hesaplanan Gelir Vergisi', value: formatCurrency(incomeTax.totalTax), isHighlighted: true },
      };
      
      const table: CalculationResult['table'] = {
        headers: ['Vergi Dilimi', 'Bu Dilimdeki Matrah', 'Hesaplanan Vergi'],
        rows: incomeTax.breakdown.map((b: TaxBreakdown) => [b.bracket, formatCurrency(b.taxable), formatCurrency(b.tax)])
      };

      return { summary, table };
    },
  },
   content: {
    sections: [
      {
        title: "Değer Artış Kazancı Vergisi Nedir?",
        content: (
          <p>
            Değer artış kazancı vergisi, Gelir Vergisi Kanunu'nda belirtilen mal ve hakların (genellikle gayrimenkuller) belirli bir süre içinde elden çıkarılmasından doğan kazancın vergilendirilmesidir. Eğer bir gayrimenkulü satın aldıktan sonra ilk 5 yıl içinde satarsanız ve bu satıştan bir kar elde ederseniz, bu kar değer artış kazancı olarak kabul edilir ve gelir vergisine tabi olur.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Hangi durumlarda bu vergi ödenmez?",
        answer: "Gayrimenkuller için, satın alma tarihinden itibaren 5 tam yıl geçtikten sonra yapılan satışlardan elde edilen kazançlar bu vergiye tabi değildir. Ayrıca, miras veya bağış yoluyla edinilen malların satışı da değer artış kazancı vergisine girmez."
      },
      {
        question: "İstisna tutarı ne demektir?",
        answer: "Devlet her yıl bir istisna tutarı belirler. Elde ettiğiniz toplam karın bu tutar kadar olan kısmı vergiden muaftır. Vergi, sadece istisna tutarını aşan kazanç kısmı için hesaplanır. 2024 yılı için bu istisna tutarı 87.000 TL'dir."
      },
      {
        question: "Maliyet bedeli nasıl hesaplanır?",
        answer: "Maliyet bedeli, gayrimenkulün alış fiyatıdır. Ancak, enflasyonun etkisini azaltmak için, alış fiyatı, satışın yapıldığı aydan bir önceki ayın Yurt İçi Üretici Fiyat Endeksi (Yİ-ÜFE) ile günümüz değerine endekslenebilir. Bu hesaplayıcı basitlik adına endeksleme yapmamaktadır."
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
        resultTitle="Vergi Hesaplama Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}