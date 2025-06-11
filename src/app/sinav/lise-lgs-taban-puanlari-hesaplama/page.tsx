import type { Metadata } from 'next';
import LiseTabanPuanlariClient, { Lise } from './LiseTabanPuanlariClient';
import RichContent from '@/components/RichContent';

// Bu veri normalde bir API'den veya e-Okul'dan gelir. Şimdilik örnek veri.
const liseler: Lise[] = [
  { id: 1, il: 'İstanbul', ilce: 'Fatih', adi: 'İstanbul Erkek Lisesi', turu: 'Anadolu Lisesi', yuzdelik: 0.01, puan: 499.5 },
  { id: 2, il: 'İstanbul', ilce: 'Beşiktaş', adi: 'Galatasaray Lisesi', turu: 'Anadolu Lisesi', yuzdelik: 0.01, puan: 500.0 },
  { id: 3, il: 'Ankara', ilce: 'Çankaya', adi: 'Ankara Fen Lisesi', turu: 'Fen Lisesi', yuzdelik: 0.08, puan: 495.3 },
  { id: 4, il: 'İzmir', ilce: 'Bornova', adi: 'İzmir Fen Lisesi', turu: 'Fen Lisesi', yuzdelik: 0.12, puan: 494.2 },
  { id: 5, il: 'İstanbul', ilce: 'Kadıköy', adi: 'Kadıköy Anadolu Lisesi', turu: 'Anadolu Lisesi', yuzdelik: 0.25, puan: 490.1 },
  { id: 6, il: 'İstanbul', ilce: 'Üsküdar', adi: 'Hüseyin Avni Sözen Anadolu Lisesi', turu: 'Anadolu Lisesi', yuzdelik: 0.3, puan: 488.5 },
  { id: 7, il: 'Bursa', ilce: 'Nilüfer', adi: 'Tofaş Fen Lisesi', turu: 'Fen Lisesi', yuzdelik: 0.45, puan: 485.6 },
];

const pageConfig = {
  title: "Lise Taban Puanları ve Yüzdelik Dilimleri 2024 | OnlineHesaplama",
  description: "İl, ilçe ve lise türüne göre güncel LGS taban puanları ve yüzdelik dilimleri. Aradığınız lisenin puan ve yüzdelik dilim bilgilerine kolayca ulaşın.",
  keywords: ["lgs taban puanları", "lise taban puanları", "lgs yüzdelik dilimler", "fen lisesi taban puanları", "anadolu lisesi taban puanları", "2024 lgs"],
  content: {
    sections: [
      {
        title: "LGS Lise Taban Puanları ve Yüzdelik Dilimleri",
        content: (
          <>
            <p>
              Liselere Geçiş Sistemi (LGS) sonuçlarına göre bir liseye yerleşmek isteyen öğrenciler için en önemli iki veri, okulların bir önceki yılki <strong>taban puanları</strong> ve <strong>yüzdelik dilimleridir</strong>. Özellikle yüzdelik dilim, öğrencinin Türkiye genelindeki sıralamasını gösterdiği için daha güvenilir bir tercih referansıdır.
            </p>
            <p className="mt-2">
              Aşağıdaki interaktif tabloyu kullanarak il, ilçe, lise türü veya okul adına göre arama ve filtreleme yapabilirsiniz. Bu sayede, kendi LGS sonucunuza en uygun okulları kolayca bulabilir ve gerçekçi bir tercih listesi oluşturabilirsiniz. Unutmayın ki bu veriler bir önceki yılın yerleştirme sonuçlarına aittir ve her yıl küçük değişiklikler gösterebilir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Yüzdelik dilim nedir, neden önemlidir?",
        answer: "Yüzdelik dilim, adayın sınava giren tüm öğrenciler içindeki sıralamasının yüzde olarak ifade edilmesidir. Örneğin, %5'lik dilimde olan bir öğrenci, sınava girenlerin en başarılı %5'lik kesiminde yer alıyor demektir. Tercih yaparken puan yerine yüzdelik dilimi kullanmak, sınavın zorluk derecesindeki yıllık değişimlerden etkilenmediği için daha sağlıklı sonuçlar verir."
      },
      {
        question: "Genel yüzdelik dilim mi, il yüzdelik dilimi mi kullanılmalı?",
        answer: "Merkezi yerleştirmelerde (nitelikli liseler) her zaman 'Genel Yüzdelik Dilim' kullanılır. 'İl Yüzdelik Dilimi' ise yerel yerleştirme sürecinde, yani adrese dayalı okul tercihlerinde bir referans olarak kullanılabilir."
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
      <LiseTabanPuanlariClient liseler={liseler} />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}