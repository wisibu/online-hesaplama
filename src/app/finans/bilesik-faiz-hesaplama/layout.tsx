import { generateCalculatorMetadata } from '@/components/CalculatorLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = generateCalculatorMetadata({
  title: 'Bileşik Faiz Hesaplama (Yıllık Detaylı) | OnlineHesaplama',
  description: 'Yatırımınızın bileşik faiz ile gelecekteki değerini hesaplayın. Anapara, faiz oranı, süre ve ek yatırım detayları ile yıllık döküm alın.',
  keywords: 'bileşik faiz hesaplama, yatırım hesaplama, faiz getirisi, gelecekteki değer hesaplama, faizin faizi',
  path: '/finans/bilesik-faiz-hesaplama',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 