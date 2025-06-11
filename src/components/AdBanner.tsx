'use client';

import { useEffect } from 'react';
import Script from 'next/script';

type AdBannerProps = {
  'data-ad-client': string;
  'data-ad-slot': string;
  'data-ad-format'?: string;
  'data-full-width-responsive'?: string;
  className?: string;
  style?: React.CSSProperties;
};

const AdBanner = (props: AdBannerProps) => {
  const { 
    'data-ad-client': dataAdClient, 
    'data-ad-slot': dataAdSlot, 
    className, 
    style, 
    ...rest 
  } = props;

  // Reklamların gösterilip gösterilmeyeceğini kontrol eden ana mantık
  const adsShouldShow = process.env.NODE_ENV !== 'development' || 
                       (process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' && dataAdClient && dataAdSlot);

  useEffect(() => {
    if (adsShouldShow) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        console.error("AdSense Error:", err);
      }
    }
  }, [adsShouldShow]);

  // Geliştirme ortamı dışında veya reklamlar için tüm koşullar sağlanmadığında hiçbir şey gösterme
  if (!adsShouldShow) {
    return null;
  }
  
  // Sadece geliştirme ortamında, reklamlar aktif ama ID'ler eksikse hata göster
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ADS_ENABLED === 'true' && (!dataAdClient || !dataAdSlot)) {
    return (
        <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <strong>Reklam Geliştirici Uyarısı:</strong> `data-ad-client` ve `data-ad-slot` kimlikleri eksik.
        </div>
    );
  }
  
  return (
    <>
        {/* 
          AdSense script'i. Next.js'in Script bileşeni sayesinde bu script, 
          aynı sayfa içinde birden fazla AdBanner kullanılsa bile sadece bir kez yüklenir.
          'afterInteractive' stratejisi, sayfanın ana içeriği yüklendikten sonra script'i yükler.
        */}
        <Script
            id="adsbygoogle-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${dataAdClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
        {/* 
          Bu div reklamın kapsayıcısıdır. `overflow: hidden` önemlidir, 
          çünkü AdSense bazen kapsayıcıdan daha büyük bir iframe oluşturabilir.
        */}
        <div className={className} style={{ ...style, overflow: 'hidden', textAlign: 'center' }}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={dataAdClient}
                data-ad-slot={dataAdSlot}
                {...rest}
            />
        </div>
    </>
  );
};

export default AdBanner; 