import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// Yasal Oranlar
const NORMAL_MESAI_SAATI_AYLIK = 225;
const FAZLA_MESAI_ZAM_ORANI = 1.5; // %50 zamlı

const pageConfig = {
  title: "Fazla Mesai Ücreti Hesaplama (2024) | OnlineHesaplama",
  description: "Aylık brüt maaşınızı ve fazla çalışma saatinizi girerek 2024 yılına göre almanız gereken brüt ve net fazla mesai ücretini kolayca hesaplayın.",
  keywords: ["fazla mesai ücreti hesaplama", "mesai hesaplama", "fazla çalışma ücreti", "mesai ücreti 2024"],
  calculator: {
    title: "Fazla Mesai Ücreti Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Aylık brüt maaşınızı ve ay içinde yaptığınız toplam fazla mesai saatini girin.
      </p>
    ),
    inputFields: [
      { id: 'brutMaas', label: 'Aylık Brüt Maaş (TL)', type: 'number', placeholder: '30000' },
      { id: 'fazlaMesaiSaati', label: 'Toplam Fazla Mesai (Saat)', type: 'number', placeholder: '10' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { brutMaas, fazlaMesaiSaati } = inputs as { brutMaas: number, fazlaMesaiSaati: number };
        
        if (!brutMaas || brutMaas <= 0 || !fazlaMesaiSaati || fazlaMesaiSaati < 0) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları geçerli değerlerle doldurun.' } } };
        }

        const saatlikBrutUcret = brutMaas / NORMAL_MESAI_SAATI_AYLIK;
        const saatlikFazlaMesaiUcreti = saatlikBrutUcret * FAZLA_MESAI_ZAM_ORANI;
        const toplamBrutFazlaMesai = saatlikFazlaMesaiUcreti * fazlaMesaiSaati;
        
        // Net ücret hesabı için kesintiler (yaklaşık olarak %15 gelir vergisi ve %15 SGK üzerinden hesaplanmıştır, gerçek vergi dilimine göre değişebilir)
        const vergiVeSgkKesintisi = toplamBrutFazlaMesai * 0.30;
        const toplamNetFazlaMesai = toplamBrutFazlaMesai - vergiVeSgkKesintisi;

        const summary = {
            toplamBrut: { label: 'Toplam Brüt Fazla Mesai Ücreti', value: formatCurrency(toplamBrutFazlaMesai), isHighlighted: true },
            toplamNet: { label: 'Tahmini Net Fazla Mesai Ücreti', value: formatCurrency(toplamNetFazlaMesai) },
            saatlikBrut: { label: 'Saatlik Normal Brüt Ücret', value: formatCurrency(saatlikBrutUcret) },
            saatlikFazlaMesai: { label: 'Saatlik Zamlı Mesai Ücreti (%50)', value: formatCurrency(saatlikFazlaMesaiUcreti) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Fazla Mesai Ücreti Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              4857 sayılı İş Kanunu'na göre, haftalık 45 saati aşan çalışmalar fazla mesai olarak kabul edilir. Her bir saat fazla çalışma için verilecek ücret, normal çalışma ücretinin saat başına düşen miktarının <strong>yüzde elli (%50)</strong> yükseltilmesi suretiyle ödenir.
            </p>
            <p className="mt-2">
              Hesaplama adımları şöyledir:
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Saatlik Normal Ücret Bulunur:</strong> Aylık brüt maaş, yasal aylık çalışma saati olan 225'e bölünür.</li>
                <li><strong>Zamlı Saatlik Ücret Hesaplanır:</strong> Bulunan saatlik ücret, 1.5 ile çarpılarak %50 zamlı saatlik mesai ücreti elde edilir.</li>
                <li><strong>Brüt Mesai Ücreti Bulunur:</strong> Zamlı saatlik ücret, yapılan toplam fazla mesai saati ile çarpılarak brüt fazla mesai alacağı hesaplanır.</li>
                <li><strong>Net Ücret:</strong> Brüt mesai ücretinden gelir vergisi ve SGK primi gibi yasal kesintiler düşülerek net tutara ulaşılır. Bu kesintilerin oranı, çalışanın bulunduğu vergi dilimine göre değişiklik gösterebilir.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Haftalık çalışma süresi en fazla ne kadar olabilir?",
        answer: "Haftalık normal çalışma süresi 45 saattir. Fazla mesai süresi ise günde 3 saati, yılda ise toplam 270 saati geçemez."
      },
      {
        question: "Fazla mesai ücreti yerine serbest zaman (izin) kullanılabilir mi?",
        answer: "Evet, işçi fazla çalıştığı her bir saat karşılığında yüzde elli zamlı ücret almak yerine, bir saat otuz dakika serbest zaman kullanma hakkına da sahiptir. Bu talebini altı ay içinde işverene yazılı olarak bildirmesi gerekir."
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
        resultTitle="Fazla Mesai Ücreti Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}