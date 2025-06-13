export const seoConfig = {
  defaultTitle: 'Online Hesaplama - Hızlı ve Güvenilir Hesaplama Araçları',
  titleTemplate: '%s | Online Hesaplama',
  description: 'Kredi, vergi, matematik, finans ve daha birçok alanda hızlı ve güvenilir hesaplama araçları. Kullanıcı dostu arayüz ile tüm hesaplamalarınızı kolayca yapın.',
  canonical: 'https://onlinehesaplama.com',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://onlinehesaplama.com',
    siteName: 'Online Hesaplama',
    images: [
      {
        url: 'https://onlinehesaplama.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Online Hesaplama',
      },
    ],
  },
  twitter: {
    handle: '@onlinehesaplama',
    site: '@onlinehesaplama',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'theme-color',
      content: '#3b82f6',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/icons/apple-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/manifest.json',
    },
  ],
};

export const categoryDescriptions = {
  finans: {
    title: 'Finans Hesaplama Araçları',
    description: 'Kredi, faiz, yatırım ve diğer finansal hesaplamalar için kullanıcı dostu araçlar.',
    keywords: 'finans hesaplama, kredi hesaplama, faiz hesaplama, yatırım hesaplama',
  },
  kredi: {
    title: 'Kredi Hesaplama Araçları',
    description: 'İhtiyaç, konut ve taşıt kredisi hesaplamaları için detaylı ve güvenilir araçlar.',
    keywords: 'kredi hesaplama, ihtiyaç kredisi, konut kredisi, taşıt kredisi',
  },
  matematik: {
    title: 'Matematik Hesaplama Araçları',
    description: 'Temel matematik işlemlerinden karmaşık hesaplamalara kadar tüm matematik araçları.',
    keywords: 'matematik hesaplama, geometri hesaplama, alan hesaplama, hacim hesaplama',
  },
  vergi: {
    title: 'Vergi Hesaplama Araçları',
    description: 'KDV, gelir vergisi ve diğer vergi hesaplamaları için pratik araçlar.',
    keywords: 'vergi hesaplama, kdv hesaplama, gelir vergisi hesaplama, stopaj hesaplama',
  },
  saglik: {
    title: 'Sağlık Hesaplama Araçları',
    description: 'Vücut kitle indeksi, kalori ihtiyacı ve diğer sağlık hesaplamaları.',
    keywords: 'sağlık hesaplama, vki hesaplama, kalori hesaplama, ideal kilo hesaplama',
  },
  sinav: {
    title: 'Sınav Puanı Hesaplama Araçları',
    description: 'YKS, LGS ve diğer sınavlar için puan hesaplama araçları.',
    keywords: 'sınav puanı hesaplama, yks puan hesaplama, lgs puan hesaplama',
  },
};

export const structuredData = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Online Hesaplama',
    url: 'https://onlinehesaplama.com',
    logo: 'https://onlinehesaplama.com/logo.png',
    sameAs: [
      'https://twitter.com/onlinehesaplama',
      'https://www.facebook.com/onlinehesaplama',
      'https://www.linkedin.com/company/onlinehesaplama',
    ],
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Online Hesaplama',
    url: 'https://onlinehesaplama.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://onlinehesaplama.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
}; 