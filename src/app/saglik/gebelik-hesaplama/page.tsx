import type { Metadata } from 'next';
import CalculatorUI, { InputField, CalculationResult } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { formatDate } from '@/utils/formatting';

const pageConfig = {
  title: "Gebelik Haftası ve Doğum Tarihi Hesaplama | OnlineHesaplama",
  description: "Son adet tarihinizi (SAT) girerek kaç haftalık hamile olduğunuzu, tahmini doğum tarihinizi ve bebeğinizin burcunu anında öğrenin.",
  keywords: ["gebelik hesaplama", "doğum tarihi hesaplama", "kaç haftalık hamilelik", "tahmini doğum tarihi", "SAT hesaplama"],
  calculator: {
    title: "Gebelik ve Doğum Tarihi Hesaplama",
    description: (
      <p className="text-sm text-gray-600">
        Son adet döneminizin ilk gününü girerek hesaplama yapın.
      </p>
    ),
    inputFields: [
      { id: 'sonAdetTarihi', label: 'Son Adet Tarihinin İlk Günü (SAT)', type: 'date', defaultValue: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0] },
    ] as InputField[],
    calculate: async (inputs: { [key: string]: string | number | boolean }): Promise<CalculationResult | null> => {
        'use server';
        
        const { sonAdetTarihi: sonAdetTarihiStr } = inputs as { sonAdetTarihi: string };

        if (!sonAdetTarihiStr) {
            return { summary: { error: { type: 'error', label: 'Hata', value: 'Lütfen geçerli bir tarih girin.' } } };
        }

        const sonAdet = new Date(sonAdetTarihiStr);
        const bugun = new Date();
        
        const gunFarki = Math.floor((bugun.getTime() - sonAdet.getTime()) / (1000 * 60 * 60 * 24));
        const gebelikHaftasi = Math.floor(gunFarki / 7);
        const gebelikGunu = gunFarki % 7;

        // Naegele Kuralı: SAT - 3 Ay + 7 Gün + 1 Yıl
        const dogumTarihi = new Date(sonAdet);
        dogumTarihi.setMonth(dogumTarihi.getMonth() - 3);
        dogumTarihi.setDate(dogumTarihi.getDate() + 7);
        dogumTarihi.setFullYear(dogumTarihi.getFullYear() + 1);

        const getBurc = (date: Date) => {
            const gun = date.getDate();
            const ay = date.getMonth() + 1;
            if ((ay == 1 && gun >= 21) || (ay == 2 && gun <= 19)) return "Kova ♒";
            if ((ay == 2 && gun >= 20) || (ay == 3 && gun <= 20)) return "Balık ♓";
            if ((ay == 3 && gun >= 21) || (ay == 4 && gun <= 20)) return "Koç ♈";
            if ((ay == 4 && gun >= 21) || (ay == 5 && gun <= 21)) return "Boğa ♉";
            if ((ay == 5 && gun >= 22) || (ay == 6 && gun <= 22)) return "İkizler ♊";
            if ((ay == 6 && gun >= 23) || (ay == 7 && gun <= 22)) return "Yengeç ♋";
            if ((ay == 7 && gun >= 23) || (ay == 8 && gun <= 22)) return "Aslan ♌";
            if ((ay == 8 && gun >= 23) || (ay == 9 && gun <= 22)) return "Başak ♍";
            if ((ay == 9 && gun >= 23) || (ay == 10 && gun <= 22)) return "Terazi ♎";
            if ((ay == 10 && gun >= 23) || (ay == 11 && gun <= 21)) return "Akrep ♏";
            if ((ay == 11 && gun >= 22) || (ay == 12 && gun <= 21)) return "Yay ♐";
            if ((ay == 12 && gun >= 22) || (ay == 1 && gun <= 20)) return "Oğlak ♑";
            return "";
        };

        const summary: CalculationResult['summary'] = {
            gebelikSuresi: { type: 'result', label: "Gebelik Süresi (Tahmini)", value: `${gebelikHaftasi} hafta, ${gebelikGunu} gün`, isHighlighted: true },
            dogumTarihi: { type: 'info', label: "Tahmini Doğum Tarihi", value: formatDate(dogumTarihi) },
            bebeginBurcu: { type: 'info', label: "Bebeğinizin Burcu", value: getBurc(dogumTarihi) },
        };
          
        return { summary };
    },
  },
  content: {
    sections: [
      {
        title: "Gebelik Haftası ve Doğum Tarihi Nasıl Hesaplanır?",
        content: (
          <>
            <p>
              Gebelik hesaplamaları genellikle son adet tarihinizin (SAT) ilk gününe dayanır. Bu yöntem, döllenmenin tam zamanı bilinmediği için standart bir başlangıç noktası sunar.
            </p>
            <ol className="list-decimal list-inside space-y-2 mt-2">
                <li><strong>Gebelik Haftası:</strong> Son adet tarihinizin ilk gününden bugüne kadar geçen toplam gün sayısı hesaplanır ve 7'ye bölünür. Bu, hamileliğin kaç hafta ve kaç gün sürdüğünü gösterir.</li>
                <li><strong>Tahmini Doğum Tarihi (TDT):</strong> En yaygın kullanılan yöntem Naegele kuralıdır. Bu kurala göre, son adet tarihinizden 3 ay geriye gidilir, 7 gün ve 1 yıl eklenir. Bu hesaplama, 28 günlük düzenli adet döngülerine ve gebeliğin 40 hafta (280 gün) süreceği varsayımına dayanır.</li>
            </ol>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Hesaplanan tarih kesin midir?",
        answer: "Hayır, bu tarih yalnızca bir tahmindir. Bebeklerin sadece küçük bir yüzdesi tam olarak hesaplanan günde doğar. Genellikle doğum, hesaplanan tarihten iki hafta önce veya iki hafta sonra gerçekleşebilir. En doğru tarih için doktorunuzun ultrason ölçümleri önemlidir."
      },
      {
        question: "Adet döngüm düzensiz ise bu hesaplama doğru sonuç verir mi?",
        answer: "Adet döngüleri düzensiz olan kadınlar için son adet tarihine dayalı hesaplamalar yanıltıcı olabilir. Bu durumda, gebeliğin ilk haftalarında yapılan ultrason ölçümleri (CRL - baş-popo mesafesi) gebelik haftasını ve tahmini doğum tarihini daha doğru bir şekilde belirleyecektir."
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
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Gebelik Analizi"
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}