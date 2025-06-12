import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const appDir = path.join(rootDir, 'src', 'app');

// Klasör yapısını tarayarak menü verilerini oluştur
function getAllPagesRecursive(dir, baseRoute) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(getAllPagesRecursive(fullPath, baseRoute + '/' + file.name));
    } else if (file.isFile() && file.name === 'page.tsx') {
      // Alt menü adı, route'un son parçası
      const parts = baseRoute.split('/').filter(Boolean);
      const slug = parts[parts.length - 1];
      results.push({
        name: formatTitle(slug),
        href: baseRoute,
        iconName: getSubIconName(slug)
      });
    }
  }
  return results;
}

function generateNavData() {
  try {
    const allowedCategories = [
      'kredi', 'muhasebe', 'saglik', 'finans', 'vergi', 'egitim', 'sinav', 'matematik'
    ];
    const categories = [];
    const dirs = fs.readdirSync(appDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && allowedCategories.includes(dirent.name.toLowerCase()) || ['tasarruf', 'toplama', 'yatirim'].includes(dirent.name.toLowerCase()))
      .map(dirent => dirent.name);

    // Taşınacak alt linkler
    let tasarrufLinks = [];
    let toplamaLinks = [];
    let yatirimLinks = [];

    // Tasarruf
    const tasarrufPath = path.join(appDir, 'tasarruf');
    if (fs.existsSync(tasarrufPath)) {
      tasarrufLinks = getAllPagesRecursive(tasarrufPath, '/tasarruf');
    }
    // Toplama
    const toplamaPath = path.join(appDir, 'toplama');
    if (fs.existsSync(toplamaPath)) {
      toplamaLinks = getAllPagesRecursive(toplamaPath, '/toplama');
    }
    // Yatırım
    const yatirimPath = path.join(appDir, 'yatirim');
    if (fs.existsSync(yatirimPath)) {
      yatirimLinks = getAllPagesRecursive(yatirimPath, '/yatirim');
    }

    let yuzdeHesaplamaLink = null;
    // Özel: hesaplamalar/yuzde-hesaplama'yı matematik'e taşı
    const hesaplamalarPath = path.join(appDir, 'hesaplamalar');
    if (fs.existsSync(hesaplamalarPath)) {
      const yuzdePath = path.join(hesaplamalarPath, 'yuzde-hesaplama');
      const pageFile = path.join(yuzdePath, 'page.tsx');
      if (fs.existsSync(pageFile)) {
        yuzdeHesaplamaLink = {
          name: 'Yüzde Hesaplama',
          href: '/hesaplamalar/yuzde-hesaplama',
          iconName: getSubIconName('yuzde-hesaplama')
        };
      }
    }

    for (const dir of dirs) {
      if (['hesaplamalar', 'tasarruf', 'toplama', 'yatirim'].includes(dir)) continue; // Bu menüler ana menüde olmayacak
      const categoryPath = path.join(appDir, dir);
      let subLinks = getAllPagesRecursive(categoryPath, '/' + dir);
      // Matematik'e özel olarak Yüzde Hesaplama ve Toplama ekle
      if (dir === 'matematik') {
        if (yuzdeHesaplamaLink && !subLinks.some(link => link.href === yuzdeHesaplamaLink.href)) {
          subLinks.unshift(yuzdeHesaplamaLink);
        }
        if (toplamaLinks.length > 0) {
          toplamaLinks.forEach(link => {
            if (!subLinks.some(l => l.href === link.href)) {
              subLinks.push(link);
            }
          });
        }
      }
      // Finans'a tasarruf ve yatırım linklerini ekle
      if (dir === 'finans') {
        if (tasarrufLinks.length > 0) {
          tasarrufLinks.forEach(link => {
            if (!subLinks.some(l => l.href === link.href)) {
              subLinks.push(link);
            }
          });
        }
        if (yatirimLinks.length > 0) {
          yatirimLinks.forEach(link => {
            // Sadece Basit Faiz ve Bileşik Faiz ekle
            if ((/basit-faiz/i.test(link.name) || /bilesik-faiz/i.test(link.name)) && !subLinks.some(l => l.href === link.href)) {
              subLinks.push(link);
            }
          });
        }
      }
      if (subLinks.length > 0) {
        const category = {
          name: dir.charAt(0).toUpperCase() + dir.slice(1),
          iconName: getIconName(dir),
          subLinks
        };
        categories.push(category);
      }
    }

    const navData = { categories };
    const outputPath = path.join(rootDir, 'src', 'data', 'navLinks.json');
    fs.writeFileSync(outputPath, JSON.stringify(navData, null, 2));
    console.log('✅ Menü verileri başarıyla güncellendi!');
  } catch (error) {
    console.error('❌ Menü verileri güncellenirken bir hata oluştu:', error);
  }
}

