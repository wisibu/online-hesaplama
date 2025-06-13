import { generateCalculatorMetadata } from '@/components/CalculatorLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = generateCalculatorMetadata({
  title: 'Kısa Çalışma Ödeneği Hesaplama (2024) | OnlineHesaplama',
  description: 'Kısa çalışma ödeneğinizi kolayca hesaplayın. Brüt maaş, çalışma süresi ve diğer detaylar ile ödenecek tutarı öğrenin.',
  keywords: 'kısa çalışma ödeneği hesaplama, kısa çalışma ne kadar, kısa çalışma süresi, işsizlik ödeneği',
  path: '/muhasebe/kisa-calisma-odenegi-hesaplama',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 