import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult, TableData } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı Parametreleri
const SGK_TABAN = 20002.50;
const SGK_TAVAN = 150018.90;
const SGK_PRIM_ORANI_ISCI = 0.14;
const ISSIZLIK_PRIM_ORANI_ISCI = 0.01;
const DAMGA_VERGISI_ORANI = 0.00759;

const GELIR_VERGISI_DILIMLERI_2024 = [
    { limit: 110000, rate: 0.15 },
    { limit: 230000, rate: 0.20 },
    { limit: 870000, rate: 0.27 }, // Note: This was 580k in a previous file, using the value from this file.
    { limit: 3000000, rate: 0.35 },
    { limit: Infinity, rate: 0.40 },
];

const ASGARI_UCRET_ISTISNA_MATRAH = 17009.68;
const ASGARI_UCRET_ISTISNA_DAMGA = 151.82;


const calculateMonthlyNetSalary = (brut: number, kümülatifVergiMatrahi: number, engellilikOrani: number) => {
    const sgkMatrah = Math.max(SGK_TABAN, Math.min(brut, SGK_TAVAN));
    const sgkPrimi = sgkMatrah * SGK_PRIM_ORANI_ISCI;
    const issizlikPrimi = sgkMatrah * ISSIZLIK_PRIM_ORANI_ISCI;
    const sgkToplamIsciKesintisi = sgkPrimi + issizlikPrimi;
    
    const gelirVergisiMatrahi = brut - sgkToplamIsciKesintisi;

    let engellilikIndirimi = 0;
    if (engellilikOrani === 1) engellilikIndirimi = 6900;
    if (engellilikOrani === 2) engellilikIndirimi = 4000;
    if (engellilikOrani === 3) engellilikIndirimi = 1700;
    
    const vergiMatrahiIndirimli = Math.max(0, gelirVergisiMatrahi - engellilikIndirimi);
    
    let vergi = 0;
    let kalanMatrah = vergiMatrahiIndirimli;
    let kümülatifOncesi = kümülatifVergiMatrahi;

    for (const dilim of GELIR_VERGISI_DILIMLERI_2024) {
        if (kalanMatrah <= 0) break;
        const matrahInDilim = Math.min(kalanMatrah, dilim.limit - kümülatifOncesi);
        
        if (matrahInDilim > 0) {
            vergi += matrahInDilim * dilim.rate;
            kalanMatrah -= matrahInDilim;
            kümülatifOncesi += matrahInDilim;
        }
    }

    const gelirVergisiIstisnasi = 17002.13 * 0.15; // Asgari ücretin gelir vergisi istisnası
    const damgaVergisiIstisnasi = 20002.50 * DAMGA_VERGISI_ORANI;

    const odenecekGelirVergisi = Math.max(0, vergi - gelirVergisiIstisnasi);
    const odenecekDamgaVergisi = Math.max(0, (brut * DAMGA_VERGISI_ORANI) - damgaVergisiIstisnasi);

    const netMaas = brut - sgkToplamIsciKesintisi - odenecekGelirVergisi - odenecekDamgaVergisi;

    return {
        brut,
        netMaas,
        sgkToplamIsciKesintisi,
        gelirVergisiMatrahi,
        yeniKumulatifMatrah: kümülatifVergiMatrahi + gelirVergisiMatrahi,
        odenecekGelirVergisi,
        odenecekDamgaVergisi,
    };
};


