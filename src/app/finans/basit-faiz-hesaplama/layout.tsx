import { generateCalculatorMetadata } from '@/components/CalculatorLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = generateCalculatorMetadata({
  title: 'Basit Faiz Hesaplama',
  description: 'Basit faiz yöntemiyle yatırımınızın ne kadar getiri sağlayacağını kolayca hesaplayın. Anapara, faiz oranı ve vade süresini girerek hemen sonucu öğrenin.',
  keywords: 'basit faiz hesaplama, faiz hesaplama, yatırım hesaplama, faiz getirisi hesaplama, mevduat faizi hesaplama, faiz oranı hesaplama',
  path: '/finans/basit-faiz-hesaplama',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 