import type { Metadata } from 'next';
import TusClient from './TusClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "TUS Puan Hesaplama (Tıpta Uzmanlık Sınavı) | OnlineHesaplama",
  description: "Tıpta Uzmanlık Sınavı (TUS) için Temel ve Klinik Bilimler testlerindeki doğru/yanlış sayılarınızı girerek Temel, Klinik ve Ağırlıklı Klinik puanlarınızı hesaplayın.",
  keywords: ["tus puan hesaplama", "tıpta uzmanlık sınavı", "tus temel bilimler", "tus klinik bilimler", "tus puanı"],
  content: {
    sections: [
      {
        title: "TUS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Tıpta Uzmanlık Eğitimi Giriş Sınavı (TUS), tıp fakültesi mezunlarının uzmanlık alanlarını belirlemek için girdikleri, Türkiye'nin en rekabetçi sınavlarından biridir. Puanlama, adayların Temel Tıp Bilimleri ve Klinik Tıp Bilimleri testlerindeki performanslarına göre yapılır.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li><strong>Netlerin Hesaplanması:</strong> Her iki test (Temel ve Klinik) için de doğru cevap sayısından, yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur (4 yanlış 1 doğruyu götürür).</li>
              <li><strong>Ağırlıklı Puanların Hesaplanması:</strong> Her puan türü için (Temel Tıp Puanı, Klinik Tıp Puanı) ilgili testlerin netleri farklı katsayılarla çarpılır. Örneğin, Klinik Tıp Puanı hesaplanırken Klinik Bilimler Testi'nin ağırlığı daha yüksektir.</li>
              <li><strong>TUS Puanı:</strong> Hesaplanan ağırlıklı puanlar, ÖSYM tarafından her sınavın istatistiksel verilerine (ortalama, standart sapma) göre 100'lük puan sistemine dönüştürülür. Başarılı sayılmak ve tercih yapabilmek için en az 45 puan almak gerekmektedir.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "TUS'ta hangi puan türü ne için kullanılır?",
        answer: "Temel Tıp Puanı, genellikle Temel Tıp Bilimleri alanlarındaki (Anatomi, Fizyoloji vb.) uzmanlık programlarına yerleştirmede kullanılır. Klinik Tıp Puanı ise Klinik Tıp Bilimleri (Dahiliye, Cerrahi, Pediatri vb.) programları için kullanılır."
      },
      {
        question: "TUS'a girmek için yabancı dil şartı var mı?",
        answer: "Evet, TUS'a girebilmek ve uzmanlık eğitimine başlayabilmek için adayların YDS, E-YDS veya YÖKDİL (Sağlık) gibi sınavlardan belirli bir baraj puanını (genellikle 50) almış olmaları gerekmektedir."
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
      <TusClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 