import type { Metadata } from 'next';
import DgsTabanPuanlariClient, { DgsProgram } from './DgsTabanPuanlariClient';
import RichContent from '@/components/RichContent';

// Bu veri normalde bir API'den veya veritabanından gelir. Şimdilik örnek veri.
const dgsProgramlari: DgsProgram[] = [
  { id: 1, uni: 'BOĞAZİÇİ ÜNİVERSİTESİ', fakulte: 'Mühendislik Fakültesi', bolum: 'Bilgisayar Mühendisliği', puanTuru: 'SAY', kontenjan: 5, puan: 395.45, siralama: 102, sehir: 'İstanbul' },
  { id: 2, uni: 'ORTA DOĞU TEKNİK ÜNİVERSİTESİ', fakulte: 'Mühendislik Fakültesi', bolum: 'Elektrik-Elektronik Mühendisliği', puanTuru: 'SAY', kontenjan: 10, puan: 389.12, siralama: 255, sehir: 'Ankara' },
  { id: 3, uni: 'İSTANBUL ÜNİVERSİTESİ', fakulte: 'Hukuk Fakültesi', bolum: 'Hukuk', puanTuru: 'EA', kontenjan: 20, puan: 370.88, siralama: 512, sehir: 'İstanbul' },
  { id: 4, uni: 'ANKARA ÜNİVERSİTESİ', fakulte: 'Siyasal Bilgiler Fakültesi', bolum: 'Uluslararası İlişkiler', puanTuru: 'EA', kontenjan: 15, puan: 355.67, siralama: 1204, sehir: 'Ankara' },
  { id: 5, uni: 'EGE ÜNİVERSİTESİ', fakulte: 'İletişim Fakültesi', bolum: 'Radyo, Televizyon ve Sinema', puanTuru: 'SÖZ', kontenjan: 8, puan: 340.21, siralama: 850, sehir: 'İzmir' },
];

const pageConfig = {
  title: "DGS Taban Puanları 2024 | OnlineHesaplama",
  description: "Üniversite ve bölümlere göre güncel DGS taban puanları, başarı sıralamaları ve kontenjan bilgileri. İlgili programa göre arama ve filtreleme yapın.",
  keywords: ["dgs taban puanları", "dgs başarı sıralamaları", "dikey geçiş taban puanları", "dgs kontenjanları", "2024 dgs puanları"],
  content: {
    sections: [
      {
        title: "DGS Taban Puanları ve Başarı Sıralamaları",
        content: (
          <>
            <p>
              Dikey Geçiş Sınavı (DGS) ile bir lisans programına yerleşmek isteyen adaylar için en önemli referanslardan biri, geçmiş yıllara ait taban puanları ve başarı sıralamalarıdır. Bu veriler, tercih edeceğiniz bölümün yaklaşık olarak hangi puan aralığında ve sıralamada olduğunu göstererek gerçekçi bir tercih listesi hazırlamanıza yardımcı olur.
            </p>
            <p className="mt-2">
              Aşağıdaki interaktif tabloyu kullanarak üniversite, bölüm, puan türü veya şehre göre filtreleme yapabilir, aradığınız programın en güncel taban puanı ve başarı sıralaması bilgilerine kolayca ulaşabilirsiniz. Unutmayın ki bu puanlar bir önceki yılın yerleştirme sonuçlarına aittir ve her yıl kontenjan, tercih yoğunluğu ve sınav zorluğuna göre değişiklik gösterebilir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Taban puan mı, başarı sırası mı daha önemlidir?",
        answer: "Tercih yaparken başarı sırasını dikkate almak genellikle daha güvenilir bir yaklaşımdır. Çünkü sınavların zorluk derecesi her yıl değişebilir ve bu da puanların dalgalanmasına neden olur. Ancak başarı sıralamaları, adayların genel başarı düzeyindeki yerini gösterdiği için daha istikrarlı bir veridir."
      },
      {
        question: "Taban puanı 'Yok' veya 'Dolmadı' ne anlama geliyor?",
        answer: "'Dolmadı' ifadesi, o bölümün kontenjanının tamamen dolmadığını ve son yerleşen öğrencinin puanının oluşmadığını gösterir. Bu bölümleri, ilgili puan türünde puanınız hesaplandıysa tercih edebilirsiniz."
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
      <DgsTabanPuanlariClient programs={dgsProgramlari} />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
}