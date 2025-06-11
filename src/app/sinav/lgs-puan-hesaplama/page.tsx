import type { Metadata } from 'next';
import LgsClient from './LgsClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "LGS Puan Hesaplama 2024 | OnlineHesaplama",
  description: "LGS'deki sözel ve sayısal bölüm dersleri için doğru ve yanlış sayılarınızı girerek yüzdelik diliminize en yakın tahmini LGS merkezi sınav puanınızı hesaplayın.",
  keywords: ["lgs puan hesaplama", "lgs yüzdelik dilim hesaplama", "liselere geçiş sınavı", "lgs 2024"],
  content: {
    sections: [
      {
        title: "LGS Puanı Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Liselere Geçiş Sistemi (LGS) kapsamında yapılan merkezî sınavın puanı, öğrencilerin Sözel ve Sayısal bölümlerdeki performanslarına göre hesaplanır. Her dersin sınavdaki ağırlığı farklıdır ve bu ağırlıklar katsayılarla belirlenir.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
              <li><strong>Netlerin Hesaplanması:</strong> Her ders için, doğru cevap sayısından yanlış cevap sayısının üçte biri çıkarılarak net sayısı bulunur (3 yanlış 1 doğruyu götürür).</li>
              <li><strong>Ağırlıklı Ham Puan:</strong> Her dersin neti, o ders için belirlenmiş katsayı ile çarpılır. Tüm dersler için hesaplanan bu ağırlıklı puanlar toplanarak adayın Ağırlıklı Ham Puanı (AHP) elde edilir.</li>
              <li><strong>Merkezi Sınav Puanı (MSP):</strong> Adayların Ağırlıklı Ham Puanları, o yılki sınavın ortalama ve standart sapması kullanılarak 100 ile 500 arasında bir puana dönüştürülür. Bu hesaplayıcı, geçmiş yılların verilerine dayanarak tahmini bir MSP sunar.</li>
            </ol>
            <p className='mt-2'><strong>Önemli Not:</strong> Gerçek sınav puanı ve yüzdelik dilim, sınava giren tüm öğrencilerin sonuçlarına göre belirlendiği için burada hesaplanan puan ve yüzdelik dilim tahmini değerlerdir.</p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "LGS'de derslerin katsayıları nelerdir?",
        answer: "LGS puan hesaplamasında Türkçe, Matematik ve Fen Bilimleri derslerinin katsayısı 4; T.C. İnkılap Tarihi ve Atatürkçülük, Din Kültürü ve Ahlak Bilgisi ve Yabancı Dil derslerinin katsayısı ise 1'dir."
      },
      {
        question: "Puan mı daha önemli, yüzdelik dilim mi?",
        answer: "Lise tercihi yaparken yüzdelik dilim, puandan çok daha önemli ve güvenilir bir veridir. Çünkü sınavın zorluğuna göre puanlar her yıl değişse de yüzdelik dilimler, adayın Türkiye genelindeki sırasını gösterdiği için daha istikrarlı bir referans noktasıdır."
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
      <LgsClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}