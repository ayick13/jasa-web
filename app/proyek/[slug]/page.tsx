// jasa-web-main/app/proyek/[slug]/page.tsx

import { Metadata } from 'next';
import { portfolioProjects } from '@/lib/portfolio-data'; 
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Eye, Github } from 'lucide-react'; 

const ProjectCTA = () => (
    <div className="mt-16 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Tertarik dengan Layanan Kami?
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
            Jika Anda mencari solusi serupa atau ingin mendiskusikan proyek Anda sendiri, jangan ragu untuk menghubungi kami.
        </p>
        <Link 
            href="/#contact" 
            className="inline-flex items-center justify-center gap-2 bg-cyan-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
        >
            Hubungi Kami Sekarang
        </Link>
    </div>
);

// PERBAIKAN: Gunakan tipe yang spesifik, bukan 'any'
type ProyekPostPageProps = {
    params: {
        slug: string;
    };
};

export async function generateMetadata({ params }: ProyekPostPageProps): Promise<Metadata> {
    const slug = params.slug; 
    const project = portfolioProjects.find((p) => p.slug === slug);
    if (!project) { return { title: 'Proyek Tidak Ditemukan' }; }
    return {
        title: project.title,
        description: project.summary,
        openGraph: {
            title: project.title,
            description: project.summary,
            type: 'article', 
            images: [project.imageUrl],
        },
        twitter: {
            card: 'summary_large_image',
            title: project.title,
            description: project.summary,
            images: [project.imageUrl],
        }
    };
}

export async function generateStaticParams() {
    return portfolioProjects.map((project) => ({ slug: project.slug }));
}

export default function ProyekPostPage({ params }: ProyekPostPageProps) {
    const slug = params.slug;
    const project = portfolioProjects.find((p) => p.slug === slug);
    if (!project) { notFound(); }

    return (
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
                <Link href="/proyek" className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke semua proyek
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-4">{project.title}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">{project.summary}</p>

                {project.liveUrl && (
                    <div className="mb-4">
                        <Link 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 bg-cyan-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Lihat Proyek
                        </Link>
                    </div>
                )}
                {project.githubUrl && (
                    <div className="mb-8">
                        <Link 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-6 rounded-full hover:bg-slate-600 transition-all duration-300"
                        >
                            <Github className="w-5 h-5" />
                            Lihat di GitHub
                        </Link>
                    </div>
                )}

                <div className="relative w-full h-64 md:h-96 mb-8 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                    <Image src={project.imageUrl} alt={project.title} fill className="object-cover" priority />
                </div>
                
                <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: project.description }} />

                <ProjectCTA />
            </div>
        </article>
    );
}