import {
  FaCalculator, FaCreditCard, FaCar, FaHeartbeat, FaPercent, FaGavel, FaFileInvoiceDollar,
  FaPiggyBank, FaUniversity, FaGraduationCap, FaChartLine, FaLandmark, FaCarSide, FaPoundSign, FaFileContract, FaRegFileAlt, FaBalanceScale, FaBuilding, FaPlane, FaMoneyBillWave, FaPercentage
} from 'react-icons/fa';
import { GiReceiveMoney, GiPayMoney, GiCash, GiTestTubes, GiHealthNormal } from 'react-icons/gi';
import { BsBank } from 'react-icons/bs';
import { RiHealthBookFill } from "react-icons/ri";

import { IconType } from 'react-icons';

export interface NavLink {
  href: string;
  title: string;
  description: string;
  icon: IconType;
}

export interface Category {
  category: string;
  icon: IconType;
  links: NavLink[];
}

export const createSlug = (text: string) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^\w-]+/g, '');
};

export const navLinksData: Category[] = [
  {
    category: 'Popüler Hesaplamalar',
    icon: FaCalculator,
    links: [
      { href: '/kredi/ihtiyac-kredisi-hesaplama', title: 'İhtiyaç Kredisi Hesaplama', description: 'Aylık taksit ve geri ödeme tutarını hesaplayın.', icon: FaCreditCard },
      { href: '/kredi/konut-kredisi-hesaplama', title: 'Konut Kredisi Hesaplama', description: 'Konut kredisi aylık taksit ve masraflarını hesaplayın.', icon: FaBuilding },
      { href: '/kredi/tasit-kredisi-hesaplama', title: 'Taşıt Kredisi Hesaplama', description: 'Taşıt kredisi aylık ödeme planınızı oluşturun.', icon: FaCarSide },
      { href: '/muhasebe/kidem-tazminati-hesaplama', title: 'Kıdem Tazminatı Hesaplama', description: 'Kıdem tazminatı tavanını dikkate alarak hesaplama yapın.', icon: FaGavel },
      { href: '/muhasebe/brutten-nete-maas-hesaplama', title: 'Brütten Nete Maaş Hesaplama', description: 'Brüt maaştan net maaşı, tüm kesintileri görerek hesaplayın.', icon: FaPercent },
      { href: '/vergi/kdv-hesaplama', title: 'KDV Hesaplama', description: 'Dahil veya hariç KDV tutarlarını kolayca hesaplayın.', icon: FaPercentage },
    ],
  },
  {
    category: 'Kredi Hesaplama',
    icon: FaCreditCard,
    links: [
        { href: "/kredi/ihtiyac-kredisi-hesaplama", title: "İhtiyaç Kredisi Hesaplama", description: "İhtiyaç kredisi faiz oranlarına göre aylık taksit ve toplam geri ödeme tutarını hesaplayın.", icon: FaCreditCard },
        { href: "/kredi/konut-kredisi-hesaplama", title: "Konut Kredisi Hesaplama", description: "Konut kredisi faiz oranlarına göre aylık taksit ve toplam geri ödeme tutarını hesaplayın.", icon: FaCreditCard },
        { href: "/kredi/tasit-kredisi-hesaplama", title: "Taşıt Kredisi Hesaplama", description: "Taşıt kredisi faiz oranlarına göre aylık taksit ve toplam geri ödeme tutarını hesaplayın.", icon: FaCreditCard },
        { href: "/kredi/ticari-kredi-hesaplama", title: "Ticari Kredi Hesaplama", description: "Ticari kredi faiz oranlarına göre aylık taksit ve toplam geri ödeme tutarını hesaplayın.", icon: FaCreditCard },
        { href: "/kredi/kredi-yapilandirma-hesaplama", title: "Kredi Yapılandırma Hesaplama", description: "Kredi yapılandırma faiz oranlarına göre aylık taksit ve toplam geri ödeme tutarını hesaplayın.", icon: FaCreditCard },
        { href: "/kredi/ne-kadar-kredi-alabilirim-hesaplama", title: "Ne Kadar Kredi Alabilirim Hesaplama", description: "Ne kadar kredi alabileceğinizi hesaplayın.", icon: FaCreditCard },
    ],
  },
  {
    category: 'Muhasebe',
    icon: FaFileInvoiceDollar,
    links: [
        { href: "/muhasebe/brutten-nete-maas-hesaplama", title: "Brütten Nete Maaş Hesaplama", description: "Brüt maaşınızdan net maaşınızı hesaplayın.", icon: FaPercent },
        { href: "/muhasebe/netten-brute-maas-hesaplama", title: "Netten Brüte Maaş Hesaplama", description: "Net maaşınızdan brüt maaşınızı hesaplayın.", icon: FaPercent },
        { href: "/muhasebe/kidem-tazminati-hesaplama", title: "Kıdem Tazminatı Hesaplama", description: "İşten ayrılma durumunda hak ettiğiniz kıdem tazminatı tutarını hesaplayın.", icon: FaGavel },
        { href: "/muhasebe/ihbar-tazminati-hesaplama", title: "İhbar Tazminatı Hesaplama", description: "İşten ayrılma durumunda hak ettiğiniz ihbar tazminatı tutarını hesaplayın.", icon: FaGavel },
        { href: "/muhasebe/fazla-mesai-ucreti-hesaplama", title: "Fazla Mesai Ücreti Hesaplama", description: "Fazla mesai ücretinizi hesaplayın.", icon: FaPercent },
        { href: "/muhasebe/yillik-izin-ucreti-hesaplama", title: "Yıllık İzin Ücreti Hesaplama", description: "Yıllık izin ücretinizi hesaplayın.", icon: FaPercent },
    ]
  },
  {
      category: 'Otomobil',
      icon: FaCar,
      links: [
          { href: "/otomobil/yakit-tuketimi-hesaplama", title: "Yakıt Tüketimi Hesaplama", description: "Yakıt tüketiminizi hesaplayın.", icon: FaCar },
          { href: "/otomobil/yolculuk-suresi-hesaplama", title: "Yolculuk Süresi Hesaplama", description: "Yolculuk sürenizi hesaplayın.", icon: FaCar },
          { href: "/otomobil/aylik-arac-kredisi-hesaplama", title: "Aylık Araç Kredisi Hesaplama", description: "Aylık araç kredinizi hesaplayın.", icon: FaCar },
      ]
  },
  {
      category: 'Vergi',
      icon: FaPercentage,
      links: [
          { href: "/vergi/kdv-hesaplama", title: "KDV Hesaplama", description: "KDV hesaplayın.", icon: FaPercentage },
          { href: "/vergi/gelir-vergisi-hesaplama", title: "Gelir Vergisi Hesaplama", description: "Gelir verginizi hesaplayın.", icon: FaPercentage },
          { href: "/vergi/emlak-vergisi-hesaplama", title: "Emlak Vergisi Hesaplama", description: "Emlak verginizi hesaplayın.", icon: FaPercentage },
          { href: "/vergi/mtv-hesaplama", title: "MTV Hesaplama", description: "MTV hesaplayın.", icon: FaPercentage },
          { href: "/vergi/otv-hesaplama", title: "ÖTV Hesaplama", description: "ÖTV hesaplayın.", icon: FaPercentage },
          { href: "/vergi/damga-vergisi-hesaplama", title: "Damga Vergisi Hesaplama", description: "Damga verginizi hesaplayın.", icon: FaPercentage },
      ]
  },
  {
      category: 'Yatırım',
      icon: FaChartLine,
      links: [
          { href: "/yatirim/bilesik-faiz-hesaplama", title: "Bileşik Faiz Hesaplama", description: "Bileşik faiz hesaplayın.", icon: FaChartLine },
          { href: "/yatirim/basit-faiz-hesaplama", title: "Basit Faiz Hesaplama", description: "Basit faiz hesaplayın.", icon: FaChartLine },
      ]
  },
  {
      category: 'Finans',
      icon: FaLandmark,
      links: [
          { href: "/finans/enflasyon-hesaplama", title: "Enflasyon Hesaplama", description: "Enflasyon hesaplayın.", icon: FaLandmark },
          { href: "/finans/repo-hesaplama", title: "Repo Hesaplama", description: "Repo hesaplayın.", icon: FaLandmark },
          { href: "/finans/bono-hesaplama", title: "Bono Hesaplama", description: "Bono hesaplayın.", icon: FaLandmark },
          { href: "/finans/doviz-hesaplama", title: "Döviz Hesaplama", description: "Döviz hesaplayın.", icon: FaLandmark },
          { href: "/finans/altin-hesaplama", title: "Altın Hesaplama", description: "Altın hesaplayın.", icon: FaLandmark },
      ]
  },
  {
      category: 'Matematik',
      icon: FaCalculator,
      links: [
          { href: "/matematik/yuzde-hesaplama", title: "Yüzde Hesaplama", description: "Yüzde hesaplayın.", icon: FaCalculator },
          { href: "/matematik/oran-hesaplama", title: "Oran Hesaplama", description: "Oran hesaplayın.", icon: FaCalculator },
          { href: "/matematik/faktoriyel-hesaplama", title: "Faktöriyel Hesaplama", description: "Faktöriyel hesaplayın.", icon: FaCalculator },
          { href: "/matematik/permutasyon-hesaplama", title: "Permütasyon Hesaplama", description: "Permütasyon hesaplayın.", icon: FaCalculator },
          { href: "/matematik/kombinasyon-hesaplama", title: "Kombinasyon Hesaplama", description: "Kombinasyon hesaplayın.", icon: FaCalculator },
      ]
  },
  {
      category: 'Eğitim',
      icon: FaUniversity,
      links: [
          { href: "/egitim/lise-ortalama-hesaplama", title: "Lise Ortalama Hesaplama", description: "Lise ortalamanızı hesaplayın.", icon: FaUniversity },
          { href: "/egitim/takdir-tesekkur-hesaplama", title: "Takdir Teşekkür Hesaplama", description: "Takdir teşekkür hesaplayın.", icon: FaUniversity },
          { href: "/egitim/universite-not-ortalamasi-hesaplama", title: "Üniversite Not Ortalaması Hesaplama", description: "Üniversite not ortalamanızı hesaplayın.", icon: FaUniversity },
      ]
  },
  {
      category: 'Sınav',
      icon: FaGraduationCap,
      links: [
          { href: "/sinav/lgs-puan-hesaplama", title: "LGS Puan Hesaplama", description: "LGS puanınızı hesaplayın.", icon: FaGraduationCap },
          { href: "/sinav/ayt-puan-hesaplama", title: "AYT Puan Hesaplama", description: "AYT puanınızı hesaplayın.", icon: FaGraduationCap },
          { href: "/sinav/kpss-puan-hesaplama", title: "KPSS Puan Hesaplama", description: "KPSS puanınızı hesaplayın.", icon: FaGraduationCap },
          { href: "/sinav/ales-puan-hesaplama", title: "ALES Puan Hesaplama", description: "ALES puanınızı hesaplayın.", icon: FaGraduationCap },
          { href: "/sinav/dgs-puan-hesaplama", title: "DGS Puan Hesaplama", description: "DGS puanınızı hesaplayın.", icon: FaGraduationCap },
      ]
  },
  {
      category: 'Sağlık',
      icon: FaHeartbeat,
      links: [
        { href: "/saglik/vucut-kitle-indeksi-hesaplama", title: "Vücut Kitle İndeksi Hesaplama", description: "Vücut kitle indeksinizi hesaplayın.", icon: FaHeartbeat },
        { href: "/saglik/ideal-kilo-hesaplama", title: "İdeal Kilo Hesaplama", description: "İdeal kilonuzu hesaplayın.", icon: FaHeartbeat },
        { href: "/saglik/kalori-ihtiyaci-hesaplama", title: "Kalori İhtiyacı Hesaplama", description: "Günlük kalori ihtiyacınızı hesaplayın.", icon: FaHeartbeat },
        { href: "/saglik/bazal-metabolizma-hizi-hesaplama", title: "Bazal Metabolizma Hızı Hesaplama", description: "Bazal metabolizma hızınızı hesaplayın.", icon: FaHeartbeat },
        { href: "/saglik/vucut-yag-orani-hesaplama", title: "Vücut Yağ Oranı Hesaplama", description: "Vücut yağ oranınızı hesaplayın.", icon: FaHeartbeat },
        { href: "/saglik/gebelik-hesaplama", title: "Gebelik Hesaplama", description: "Gebelik haftanızı ve doğum tarihinizi hesaplayın.", icon: FaHeartbeat },
        { href: "/saglik/yumurtlama-donemi-hesaplama", title: "Yumurtlama Dönemi Hesaplama", description: "Yumurtlama döneminizi hesaplayın.", icon: FaHeartbeat },
      ]
  }
]; 