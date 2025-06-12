import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatNumber } from '@/utils/formatting';

// Katsayılar ve taban puan ÖSYM kılavuzlarına göre tahminidir.
const STS_KATSAYI = 0.6; // Her netin puana katkısı (tahmini)
const STS_BASE_PUAN = 25; // Tahmini taban puan
const PASSING_SCORE = 40; // Yönetmeliğe göre geçme notu

const pageConfig = {
  title: "STS Puan Hesaplama (Tıp Doktorluğu) | OnlineHesaplama",
  description: "Tıp Doktorluğu Alanında Seviye Tespit Sınavı (STS) için doğru ve yanlış sayılarınızı girerek tahmini puanınızı ve başarı durumunuzu hesaplayın.",
  keywords: ["sts puan hesaplama", "tıp doktorluğu seviye tespit sınavı", "sts tıp denklik"],
  calculator: {
    title: "STS (Tıp Doktorluğu) Puan Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Toplam 120 soruluk sınavdaki doğru ve yanlış sayılarınızı girin.
      </p>
    ),
    inputFields: [
      { id: 'dogru', label: 'Doğru Sayısı', type: 'number', placeholder: '80' },
      { id: 'yanlis', label: 'Yanlış Sayısı', type: 'number', placeholder: '30' },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
      'use server';
      
      const dogru = Number(inputs.dogru);
      const yanlis = Number(inputs.yanlis);
      const totalQuestions = 120;

      if ( (dogru + yanlis > totalQuestions) || dogru < 0 || yanlis < 0 || isNaN(dogru) || isNaN(yanlis) ) {
          return { summary: { error: { type: 'error', label: 'Hata', value: `Toplam doğru ve yanlış sayısı ${totalQuestions} sayısını geçemez.` } } };
      }

      const net = dogru - (yanlis / 4);
      
      // Gerçek hesaplama standart sapma ve ortalamaya dayalıdır. Bu basitleştirilmiş bir modeldir.
      const stsPuani = STS_BASE_PUAN + (net * STS_KATSAYI);

      const summary: CalculationResult['summary'] = {
        stsPuani: { type: 'result', label: 'Tahmini STS Puanı', value: formatNumber(stsPuani, 2), isHighlighted: true },
        status: { type: 'info', label: 'Durum', value: stsPuani >= PASSING_SCORE ? 'Başarılı (Geçme Notu Aşıldı) ✅' : 'Başarısız (Geçme Notu Aşılamadı) ❌' },
        net: { type: 'info', label: 'Net Sayınız', value: formatNumber(net, 2) },
      };
        
      return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "STS Tıp Doktorluğu Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Tıp Doktorluğu Alanında Yurtdışı Yükseköğretim Diplomaları Denkliği İçin Seviye Tespit Sınavı (STS), yurt dışında tıp eğitimi almış adayların diplomalarının Türkiye'de tanınması için girmeleri gereken bir sınavdır. Puanlama, 100 üzerinden yapılır.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Netlerin Hesaplanması:</strong> Sınavdaki toplam doğru cevap sayısından, yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
                <li><strong>Puanın Hesaplanması:</strong> Hesaplanan netler, her sınavın ortalama ve standart sapmasına göre hesaplanan bir katsayı ile çarpılır ve bu sonuca bir taban puan eklenir.</li>
                <li><strong>Başarı Kriteri:</strong> Sınavda başarılı sayılmak için 100 tam puan üzerinden en az <strong>40 puan</strong> alınması gerekmektedir.</li>
            </ol>
            <p className='mt-2'>Bu hesaplayıcı, geçmiş sınav verilerine dayalı tahmini değerler kullanarak bir sonuç üretir ve resmi sonuçlar farklılık gösterebilir.</p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "STS'de hangi konulardan sorular yer alır?",
        answer: "Sınav, tıp fakültesi eğitim programında yer alan temel ve klinik bilimleri kapsayan sorulardan oluşur. Anatomi, fizyoloji, biyokimya gibi temel bilimlerin yanı sıra dahiliye, cerrahi, pediatri gibi klinik bilimlerden de sorular bulunmaktadır."
      },
      {
        question: "STS sınavı ne zaman ve nerede yapılır?",
        answer: "STS Tıp Doktorluğu sınavı genellikle ÖSYM tarafından yılda iki kez (Şubat ve Ağustos aylarında) Ankara'da düzenlenmektedir. Güncel tarihler için ÖSYM takvimini takip etmek önemlidir."
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
        resultTitle="Tahmini STS Puan Sonucu"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 