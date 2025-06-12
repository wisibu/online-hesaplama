import fs from 'fs/promises';
import path from 'path';

const appDir = path.join(process.cwd(), 'src', 'app');
const dataFile = path.join(process.cwd(), 'src', 'data', 'navLinks.json');

const extractMetadataProperty = (content, property) => {
  // This regex is designed to be simple and fast. It looks for the metadata export.
  const regex = new RegExp(`export const metadata:.*?${property}:\\s*['"](.*?)['"]`, 's');
  const match = content.match(regex);
  return match ? match[1] : null;
};

async function generateNavData() {
  console.log('🔍 Menü verileri otomatik olarak güncelleniyor (Akıllı Tarama Modu)...');
  
  try {
    const navConfig = JSON.parse(await fs.readFile(dataFile, 'utf8'));

    for (const category of navConfig) {
      category.links = []; // Start fresh for each category
      
      const categorySlug = category.category.toLowerCase().replace(/ /g, '-').replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');
      const categoryDir = path.join(appDir, categorySlug);

      try {
        const subDirs = await fs.readdir(categoryDir, { withFileTypes: true });

        for (const dirent of subDirs) {
          // A directory is only a calculation page if it contains a page.tsx file.
          if (dirent.isDirectory()) {
            const pagePath = path.join(categoryDir, dirent.name, 'page.tsx');
            const href = `/${categorySlug}/${dirent.name}`;

            try {
              // Check if page.tsx exists before trying to read it
              await fs.access(pagePath); 
              const content = await fs.readFile(pagePath, 'utf8');
              const title = extractMetadataProperty(content, 'title');
              const description = extractMetadataProperty(content, 'description');

              if (title && description) {
                console.log(`   -> Found: ${title}`);
                category.links.push({ href, title, description, iconName: category.iconName });
              }
            } catch (pageError) {
              // This subdirectory doesn't contain a page.tsx, so we ignore it.
              // This is expected for folders that are not calculation pages.
            }
          }
        }
      } catch (dirError) {
        if (dirError.code !== 'ENOENT') {
            console.warn(`  ⚠️  Warning while scanning '${categoryDir}':`, dirError.message);
        }
      }
    }

    // Sort links alphabetically by title for consistent ordering
    for (const category of navConfig) {
      category.links.sort((a, b) => a.title.localeCompare(b.title, 'tr', { numeric: true }));
    }

    await fs.writeFile(dataFile, JSON.stringify(navConfig, null, 2));
    console.log('✅ Menu data successfully updated with all pages.');

  } catch (error) {
    console.error('❌ An error occurred while updating menu data:', error);
    process.exit(1);
  }
}

generateNavData(); 