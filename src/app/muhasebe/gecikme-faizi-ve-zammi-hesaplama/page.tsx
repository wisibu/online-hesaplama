import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatCurrency } from '@/utils/formatting';

// 6183 sayılı Kanun'un 51. maddesine göre belirlenen oran (14 Kasım 2023'ten itibaren)
const AYLIK_GECIKME_ZAMMI_ORANI = 0.045; // %4.5

const pageConfig = {
  title: "Gecikme Faizi ve Zammı Hesaplama (Amme Alacakları) | 2024",
  description: "Vadesinde ödenmeyen amme alacakları (vergi, prim vb.) için gecikme zammı ve faizi tutarını 2024 güncel oranları ile hesaplayın.",
  keywords: ["gecikme zammı hesaplama", "gecikme faizi hesaplama", "vergi gecikme faizi", "sgk gecikme zammı", "amme alacakları"],
  calculator: {
    title: "Gecikme Zammı ve Faizi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Borç tutarını, vade ve ödeme tarihlerini girerek ödenecek gecikme bedelini hesaplayın.
      </p>
    ),
    inputFields: [
      { id: 'principal', label: 'Ana Para Borç Tutarı (TL)', type: 'number', placeholder: '10000' },
      { id: 'vadeTarihi', label: 'Vade Tarihi', type: 'date' },
      { id: 'odemeTarihi', label: 'Ödeme Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { principal, vadeTarihi: vadeTarihiStr, odemeTarihi: odemeTarihiStr } = inputs as { principal: number, vadeTarihi: string, odemeTarihi: string };
        
        if (!principal || principal <= 0 || !vadeTarihiStr || !odemeTarihiStr) {
            return { summary: { error: { label: 'Hata', value: 'Lütfen tüm alanları doğru bir şekilde doldurun.' } } };
        }

        const vade = new Date(vadeTarihiStr);
        const odeme = new Date(odemeTarihiStr);

        if (odeme <= vade) {
            return { summary: { info: { label: 'Bilgi', value: 'Ödeme tarihi vade tarihinden önce veya aynı gün olduğu için gecikme zammı hesaplanmaz.' } } };
        }

        let totalMonths = (odeme.getFullYear() - vade.getFullYear()) * 12;
        totalMonths -= vade.getMonth();
        totalMonths += odeme.getMonth();
        const dayDifference = odeme.getDate() - vade.getDate();
        
        if (totalMonths < 0 || (totalMonths === 0 && dayDifference <= 0)) {
             return { summary: { info: { label: 'Bilgi', value: 'Ödeme tarihi vade tarihinden önce olduğu için gecikme zammı hesaplanmaz.' } } };
        }
        
        // Ay kesirleri tam ay sayılır. Vade günü geçildiyse 1 ay başlar.
        if (dayDifference > 0 && odeme.getMonth() === vade.getMonth() && odeme.getFullYear() === vade.getFullYear()) {
            totalMonths = 1;
        } else if (dayDifference < 0) {
           // Ay hesabından gelen ay zaten doğru ay.
        } else if (dayDifference > 0) {
            totalMonths += 1;
        }

        const gecikmeZammi = principal * AYLIK_GECIKME_ZAMMI_ORANI * totalMonths;
        const toplamOdeme = principal + gecikmeZammi;

        const summary = {
            toplamOdeme: { label: 'Toplam Ödenecek Tutar', value: formatCurrency(toplamOdeme), isHighlighted: true },
            gecikmeZammi: { label: `Gecikme Zammı (${totalMonths} Ay)`, value: formatCurrency(gecikmeZammi) },
            anaPara: { label: 'Ana Para', value: formatCurrency(principal) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Gecikme Zammı ve Faizi Nedir?",
        content: (
          <>
            <p>
              <strong>Gecikme Zammı</strong>, 6183 sayılı Amme Alacaklarının Tahsil Usulü Hakkında Kanun'a göre, vadesinde ödenmeyen kamu alacaklarına (vergi, SGK primi, harçlar vb.) uygulanan bir yaptırımdır. Aylık olarak hesaplanır ve ay kesirleri tam ay olarak dikkate alınır.
            </p>
            <p className='mt-2'>
              <strong>Gecikme Faizi</strong> ise Vergi Usul Kanunu'nda düzenlenmiş olup, verginin normal vadesinden sonra yapılan tarhiyatlar için (örneğin bir vergi incelemesi sonucu bulunan matrah farkı için) vade ile tarhiyat tarihi arasında geçen süre için hesaplanır. Uygulamada oranı ve hesaplama mantığı gecikme zammı ile paraleldir. Bu hesaplayıcı, her iki durum için de geçerli olan gecikme zammı oranını kullanır.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Güncel gecikme zammı oranı nedir?",
        answer: "14 Kasım 2023 tarihli Resmi Gazete'de yayımlanan Cumhurbaşkanı Kararı ile gecikme zammı oranı aylık %3,5'ten %4,5'e yükseltilmiştir. Bu hesaplayıcı en güncel oran olan aylık %4.5'i kullanmaktadır."
      },
      {
        question: "Gecikme zammı nasıl hesaplanır?",
        answer: "Gecikme zammı, borcun vadesinin geçtiği tarihten ödendiği tarihe kadar geçen her ay ve ay kesirleri için aylık oran üzerinden hesaplanır. Örneğin, 15 gün gecikme için 1 aylık gecikme zammı uygulanır."
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
        resultTitle="Gecikme Bedeli Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 