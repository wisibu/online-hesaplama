import type { Metadata } from 'next';
import KpssClient from './KpssClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "KPSS Puan Hesaplama (Lisans, Ön Lisans, Ortaöğretim) | OnlineHesaplama",
  description: "KPSS P1, P2, P3, P93, P94 puan türleri için öğrenim düzeyinizi ve testlerdeki doğru/yanlış sayılarınızı girerek tahmini puanınızı hesaplayın.",
  keywords: ["kpss puan hesaplama", "kpss lisans", "kpss ön lisans", "kpss ortaöğretim", "p3 puanı", "p93 puanı", "p94 puanı"],
  content: {
    sections: [
      {
        title: "KPSS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Kamu Personel Seçme Sınavı (KPSS), kamu kurumlarına personel alımında kullanılan en temel sınavlardan biridir. Puan hesaplaması, sınavın yapıldığı öğrenim düzeyine (Lisans, Ön Lisans, Ortaöğretim) ve girilen oturumlara göre değişiklik gösterir.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li><strong>Netlerin Hesaplanması:</strong> Her test için doğru cevap sayısından, yanlış cevap sayısının dörtte biri çıkarılarak net sayısı bulunur.</li>
              <li><strong>Standart Puan:</strong> Her test için adayların netleri, o testin ortalama ve standart sapması kullanılarak standart puana dönüştürülür. Bu, adayın sınava giren diğer kişilere göre başarısını gösterir.</li>
              <li><strong>Ağırlıklı Puan ve KPSS Puanı:</strong> Hesaplanan standart puanlar, her puan türü (P1, P3, P93 vb.) için belirlenmiş katsayılarla çarpılıp toplanır. Son olarak bu toplama, yine her puan türü için özel olarak belirlenmiş bir formülle 100'lük sisteme çevrilerek nihai KPSS puanı elde edilir.</li>
            </ol>
            <p className='mt-2'>Bu hesaplayıcı, ÖSYM'nin geçmiş yıllardaki verilerine dayalı tahmini katsayılar kullanarak bir sonuç üretir ve gerçek sonuçlar farklılık gösterebilir.</p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Hangi puan türü hangi alımlar için kullanılır?",
        answer: "P3 puanı genellikle Lisans mezunları için (A grubu ve B grubu öğretmenlik dışı) atamalarda, P93 Ön Lisans mezunları için, P94 ise Ortaöğretim (Lise) mezunları için B grubu atamalarda kullanılır."
      },
      {
        question: "KPSS puanının geçerlilik süresi nedir?",
        answer: "Genellikle KPSS sonuçları iki yıl süreyle geçerlidir. Ancak, öğretmen adayları için bu süre bir yıldır. Yeni bir sınav yapıldığında, önceki puanların geçerliliği sona erebilir."
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
      <KpssClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}