import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords: string;
  path: string;
  imageUrl?: string;
}

export function generateMetadata({
  title,
  description,
  keywords,
  path,
  imageUrl = '/images/og-default.jpg'
}: SEOProps): Metadata {
  const siteUrl = 'https://onlinehesaplama.com';
  const fullUrl = `${siteUrl}${path}`;
  
  return {
    title: `${title} | Online Hesaplama`,
    description,
    keywords,
    authors: [{ name: 'Online Hesaplama' }],
    creator: 'Online Hesaplama',
    publisher: 'Online Hesaplama',
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | Online Hesaplama`,
      description,
      url: fullUrl,
      siteName: 'Online Hesaplama',
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Online Hesaplama`,
      description,
      creator: '@onlinehesaplama',
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
} 