// src/app/toplama/page.tsx
import type { Metadata } from 'next';
import ToplamaClientPage from './toplama-client';

export const metadata: Metadata = {
  title: "Online Toplama Hesaplayıcı | OnlineHesaplama",
  description: "Bu online toplama hesaplayıcı, iki veya daha fazla sayıyı hızlı ve kolay bir şekilde toplamanıza olanak tanır. Sadece sayıları girin ve sonucu anında görün!",
  keywords: ["toplama hesaplama", "toplama makinesi", "online toplama", "sayı toplama"],
  openGraph: {
    title: "Online Toplama Hesaplayıcı | OnlineHesaplama",
    description: "Bu online toplama hesaplayıcı, iki veya daha fazla sayıyı hızlı ve kolay bir şekilde toplamanıza olanak tanır. Sadece sayıları girin ve sonucu anında görün!",
  },
};

export default function Page() {
  return <ToplamaClientPage />;
}
