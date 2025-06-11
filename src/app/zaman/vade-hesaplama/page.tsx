import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Vade Hesaplama | Çek, Senet Vade Sonu Tarihi Bulma | OnlineHesaplama",
  description: "Başlangıç tarihine belirli bir gün veya ay ekleyerek vade sonu tarihini kolayca hesaplayın. Çek, senet, kredi ve diğer finansal işlemleriniz için pratik.",
  keywords: ["vade hesaplama", "vade sonu tarihi", "çek vadesi hesaplama", "senet vadesi", "tarihe gün ekleme"],
  calculator: {
    title: "Vade Sonu Tarihi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Vade başlangıç tarihini ve vade süresini girerek vade sonu tarihini bulun.
      </p>
    ),
    inputFields: [
      { id: 'startDate', label: 'Vade Başlangıç Tarihi', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { id: 'vade', label: 'Vade Süresi', type: 'number', placeholder: 'Örn: 90' },
      { id: 'unit', label: 'Vade Birimi', type: 'select', options: [{value: 'days', label: 'Gün'}, {value: 'months', label: 'Ay'}], defaultValue: 'days' },
    ] as InputField[],
    calculate: async (inputs: { [key:string]: string | number }): Promise<CalculationResult | null> => {
        'use server';
        
        const { startDate: startStr, vade, unit } = inputs as { startDate: string, vade: number, unit: 'days' | 'months' };

        if (!startStr) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen bir başlangıç tarihi girin.' } } };
        }
         if (vade === undefined || vade < 0) {
             return { summary: { error: { label: 'Hata', value: 'Lütfen geçerli bir vade süresi girin.' } } };
        }
        
        const startDate = new Date(startStr);
        
        if (unit === 'days') {
            startDate.setDate(startDate.getDate() + vade);
        } else if (unit === 'months') {
            startDate.setMonth(startDate.getMonth() + vade);
        }
        
        const resultDate = startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });

        const summary = {
            result: { label: 'Vade Sonu Tarihi', value: resultDate },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Vade Sonu Tarihi Nasıl Hesaplanır?",
        content: (
          <p>
           Vade sonu tarihi, bir borcun, senedin, çekin veya herhangi bir finansal yükümlülüğün ödenmesi gereken son tarihi ifade eder. Bu hesaplayıcı, belirttiğiniz başlangıç tarihine (genellikle işlemin yapıldığı tarih) girdiğiniz vade süresini (gün veya ay olarak) ekleyerek vade sonu takvim gününü ve haftanın hangi gününe denk geldiğini size gösterir. Bu, ödeme planlarınızı yönetmenize ve son ödeme tarihlerini kaçırmamanıza yardımcı olur.
          </p>
        )
      }
    ],
    faqs: [
      {
        question: "Vade sonu tatil gününe denk gelirse ne olur?",
        answer: "Genellikle, eğer bir borcun vadesi resmi bir tatil gününe veya hafta sonuna (Cumartesi/Pazar) denk gelirse, ödeme yükümlülüğü takip eden ilk iş gününe devreder. Ancak bu durum, yapılan sözleşmenin şartlarına göre değişiklik gösterebilir. Bu hesaplayıcı sadece takvim tarihini gösterir, tatil günü kontrolü yapmaz."
      },
      {
        question: "Ay olarak vade hesaplarken günler nasıl etkilenir?",
        answer: "Vade süresini 'Ay' olarak seçtiğinizde, hesaplayıcı takvim aylarına göre ilerler. Örneğin, 31 Ocak'ta başlayan 1 aylık vade, Şubat ayının son günü olan 28 veya 29 Şubat'ta sona erer. Araç, ayların farklı gün sayılarını (30, 31, 28/29) otomatik olarak dikkate alır."
      }
    ]
  }
};

export const metadata: Metadata = {
  title: "Vade Hesaplama",
  description: "Vade tarihlerini iş günlerine göre hesaplayın. Bu araç yeni adresine taşınmıştır.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/zaman/is-gunu-hesaplama',
  },
};

export default function Page() {
  redirect('/zaman/is-gunu-hesaplama');
}