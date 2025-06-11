import type { Metadata } from 'next';
import BebekGelisimClient from '../BebekGelisimClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Bebek Kilosu Hesaplama ve Persentil Takibi | DSÖ",
  description: "Bebeğinizin yaşına ve cinsiyetine göre kilosunun normal persentil aralıklarında olup olmadığını Dünya Sağlık Örgütü (DSÖ) verileriyle anında öğrenin.",
  keywords: ["bebek kilosu hesaplama", "persentil hesaplama", "bebek gelişim tablosu", "kilo takibi", "DSÖ persentil"],
  content: {
    sections: [
      {
        title: "Bebeklerde Kilo Gelişimi ve Persentil Eğrileri",
        content: (
          <>
            <p>
              Bebeğinizin kilosu, yeterli beslenip beslenmediğini ve sağlıklı büyüdüğünü gösteren önemli bir veridir. Tıpkı boy takibinde olduğu gibi, kilo takibinde de Dünya Sağlık Örgütü (DSÖ) tarafından oluşturulan persentil eğrileri kullanılır.
            </p>
            <p className="mt-2">
              Bu eğriler, bebeğinizin kilosunu aynı yaş ve cinsiyetteki diğer bebeklerle karşılaştırır. 50. persentil ortalama kiloyu gösterirken, 3. ve 97. persentil arasındaki değerler genellikle normal kabul edilir. Bebeğin gelişiminin düzenli olarak kendi persentil çizgisine yakın seyretmesi beklenir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Bebeğim yeterince kilo almıyor, ne yapmalıyım?",
        answer: "Eğer bebeğinizin kilo alımının yavaşladığını veya persentil eğrisinde düşüş olduğunu düşünüyorsanız, bir çocuk doktoruna başvurmalısınız. Doktor, beslenme düzenini ve genel sağlık durumunu değerlendirerek size en doğru bilgiyi verecektir."
      },
      {
        question: "Persentil değerleri neden önemlidir?",
        answer: "Persentil takibi, potansiyel bir büyüme veya beslenme sorununun erken tespiti için kritik bir araçtır. Tek bir ölçümden çok, zaman içindeki değişim ve gelişim trendi önemlidir. Bu nedenle düzenli doktor kontrolleri aksatılmamalıdır."
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
      <BebekGelisimClient type="kilo" />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}