const pageConfig = {
  title: "Brütten Nete Maaş Hesaplama Tablosu (12 Aylık) | OnlineHesaplama",
  description: "2024 yılı güncel verilerine göre aylık brüt maaşınızın yıl içindeki 12 aylık net maaş dökümünü, kümülatif vergi matrahı değişimini ve tüm kesintileri tablo olarak görün.",
  keywords: ["brütten nete maaş hesaplama", "12 aylık maaş tablosu", "kümülatif vergi matrahı", "net maaş tablosu"],
  calculator: {
    title: "12 Aylık Brütten Nete Maaş Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Aylık brüt maaşınızı girerek 12 aylık maaş gelişimini ve yıllık toplamları görün.
      </p>
    ),
    inputFields: [
      { id: 'brutMaas', label: 'Aylık Brüt Maaş (TL)', type: 'number', placeholder: '50000' },
      { id: 'engellilik', label: 'Engellilik İndirimi', type: 'select', options: [
        { value: 0, label: 'Yok' },
        { value: 1, label: '1. Derece (6.900 TL)' },
        { value: 2, label: '2. Derece (4.000 TL)' },
        { value: 3, label: '3. Derece (1.700 TL)' },
      ], defaultValue: '0' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const brut = Number(inputs.brutMaas);
        const engellilik = Number(inputs.engellilik);

        if (isNaN(brut) || brut <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir brüt maaş girin.' } } };
        }

        const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        let kumulatifMatrah = 0;
        const results = [];

        for (let i = 0; i < 12; i++) {
            const result = calculateMonthlyNetSalary(brut, kumulatifMatrah, engellilik);
            results.push({ month: months[i], ...result });
            kumulatifMatrah = result.yeniKumulatifMatrah;
        }

        const totalNet = results.reduce((acc, r) => acc + r.netMaas, 0);
        const avgNet = totalNet / 12;

        const summary = {
            avgNet: { label: 'Yıllık Ortalama Net Maaş', value: formatCurrency(avgNet), isHighlighted: true },
            totalBrut: { label: 'Yıllık Toplam Brüt Maaş', value: formatCurrency(brut * 12) },
            totalNet: { label: 'Yıllık Toplam Net Maaş', value: formatCurrency(totalNet) },
        };
        
        const table: TableData = {
            headers: ["Ay", "Brüt Maaş", "SGK Kesintisi", "GV Matrahı", "Kümülatif Matrah", "Gelir Vergisi", "Damga Vergisi", "Net Maaş"],
            rows: results.map(r => [
                r.month,
                formatCurrency(r.brut),
                formatCurrency(r.sgkToplamIsciKesintisi),
                formatCurrency(r.gelirVergisiMatrahi),
                formatCurrency(r.yeniKumulatifMatrah),
                formatCurrency(r.odenecekGelirVergisi),
                formatCurrency(r.odenecekDamgaVergisi),
                formatCurrency(r.netMaas),
            ])
        };
          
        return { summary, table };
    },
  },
  content: {
    sections: [
      {
        title: "Brüt Maaştan Net Maaşa Yıllık Yolculuk",
        content: (
          <p>
            Brüt maaş, işçinin bordrosunda görünen, herhangi bir kesinti yapılmamış toplam tutardır. Ancak bu tutarın tamamı çalışanın eline geçmez. Brüt maaştan, devlet tarafından belirlenen yasal kesintiler (SGK primi, işsizlik sigortası primi, gelir vergisi ve damga vergisi) düşüldükten sonra kalan tutar, çalışanın banka hesabına yatan <strong>net maaşı</strong> oluşturur. Bu hesaplayıcı, 2024 yılı için geçerli tüm oranları, istisnaları ve vergi dilimlerini dikkate alarak bu dönüşümü sizin için 12 aylık bir tablo halinde sunar.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Tablodaki net maaşım neden aylar geçtikçe düşüyor?",
        answer: "Bu durumun sebebi 'Kümülatif Vergi Matrahı'dır. Kümülatif vergi matrahı, yılın başından itibaren vergiye tabi olan kazançlarınızın toplamıdır. Gelir vergisi oranınız (%15, %20, %27 vb.) bu toplam tutara göre belirlenir. Yıl içinde bu matrah arttıkça, daha yüksek bir vergi dilimine geçersiniz. Bu durum, brüt maaşınız aynı kalsa bile, daha yüksek oranda vergi kesildiği için net maaşınızın yılın ilerleyen aylarında düşmesine neden olabilir. Tablomuz bu değişimi net bir şekilde göstermektedir."
      },
      {
        question: "Asgari ücret vergi istisnası nedir?",
        answer: "2022 yılından itibaren, tüm çalışanların maaşlarının asgari ücret tutarı kadar olan kısmı gelir vergisinden ve damga vergisinden muaftır. Bu, hesaplanan gelir verginizden ve damga verginizden, asgari ücretin vergisi kadar bir indirim yapılması anlamına gelir ve net maaşınızı artırır. Hesaplayıcımız bu istisnayı her ay için otomatik olarak uygular."
      },
    ]
  }
};

export const metadata: Metadata = {
  title: pageConfig.title,
  description: pageConfig.description,
  keywords: pageConfig.keywords,
};

export default function Page() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Yıllık Maaş Özeti"
        tableTitle="12 Aylık Detaylı Maaş Bordrosu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}