// Kategori için ikon adını belirle
function getIconName(category) {
  const iconMap = {
    kredi: 'FaMoneyBillWave',
    muhasebe: 'FaCalculator',
    saglik: 'FaHeartbeat',
    finans: 'FaChartLine',
    vergi: 'FaFileInvoiceDollar',
    egitim: 'FaGraduationCap',
    sinav: 'FaClipboardList',
    matematik: 'FaSquareRootAlt',
    otomobil: 'FaCar'
  };
  return iconMap[category.toLowerCase()] || 'FaFolder';
}

// Alt menü öğesi için ikon adını belirle
function getSubIconName(file) {
  const iconMap = {
    'ihtiyac-kredisi': 'FaCalculator',
    'konut-kredisi': 'FaHome',
    'tasit-kredisi': 'FaCar',
    'brutten-nete-maas': 'FaMoneyBill',
    'netten-brute-maas': 'FaMoneyBillWave',
    'vucut-kitle-indeksi': 'FaWeight',
    'kalori-ihtiyaci': 'FaAppleAlt',
    'doviz-cevirici': 'FaExchangeAlt',
    'kripto-cevirici': 'FaBitcoin',
    'kdv-hesaplama': 'FaPercentage',
    'gelir-vergisi': 'FaFileInvoice',
    'not-ortalamasi': 'FaCalculator',
    'ders-programi': 'FaCalendarAlt',
    'puan-hesaplama': 'FaCalculator',
    'sinav-takvimi': 'FaCalendarAlt',
    'geometri': 'FaShapes',
    'istatistik': 'FaChartBar',
    'yakit-hesaplama': 'FaGasPump',
    'arac-maliyeti': 'FaMoneyBillWave'
  };
  return iconMap[file.replace('.tsx', '')] || 'FaFile';
}

