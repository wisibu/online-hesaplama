import { generateCalculatorMetadata } from '@/components/CalculatorLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = generateCalculatorMetadata({
  title: 'İhbar Tazminatı Hesaplama (2024) | OnlineHesaplama',
  description: 'İhbar tazminatınızı kolayca hesaplayın. Brüt maaş, çalışma süresi ve diğer detaylar ile tazminat tutarınızı öğrenin.',
  keywords: 'ihbar tazminatı hesaplama, ihbar tazminatı ne kadar, ihbar süresi hesaplama, işten çıkarma tazminatı',
  path: '/muhasebe/ihbar-tazminati-hesaplama',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 