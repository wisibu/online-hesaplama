import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

// Katsayılar ÖSYM kılavuzlarına göre belirlenmiştir.
const GYGK_KATSAYI = 0.3;
const ALAN_KATSAYI = 0.7;
const BASE_PUAN = 40; // Örnek taban puan, gerçek hesaplama farklı olabilir.
const MAX_PUAN = 100;

const pageConfig = {
  title: "Hakim ve Savcı Yardımcılığı Sınavı Puan Hesaplama | OnlineHesaplama",
  description: "Adli Yargı Hâkim ve Savcı Yardımcılığı sınavı için Genel Yetenek/Genel Kültür ve Alan Bilgisi testlerindeki netlerinizi girerek sınav puanınızı hesaplayın.",
  keywords: ["hakimlik sınavı puan hesaplama", "savcılık sınavı puan hesaplama", "adli yargı sınavı"],
  calculator: {
    title: "Hâkim ve Savcı Yardımcılığı Sınav Puanı Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        İki bölümdeki doğru ve yanlış sayılarınızı girerek tahmini sınav puanınızı öğrenin.
      </p>
    ),
    inputFields: [
      { id: 'gygk_dogru', label: 'GY-GK Doğru (35 Soru)', type: 'number', placeholder: '25' },
      { id: 'gygk_yanlis', label: 'GY-GK Yanlış', type: 'number', placeholder: '5' },
      { id: 'alan_dogru', label: 'Alan Bilgisi Doğru (100 Soru)', type: 'number', placeholder: '80' },
      { id: 'alan_yanlis', label: 'Alan Bilgisi Yanlış', type: 'number', placeholder: '15' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { gygk_dogru, gygk_yanlis, alan_dogru, alan_yanlis } = inputs as { gygk_dogru: number, gygk_yanlis: number, alan_dogru: number, alan_yanlis: number };

        if ( (gygk_dogru + gygk_yanlis > 35) || (alan_dogru + alan_yanlis > 100) || [gygk_dogru, gygk_yanlis, alan_dogru, alan_yanlis].some(v => v < 0 || isNaN(v)) ) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen soru sayılarına uygun, geçerli değerler girin.' } } };
        }

        const gygkNet = gygk_dogru - (gygk_yanlis / 4);
        const alanNet = alan_dogru - (alan_yanlis / 4);
        
        // Puan hesaplama formülü standart sapma ve ortalamaya göre değişir. Bu basitleştirilmiş bir modeldir.
        // Formül: (GYGK Net * 0.3) + (Alan Net * 0.7)
        const agirlikliPuan = (gygkNet * GYGK_KATSAYI) + (alanNet * ALAN_KATSAYI);
        
        // Gerçekte standart puan dönüşümü yapılır. Bu, sonucu 100'lük sisteme yaklaştıran bir modellemedir.
        const sinavPuani = Math.min(MAX_PUAN, BASE_PUAN + (agirlikliPuan / 80 * 60));

        const summary: CalculationResult['summary'] = {
            sinavPuani: { type: 'result', label: 'Tahmini Sınav Puanı', value: formatNumber(sinavPuani, 3), isHighlighted: true },
            status: { type: 'info', label: 'Durum (70 Puan Barajı)', value: sinavPuani >= 70 ? 'Başarılı ✅' : 'Başarısız ❌' },
            gygkNet: { type: 'info', label: 'Genel Yetenek-GK Net', value: formatNumber(gygkNet, 2) },
            alanNet: { type: 'info', label: 'Alan Bilgisi Net', value: formatNumber(alanNet, 2) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Adli Yargı Sınav Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Adli Yargı Hâkim ve Savcı Yardımcılığı Sınavı puanı, iki ana bölümün ağırlıklı ortalaması alınarak hesaplanır. Bu bölümler Ortak Alan Bilgisi, Genel Yetenek ve Genel Kültür'dür.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Netlerin Hesaplanması:</strong> Her bölüm için, doğru cevap sayısından yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
                <li><strong>Ağırlıklı Puan:</strong> Genel Yetenek ve Genel Kültür Testi'nin ağırlığı %30, Alan Bilgisi Testi'nin ağırlığı ise %70'tir. Netler bu katsayılarla çarpılarak toplanır.</li>
                <li><strong>Nihai Puan:</strong> Elde edilen ağırlıklı puan, ÖSYM tarafından standart puan hesaplama yöntemi kullanılarak 100 üzerinden bir puana dönüştürülür. Mülakata kalabilmek için genellikle 70 puan barajını aşmak gerekir.</li>
            </ol>
             <p className='mt-2'>Bu hesaplayıcı, geçmiş yılların verilerine dayalı basitleştirilmiş bir model kullanarak tahmini bir sonuç üretir ve resmi sonuçlar farklılık gösterebilir.</p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Sınavda hangi dersler var?",
        answer: "Genel Yetenek ve Genel Kültür bölümünde Türkçe, Matematik, Türk Kültür ve Medeniyetleri, Atatürk İlkeleri ve İnkılap Tarihi ve Temel Yurttaşlık Bilgisi bulunur. Alan Bilgisi bölümünde ise Anayasa Hukuku, İdare Hukuku, Medeni Hukuk, Borçlar Hukuku, Ticaret Hukuku, Ceza Hukuku gibi hukuk dallarından sorular yer alır."
      },
      {
        question: "70 puan almak mülakat için yeterli mi?",
        answer: "70 puan, mülakata çağrılmak için gerekli olan asgari baraj puanıdır. Ancak bu, mülakata kesin olarak çağrılacağınız anlamına gelmez. Adaylar, en yüksek puandan başlanarak sıralanır ve ilan edilen kadro sayısının belirli bir katı kadar aday mülakata çağrılır. Bu nedenle, sıralamadaki yeriniz de büyük önem taşır."
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
        resultTitle="Sınav Puanı Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}