// File: app/ai-suite/components/ImageGenerationAndCreationSection.tsx
import React from 'react';
import { Download, Zap, Eraser, Sparkles, Wand2, MessageSquare, Bot, Send, Settings, ChevronDown, ImageIcon, BrainCircuit, Upload, CheckCircle, Copy, CornerDownLeft, X, Volume2, Paperclip, History, KeyRound, ExternalLink, Trash2, Eye, EyeOff, LogOut, Github } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Re-export constants and types needed here
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
const artStylesGrouped = [
    { label: 'Default Styles', options: [
        { value: 'realistic', text: 'Realistic' },
        { value: 'photographic', text: 'Photographic' },
        { value: 'anime', text: 'Anime' },
        { value: 'manga', text: 'Manga' },
        { value: 'pixel-art', text: 'Pixel Art' },
        { value: 'fantasy', text: 'Fantasy' },
        { value: 'sci-fi', text: 'Sci-Fi' },
        { value: 'steampunk', text: 'Steampunk' },
        { value: 'cyberpunk', text: 'Cyberpunk' },
        { value: 'cinematic', text: 'Cinematic' }
    ]},
    { label: 'Ultra Realism', options: [
        { value: 'hyper realistic', text: 'Hyper Realistic' },
        { value: 'photorealistic', text: '8K Photorealistic' },
        { value: 'cinematic realism', text: 'Cinematic Realism' },
        { value: 'hyperdetailed', text: 'Hyperdetailed' },
        { value: 'sci-fi realism', text: 'Sci-Fi Realism' },
        { value: 'medical illustration', text: 'Medical Illustration' }
    ]},
    { label: 'Specialized Techniques', options: [
        { value: 'airbrush', text: 'Airbrush Art' },
        { value: 'scratchboard', text: 'Scratchboard Art' },
        { value: 'linocut print', text: 'Linocut Print' },
        { value: 'woodblock print', text: 'Woodblock Print' },
        { value: 'silkscreen', text: 'Silkscreen Printing' },
        { value: 'engraving', text: 'Engraving' },
        { value: 'mezzotint', text: 'Mezzotint' },
        { value: 'lithography', text: 'Lithography' },
        { value: 'etching', text: 'Etching' },
        { value: 'drypoint', text: 'Drypoint' }
    ]},
    { label: 'Contemporary Styles', options: [
        { value: 'street art', text: 'Street Art' },
        { value: 'graffiti', text: 'Graffiti' },
        { value: 'stencil art', text: 'Stencil Art' },
        { value: 'pop surrealism', text: 'Pop Surrealism' },
        { value: 'lowbrow art', text: 'Lowbrow Art' },
        { value: 'urban contemporary', text: 'Urban Contemporary' },
        { value: 'outsider art', text: 'Outsider Art' },
        { value: 'naive art', text: 'Naive Art' },
        { value: 'folk art', text: 'Folk Art' },
        { value: 'visionary art', text: 'Visionary Art' }
    ]},
    { label: 'Digital & Mixed Media', options: [
        { value: 'digital collage', text: 'Digital Collage' },
        { value: 'mixed media', text: 'Mixed Media' },
        { value: 'photo manipulation', text: 'Photo Manipulation' },
        { value: 'vector art', text: 'Vector Art' },
        { value: 'pixel art', text: 'Pixel Art' },
        { value: 'vaporwave', text: 'Vaporwave Aesthetic' },
        { value: 'synthwave', text: 'Synthwave' },
        { value: 'outrun', text: 'Outrun Style' },
        { value: 'cybergoth', text: 'Cybergoth' },
        { value: 'y2k aesthetic', text: 'Y2K Aesthetic' }
    ]},
    { label: 'Illustration Styles', options: [
        { value: 'editorial illustration', text: 'Editorial Illustration' },
        { value: 'scientific illustration', text: 'Scientific Illustration' },
        { value: 'botanical illustration', text: 'Botanical Illustration' },
        { value: 'medical illustration', text: 'Medical Illustration' },
        { value: 'technical drawing', text: 'Technical Drawing' },
        { value: 'infographic', text: 'Infographic Style' },
        { value: 'comic book', text: 'Comic Book Style' },
        { value: 'graphic novel', text: 'Graphic Novel' },
        { value: 'storyboard', text: 'Storyboard Style' },
        { value: 'concept art', text: 'Concept Art' }
    ]},
    { label: 'Regional & Ethnic Styles', options: [
        { value: 'african art', text: 'African Art' },
        { value: 'aboriginal art', text: 'Aboriginal Art' },
        { value: 'maori art', text: 'Maori Art' },
        { value: 'native american', text: 'Native American Art' },
        { value: 'aztec art', text: 'Aztec Art' },
        { value: 'mayan art', text: 'Mayan Art' },
        { value: 'inca art', text: 'Inca Art' },
        { value: 'balinese art', text: 'Balinese Art' },
        { value: 'javanese batik', text: 'Javanese Batik' },
        { value: 'thai art', text: 'Thai Art' }
    ]},
    { label: 'Photography Styles', options: [
        { value: 'professional photography', text: 'Professional Photography' },
        { value: 'casual photography', text: 'Casual Photography' },
        { value: 'studio portrait', text: 'Studio Portrait (Ring Light)' },
        { value: 'fujifilm pro', text: 'Fujifilm PRO' },
        { value: 'kodak portra', text: 'Kodak Portra' },
        { value: 'leica m', text: 'Leica M-Series' },
        { value: 'street photography', text: 'Street Photography' },
        { value: 'urban exploration', text: 'Urban Exploration' },
        { value: 'fashion photography', text: 'Fashion Editorial' },
        { value: 'product photography', text: 'Product Photography' },
        { value: 'food photography', text: 'Food Photography' },
        { value: 'macro photography', text: 'Macro Photography' },
        { value: 'astrophotography', text: 'Astrophotography' },
        { value: 'underwater', text: 'Underwater Photography' },
        { value: 'drone photography', text: 'Drone Photography' },
        { value: 'long exposure', text: 'Long Exposure' },
        { value: 'tilt-shift', text: 'Tilt-Shift' },
        { value: 'infrared', text: 'Infrared Photography' }
    ]},
    { label: 'Anime & Manga', options: [
        { value: 'anime', text: 'Modern Anime' },
        { value: 'studio ghibli', text: 'Studio Ghibli' },
        { value: 'makoto shinkai', text: 'Makoto Shinkai' },
        { value: '90s anime', text: '90s Anime' },
        { value: 'manga', text: 'Shonen Manga' },
        { value: 'seinen manga', text: 'Seinen Manga' },
        { value: 'webtoon', text: 'Webtoon' },
        { value: 'manhwa', text: 'Korean Manhwa' },
        { value: 'chibi', text: 'Chibi' },
        { value: 'kawaii', text: 'Kawaii Style' },
        { value: 'mecha anime', text: 'Mecha Anime' },
        { value: 'shoujo anime', text: 'Shoujo Anime' }
    ]},
    { label: 'Digital Painting', options: [
        { value: 'digital painting', text: 'Digital Painting' },
        { value: 'concept art', text: 'Concept Art' },
        { value: 'character design', text: 'Character Design' },
        { value: 'environment art', text: 'Environment Art' },
        { value: 'matte painting', text: 'Matte Painting' },
        { value: 'speedpainting', text: 'Speedpainting' },
        { value: 'fantasy art', text: 'Fantasy Art' },
        { value: 'dark fantasy', text: 'Dark Fantasy' },
        { value: 'book illustration', text: 'Book Illustration' },
        { value: 'children book', text: 'Children\'s Book' }
    ]},
    { label: 'Traditional Media', options: [
        { value: 'oil painting', text: 'Oil Painting' },
        { value: 'watercolor', text: 'Watercolor' },
        { value: 'gouache', text: 'Gouache' },
        { value: 'acrylic painting', text: 'Acrylic Painting' },
        { value: 'pastel', text: 'Pastel' },
        { value: 'ink wash', text: 'Ink Wash' },
        { value: 'fresco', text: 'Fresco' },
        { value: 'tempera', text: 'Tempera' },
        { value: 'renaissance', text: 'Renaissance' },
        { value: 'baroque', text: 'Baroque' },
        { value: 'rococo', text: 'Rococo' },
        { value: 'impressionist', text: 'Impressionist' },
        { value: 'post-impressionist', text: 'Post-Impressionist' },
        { value: 'expressionist', text: 'Expressionist' },
        { value: 'art nouveau', text: 'Art Nouveau' },
        { value: 'art deco', text: 'Art Deco' },
        { value: 'victorian', text: 'Victorian' },
        { value: 'socialist realism', text: 'Socialist Realism' }
    ]},
    { label: 'Drawing Techniques', options: [
        { value: 'pencil sketch', text: 'Pencil Sketch' },
        { value: 'charcoal sketch', text: 'Charcoal Sketch' },
        { value: 'ink drawing', text: 'Ink Drawing' },
        { value: 'ballpoint pen', text: 'Ballpoint Pen' },
        { value: 'colored pencil', text: 'Colored Pencil' },
        { value: 'marker drawing', text: 'Marker Drawing' },
        { value: 'etching', text: 'Etching' },
        { value: 'linocut', text: 'Linocut' },
        { value: 'woodcut', text: 'Woodcut' },
        { value: 'pointillism', text: 'Pointillism' },
        { value: 'stippling', text: 'Stippling' }
    ]},
    { label: '3D & CGI', options: [
        { value: '3d render', text: '3D Render' },
        { value: 'blender', text: 'Blender' },
        { value: 'unreal engine', text: 'Unreal Engine' },
        { value: 'octane render', text: 'Octane Render' },
        { value: 'redshift', text: 'Redshift' },
        { value: 'arnold render', text: 'Arnold Render' },
        { value: 'zbrush', text: 'ZBrush Sculpt' },
        { value: 'claymation', text: 'Claymation' },
        { value: 'stop motion', text: 'Stop Motion' },
        { value: 'isometric', text: 'Isometric' },
        { value: 'voxel art', text: 'Voxel Art' }
    ]},
    { label: 'Game Art Styles', options: [
        { value: 'low poly', text: 'Low Poly' },
        { value: 'pixel art', text: 'Pixel Art' },
        { value: 'ps1 graphics', text: 'PS1 Graphics' },
        { value: 'ps2 graphics', text: 'PS2 Graphics' },
        { value: 'n64 style', text: 'N64 Style' },
        { value: 'arc system works', text: 'Arc System Works' },
        { value: 'cel shaded', text: 'Cel-Shaded' },
        { value: 'borderlands', text: 'Borderlands Style' },
        { value: 'valorant style', text: 'Valorant Style' },
        { value: 'overwatch style', text: 'Overwatch Style' },
        { value: 'genshin impact', text: 'Genshin Impact' },
        { value: 'honkai star rail', text: 'Honkai: Star Rail' }
    ]},
    { label: 'Cyberpunk & Futuristic', options: [
        { value: 'cyberpunk', text: 'Cyberpunk 2077' },
        { value: 'cyberpunk anime', text: 'Cyberpunk Anime' },
        { value: 'biopunk', text: 'Biopunk' },
        { value: 'dieselpunk', text: 'Dieselpunk' },
        { value: 'steampunk', text: 'Steampunk' },
        { value: 'atompunk', text: 'Atompunk' },
        { value: 'solarpunk', text: 'Solarpunk' },
        { value: 'cassette futurism', text: 'Cassette Futurism' },
        { value: 'retro futurism', text: 'Retro Futurism' },
        { value: 'blade runner', text: 'Blade Runner' },
        { value: 'ghost in the shell', text: 'Ghost in the Shell' }
    ]},
    { label: 'Cartoon & Comics', options: [
        { value: 'disney style', text: 'Disney' },
        { value: 'pixar style', text: 'Pixar' },
        { value: 'dreamworks', text: 'Dreamworks' },
        { value: 'cartoon network', text: 'Cartoon Network' },
        { value: 'adult swim', text: 'Adult Swim' },
        { value: 'rick and morty', text: 'Rick and Morty' },
        { value: 'calarts style', text: 'CalArts Style' },
        { value: 'peanuts', text: 'Peanuts' },
        { value: 'marvel comics', text: 'Marvel Comics' },
        { value: 'dc comics', text: 'DC Comics' },
        { value: 'european comics', text: 'European Comics' },
        { value: 'french ligne claire', text: 'Ligne Claire' }
    ]},
    { label: 'Abstract & Experimental', options: [
        { value: 'abstract', text: 'Abstract' },
        { value: 'cubism', text: 'Cubism' },
        { value: 'surrealism', text: 'Surrealism' },
        { value: 'dadaism', text: 'Dadaism' },
        { value: 'bauhaus', text: 'Bauhaus' },
        { value: 'constructivism', text: 'Constructivism' },
        { value: 'psychedelic', text: 'Psychedelic' },
        { value: 'fluid art', text: 'Fluid Art' },
        { value: 'glitch art', text: 'Glitch Art' },
        { value: 'fractal art', text: 'Fractal Art' },
        { value: 'generative art', text: 'Generative Art' },
        { value: 'data bending', text: 'Data Bending' }
    ]},
    { label: 'Special Effects', options: [
        { value: 'holographic', text: 'Holographic' },
        { value: 'neon glow', text: 'Neon Glow' },
        { value: 'chromatic aberration', text: 'Chromatic Aberration' },
        { value: 'double exposure', text: 'Double Exposure' },
        { value: 'light painting', text: 'Light Painting' },
        { value: 'lens flare', text: 'Lens Flare' },
        { value: 'vhs effect', 'text': 'VHS Effect' },
        { value: 'crt screen', text: 'CRT Screen' },
        { value: 'film grain', text: 'Film Grain' },
        { value: 'cross processing', text: 'Cross Processing' }
    ]},
    { label: 'Cultural & Historical', options: [
        { value: 'ukiyo-e', text: 'Ukiyo-e' },
        { value: 'chinese painting', text: 'Chinese Painting' },
        { value: 'sumi-e', text: 'Sumi-e' },
        { value: 'persian miniature', text: 'Persian Miniature' },
        { value: 'medieval illuminated', text: 'Medieval Illuminated' },
        { value: 'byzantine icon', text: 'Byzantine Icon' },
        { value: 'tribal art', text: 'Tribal Art' },
        { value: 'afrofuturism', text: 'Afrofuturism' },
        { value: 'indigenous art', text: 'Indigenous Art' },
        { value: 'soviet propaganda', text: 'Soviet Propaganda' }
    ]}
];
const qualityOptions = ['standar', 'hd', 'ultrahd'] as const;
type QualityOption = (typeof qualityOptions)[number];
const batchSizes = [1, 2, 3, 4] as const;
type BatchSize = (typeof batchSizes)[number];
const imagePresets = [
    { label: 'Square (1024x1024)', width: 1024, height: 1024 },
    { label: 'Portrait (1024x1792)', width: 1024, height: 1792 },
    { label: 'Landscape (1792x1024)', width: 1792, height: 1024 },
];

