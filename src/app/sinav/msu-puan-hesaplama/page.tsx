import type { Metadata } from 'next';
import MsuClient from './MsuClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "MSÜ Puan Hesaplama 2024 | OnlineHesaplama",
  description: "Milli Savunma Üniversitesi (MSÜ) sınavı için Türkçe, Sosyal Bilimler, Temel Matematik ve Fen Bilimleri testlerindeki netlerinizi girerek Sayısal, Sözel, Eşit Ağırlık ve Genel puanınızı hesaplayın.",
  keywords: ["msü puan hesaplama", "milli savunma üniversitesi", "msü sayısal puan", "msü sözel puan", "msü eşit ağırlık puanı"],
  content: {
    sections: [
      {
        title: "MSÜ Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Milli Savunma Üniversitesi (MSÜ) Askeri Öğrenci Aday Belirleme Sınavı puanı, adayların 120 soruluk sınavdaki performanslarına göre hesaplanır. Sınav, TYT'ye benzer şekilde tek oturumda yapılır ve 4 farklı puan türü (Sayısal, Sözel, Eşit Ağırlık, Genel Puan) hesaplanır.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li><strong>Netlerin Hesaplanması:</strong> Her ders için, doğru cevap sayısından yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
              <li><strong>Ağırlıklı Puanlar:</strong> Her puan türü için, ilgili testlerden elde edilen netler farklı katsayılarla çarpılır. Örneğin Sayısal puan için Matematik ve Fen netlerinin ağırlığı daha yüksektir.</li>
              <li><strong>MSÜ Puanı:</strong> Hesaplanan ağırlıklı puanlar, her senenin sınav zorluğuna göre belirlenen bir formülle standart puana dönüştürülür. Bu hesaplayıcı, geçmiş yılların verilerine dayalı tahmini katsayılar kullanarak bir sonuç üretir.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "MSÜ puanı tek başına yeterli mi?",
        answer: "Hayır. MSÜ puanı, askeri öğrenci adaylarını belirlemedeki ilk aşamadır. Belirlenen taban puanı geçen adaylar, ikinci seçim aşamalarına (Fiziki Yeterlilik Testi, Kişilik Değerlendirme Testi, Mülakat vb.) çağrılırlar. Ayrıca Harp Okulları ve Astsubay Meslek Yüksekokulları için YKS (TYT ve AYT) puanı da gereklidir."
      },
      {
        question: "Hangi puan türü hangi okul için geçerli?",
        answer: "Harp Okulları (Kara, Deniz, Hava) için MSÜ Sayısal, Eşit Ağırlık ve Sözel puan türleri kullanılır. Astsubay Meslek Yüksekokulları için ise MSÜ Sayısal, Eşit Ağırlık, Sözel ve Genel Puan türleri kullanılır. Tercih edilecek okula göre ilgili puan türünün hesaplanmış olması gerekir."
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
      <MsuClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}