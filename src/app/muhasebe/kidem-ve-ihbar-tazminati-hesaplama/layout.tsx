import { generateCalculatorMetadata } from '@/components/CalculatorLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = generateCalculatorMetadata({
  title: 'Kıdem ve İhbar Tazminatı Hesaplama (2024) | OnlineHesaplama',
  description: 'Kıdem ve ihbar tazminatınızı kolayca hesaplayın. Brüt maaş, çalışma süresi ve diğer detaylar ile tazminat tutarınızı öğrenin.',
  keywords: 'kıdem tazminatı hesaplama, ihbar tazminatı hesaplama, tazminat hesaplama, işten çıkarma tazminatı',
  path: '/muhasebe/kidem-ve-ihbar-tazminati-hesaplama',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 