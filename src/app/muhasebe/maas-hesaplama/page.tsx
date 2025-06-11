import type { Metadata } from 'next';
import Link from 'next/link';
import RichContent from '@/components/RichContent';

const pageConfig = {
  title: "Maaş Hesaplama (Brütten Nete & Netten Brüte) | OnlineHesaplama",
  description: "Brüt maaştan net maaşı veya net maaştan brüt maaşı hesaplamak için en doğru araçlar. Tüm vergi ve kesintileri anında görün.",
  keywords: ["maaş hesaplama", "brütten nete", "netten brüte", "maaş hesaplama robotu", "net maaş", "brüt maaş"],
  content: {
    title: "Maaş Hesaplama Araçları",
    description: "Maaşınızı etkileyen tüm faktörleri anlayın ve elinize geçecek net tutarı veya işverene toplam maliyetinizi kolayca hesaplayın. Brütten nete veya netten brüte maaş hesaplamak için aşağıdaki araçlarımızı kullanabilirsiniz.",
    sections: [
      {
        title: "Maaşın Temel Bileşenleri",
        content: (
          <>
            <p>
              Bir çalışanın maaşı, genellikle 'brüt' ve 'net' olmak üzere iki temel kavram etrafında şekillenir. Maaş bordronuzu anlamak, bu iki kavram ve aralarındaki kesintileri bilmekten geçer.
            </p>
            <ul className="list-disc list-inside mt-4 pl-4 space-y-2">
              <li><strong>Brüt Maaş:</strong> İş sözleşmesinde belirtilen, içerisinde tüm vergiler ve kesintiler dahil olan toplam tutardır.</li>
              <li><strong>SGK Primleri:</strong> Sosyal Güvenlik Kurumu'na ödenen, emeklilik ve sağlık hizmetlerini kapsayan primlerdir. İşçi ve işveren payı olarak ikiye ayrılır.</li>
              <li><strong>İşsizlik Sigortası Primi:</strong> İşsiz kalma durumunda belirli bir süre gelir desteği sağlayan fona ödenen primdir.</li>
              <li><strong>Gelir Vergisi:</strong> Devletin, kazancınız üzerinden aldığı vergidir. Kazanç arttıkça vergi oranı da artan dilimli bir sisteme tabidir.</li>
              <li><strong>Damga Vergisi:</strong> Maaş bordrosu gibi resmi belgelerden alınan cüzi bir vergidir.</li>
              <li><strong>Net Maaş:</strong> Brüt maaştan tüm bu yasal kesintiler yapıldıktan sonra çalışanın eline geçen 'temiz' tutardır.</li>
            </ul>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Brütten nete hesaplama neden önemlidir?",
        answer: "İş görüşmelerinde veya sözleşmelerde genellikle brüt maaş konuşulur. Elinize net olarak ne kadar geçeceğini bilmek, bütçenizi doğru planlamanız için kritik öneme sahiptir."
      },
      {
        question: "Netten brüte hesaplama ne işe yarar?",
        answer: "Bu hesaplama genellikle işverenler tarafından kullanılır. Bir çalışana belirli bir net maaş ödemeyi taahhüt ettiklerinde, bu net maaşı sağlamak için ne kadar brüt maaş belirlemeleri gerektiğini ve bunun toplam maliyetini (işveren SGK payı dahil) görmelerini sağlar."
      },
       {
        question: "Asgari ücretin maaş hesaplamasındaki rolü nedir?",
        answer: "Asgari ücret, bir çalışana yasal olarak ödenebilecek en düşük maaş tutarını belirler. Ayrıca, gelir vergisi ve SGK primi hesaplamalarında bazı istisnalar ve tavan-taban limitleri için bir referans noktası olarak kullanılır."
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
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{pageConfig.content.title}</h1>
        <p className="text-lg text-gray-600 mb-8">{pageConfig.content.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link href="/muhasebe/brutten-nete-maas-hesaplama" className="block p-6 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-300 shadow-sm">
            <h2 className="text-xl font-semibold text-blue-800">Brütten Nete Maaş Hesaplama</h2>
            <p className="text-gray-700 mt-2">Brüt maaşınızı girerek vergi ve kesintiler sonrası elinize geçecek net tutarı hesaplayın.</p>
          </Link>
          <Link href="/muhasebe/netten-brute-maas-hesaplama" className="block p-6 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-300 shadow-sm">
            <h2 className="text-xl font-semibold text-green-800">Netten Brüte Maaş Hesaplama</h2>
            <p className="text-gray-700 mt-2">Net maaş beklentinize ulaşmak için gereken brüt maaşı ve işveren maliyetini öğrenin.</p>
          </Link>
        </div>

        <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />

      </div>
    </div>
  );
}