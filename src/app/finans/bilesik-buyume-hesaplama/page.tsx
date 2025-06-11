import type { Metadata } from 'next';
import RichContent from '@/components/RichContent';
import BilesikBuyumeClient from './BilesikBuyumeClient';

const pageConfig = {
  title: "Yıllık Bileşik Büyüme Oranı (CAGR) Hesaplama | OnlineHesaplama",
  description: "Bir yatırımın veya değerin belirli bir dönemdeki Yıllık Bileşik Büyüme Oranını (CAGR) veya gelecekteki değerini kolayca hesaplayın.",
  keywords: ["bileşik büyüme hesaplama", "cagr hesaplama", "yıllık bileşik büyüme oranı", "yatırım büyümesi", "gelecekteki değer hesaplama"],
  content: {
    sections: [
      {
        title: "Yıllık Bileşik Büyüme Oranı (CAGR) Nedir?",
        content: (
          <>
            <p>
              Yıllık Bileşik Büyüme Oranı (Compound Annual Growth Rate - CAGR), bir yatırımın veya herhangi bir değerin belirli bir zaman aralığındaki ortalama yıllık büyüme oranını gösteren bir finansal metriktir. CAGR, yatırımın başlangıç ve bitiş değerleri arasındaki büyümenin, her yıl aynı oranda bileşik olarak gerçekleştiği varsayımına dayanır.
            </p>
            <p className="mt-2">
              Bu oran, büyümenin zaman içindeki dalgalanmalarını yumuşatarak tek ve anlaşılır bir yüzde değeri sunar. Bu nedenle, farklı yatırımların performansını karşılaştırmak için oldukça kullanışlıdır.
            </p>
          </>
        )
      }
    ],
    faqs: [
        {
            question: "CAGR neden basit büyüme oranından daha iyidir?",
            answer: "Basit büyüme oranı, sadece başlangıç ve bitiş noktalarını dikkate alır ve büyümenin zaman içindeki bileşik etkisini göz ardı eder. CAGR ise, faizin faizi (veya büyümenin büyümesi) etkisini hesaba kattığı için daha gerçekçi ve doğru bir performans ölçütüdür."
        },
        {
            question: "Bu hesap makinesi hangi durumlar için kullanılabilir?",
            answer: "Bir yatırım portföyünün, bir şirketin gelirlerinin, bir hisse senedinin fiyatının veya herhangi bir varlığın belirli bir dönemdeki performansını ölçmek ve gelecekteki potansiyel değerini tahmin etmek için kullanabilirsiniz."
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
      <BilesikBuyumeClient />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}