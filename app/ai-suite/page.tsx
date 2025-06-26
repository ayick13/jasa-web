// File: app/ai-suite/page.tsx

'use client'; // Menandakan komponen ini adalah Client Component di Next.js

import { useSession, signOut } from 'next-auth/react'; // Untuk otentikasi pengguna
import React, { useState, useEffect, useRef, useCallback, Fragment, Suspense } from 'react'; // React hooks dan Fragment
import { useSearchParams, useRouter } from 'next/navigation'; // Untuk mengelola URL query params dan navigasi
import Image from 'next/image'; // Komponen Image dari Next.js untuk optimasi gambar
import { toast, Toaster } from 'react-hot-toast'; // Library untuk notifikasi toast
import { Github, LogOut, ExternalLink } from 'lucide-react'; // Ikon dari Lucide Icons

// Import komponen-komponen yang telah direstrukturisasi
import { ImageGenerationAndCreationSection } from './components/ImageGenerationAndCreationSection';
import { AiChatAndImageAnalysisSection } from './components/AiChatAndImageAnalysisSection';
import { AudioGenerationSection } from './components/AudioGenerationSection';
import { ImageDisplayAndHistorySection } from './components/ImageDisplayAndHistorySection';

// Definisi konstanta dan tipe data yang digunakan di halaman ini atau diteruskan sebagai props
// Catatan: Beberapa konstanta ini juga mungkin didefinisikan ulang di komponen anak
// jika mereka hanya digunakan secara internal oleh komponen tersebut untuk dropdown dll.
// Ini untuk memastikan page.tsx memiliki akses ke definisi yang sama untuk logika utamanya.
const imageGenModels = ['flux', 'turbo', 'dall-e-3', 'gptimage'] as const;
type ImageGenModel = (typeof imageGenModels)[number];
const artStyles = [
    'realistic', 'photographic', 'anime', 'manga', 'pixel-art', 'fantasy', 'sci-fi', 'steampunk', 'cyberpunk', 'cinematic',
    'hyper realistic', 'cinematic realism', 'hyperdetailed', 'sci-fi realism', 'medical illustration',
    'airbrush', 'scratchboard', 'linocut print', 'woodblock print', 'silkscreen', 'engraving', 'mezzotint', 'lithography', 'etching', 'drypoint',
    'street art', 'graffiti', 'stencil art', 'pop surrealism', 'lowbrow art', 'urban contemporary', 'outsider art', 'naive art', 'folk art', 'visionary art',
    'digital collage', 'mixed media', 'photo manipulation', 'vector art', 'pixel art', 'vaporwave', 'synthwave', 'outrun', 'cybergoth', 'y2k aesthetic',
    'editorial illustration', 'scientific illustration', 'botanical illustration', 'technical drawing', 'infographic', 'comic book', 'graphic novel', 'storyboard', 'concept art',
    'african art', 'aboriginal art', 'maori art', 'native american', 'aztec art', 'mayan art', 'inca art', 'balinese art', 'javanese batik', 'thai art',
    'professional photography', 'casual photography', 'studio portrait', 'fujifilm pro', 'kodak portra', 'leica m', 'street photography', 'urban exploration', 'fashion photography', 'product photography', 'food photography', 'macro photography', 'astrophotography', 'underwater', 'drone photography', 'long exposure', 'tilt-shift', 'infrared',
    'studio ghibli', 'makoto shinkai', '90s anime', 'seinen manga', 'webtoon', 'manhwa', 'chibi', 'kawaii', 'mecha anime', 'shoujo anime',
    'digital painting', 'character design', 'environment art', 'matte painting', 'speedpainting', 'dark fantasy', 'book illustration', 'children book',
    'oil painting', 'watercolor', 'gouache', 'acrylic painting', 'pastel', 'ink wash', 'fresco', 'tempera', 'renaissance', 'baroque', 'rococo', 'impressionist', 'post-impressionist', 'expressionist', 'art nouveau', 'art deco', 'victorian', 'socialist realism',
    'pencil sketch', 'charcoal sketch', 'ink drawing', 'ballpoint pen', 'colored pencil', 'marker drawing', 'linocut', 'woodcut', 'pointillism', 'stippling',
    '3d render', 'blender', 'unreal engine', 'octane render', 'redshift', 'arnold render', 'zbrush', 'claymation', 'stop motion', 'isometric', 'voxel art',
    'low poly', 'ps1 graphics', 'ps2 graphics', 'n64 style', 'arc system works', 'cel shaded', 'borderlands', 'valorant style', 'overwatch style', 'genshin impact', 'honkai star rail',
    'cyberpunk anime', 'biopunk', 'dieselpunk', 'atompunk', 'solarpunk', 'cassette futurism', 'retro futurism', 'blade runner', 'ghost in the shell',
    'disney style', 'pixar style', 'dreamworks', 'cartoon network', 'adult swim', 'rick and morty', 'calarts style', 'peanuts', 'marvel comics', 'dc comics', 'european comics', 'french ligne claire',
    'abstract', 'cubism', 'surrealism', 'dadaism', 'bauhaus', 'constructivism', 'psychedelic', 'fluid art', 'glitch art', 'fractal art', 'generative art', 'data bending',
    'holographic', 'neon glow', 'chromatic aberration', 'double exposure', 'light painting', 'lens flare', 'vhs effect', 'crt screen', 'film grain', 'cross processing',
    'ukiyo-e', 'chinese painting', 'sumi-e', 'persian miniature', 'medieval illuminated', 'byzantine icon', 'tribal art', 'afrofuturism', 'indigenous art', 'soviet propaganda'
] as const;
type ArtStyle = (typeof artStyles)[number];
const qualityOptions = ['standar', 'hd', 'ultrahd'] as const;
type QualityOption = (typeof qualityOptions)[number];
const batchSizes = [1, 2, 3, 4] as const;
type BatchSize = (typeof batchSizes)[number];

