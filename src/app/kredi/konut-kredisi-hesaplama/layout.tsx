import { generateCalculatorMetadata } from '@/components/CalculatorLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = generateCalculatorMetadata({
  title: 'Konut Kredisi Hesaplama | Kredi Taksit & Faiz Oranları',
  description: 'En uygun konut kredisi için taksit, faiz ve toplam geri ödeme tutarını hesaplayın. 10, 15, 20 yıl vade seçenekleriyle ev kredinizi planlayın.',
  keywords: 'konut kredisi hesaplama, ev kredisi, kredi taksit hesaplama, konut kredisi faiz oranları, mortgage hesaplama',
  path: '/kredi/konut-kredisi-hesaplama',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 