interface ImageGenerationAndCreationSectionProps {
    prompt: string;
    setPrompt: (value: string) => void;
    handleGenerateImage: () => Promise<void>;
    isLoading: boolean;
    imageGenModel: ImageGenModel;
    handleModelChange: (newModel: ImageGenModel) => void;
    artStyle: ArtStyle;
    setArtStyle: (style: ArtStyle) => void;
    quality: QualityOption;
    setQuality: (quality: QualityOption) => void;
    batchSize: BatchSize;
    setBatchSize: (size: BatchSize) => void;
    imageWidth: number;
    setImageWidth: (width: number) => void;
    imageHeight: number;
    setImageHeight: (height: number) => void;
    handleClearPrompt: () => void;
    isCreatorLoading: boolean;
    creatorSubject: string;
    setCreatorSubject: (subject: string) => void;
    creatorDetails: string;
    setCreatorDetails: (details: string) => void;
    handleCreatePrompt: () => Promise<void>;
    createdPrompt: string | null;
    setCreatedPrompt: (prompt: string | null) => void;
}

const ParameterInput = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</label>
        {children}
    </div>
);

const Accordion = ({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 p-3 bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-semibold text-slate-800 dark:text-white"
            >
                <div className="flex items-center gap-2">{icon}{title}</div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                    {children}
                </div>
            )}
        </div>
    );
};

