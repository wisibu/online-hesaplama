import { generateCalculatorMetadata } from '@/components/CalculatorLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = generateCalculatorMetadata({
  title: 'Kredi Kartı Gecikme Faizi Hesaplama | OnlineHesaplama',
  description: 'Kredi kartı gecikme faizinizi kolayca hesaplayın. Borç tutarı, gecikme süresi ve faiz oranı ile toplam ödenecek tutarı öğrenin.',
  keywords: 'kredi kartı gecikme faizi, gecikme faizi hesaplama, kredi kartı borç hesaplama, gecikme bedeli',
  path: '/kredi/kredi-karti-gecikme-faizi-hesaplama',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 