import type { Metadata } from 'next';
import BebekGelisimClient from '../BebekGelisimClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Bebek Boyu Hesaplama ve Persentil Takibi | DSÖ",
  description: "Bebeğinizin yaşına ve cinsiyetine göre boyunun normal persentil aralıklarında olup olmadığını Dünya Sağlık Örgütü (DSÖ) verileriyle anında öğrenin.",
  keywords: ["bebek boyu hesaplama", "persentil hesaplama", "bebek gelişim tablosu", "boy kilo takibi", "DSÖ persentil"],
  content: {
    sections: [
      {
        title: "Bebeklerde Boy Gelişimi ve Persentil Eğrileri",
        content: (
          <>
            <p>
              Bebeklerin boy uzunluğu, sağlıklı büyüme ve gelişmenin en önemli göstergelerinden biridir. Persentil eğrileri, bir bebeğin boyunu aynı yaş ve cinsiyetteki diğer bebeklerle karşılaştırmak için kullanılan standart bir araçtır. Dünya Sağlık Örgütü (DSÖ), bu eğrileri küresel verilerle oluşturur.
            </p>
            <p className="mt-2">
              Örneğin, bir bebeğin boyu 75. persentilde ise, bu onun yaşıtlarının %75'inden daha uzun olduğu anlamına gelir. Genellikle 3. ve 97. persentiller arasındaki değerler normal kabul edilir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Hangi persentil değerleri normal kabul edilir?",
        answer: "Genellikle, bir çocuğun persentil değerinin 3 ile 97 arasında olması normal olarak kabul edilir. Önemli olan tek bir ölçümden ziyade, çocuğun kendi persentil eğrisini düzenli bir şekilde takip etmesidir. Ani düşüşler veya yükselişler bir doktor tarafından değerlendirilmelidir."
      },
      {
        question: "Bebeğimin boyu düşük persentilde ise endişelenmeli miyim?",
        answer: "Tek bir ölçüm her zaman endişe kaynağı olmayabilir. Genetik faktörler (anne-baba boyu) de boy gelişiminde etkilidir. Ancak, büyüme eğrisinde sürekli bir düşüş varsa veya boy 3. persentilin altındaysa, bir çocuk doktoruna danışmak önemlidir."
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
      <BebekGelisimClient type="boy" />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}