// Dosya adını başlığa dönüştür (gelişmiş Türkçeleştirme)
function formatTitle(fileOrSlug) {
  // Sık karşılaşılan özel başlıklar
  const specialMap = {
    'ders-notu': 'Ders Notu',
    'e-okul-not': 'E-Okul Notu',
    'lise-ders-puani': 'Lise Ders Puanı',
    'lise-mezuniyet-puani': 'Lise Mezuniyet Puanı',
    'lise-ortalama': 'Lise Ortalama',
    'lise-ybp': 'Lise YBP',
    'okula-baslama-yasi': 'Okula Başlama Yaşı',
    'takdir-tesekkur': 'Takdir Teşekkür',
    'universite-not-ortalamasi': 'Üniversite Not Ortalaması',
    'vize-final-ortalama': 'Vize Final Ortalaması',
    'sigara-parasi-biriktirme': 'Sigara Parası Biriktirme',
    'bilesik-faiz': 'Bileşik Faiz',
    'basit-faiz': 'Basit Faiz',
    'kredi-karti': 'Kredi Kartı',
    'kredi-dosya-masrafi': 'Kredi Dosya Masrafı',
    'kredi-erken-kapatma-cezasi': 'Kredi Erken Kapatma Cezası',
    'kredi-gecikme-faizi': 'Kredi Gecikme Faizi',
    'kredi-karti-asgari-odeme': 'Kredi Kartı Asgari Ödeme',
    'kredi-karti-asgari-odeme-tutari': 'Kredi Kartı Asgari Ödeme Tutarı',
    'kredi-karti-gecikme-faizi': 'Kredi Kartı Gecikme Faizi',
    'kredi-karti-islem-taksitlendirme': 'Kredi Kartı İşlem Taksitlendirme',
    'kredi-karti-taksitli-nakit-avans': 'Kredi Kartı Taksitli Nakit Avans',
    'tasit-kredisi': 'Taşıt Kredisi',
    'ticari-arac-kredisi': 'Ticari Araç Kredisi',
    'ticari-ihtiyac-kredisi': 'Ticari İhtiyaç Kredisi',
    'vucut-kitle-indeksi': 'Vücut Kitle İndeksi',
    'gunluk-kalori-ihtiyaci': 'Günlük Kalori İhtiyacı',
    'gunluk-protein-ihtiyaci': 'Günlük Protein İhtiyacı',
    'gunluk-su-ihtiyaci': 'Günlük Su İhtiyacı',
    'gunluk-yag-ihtiyaci': 'Günlük Yağ İhtiyacı',
    'gunluk-karbonhidrat-ihtiyaci': 'Günlük Karbonhidrat İhtiyacı',
    'gunluk-makro-besin-ihtiyaci': 'Günlük Makro Besin İhtiyacı',
    'gunluk-kreatin-dozu': 'Günlük Kreatin Dozu',
    'bebeğin-boyu': 'Bebek Boyu',
    'bebeğin-kilosu': 'Bebek Kilosu',
    'bel-kalca-orani': 'Bel Kalça Oranı',
    'asi-takvimi': 'Aşı Takvimi',
    'adet-gunu': 'Adet Günü',
    'sutyen-bedeni': 'Sütyen Bedeni',
    'yumurtlama-donemi': 'Yumurtlama Dönemi',
    'yasam-suresi': 'Yaşam Süresi',
    'sigara-maliyeti': 'Sigara Maliyeti',
    'ideal-kilo': 'İdeal Kilo',
    'kalori-ihtiyaci': 'Kalori İhtiyacı',
    'vucut-yag-orani': 'Vücut Yağ Oranı',
    'bebek-boyu': 'Bebek Boyu',
    'bebek-kilosu': 'Bebek Kilosu',
    'bazal-metabolizma-hizi': 'Bazal Metabolizma Hızı',
    'gebelik': 'Gebelik',
    'brutten-nete-maas': 'Brütten Nete Maaş',
    'netten-brute-maas': 'Netten Brüte Maaş',
    'emeklilik-borclanmasi': 'Emeklilik Borçlanması',
    'emeklilik-hesaplama-ne-zaman-emekli-olurum': 'Ne Zaman Emekli Olurum',
    'fazla-mesai-ucreti': 'Fazla Mesai Ücreti',
    'gecikme-faizi-ve-zammi': 'Gecikme Faizi ve Zammı',
    'gecikme-zammi': 'Gecikme Zammı',
    'gelir-vergisi': 'Gelir Vergisi',
    'huzur-hakki': 'Huzur Hakkı',
    'ihbar-tazminati': 'İhbar Tazminatı',
    'iskonto': 'İskonto',
    'issizlik-maasi': 'İşsizlik Maaşı',
    'kidem-tazminati': 'Kıdem Tazminatı',
    'kidem-ve-ihbar-tazminati': 'Kıdem ve İhbar Tazminatı',
    'kisa-calisma-odenegi': 'Kısa Çalışma Ödeneği',
    'maas': 'Maaş',
    'serbest-meslek-makbuzu': 'Serbest Meslek Makbuzu',
    'yeniden-degerleme-orani': 'Yeniden Değerleme Oranı',
    'yillik-izin': 'Yıllık İzin',
    'yillik-izin-ucreti': 'Yıllık İzin Ücreti',
    'yolluk': 'Yolluk',
    'amortisman': 'Amortisman',
    'binek-arac-gider-kisitlamasi': 'Binek Araç Gider Kısıtlaması',
    'agi-nedir': 'AGİ Nedir',
    'doviz-hesaplama': 'Döviz',
    'altin-hesaplama': 'Altın',
    'faiz-hesaplama': 'Faiz',
    'bilesik-buyume-hesaplama': 'Bileşik Büyüme',
    'enflasyon-hesaplama': 'Enflasyon',
    'repo-hesaplama': 'Repo',
    'net-bugunku-deger-hesaplama': 'Net Bugünkü Değer',
    'ortalama-vade-hesaplama': 'Ortalama Vade',
    'parasal-deger-hesaplama': 'Parasal Değer',
    'reel-getiri-hesaplama': 'Reel Getiri',
    'sermaye-ve-temettu-hesaplama': 'Sermaye ve Temettü',
    'ic-ve-dis-iskonto-hesaplama': 'İç ve Dış İskonto',
    'ic-verim-orani-hesaplama': 'İç Verim Oranı',
    'iban-dogrulama': 'IBAN Doğrulama',
    'gecmis-altin-fiyatlari-hesaplama': 'Geçmiş Altın Fiyatları',
    'gecmis-doviz-kurlari-hesaplama': 'Geçmiş Döviz Kurları',
    'kira-artis-orani-hesaplama': 'Kira Artış Oranı',
    'kira-vergisi-hesaplama': 'Kira Vergisi',
    'kira-stopaj-hesaplama': 'Kira Stopaj',
    'konaklama-vergisi-hesaplama': 'Konaklama Vergisi',
    'kurumlar-vergisi-hesaplama': 'Kurumlar Vergisi',
    'mtv-hesaplama': 'MTV',
    'otv-hesaplama': 'ÖTV',
    'stopaj-hesaplama': 'Stopaj',
    'veraset-ve-intikal-vergisi-hesaplama': 'Veraset ve İntikal Vergisi',
    'vergi-gecikme-faizi-hesaplama': 'Vergi Gecikme Faizi',
    'damga-vergisi-hesaplama': 'Damga Vergisi',
    'deger-artis-kazanci-vergisi-hesaplama': 'Değer Artış Kazancı Vergisi',
    'degerli-konut-vergisi-hesaplama': 'Değerli Konut Vergisi',
    'emlak-vergisi-hesaplama': 'Emlak Vergisi',
    'gumruk-vergisi-hesaplama': 'Gümrük Vergisi',
    'kambiyo-vergisi-hesaplama': 'Kambiyo Vergisi',
    'kdv-hesaplama': 'KDV',
    'kdv-tevkifati-hesaplama': 'KDV Tevkifatı',
    'puan-hesaplama': 'Puan',
    'puan': 'Puan',
    'not-ortalamasi': 'Not Ortalaması',
    'alan-hesaplama': 'Alan',
    'cevre-hesaplama': 'Çevre',
    'hacim-hesaplama': 'Hacim',
    'faktoriyel-hesaplama': 'Faktöriyel',
    'kombinasyon-hesaplama': 'Kombinasyon',
    'permutasyon-hesaplama': 'Permütasyon',
    'uslu-sayi-hesaplama': 'Üslü Sayı',
    'koklu-sayi-hesaplama': 'Köklü Sayı',
    'asal-carpan-hesaplama': 'Asal Çarpan',
    'asal-carpanlara-ayirma-hesaplama': 'Asal Çarpanlara Ayırma',
    'ebob-ekok-hesaplama': 'EBOB EKOK',
    'moduler-aritmetik-hesaplama': 'Modüler Aritmetik',
    'standart-sapma-hesaplama': 'Standart Sapma',
    'taban-donusumu-hesaplama': 'Taban Dönüşümü',
    'sayi-okunusu-hesaplama': 'Sayı Okunuşu',
    'sayi-yuvarlama-hesaplama': 'Sayı Yuvarlama',
    'bolunebilme-kurallari-hesaplama': 'Bölünebilme Kuralları',
    'metrekare-hesaplama': 'Metrekare',
    'mil-hesaplama': 'Mil',
    'inc-hesaplama': 'İnç',
    'rastgele-sayi-hesaplama': 'Rastgele Sayı',
    'toplama-hesaplayici': 'Toplama',
    'altin-oran-hesaplama': 'Altın Oran',
    'oran-hesaplama': 'Oran',
    'yuzde-hesaplama': 'Yüzde',
    // ... daha fazla özel başlık eklenebilir ...
  };
  const slug = fileOrSlug.replace('.tsx', '').toLowerCase();
  if (specialMap[slug]) return specialMap[slug];
  // Otomatik başlık üretimi
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .replace(/I/g, 'İ')
    .replace(/C/g, 'Ç')
    .replace(/G/g, 'Ğ')
    .replace(/O/g, 'Ö')
    .replace(/S/g, 'Ş')
    .replace(/U/g, 'Ü');
}

// Scripti çalıştır
generateNavData(); 