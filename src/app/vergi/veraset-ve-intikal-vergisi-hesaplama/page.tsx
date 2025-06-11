import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult, TableData } from '@/components/CalculatorUI';
import { formatCurrency } from '@/utils/formatting';
import RichContent from '@/components/RichContent';

// 2024 Veraset ve İntikal Vergisi Tarifesi
const taxBrackets2024 = {
    veraset: [ // Miras yoluyla
        { limit: 1700000, rate: 0.01 },
        { limit: 5700000, rate: 0.03 },
        { limit: 14700000, rate: 0.05 },
        { limit: 29000000, rate: 0.07 },
        { limit: Infinity, rate: 0.10 },
    ],
    ivazsiz: [ // Hibe, bağış, çekiliş vb.
        { limit: 1700000, rate: 0.10 },
        { limit: 5700000, rate: 0.15 },
        { limit: 14700000, rate: 0.20 },
        { limit: 29000000, rate: 0.25 },
        { limit: Infinity, rate: 0.30 },
    ],
};

// 2024 İstisna Tutarları
const exemptions2024 = {
    evlatlik: 3821044, // Evlatlıklar dahil, füruğ ve eşten her birine isabet eden miras hisseleri
    ivazsiz: 37059,     // Bağış, hibe vb.
    sansOyunlari: 37059, // Şans oyunları ve çekilişler
};

const pageConfig = {
  title: "Veraset ve İntikal Vergisi Hesaplama (2024) | OnlineHesaplama",
  description: "Miras veya bağış yoluyla edindiğiniz mallar için 2024 yılı güncel tarifesine göre ödemeniz gereken veraset ve intikal vergisini hesaplayın.",
  keywords: ["veraset ve intikal vergisi hesaplama", "miras vergisi", "hibe vergisi", "bağış vergisi"],
  calculator: {
    title: "Veraset ve İntikal Vergisi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        İntikal şeklini ve vergi matrahını girerek ödemeniz gereken vergiyi öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'transferType', label: 'İntikal Şekli', type: 'select', options: [
        { value: 'veraset', label: 'Veraset (Miras)' },
        { value: 'ivazsiz', label: 'İvazsız İntikal (Bağış, Hibe vb.)' },
      ]},
      { id: 'taxableAmount', label: 'Vergiye Tabi Tutar (Matrah)', type: 'number', placeholder: '2000000' },
      { id: 'isSpouseOrChild', label: 'Mirasçı, eş veya evlatlık mı?', type: 'checkbox', defaultChecked: true, displayCondition: { field: 'transferType', value: 'veraset' } },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { transferType, taxableAmount, isSpouseOrChild } = inputs;
        const amount = Number(taxableAmount);
        const type = transferType as 'veraset' | 'ivazsiz';

        if (isNaN(amount) || amount <= 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir tutar girin.' } } };
        }

        const exemption = type === 'veraset' && isSpouseOrChild ? exemptions2024.evlatlik : exemptions2024.ivazsiz;
        const netTaxableAmount = Math.max(0, amount - exemption);

        if (netTaxableAmount === 0) {
            return { summary: { 
                info: { label: 'Bilgi', value: `Tutar, ${formatCurrency(exemption)} olan istisna sınırının altında kaldığı için vergi hesaplanmamıştır.` }
            }};
        }

        const brackets = taxBrackets2024[type];
        let totalTax = 0;
        let remainingAmount = netTaxableAmount;
        let previousLimit = 0;

        for (const bracket of brackets) {
            if (remainingAmount <= 0) break;
            const taxableInBracket = Math.min(remainingAmount, bracket.limit - previousLimit);
            if (taxableInBracket > 0) {
                totalTax += taxableInBracket * bracket.rate;
            }
            remainingAmount -= taxableInBracket;
            previousLimit = bracket.limit;
        }

        const summary = {
            initialAmount: { label: 'Beyan Edilen Tutar', value: formatCurrency(amount) },
            exemption: { label: 'Uygulanan İstisna', value: formatCurrency(exemption) },
            taxableBase: { label: 'Vergi Matrahı', value: formatCurrency(netTaxableAmount) },
            totalTax: { label: 'Hesaplanan Vergi', value: formatCurrency(totalTax), isHighlighted: true },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
        {
            title: "Veraset ve İntikal Vergisi Nedir?",
            content: (
              <p>
                Veraset ve İntikal Vergisi, Türkiye Cumhuriyeti vatandaşlarının veya Türkiye'de malı bulunan kişilerin vefatı (veraset) veya karşılıksız olarak mal devretmesi (ivazsız intikal) durumunda, devredilen mallar üzerinden alınan bir servet vergisidir. Mirasçılar veya malı devralanlar bu vergiyi ödemekle yükümlüdür. Vergi oranları, intikalin şekline (miras veya bağış) ve devralınan malın değerine göre farklılık gösterir.
              </p>
            )
        }
    ],
    faqs: [
      {
        question: "Veraset ve İvazsız intikal arasındaki temel fark nedir?",
        answer: "<strong>Veraset</strong>, bir kişinin vefatı üzerine mallarının yasal veya atanmış mirasçılarına geçmesidir. <strong>İvazsız intikal</strong> ise bir kişinin hayattayken malını karşılıksız olarak (hibe, bağış, hediye gibi) başka birine devretmesidir. Vergi oranları, ivazsız intikallerde veraset yoluyla intikallere göre daha yüksektir."
      },
      {
        question: "Vergi istisnaları nelerdir?",
        answer: "2024 yılı için, vefat eden kişinin eşi, çocukları ve evlatlıklarının her birine isabet eden miras payı için 3.821.044 TL'lik bir istisna uygulanır. Yani miras payınız bu tutarın altındaysa vergi ödemezsiniz. Bağış, hibe gibi diğer ivazsız intikallerde ise istisna tutarı 37.059 TL'dir."
      },
      {
        question: "Vergi beyannamesi ne zaman verilir?",
        answer: "Veraset yoluyla intikallerde beyanname, ölüm tarihinden itibaren genellikle 4 ay içinde verilir. Eğer ölüm Türkiye dışında gerçekleşmişse süreler uzayabilir. Bağış gibi durumlarda ise malın hukuken edinildiği tarihi izleyen bir ay içinde beyanname verilmelidir."
      },
      {
          question: "Bu vergi nasıl ödenir?",
          answer: "Veraset ve İntikal Vergisi, beyannamenin verildiği yılı takip eden 3 yıl içinde, her yıl Mayıs ve Kasım aylarında olmak üzere toplam 6 eşit taksitte ödenebilir."
      }
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
        resultTitle="Vergi Hesaplama Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}