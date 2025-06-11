import type { Metadata } from 'next';
import EkpssClient from './EkpssClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "EKPSS Puan Hesaplama (Engelli Kamu Personeli Seçme Sınavı) | OnlineHesaplama",
  description: "EKPSS için öğrenim düzeyi, engel grubu ve testlerdeki doğru/yanlış sayılarınızı girerek tahmini EKPSS P-1, P-2, P-3 puanlarınızı hesaplayın.",
  keywords: ["ekpss puan hesaplama", "engelli kamu personeli seçme sınavı", "ekpss lisans", "ekpss ön lisans", "ekpss ortaöğretim"],
  content: {
    sections: [
      {
        title: "EKPSS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Engelli Kamu Personeli Seçme Sınavı (EKPSS), engelli bireylerin kamu kurum ve kuruluşlarına atanabilmesi için yapılan merkezi bir sınavdır. Puan hesaplaması, adayın öğrenim düzeyine, engel grubuna ve Genel Yetenek ile Genel Kültür testlerindeki performansına göre yapılır.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li><strong>Netlerin Hesaplanması:</strong> Her iki test için de doğru cevap sayısından, yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
              <li><strong>Standart Puanların Hesaplanması:</strong> Her adayın netleri, sınavdaki tüm adayların netlerinin ortalaması ve standart sapması kullanılarak bir standart puana dönüştürülür. Bu işlem her test için ayrı ayrı yapılır.</li>
              <li><strong>Ağırlıklı Puanların Hesaplanması:</strong> Standart puanlar, öğrenim düzeyine göre belirlenmiş katsayılarla çarpılır. Örneğin, Lisans düzeyi için P3 puanı hesaplanırken Genel Yetenek %60, Genel Kültür %40 ağırlığa sahiptir.</li>
              <li><strong>EKPSS Puanı:</strong> Ağırlıklı puanların toplanması ve belirli bir formülle 100'lük sisteme dönüştürülmesiyle nihai EKPSS puanı elde edilir.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "EKPSS puanı kaç yıl geçerlidir?",
        answer: "EKPSS sonuçları, sınavın yapıldığı tarihten itibaren dört yıl süreyle geçerlidir. Ancak, yeni bir sınav yapılması durumunda adayların bu yeni sınava girmesi gerekir."
      },
      {
        question: "Hangi puan türü ne anlama geliyor? (P1, P2, P3)",
        answer: "EKPSS'de P1 Ortaöğretim, P2 Ön Lisans ve P3 Lisans mezunları için hesaplanan puan türleridir. Atama tercihleri bu puan türlerine göre yapılır."
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
      <EkpssClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}