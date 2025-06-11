import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult, ResultTable } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı Gelir Vergisi Dilimleri
const GELIR_VERGISI_DILIMLERI = [
    { limit: 110000, rate: 0.15, previousLimit: 0 },
    { limit: 230000, rate: 0.20, previousLimit: 110000 },
    { limit: 870000, rate: 0.27, previousLimit: 230000 },
    { limit: 3000000, rate: 0.35, previousLimit: 870000 },
    { limit: Infinity, rate: 0.40, previousLimit: 3000000 },
];

const calculateIncomeTax = (matrah: number, kümülatifMatrah: number) => {
    let toplamVergi = 0;
    const table: ResultTable = {
        title: "Vergi Dilimi Dökümü",
        headers: ["Vergi Dilimi (%)", "Bu Dilime Giren Tutar", "Hesaplanan Vergi"],
        rows: []
    };

    let kalanMatrah = matrah;
    let genelToplamMatrah = kümülatifMatrah;

    for (const dilim of GELIR_VERGISI_DILIMLERI) {
        if (kalanMatrah <= 0) break;

        const dilimBasi = dilim.previousLimit;
        const dilimSonu = dilim.limit;
        
        if (genelToplamMatrah < dilimSonu) {
            const dilimdeKullanilabilirAlan = dilimSonu - genelToplamMatrah;
            const buDilimeGirenTutar = Math.min(kalanMatrah, dilimdeKullanilabilirAlan);
            const vergi = buDilimeGirenTutar * dilim.rate;

            toplamVergi += vergi;
            table.rows.push([`%${dilim.rate * 100}`, formatCurrency(buDilimeGirenTutar), formatCurrency(vergi)]);
            
            kalanMatrah -= buDilimeGirenTutar;
            genelToplamMatrah += buDilimeGirenTutar;
        }
    }

    return { toplamVergi, table };
};

const pageConfig = {
  title: "Gelir Vergisi Hesaplama (2024 Vergi Dilimleri) | OnlineHesaplama",
  description: "2024 yılı güncel vergi dilimlerine göre gelir vergisi tutarınızı hesaplayın. Maaş, kira ve diğer gelirleriniz için vergi dökümünü anında görün.",
  keywords: ["gelir vergisi hesaplama", "vergi dilimleri 2024", "gelir vergisi", "maaş vergi hesaplama", "kira vergisi"],
  calculator: {
    title: "Gelir Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Vergiye tabi gelirinizi (matrah) girerek ödemeniz gereken gelir vergisini ve dilim dökümünü öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'matrah', label: 'Gelir Vergisi Matrahı (TL)', type: 'number', placeholder: '150000' },
      { id: 'kumulatifMatrah', label: 'Mevcut Kümülatif Vergi Matrahı (Varsa) (TL)', type: 'number', placeholder: '0' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const matrah = Number(inputs.matrah);
        const kumulatifMatrah = Number(inputs.kumulatifMatrah) || 0;

        if (isNaN(matrah) || matrah < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir matrah girin.' } } };
        }
        
        const { toplamVergi, table } = calculateIncomeTax(matrah, kumulatifMatrah);

        const summary = {
            totalTax: { label: 'Toplam Gelir Vergisi', value: formatCurrency(toplamVergi) },
            totalMatrah: { label: 'Yeni Kümülatif Matrah', value: formatCurrency(matrah + kumulatifMatrah) },
        };
          
        return { summary, table };
    },
  },
  content: {
    sections: [
      {
        title: "Gelir Vergisi ve Vergi Dilimleri Nedir?",
        content: (
          <p>
            Gelir vergisi, kişilerin ve kurumların elde ettikleri kazançlar üzerinden devlete ödedikleri bir vergidir. Türkiye'de gelir vergisi, <strong>artan oranlı tarife</strong> sistemine göre alınır. Bu, geliriniz arttıkça, artan kısmın daha yüksek bir vergi oranına tabi olması anlamına gelir. Bu farklı oranların geçerli olduğu gelir aralıklarına ise <strong>vergi dilimleri</strong> denir. Örneğin, gelirinizin ilk 110.000 TL'lik kısmı %15 ile vergilendirilirken, bu tutarı aşan kısmı %20'lik dilime girer.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Gelir Vergisi Matrahı nedir?",
        answer: "Gelir vergisi matrahı, brüt gelirinizden yasal olarak izin verilen indirimlerin (örneğin SGK primi, engellilik indirimi, bazı bağış ve yardımlar) düşüldükten sonra kalan ve verginin üzerinden hesaplanacağı tutardır."
      },
      {
        question: "Kümülatif Vergi Matrahı neden önemlidir?",
        answer: "Özellikle ücretli çalışanlar için, her ay hesaplanan vergi matrahı bir önceki ayların matrahlarına eklenerek kümülatif (toplam) vergi matrahını oluşturur. Hangi vergi diliminde olduğunuz, bu kümülatif tutara göre belirlenir. Bu yüzden yılın ilerleyen aylarında daha üst vergi dilimlerine geçilebilir."
      },
      {
        question: "Bu hesaplayıcı hangi gelir türleri için kullanılabilir?",
        answer: "Bu hesaplayıcı, temel olarak vergiye tabi matrahı bilinen tüm gelir türleri için kullanılabilir. Maaş gelirleri, beyan edilecek kira gelirleri, serbest meslek kazançları veya ticari kazançlar gibi gelirlerinizin vergi matrahını girdikten sonra ödeyeceğiniz vergiyi yaklaşık olarak hesaplayabilirsiniz. Unutmayın ki, kira gibi bazı gelir türlerinde özel istisnalar (örneğin 2024 için 33.000 TL mesken kira geliri istisnası) bulunabilir ve bu istisnalar matraha ulaşmadan önce düşülmelidir."
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
        resultTitle="Vergi Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 