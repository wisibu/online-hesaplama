import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// 2024 Yılı Parametreleri
const ASGARI_UCRET_BRUT = 20002.50;
const ISSIZLIK_MAASI_TAVAN = ASGARI_UCRET_BRUT * 0.80;
const DAMGA_VERGISI_ORANI = 0.00759;

const pageConfig = {
  title: "İşsizlik Maaşı Hesaplama (2024) | OnlineHesaplama",
  description: "Son 4 aylık brüt ücretiniz ve prim gün sayınıza göre ne kadar süreyle, aylık ne kadar işsizlik maaşı alacağınızı 2024 yılına göre anında hesaplayın.",
  keywords: ["işsizlik maaşı hesaplama", "işkur işsizlik maaşı", "işsizlik ödeneği", "ne kadar işsizlik maaşı alırım"],
  calculator: {
    title: "İşsizlik Maaşı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        İŞKUR'dan alacağınız işsizlik ödeneğinin süresini ve tutarını öğrenmek için bilgileri girin.
      </p>
    ),
    inputFields: [
      { id: 'primGun', label: 'Son 3 Yıldaki Toplam Prim Gün Sayısı', type: 'number', placeholder: '750' },
      { id: 'maas1', label: 'Son 4. Ay Brüt Maaş', type: 'number', placeholder: '25000' },
      { id: 'maas2', label: 'Son 3. Ay Brüt Maaş', type: 'number', placeholder: '25000' },
      { id: 'maas3', label: 'Son 2. Ay Brüt Maaş', type: 'number', placeholder: '25000' },
      { id: 'maas4', label: 'Son 1. Ay Brüt Maaş', type: 'number', placeholder: '25000' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { primGun, maas1, maas2, maas3, maas4 } = inputs as { primGun: number, maas1: number, maas2: number, maas3: number, maas4: number };

        if (!primGun || primGun < 600 || !maas1 || !maas2 || !maas3 || !maas4) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları doğru doldurun. En az 600 prim günü gereklidir.' } } };
        }

        let sureAy = 0;
        if (primGun >= 600 && primGun < 900) sureAy = 6;
        else if (primGun >= 900 && primGun < 1080) sureAy = 8;
        else if (primGun >= 1080) sureAy = 10;
        
        const ortalamaBrutMaas = (maas1 + maas2 + maas3 + maas4) / 4;
        let brutIssizlikMaasi = ortalamaBrutMaas * 0.40;

        // Tavan kontrolü
        brutIssizlikMaasi = Math.min(brutIssizlikMaasi, ISSIZLIK_MAASI_TAVAN);

        const damgaVergisi = brutIssizlikMaasi * DAMGA_VERGISI_ORANI;
        const netIssizlikMaasi = brutIssizlikMaasi - damgaVergisi;
        const toplamOdeme = netIssizlikMaasi * sureAy;

        const summary = {
            sure: { label: 'Maaş Alma Süresi', value: `${sureAy} Ay` },
            aylikNetMaas: { label: 'Aylık Net İşsizlik Maaşı', value: formatCurrency(netIssizlikMaasi) },
            aylikBrutMaas: { label: 'Aylık Brüt İşsizlik Maaşı', value: formatCurrency(brutIssizlikMaasi) },
            toplamOdeme: { label: `Toplam Net Ödeme (${sureAy} ay)`, value: formatCurrency(toplamOdeme) },
            damgaVergisi: { label: 'Aylık Damga Vergisi Kesintisi', value: formatCurrency(damgaVergisi) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "İşsizlik Maaşı (Ödeneği) Nedir?",
        content: (
          <p>
            İşsizlik ödeneği, sigortalı bir işte çalışırken kendi istek ve kusuru dışında işini kaybeden kişilere, yeni bir iş bulana kadar geçimlerini sağlamalarına yardımcı olmak amacıyla İŞKUR tarafından ödenen bir maaştır. Bu ödeneğin süresi ve tutarı, sigortalının son üç yıl içindeki prim ödeme gün sayısına ve son dört aydaki brüt maaş ortalamasına göre belirlenir.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "İşsizlik maaşı almanın şartları nelerdir?",
        answer: "İşsizlik maaşı alabilmek için; <br/>1) Kendi istek ve kusurunuz dışında işsiz kalmış olmanız, <br/>2) Son 3 yıl içinde en az 600 gün işsizlik sigortası primi ödemiş olmanız, <br/>3) İşten ayrılmadan önceki son 120 gün boyunca sürekli çalışmış olmanız, <br/>4) İşten ayrıldıktan sonraki 30 gün içinde İŞKUR'a şahsen veya elektronik ortamda başvurmanız gerekmektedir."
      },
      {
        question: "İşsizlik maaşı nasıl hesaplanır?",
        answer: "Aylık brüt işsizlik maaşı, sigortalının son dört aylık brüt maaş ortalamasının %40'ı olarak hesaplanır. Ancak bu tutar, aylık brüt asgari ücretin %80'ini geçemez. Bu brüt tutar üzerinden sadece damga vergisi kesintisi yapılır, gelir vergisi veya SGK primi kesilmez."
      },
       {
        question: "İşsizlik maaşı alırken sağlık hizmetlerinden yararlanabilir miyim?",
        answer: "Evet, işsizlik ödeneği aldığınız süre boyunca Genel Sağlık Sigortası (GSS) primleriniz İŞKUR tarafından ödenir. Bu sayede siz ve bakmakla yükümlü olduğunuz aile bireyleri, devlet hastanelerinden ve sağlık hizmetlerinden ücretsiz olarak yararlanmaya devam edersiniz."
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
        resultTitle="İşsizlik Maaşı Sonuçları"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}