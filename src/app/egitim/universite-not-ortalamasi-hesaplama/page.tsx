import type { Metadata } from 'next';
import UniversiteOrtalamaClient from './UniversiteOrtalamaClient';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Üniversite Not Ortalaması Hesaplama (AGNO/GANO) | OnlineHesaplama",
  description: "Derslerinizden aldığınız harf notlarını ve ECTS kredilerini girerek dönem veya genel ağırlıklı not ortalamanızı (AGNO/GANO) 4'lük ve 100'lük sistemde hesaplayın.",
  keywords: ["üniversite not ortalaması hesaplama", "gano hesaplama", "agno hesaplama", "ağırlıklı not ortalaması", "ects"],
  content: {
    sections: [
      {
        title: "Üniversite Not Ortalaması (AGNO/GANO) Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Ağırlıklı Genel Not Ortalaması (AGNO veya GANO), üniversite öğrencilerinin akademik başarılarını gösteren en önemli ölçütlerden biridir. Her dersin kredisinin (AKTS), o dersten alınan notun katsayısıyla çarpılıp, bu çarpımların toplamının toplam krediye bölünmesiyle hesaplanır.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Harf Notu Katsayısı:</strong> Her harf notunun (AA, BA, BB vb.) 4'lük sistemde bir karşılığı vardır (Örn: AA=4.00, BA=3.50).</li>
                <li><strong>Ağırlıklı Puan:</strong> Her ders için, dersin kredisi ile harf notu katsayısı çarpılır. (Örn: 3 Kredilik bir dersten BA alındıysa: 3 x 3.50 = 10.5)</li>
                <li><strong>Ortalama Hesabı:</strong> Tüm dersler için hesaplanan ağırlıklı puanların toplamı, alınan tüm derslerin kredi (AKTS) toplamına bölünür.</li>
            </ol>
            <p className='mt-2'>Bu hesaplayıcı, bu işlemi sizin için otomatik olarak yapar ve hem 4'lük sistemdeki ortalamanızı hem de YÖK dönüşüm tablosuna göre 100'lük sistemdeki yaklaşık karşılığını gösterir.</p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "AGNO ile GANO arasındaki fark nedir?",
        answer: "AGNO (Ağırlıklı Not Ortalaması) genellikle tek bir dönemin (güz veya bahar) ortalamasını ifade ederken, GANO (Genel Ağırlıklı Not Ortalaması) o ana kadar alınmış tüm derslerin ortalamasını ifade eder. Hesaplama mantığı ikisi için de aynıdır."
      },
      {
        question: "DC ve DD notları ile dersten geçer miyim?",
        answer: "Bu durum üniversitenizin yönetmeliğine bağlıdır. Çoğu üniversitede, DC ve DD gibi şartlı geçer notların geçerli sayılabilmesi için GANO'nuzun belirli bir barajın (genellikle 2.00) üzerinde olması gerekir. GANO'nuz bu barajın altındaysa, bu dersleri tekrar almanız gerekebilir."
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
      <UniversiteOrtalamaClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}