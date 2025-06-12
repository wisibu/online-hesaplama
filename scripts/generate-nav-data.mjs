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
      'kredi', 'muhasebe', 'saglik', 'finans', 'vergi', 'egitim', 'sinav', 'matematik', 'otomobil', 'yatirim', 'tasarruf', 'hesaplamalar', 'toplama'
    ];
    const categories = [];
    const dirs = fs.readdirSync(appDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && allowedCategories.includes(dirent.name.toLowerCase()))
      .map(dirent => dirent.name);

    for (const dir of dirs) {
      const categoryPath = path.join(appDir, dir);
      const subLinks = getAllPagesRecursive(categoryPath, '/' + dir);
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

// Dosya adını başlığa dönüştür
function formatTitle(file) {
  return file
    .replace('.tsx', '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Scripti çalıştır
generateNavData(); 