import { FaCalculator, FaCreditCard, FaCar, FaHeartbeat, FaPercent, FaGavel, FaFileInvoiceDollar } from 'react-icons/fa';
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
      {
        href: '/kredi/ihtiyac-kredisi-hesaplama',
        title: 'İhtiyaç Kredisi Hesaplama',
        description: 'İhtiyaç kredisi faiz oranlarına göre aylık taksit ve toplam geri ödeme tutarını hesaplayın.',
        icon: FaCreditCard,
      },
      {
        href: '/muhasebe/kidem-tazminati-hesaplama',
        title: 'Kıdem Tazminatı Hesaplama',
        description: 'İşten ayrılma durumunda hak ettiğiniz kıdem tazminatı tutarını hesaplayın.',
        icon: FaGavel,
      }
    ],
  },
  {
    category: 'Kredi Hesaplama',
    icon: FaCreditCard,
    links: [
        {
            href: '/kredi/ihtiyac-kredisi-hesaplama',
            title: 'İhtiyaç Kredisi Hesaplama',
            description: 'İhtiyaç kredisi faiz oranlarına göre aylık taksit ve toplam geri ödeme tutarını hesaplayın.',
            icon: FaCreditCard,
        },
    ]
  },
  {
      category: 'Muhasebe',
      icon: FaFileInvoiceDollar,
      links: [
        {
            href: '/muhasebe/brutten-nete-maas-hesaplama',
            title: 'Brütten Nete Maaş Hesaplama',
            description: 'Brüt maaşınızdan net maaşınızı hesaplayın.',
            icon: FaPercent,
        },
        {
            href: '/muhasebe/kidem-tazminati-hesaplama',
            title: 'Kıdem Tazminatı Hesaplama',
            description: 'İşten ayrılma durumunda hak ettiğiniz kıdem tazminatı tutarını hesaplayın.',
            icon: FaGavel,
        },
      ]
  },
]; 