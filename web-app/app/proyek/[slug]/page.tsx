import { Metadata } from 'next';
import { portfolioProjects } from '@/lib/portfolio-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, Eye } from 'lucide-react';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = portfolioProjects.find((p) => p.slug === params.slug);
  if (!project) return { title: 'Proyek Tidak Ditemukan' };
  return {
    title: `${project.title} | Portofolio`,
    description: project.summary,
  };
}

export async function generateStaticParams() {
  return portfolioProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectDetailPage({ params }: Props) {
  const project = portfolioProjects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <Link href="/proyek" className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Semua Proyek
          </Link>

          <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">{project.title}</h1>
              <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: project.description }} />
            </div>
            <aside>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Detail Proyek</h3>
                <ul className="space-y-4">
                  <li>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">Kategori</h4>
                    <p className="text-cyan-600 dark:text-cyan-400">{project.category}</p>
                  </li>
                  <li>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">Teknologi</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map(tech => (
                        <span key={tech} className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full">{tech}</span>
                      ))}
                    </div>
                  </li>
                </ul>
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-cyan-500 text-white font-bold py-3 px-4 rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 transition-all duration-300"
                >
                  <Eye className="w-5 h-5" />
                  Lihat Situs Live
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
