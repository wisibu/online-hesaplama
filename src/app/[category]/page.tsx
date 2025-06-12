import Link from 'next/link';
import { notFound } from 'next/navigation';
import navLinksData from '@/data/navLinks.json';
import { createSlug } from '@/utils/slug';
import { iconMap } from '@/utils/iconMap';
import { Metadata } from 'next';

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categorySlug = params.category;
  const categoryData = navLinksData.categories.find(cat => createSlug(cat.name) === categorySlug);

  if (!categoryData) {
    return {
      title: 'Kategori Bulunamadı'
    }
  }

  return {
    title: `${categoryData.name} - Hesaplama Araçları`,
    description: `Tüm ${categoryData.name.toLowerCase()} hesaplama araçları ve detaylı bilgiler.`,
  }
}

export async function generateStaticParams() {
  return navLinksData.categories.map(cat => ({
    category: createSlug(cat.name),
  }));
}

export default function CategoryPage({ params }: Props) {
  const categorySlug = params.category;
  const categoryData = navLinksData.categories.find(cat => createSlug(cat.name) === categorySlug);

  if (!categoryData) {
    notFound();
  }

  const PageIcon = iconMap[categoryData.iconName];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center text-4xl sm:text-5xl text-blue-600 mb-4">
          {PageIcon && <PageIcon />}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{categoryData.name}</h1>
        <p className="mt-2 text-md sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Bu kategorideki tüm hesaplama araçlarını aşağıda bulabilirsiniz.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.subLinks.map((link) => {
          const LinkIcon = iconMap[link.iconName];
          return (
            <Link
              href={link.href}
              key={link.href}
              className="group block p-6 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-200"
            >
              <div className="flex items-start">
                <div className="text-2xl text-blue-600 mr-4 mt-1">
                  {LinkIcon && <LinkIcon />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                    {link.name}
                  </h2>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 