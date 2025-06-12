import fs from 'fs/promises';
import path from 'path';

const appDir = path.join(process.cwd(), 'src', 'app');
const dataFile = path.join(process.cwd(), 'src', 'data', 'navLinks.json');

const extractMetadataProperty = (content, property) => {
  const regex = new RegExp(`export const metadata:.*?${property}:\\s*['"](.*?)['"]`, 's');
  const match = content.match(regex);
  return match ? match[1] : null;
};

async function generateNavData() {
  console.log('🔍 Menü verileri otomatik olarak güncelleniyor...');
  
  try {
    const navLinksData = JSON.parse(await fs.readFile(dataFile, 'utf8'));

    // Create a map for quick lookups of existing links
    const existingLinksMap = new Map();
    navLinksData.forEach(category => {
      category.links.forEach(link => {
        existingLinksMap.set(link.href, link);
      });
    });

    for (const category of navLinksData) {
      const categorySlug = category.category
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/ı/g, 'i')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c');
        
      const categoryDir = path.join(appDir, categorySlug);

      try {
        const subDirs = await fs.readdir(categoryDir, { withFileTypes: true });
        const newLinks = [];

        for (const dirent of subDirs) {
          if (dirent.isDirectory()) {
            const pagePath = path.join(categoryDir, dirent.name, 'page.tsx');
            const href = `/${categorySlug}/${dirent.name}`;

            if (existingLinksMap.has(href)) {
              // If link already exists, keep it as is
              newLinks.push(existingLinksMap.get(href));
              continue;
            }

            // This is a new link, not in the JSON file
            try {
              const content = await fs.readFile(pagePath, 'utf8');
              const title = extractMetadataProperty(content, 'title');
              const description = extractMetadataProperty(content, 'description');

              if (title && description) {
                console.log(`  ➕ Yeni sayfa bulundu: ${title}`);
                newLinks.push({
                  href,
                  title,
                  description,
                  iconName: category.iconName, // Default to category icon
                });
              }
            } catch (pageError) {
              // page.tsx might not exist, just ignore.
            }
          }
        }
        // Update category links, preserving the original order of known links
        // and appending new ones.
        const knownHrefs = new Set(category.links.map(l => l.href));
        const newlyDiscovered = newLinks.filter(l => !knownHrefs.has(l.href));
        category.links.push(...newlyDiscovered);
        
      } catch (dirError) {
        // Category directory might not exist, just ignore.
        console.warn(`  ⚠️  Uyarı: '${categoryDir}' klasörü bulunamadı, atlanıyor.`);
      }
    }

    await fs.writeFile(dataFile, JSON.stringify(navLinksData, null, 2));
    console.log('✅ Menü verileri başarıyla güncellendi!');

  } catch (error) {
    console.error('❌ Menü verileri güncellenirken bir hata oluştu:', error);
    process.exit(1); // Exit with error code
  }
}

generateNavData(); 