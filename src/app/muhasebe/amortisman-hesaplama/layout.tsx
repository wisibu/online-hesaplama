import { generateCalculatorMetadata } from '@/components/CalculatorLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = generateCalculatorMetadata({
  title: 'Amortisman Hesaplama (2024) | OnlineHesaplama',
  description: 'Sabit kıymetlerinizin amortisman tutarını kolayca hesaplayın. Maliyet bedeli, ekonomik ömür ve diğer detaylar ile amortisman planınızı oluşturun.',
  keywords: 'amortisman hesaplama, sabit kıymet amortismanı, maddi duran varlık amortismanı, amortisman oranları',
  path: '/muhasebe/amortisman-hesaplama',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 