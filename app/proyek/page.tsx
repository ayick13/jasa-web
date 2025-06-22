import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { portfolioProjects } from '@/lib/portfolio-data';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Portofolio Proyek',
  description: 'Kumpulan proyek website dan aplikasi web yang telah dikerjakan, menunjukkan keahlian dalam berbagai teknologi dan industri.',
};

export default function PortfolioIndexPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">Portofolio Proyek</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
            Beberapa proyek pilihan yang telah saya kerjakan, dari company profile, e-commerce, hingga aplikasi web fungsional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project) => (
            <Link href={`/proyek/${project.slug}`} key={project.slug} className="block bg-white dark:bg-slate-800/50 rounded-xl shadow-md hover:shadow-xl group border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative w-full h-48">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-1">{project.category}</p>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  {project.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                  {project.summary}
                </p>
                <div className="font-semibold text-cyan-600 dark:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group-hover:gap-3">
                  Lihat Detail <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
