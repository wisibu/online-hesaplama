import { navLinksData, createSlug } from '@/data/navLinks';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { FaArrowRight } from 'react-icons/fa';

export async function generateMetadata(
  { params }: { params: { category: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const categorySlug = params.category;
  const categoryData = navLinksData.find(cat => createSlug(cat.category) === categorySlug);

  if (!categoryData) {
    return {
      title: 'Kategori Bulunamadı',
      description: 'Aradığınız kategori mevcut değil.',
    };
  }

  return {
    title: `${categoryData.category} Hesaplama Araçları`,
    description: `Tüm ${categoryData.category.toLowerCase()} hesaplama araçlarını bu sayfada bulabilirsiniz.`,
  };
}

export function generateStaticParams() {
  return navLinksData.map(cat => ({
    category: createSlug(cat.category),
  }));
}

export default function Page({ params }: { params: any }) {
  const categorySlug = params.category;
  const categoryData = navLinksData.find(cat => createSlug(cat.category) === categorySlug);

  if (!categoryData) {
    notFound();
  }

  const { category, links, icon: CategoryIcon } = categoryData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 text-gray-800">
        <CategoryIcon className="text-4xl mr-4 text-blue-600" />
        <h1 className="text-4xl font-bold">{category} Hesaplama Araçları</h1>
      </div>
      <p className="mb-8 text-lg text-gray-600">
        Bu kategorideki tüm hesaplama araçlarına aşağıdan ulaşabilirsiniz.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map(link => {
          const { icon: LinkIcon } = link;
          return (
            <Link key={link.href} href={link.href} className="block group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-4">
                    <LinkIcon className="text-3xl text-blue-500 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">{link.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">{link.description}</p>
                </div>
                <div className="flex items-center justify-end text-blue-600 font-medium">
                  Hesapla
                  <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 