// Interface untuk data gambar yang dihasilkan - Didefinisikan HANYA SEKALI di sini
export interface GeneratedImageData { // Export agar bisa di-import oleh komponen lain
    url: string;
    prompt: string;
    model: ImageGenModel;
    artStyle: ArtStyle;
    quality: QualityOption;
    width: number;
    height: number;
    seed: string;
    isDalle?: boolean; // Menandakan apakah gambar dibuat oleh DALL-E (jika ada properti spesifik DALL-E)
    timestamp: number;
}

// Komponen untuk menampilkan informasi pengguna (tetap di sini karena menggunakan useSession)
const UserDisplay = () => {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full h-10 w-48"></div>;
    }

    if (status === "authenticated" && session.user) {
        return (
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-full">
                <Image
                    src={session.user.image || '/images/user.svg'} // Fallback untuk avatar
                    alt={session.user.name || 'User Avatar'}
                    width={32}
                    height={32}
                    className="rounded-full"
                />
                <div className="text-sm">
                    <p className="font-bold text-slate-800 dark:text-white">{session.user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{session.user.email}</p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })} // Fungsi logout NextAuth
                    className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        );
    }

    return null; // Tidak menampilkan apa-apa jika tidak diautentikasi
};

// Komponen utama halaman AI Suite
function AISuitePageContent() {
    const { data: session, status } = useSession(); // Status sesi pengguna
    const searchParams = useSearchParams(); // Untuk mendapatkan query params dari URL
    const router = useRouter(); // Untuk navigasi Next.js

    // State untuk input prompt utama dan pelacak modifikasi pengguna
    const [prompt, setPrompt] = useState(() => {
        const urlPrompt = searchParams.get('prompt');
        if (urlPrompt) {
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.delete('prompt');
            // Check if window is defined before trying to modify history (for SSR compatibility)
            if (typeof window !== 'undefined') {
                router.replace(`?${newSearchParams.toString()}`, { scroll: false });
            }
            return decodeURIComponent(urlPrompt); // Pastikan prompt didekode
        }
        return '';
    });
    const isPromptUserModified = useRef(false); // Ref untuk melacak apakah prompt dimodifikasi pengguna

    // Efek untuk notifikasi saat prompt dimuat dari URL
    useEffect(() => {
        if (searchParams.get('prompt') && !isPromptUserModified.current) {
            toast.success('Prompt dari halaman utama dimuat!');
        }
    }, [searchParams]);

    // State untuk parameter generasi gambar
    const [imageGenModel, setImageGenModel] = useState<ImageGenModel>('flux');
    const [artStyle, setArtStyle] = useState<ArtStyle>('realistic');
    const [quality, setQuality] = useState<QualityOption>('standar');
    const [imageWidth, setImageWidth] = useState(1024);
    const [imageHeight, setImageHeight] = useState(1024);
    const [batchSize, setBatchSize] = useState<BatchSize>(1);

    // State untuk gambar yang dihasilkan dan riwayat
    const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);
    const [historyImages, setHistoryImages] = useState<GeneratedImageData[]>([]);
    const [isLoading, setIsLoading] = useState(false); // Status loading untuk generasi gambar

    // State untuk Prompt Creator
    const [isCreatorLoading, setIsCreatorLoading] = useState(false);
    const [creatorSubject, setCreatorSubject] = useState('');
    const [creatorDetails, setCreatorDetails] = useState('');
    const [createdPrompt, setCreatedPrompt] = useState<string | null>(null);

    // State untuk Modal Detail Gambar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageData, setSelectedImageData] = useState<GeneratedImageData | null>(null);

    // State untuk Modal API Key DALL-E
    const [isDalleModalOpen, setIsDalleModalOpen] = useState(false);

    // State untuk tab "Current" atau "History"
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

    // Muat riwayat dari localStorage saat komponen dimuat
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('ai_image_history');
            if (savedHistory) {
                const parsedHistory: GeneratedImageData[] = JSON.parse(savedHistory);
                // Validasi dasar untuk memastikan ini adalah array data gambar yang valid
                if (Array.isArray(parsedHistory)) {
                    setHistoryImages(parsedHistory.filter(item => item && item.url && item.prompt && item.timestamp));
                }
            }
        } catch (e) {
            console.error("Gagal memuat riwayat dari localStorage:", e);
            // Hapus riwayat yang rusak jika parsing gagal
            localStorage.removeItem('ai_image_history');
        }
    }, []);

    // Simpan riwayat ke localStorage setiap kali berubah
    useEffect(() => {
        if (historyImages.length > 0) {
            localStorage.setItem('ai_image_history', JSON.stringify(historyImages));
        } else {
            // Hapus item jika riwayat kosong atau dihapus secara manual
            localStorage.removeItem('ai_image_history');
        }
    }, [historyImages]);

    // Handle pemilihan model DALL-E 3 dan permintaan API key
    const handleModelChange = useCallback((newModel: ImageGenModel) => {
        if (newModel === 'dall-e-3') {
            const savedKey = typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') : null;
            if (!savedKey) {
                setIsDalleModalOpen(true);
            } else {
                setImageGenModel('dall-e-3');
            }
        } else {
            setImageGenModel(newModel);
        }
    }, []);

    // Simpan API key DALL-E
    const handleSaveDalleKey = useCallback((key: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('openai_api_key', key);
        }
        setIsDalleModalOpen(false);
        setImageGenModel('dall-e-3');
        toast.success("API Key DALL-E 3 disimpan untuk sesi ini.");
    }, []);

    // Tutup modal API key DALL-E
    const handleCloseDalleModal = useCallback(() => {
        setIsDalleModalOpen(false);
        // Jika pengguna menutup modal untuk DALL-E 3, kembali ke 'flux' jika itu yang dipilih
        if (imageGenModel === 'dall-e-3') {
            setImageGenModel('flux');
        }
    }, [imageGenModel]);

    // Fungsi utama generasi gambar
    const handleGenerateImage = useCallback(async () => {
        if (!prompt.trim()) {
            toast.error('Prompt tidak boleh kosong.');
            return; // Cukup `return` tanpa nilai
        }

        // Cabut URL blob lama sebelum menghasilkan yang baru untuk mencegah kebocoran memori
        generatedImages.forEach(img => {
            if (img.url.startsWith('blob:')) {
                URL.revokeObjectURL(img.url);
            }
        });

        const finalPrompt = imageGenModel === 'dall-e-3'
            ? prompt
            : `${prompt}${artStyle !== 'realistic' ? `, in the style of ${artStyle.replace('-', ' ')}` : ''}${quality === 'hd' ? ', hd' : quality === 'ultrahd' ? ', 4k, photorealistic' : ''}`;

        setIsLoading(true);
        setGeneratedImages([]); // Hapus hasil sebelumnya
        setActiveTab('current'); // Beralih ke tab hasil saat ini

        const toastId = toast.loading(`Menghasilkan gambar dengan ${imageGenModel}...`);

        try {
            let images: GeneratedImageData[] = [];
            const timestamp = Date.now();

            if (imageGenModel === 'dall-e-3') {
                const apiKey = typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') : null;
                if (!apiKey) {
                    throw new Error("API Key DALL-E 3 tidak ditemukan. Silakan masukkan di pengaturan model.");
                }

                const response = await fetch('/api/dalle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: finalPrompt, apiKey }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Error from DALL-E API: ${response.statusText}`);
                }
                const data = await response.json();
                images = [{ url: data.imageUrl, prompt: finalPrompt, model: 'dall-e-3', artStyle: 'N/A' as ArtStyle, quality: 'N/A' as QualityOption, width: 1024, height: 1024, seed: 'N/A', isDalle: true, timestamp }];
            } else {
                // Logika API Pollinations untuk flux, turbo, gptimage
                const promises = Array.from({ length: batchSize }, () => {
                    const seed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`; // Seed unik untuk setiap gambar
                    const modelParam = imageGenModel === 'gptimage' ? 'gpt3' : imageGenModel;
                    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${imageWidth}&height=${imageHeight}&nologo=true&safe=true&model=${modelParam}&seed=${seed}&referrer=ariftirtana.my.id`;

                    return fetch(imageUrl)
                        .then(res => res.ok ? res.blob() : Promise.reject(new Error(`Failed to fetch image: ${res.statusText}`)))
                        .then(blob => {
                            return new Promise<GeneratedImageData | null>((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    if (reader.result) {
                                        const base64DataUrl = reader.result as string;
                                        const imageData: GeneratedImageData = {
                                            url: base64DataUrl,
                                            prompt: finalPrompt,
                                            model: imageGenModel,
                                            artStyle,
                                            quality,
                                            width: imageWidth,
                                            height: imageHeight,
                                            seed,
                                            timestamp
                                        };
                                        resolve(imageData);
                                    } else {
                                        resolve(null);
                                    }
                                };
                                reader.onerror = () => {
                                    console.error("FileReader error for blob:", blob);
                                    resolve(null);
                                };
                                reader.readAsDataURL(blob);
                            });
                        })
                        .catch((error) => {
                            console.error("Error generating image from Pollinations:", error);
                            return null; // Kembalikan null untuk gambar yang gagal
                        });
                });
                const results = await Promise.all(promises);
                images = results.filter((img): img is GeneratedImageData => img !== null); // Filter null
            }

            if (images.length > 0) {
                setGeneratedImages(images);
                setHistoryImages(prevHistory => [...images, ...prevHistory]); // Tambahkan gambar baru ke riwayat
                toast.success(`${images.length} gambar berhasil dibuat!`, { id: toastId });
            } else {
                throw new Error("Tidak ada gambar yang dihasilkan.");
            }

        } catch (error: any) {
            toast.error(error.message || 'Terjadi kesalahan tak terduga.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    }, [prompt, imageGenModel, artStyle, quality, imageWidth, imageHeight, batchSize, generatedImages]);


    // Hapus input prompt utama
    const handleClearPrompt = useCallback(() => {
        setPrompt('');
        isPromptUserModified.current = true; // Tandai sebagai dimodifikasi pengguna
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('prompt');
        // Check if window is defined before trying to modify history (for SSR compatibility)
        if (typeof window !== 'undefined') {
            router.replace(`?${newSearchParams.toString()}`, { scroll: false });
        }
        toast.success('Prompt dibersihkan.');
    }, [searchParams, router]);


    // Fungsionalitas Prompt Creator
    const handleCreatePrompt = useCallback(async () => {
        if (!creatorSubject.trim()) {
            toast.error('Subjek di Prompt Creator tidak boleh kosong.');
            return; // Cukup `return` tanpa nilai
        }

        setIsCreatorLoading(true);
        setCreatedPrompt(null);
        const toastId = toast.loading('AI sedang membuat prompt...');

        try {
            const response = await fetch('/api/enhance-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject: creatorSubject, details: creatorDetails }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal membuat prompt dari AI.");
            }

            const data = await response.json();
            setCreatedPrompt(data.prompt);
            toast.success('Prompt berhasil ditingkatkan!', { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "Gagal menghubungi AI.", { id: toastId });
        } finally {
            setIsCreatorLoading(false);
        }
    }, [creatorSubject, creatorDetails]);

    // Buka modal detail gambar
    const handleOpenModal = useCallback((imageData: GeneratedImageData) => {
        setSelectedImageData(imageData);
        setIsModalOpen(true);
    }, []);

    // Callback untuk ChatBox menggunakan pesan asisten sebagai prompt
    const handlePromptFromChat = useCallback((chatPrompt: string) => {
        setPrompt(chatPrompt);
        isPromptUserModified.current = true;
        toast.success('Pesan dari asisten digunakan sebagai prompt!');
    }, []);

    // Callback untuk ImageAnalyzer menggunakan hasil analisis sebagai prompt
    const handlePromptFromAnalysis = useCallback((analysisPrompt: string) => {
        setPrompt(analysisPrompt);
        isPromptUserModified.current = true;
        toast.success('Hasil analisis digunakan sebagai prompt!');
    }, []);

    // Fungsi untuk menghapus riwayat
    const handleClearHistory = useCallback(() => {
        // Cabut semua URL blob dalam riwayat untuk membebaskan memori
        historyImages.forEach(img => {
            if (img.url.startsWith('blob:')) {
                URL.revokeObjectURL(img.url);
            }
        });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ai_image_history');
        }
        setHistoryImages([]);
        toast.success('Riwayat dihapus.');
    }, [historyImages]);


    return (
        <Fragment>
            {/* Komponen Toaster untuk menampilkan notifikasi */}
            <Toaster position="top-center" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white', style: { border: '1px solid #334155' } }} />

            <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {/* Informasi Pengguna & Tombol Unduh Repo */}
                <div className="flex justify-end items-start mb-8">
                    <div className="flex flex-col gap-3">
                        <a
                            href="https://github.com/ayick13/jasa-web"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full transition-colors"
                        >
                            <Github size={16} />
                            <span>Unduh Repositori</span>
                        </a>
                        {/* Komponen UserDisplay untuk menampilkan informasi pengguna */}
                        <UserDisplay />
                    </div>
                </div>

                {/* Bagian Judul */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-slate-900 dark:text-white">AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">Image Suite</span></h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Sebuah command center untuk mengubah imajinasi Anda menjadi kenyataan visual.</p>
                </div>

                {/* Tata Letak Grid Utama */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Kolom Kiri - Generasi dan Kreasi Gambar, Chat AI, Analisis Gambar, Text to Audio */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Komponen Generasi dan Kreasi Gambar */}
                        <ImageGenerationAndCreationSection
                            prompt={prompt}
                            setPrompt={setPrompt}
                            handleGenerateImage={handleGenerateImage}
                            isLoading={isLoading}
                            imageGenModel={imageGenModel}
                            handleModelChange={handleModelChange}
                            artStyle={artStyle}
                            setArtStyle={setArtStyle}
                            quality={quality}
                            setQuality={setQuality}
                            batchSize={batchSize}
                            setBatchSize={setBatchSize}
                            imageWidth={imageWidth}
                            setImageWidth={setImageWidth}
                            imageHeight={imageHeight}
                            setImageHeight={setImageHeight}
                            handleClearPrompt={handleClearPrompt}
                            isCreatorLoading={isCreatorLoading}
                            creatorSubject={creatorSubject}
                            setCreatorSubject={setCreatorSubject}
                            creatorDetails={creatorDetails}
                            setCreatorDetails={setCreatorDetails}
                            handleCreatePrompt={handleCreatePrompt}
                            createdPrompt={createdPrompt}
                            setCreatedPrompt={setCreatedPrompt}
                        />
                        {/* Komponen Chat AI dan Analisis Gambar */}
                        <AiChatAndImageAnalysisSection
                            onPromptFromChat={handlePromptFromChat}
                            onPromptFromAnalysis={handlePromptFromAnalysis}
                        />
                        {/* Komponen Text to Audio */}
                        <AudioGenerationSection />
                    </div>

                    {/* Kolom Kanan - Tampilan dan Riwayat Gambar */}
                    <div className="lg:col-span-3">
                        <ImageDisplayAndHistorySection
                            generatedImages={generatedImages}
                            historyImages={historyImages}
                            isLoading={isLoading}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            handleClearHistory={handleClearHistory}
                            handleOpenModal={handleOpenModal}
                            selectedImageData={selectedImageData}
                            isModalOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            isDalleModalOpen={isDalleModalOpen}
                            handleCloseDalleModal={handleCloseDalleModal}
                            handleSaveDalleKey={handleSaveDalleKey}
                        />
                    </div>
                </div>
            </main>
        </Fragment>
    );
}

// Wrapper untuk memastikan suspense dan otentikasi
function AuthenticatedAISuiteWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-xl">Memuat AI Suite...</div>}>
            <AISuitePageContent />
        </Suspense>
    );
}

// Export default halaman AI Suite
export default function AISuitePage() {
    return <AuthenticatedAISuiteWrapper />;
}