export const ImageGenerationAndCreationSection: React.FC<ImageGenerationAndCreationSectionProps> = ({
    prompt,
    setPrompt,
    handleGenerateImage,
    isLoading,
    imageGenModel,
    handleModelChange,
    artStyle,
    setArtStyle,
    quality,
    setQuality,
    batchSize,
    setBatchSize,
    imageWidth,
    setImageWidth,
    imageHeight,
    setImageHeight,
    handleClearPrompt,
    isCreatorLoading,
    creatorSubject,
    setCreatorSubject,
    creatorDetails,
    setCreatorDetails,
    handleCreatePrompt,
    createdPrompt,
    setCreatedPrompt,
}) => {
    return (
        <div className="bg-white dark:bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/20 border border-slate-200 dark:border-slate-700 h-full flex flex-col space-y-6">
            <div>
                <label htmlFor="prompt" className="flex items-center text-slate-800 dark:text-slate-300 mb-3 font-bold text-xl">
                    <Zap className="w-7 h-7 mr-3 text-cyan-500 dark:text-cyan-400"/>Image Generation
                </label>
                <div className="relative w-full">
                    <textarea
                        id="prompt"
                        className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4 pr-10 text-slate-900 dark:text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        rows={4}
                        placeholder="Tuliskan imajinasi Anda di sini..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isLoading}
                    />
                    {prompt && (
                        <button onClick={handleClearPrompt} className="absolute top-3 right-3 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition">
                            <Eraser size={20}/>
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-2">
                <button
                    onClick={handleGenerateImage}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full font-bold py-4 px-8 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
                >
                    {isLoading ? (
                        <><svg className="animate-spin h-6 w-6 text-current mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</>
                    ) : (
                        <><Zap className="mr-2"/> Generate Image</>
                    )}
                </button>
            </div>
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <Accordion title="Parameter" icon={<Settings size={16}/>}>
                    <div className="grid grid-cols-2 gap-4">
                        <ParameterInput label="Model">
                            <select
                                className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white"
                                value={imageGenModel}
                                onChange={(e) => handleModelChange(e.target.value as ImageGenModel)}
                            >
                                {imageGenModels.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </ParameterInput>
                        <ParameterInput label="Gaya Seni">
                            <select
                                className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white"
                                value={artStyle}
                                onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                                disabled={imageGenModel === 'dall-e-3'}
                            >
                                {artStylesGrouped.map((group) => (
                                    <optgroup key={group.label} label={group.label}>
                                        {group.options.map(option => (
                                            <option key={option.value} value={option.value}>{option.text}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </ParameterInput>
                        <ParameterInput label="Kualitas">
                            <select
                                className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white"
                                value={quality}
                                onChange={(e) => setQuality(e.target.value as QualityOption)}
                                disabled={imageGenModel === 'dall-e-3'}
                            >
                                {qualityOptions.map(q => <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>)}
                            </select>
                        </ParameterInput>
                        <ParameterInput label="Jumlah">
                            <select
                                className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white"
                                value={batchSize}
                                onChange={(e) => setBatchSize(Number(e.target.value) as BatchSize)}
                                disabled={imageGenModel === 'dall-e-3'}
                            >
                                {batchSizes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </ParameterInput>
                        <div className="col-span-2">
                            <ParameterInput label="Ukuran Preset">
                                <select
                                    className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white"
                                    value={`${imageWidth}x${imageHeight}`}
                                    onChange={(e) => { const [widthStr, heightStr] = e.target.value.split('x'); setImageWidth(parseInt(widthStr)); setImageHeight(parseInt(heightStr)); }}
                                    disabled={imageGenModel === 'dall-e-3'}
                                >
                                    {imagePresets.map(preset => (
                                        <option key={`${preset.width}x${preset.height}`} value={`${preset.width}x${preset.height}`}>
                                            {preset.label}
                                        </option>
                                    ))}
                                </select>
                            </ParameterInput>
                        </div>
                        <div className="col-span-2 grid grid-cols-2 gap-2">
                            <ParameterInput label="Width">
                                <input type="number" className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white" value={imageWidth} onChange={e => setImageWidth(parseInt(e.target.value))} disabled={imageGenModel === 'dall-e-3'}/>
                            </ParameterInput>
                            <ParameterInput label="Height">
                                <input type="number" className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white" value={imageHeight} onChange={e => setImageHeight(parseInt(e.target.value))} disabled={imageGenModel === 'dall-e-3'}/>
                            </ParameterInput>
                        </div>
                    </div>
                </Accordion>
                <Accordion title="Prompt Creator" icon={<Wand2 size={16}/>}>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={creatorSubject}
                                onChange={e => setCreatorSubject(e.target.value)}
                                placeholder="Subjek Utama..."
                                className="w-full text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white"
                            />
                            <textarea
                                value={creatorDetails}
                                onChange={e => setCreatorDetails(e.target.value)}
                                placeholder="Detail Tambahan..."
                                rows={2}
                                className="w-full text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white"
                            />
                            <button
                                onClick={handleCreatePrompt}
                                disabled={isCreatorLoading || !creatorSubject.trim()}
                                className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-purple-700 transition disabled:opacity-50 flex justify-center items-center"
                            >
                                {isCreatorLoading ? "Meningkatkan..." : 'Tingkatkan Prompt'}
                            </button>
                        </div>
                        {createdPrompt && (
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-3">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Hasil dari AI:</p>
                                <p className="text-sm bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-300">{createdPrompt}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setPrompt(createdPrompt); toast.success('Prompt digunakan!'); }}
                                        className="flex-1 bg-sky-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-sky-700 transition flex items-center justify-center gap-2"
                                    >
                                        <CornerDownLeft size={14}/> Gunakan
                                    </button>
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(createdPrompt || ''); toast.success('Prompt disalin!'); }}
                                        className="flex-1 bg-slate-500 dark:bg-slate-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-slate-600 dark:hover:bg-slate-700 transition flex items-center justify-center gap-2"
                                    >
                                        <Copy size={14} /> Salin
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Accordion>
            </div>
        </div>
    );
};