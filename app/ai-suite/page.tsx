'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, Fragment, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import {
    Download, Zap, Eraser, Sparkles, Wand2, MessageSquare, Bot, Send, Settings,
    ChevronDown, ImageIcon, BrainCircuit, Upload, CheckCircle, Copy, CornerDownLeft, X,
    Volume2, Paperclip, History, KeyRound, ExternalLink, Trash2,
    Eye, EyeOff // Ikon Eye dan EyeOff diaktifkan kembali
} from 'lucide-react';

// --- Tipe Data & Konstanta ---
const imageGenModels = ['flux', 'turbo', 'dall-e-3', 'gptimage'] as const;
type ImageGenModel = (typeof imageGenModels)[number];

// Definisi artStyles yang diperbarui (gabungan semua gaya unik)
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

// Struktur data untuk mengelompokkan gaya seni (untuk rendering optgroup)
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
        { value: 'vhs effect', text: 'VHS Effect' },
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
interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; imageUrl?: string; }
interface GeneratedImageData { url: string; prompt: string; model: ImageGenModel; artStyle: ArtStyle; quality: QualityOption; width: number; height: number; seed: string; isDalle?: boolean; timestamp: number; }
interface HistoryItem { id: string; prompt: string; timestamp: string; }

// --- Preset Ukuran Gambar Baru ---
const imagePresets = [
    { label: 'Square (1024x1024)', width: 1024, height: 1024 },
    { label: 'Portrait (1024x1792)', width: 1024, height: 1792 },
    { label: 'Landscape (1792x1024)', width: 1792, height: 1024 },
];

// --- Komponen UI ---
const ParameterInput = ({ label, children }: { label: string, children: React.ReactNode }) => ( <div><label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>{children}</div> );
const Accordion = ({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode, defaultOpen?: boolean }) => { const [isOpen, setIsOpen] = useState(defaultOpen); return ( <div className="w-full"> <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between gap-2 p-3 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold"> <div className="flex items-center gap-2">{icon}{title}</div> <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} /> </button> {isOpen && <div className="mt-3 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">{children}</div>} </div> ); };
const CodeBlock = ({ language, code }: { language: string, code: string }) => { const handleCopy = () => { navigator.clipboard.writeText(code); toast.success("Kode disalin ke clipboard!"); }; return ( <div className="bg-slate-900/70 rounded-md my-2 border border-slate-700"> <div className="flex justify-between items-center px-4 py-1 bg-slate-800/50 rounded-t-md"> <span className="text-xs font-sans text-slate-400">{language}</span> <button onClick={handleCopy} className="text-xs text-slate-400 hover:text-white flex items-center gap-1"><Copy size={14}/> Salin</button> </div> <pre className="p-4 text-sm overflow-x-auto"><code>{code}</code></pre> </div> ); };

// Komponen modal reset dan refill admin dihapus sepenuhnya.

// --- Komponen Fungsional ---
const ChatBox = ({ onPromptFromChat }: { onPromptFromChat: (prompt: string) => void }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'init', role: 'assistant', content: 'Halo! Anda bisa mengirim teks atau gambar untuk dianalisa.' }]);
    const [input, setInput] = useState(''); const [isThinking, setIsThinking] = useState(false); const [availableModels, setAvailableModels] = useState<Record<string, any>>({}); const [selectedModel, setSelectedModel] = useState('openai'); const imageInputRef = useRef<HTMLInputElement>(null); const messagesEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    useEffect(() => { const fetchModels = async () => { try { const response = await fetch('/api/get-models'); if (!response.ok) throw new Error('Failed to fetch models'); const data = await response.json(); setAvailableModels(data); } catch (error) { toast.error("Gagal memuat daftar model AI."); } }; fetchModels(); }, []);
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; if (!file) return;
        const reader = new FileReader(); reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64Image = (reader.result as string); const base64Data = base64Image.split(',')[1];
            const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: "Tolong analisa gambar ini.", imageUrl: base64Image };
            const newMessages = [...messages, userMessage];
            setMessages(newMessages); setIsThinking(true);
            const assistantMessageId = `assistant-${Date.now()}`;
            setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: "..." }]);
            try {
                const response = await fetch('/api/chat-vision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64Data, messages: newMessages }) });
                if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error); }
                const data = await response.json();
                setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: data.reply } : msg ));
            } catch (error: any) { toast.error(error.message); setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId)); }
            finally { setIsThinking(false); }
        };
        if (event.target) event.target.value = '';
    };
    const handleSendMessage = async () => {
        if (!input.trim() || isThinking) return;
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput(''); setIsThinking(true);
        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: "..." }]);
        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages, model: selectedModel }) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Gagal mendapatkan balasan dari AI.'); }
            const data = await response.json();
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: data.reply } : msg ));
        } catch (error: any) { toast.error(error.message); setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: "Maaf, terjadi kesalahan." } : msg )); } finally { setIsThinking(false); }
    };
    const renderMessageContent = (content: string) => { const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g; let lastIndex = 0; const parts = []; let match; while ((match = codeBlockRegex.exec(content)) !== null) { const [fullMatch, language, code] = match; const textBefore = content.substring(lastIndex, match.index); if (textBefore) { parts.push(<p key={lastIndex} className="whitespace-pre-wrap">{textBefore}</p>); } parts.push(<CodeBlock key={match.index} language={language || 'bash'} code={code.trim()} />); lastIndex = match.index + fullMatch.length; } const textAfter = content.substring(lastIndex); if (textAfter) { parts.push(<p key={lastIndex + 1} className="whitespace-pre-wrap">{textAfter}</p>); } return parts.length > 0 ? parts : <p className="whitespace-pre-wrap">{content}</p>; };
    return ( <div className="flex flex-col h-[500px] bg-slate-900/50 rounded-lg"> <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" /> <div className="p-3 border-b border-slate-700 flex items-center justify-between flex-shrink-0"> <h3 className="text-sm font-bold text-white flex items-center">AI Assistant</h3> <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="bg-slate-700 text-xs text-white rounded p-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[150px]"> {Object.keys(availableModels).length > 0 ? ( Object.entries(availableModels).map(([key, modelInfo]) => (<option key={key} value={key}>{modelInfo.name || key}</option>)) ) : ( <option value="openai">Memuat model...</option> )} </select> </div> <div ref={messagesEndRef} className="flex-grow p-4 space-y-4 overflow-y-auto"> {messages.map(msg => ( <div key={msg.id} className={`flex gap-2 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}> {msg.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-cyan-900 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-cyan-400"/></div>} <div className={`p-2.5 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-300 rounded-bl-none'}`}> {msg.imageUrl && <Image src={msg.imageUrl} alt="User upload" width={200} height={200} className="rounded-md mb-2"/>} {msg.content === "..." && isThinking ? <span className="animate-pulse">...</span> : renderMessageContent(msg.content)} {msg.role === 'assistant' && msg.content && msg.content !== "..." && !msg.content.includes("kesalahan") && <button onClick={() => onPromptFromChat(msg.content)} className="mt-2 text-xs font-semibold text-cyan-400 hover:underline">Gunakan sebagai Prompt</button>} </div> </div> ))} </div> <div className="p-4 border-t border-slate-700"> <div className="flex items-center gap-2"> <button onClick={() => imageInputRef.current?.click()} title="Upload Gambar" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition"><Paperclip size={20}/></button> <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Tanya sesuatu atau upload gambar..." className="w-full bg-slate-700 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" /> <button onClick={handleSendMessage} disabled={!input.trim() || isThinking} className="p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-slate-600 transition"><Send size={20}/></button> </div> </div> </div> );
};
const TextToAudioConverter = () => { const [text, setText] = useState(''); const [voice, setVoice] = useState('alloy'); const [isLoading, setIsLoading] = useState(false); const [audioUrl, setAudioUrl] = useState<string | null>(null); const handleGenerateAudio = async () => { if (!text.trim()) return toast.error("Teks tidak boleh kosong."); setIsLoading(true); setAudioUrl(null); const toastId = toast.loading("Membuat audio..."); try { const response = await fetch('/api/text-to-audio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice }), }); if (!response.ok) { try { const errorData = await response.json(); throw new Error(errorData.error || "Gagal membuat audio."); } catch { throw new Error(await response.text()); } } const blob = await response.blob(); const url = URL.createObjectURL(blob); setAudioUrl(url); toast.success("Audio berhasil dibuat!", { id: toastId }); } catch (error: any) { toast.error(error.message, { id: toastId }); } finally { setIsLoading(false); } }; return ( <div className="space-y-4"> <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Masukkan teks yang ingin diubah menjadi suara..." rows={5} className="w-full text-sm bg-slate-800 border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" /> <div className="grid grid-cols-1 gap-4"> <ParameterInput label="Jenis Suara"><select value={voice} onChange={e => setVoice(e.target.value)} className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2"><option value="alloy">Alloy</option><option value="echo">Echo</option><option value="fable">Fable</option><option value="onyx">Onyx</option><option value="nova">Nova</option><option value="shimmer">Shimmer</option></select></ParameterInput> </div> <button onClick={handleGenerateAudio} disabled={isLoading || !text.trim()} className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-50 flex justify-center items-center">{isLoading ? "Membuat..." : "Buat Audio"}</button> {audioUrl && ( <div className="border-t border-slate-700 pt-4"><audio controls src={audioUrl} className="w-full">Your browser does not support the audio element.</audio></div> )} </div> ); };
const ImageAnalyzer = ({ onPromptFromAnalysis }: { onPromptFromAnalysis: (prompt: string) => void }) => { const [imageFile, setImageFile] = useState<File | null>(null); const [imagePreview, setImagePreview] = useState<string | null>(null); const [isAnalyzing, setIsAnalyzing] = useState(false); const [analysisResult, setAnalysisResult] = useState<string | null>(null); const fileInputRef = useRef<HTMLInputElement>(null); const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { setImageFile(file); setAnalysisResult(null); const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result as string); reader.readAsDataURL(file); } }; const handleAnalyze = async () => { if (!imageFile) return toast.error('Silakan unggah gambar terlebih dahulu.'); setIsAnalyzing(true); setAnalysisResult(null); const toastId = toast.loading('Menganalisis gambar...'); const reader = new FileReader(); reader.readAsDataURL(imageFile); reader.onload = async () => { try { const base64Image = (reader.result as string).split(',')[1]; const response = await fetch('/api/analyze-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64Image }) }); if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Analisis gambar gagal.'); } const data = await response.json(); setAnalysisResult(data.description); toast.success('Analisis berhasil!', { id: toastId }); } catch (error: any) { toast.error(error.message || 'Gagal menganalisis gambar.', { id: toastId }); } finally { setIsAnalyzing(false); } }; }; const handleUseAsPrompt = () => { if (analysisResult) { onPromptFromAnalysis(analysisResult); toast.success('Hasil analisis digunakan sebagai prompt!'); } }; return ( <div className="space-y-4"> <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" /> <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition"><Upload size={18} /> Pilih Gambar</button> {imagePreview && ( <div className="mt-4 space-y-4"> <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-slate-600"><Image src={imagePreview} alt="Pratinjau Gambar" layout="fill" objectFit="contain" /></div> <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2">{isAnalyzing ? "Menganalisis..." : 'Analisis Gambar Ini'}</button> </div> )} {analysisResult && ( <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-600 space-y-3"> <p className="text-sm text-slate-300">{analysisResult}</p> <button onClick={handleUseAsPrompt} className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition text-sm flex items-center justify-center gap-2"><CheckCircle size={16}/> Gunakan sebagai Prompt</button> </div> )} </div> ); };
const ImageDetailModal = ({ isOpen, onClose, imageData }: { isOpen: boolean, onClose: () => void, imageData: GeneratedImageData | null }) => { if (!isOpen || !imageData) return null; return ( <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}> <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col lg:flex-row gap-6 p-6 relative" onClick={(e) => e.stopPropagation()}> <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"><X size={24} /></button> <div className="flex-shrink-0 lg:w-1/2"><div className="relative aspect-square w-full bg-slate-900 rounded-md overflow-hidden"><Image src={imageData.url} alt={imageData.prompt} layout="fill" className="object-contain" unoptimized/></div></div> <div className="flex-grow lg:w-1/2 overflow-y-auto pr-2 space-y-4"> <h3 className="text-2xl font-bold text-white">Detail Generasi</h3> <div><label className="text-sm font-semibold text-slate-400">Prompt</label><p className="mt-1 text-base text-slate-200 bg-slate-700/50 p-3 rounded-md">{imageData.prompt}</p></div> <div className="grid grid-cols-2 gap-4 text-sm"> <div><label className="font-semibold text-slate-400">Model</label><p className="text-slate-200">{imageData.model}</p></div> <div><label className="font-semibold text-slate-400">Gaya Seni</label><p className="text-slate-200">{imageData.isDalle ? 'N/A' : imageData.artStyle}</p></div> <div><label className="font-semibold text-slate-400">Kualitas</label><p className="text-slate-200">{imageData.isDalle ? 'N/A' : imageData.quality}</p></div> <div><label className="font-semibold text-slate-400">Resolusi</label><p className="text-slate-200">{imageData.width} x {imageData.height}</p></div> <div><label className="font-semibold text-slate-400">Seed</label><p className="text-slate-200 break-all">{imageData.seed}</p></div> <div><label className="font-semibold text-slate-400">Waktu Generasi</label><p className="text-slate-200">{new Date(imageData.timestamp).toLocaleString()}</p></div> </div> <div className="pt-4 flex flex-col sm:flex-row gap-2"> <a href={imageData.url} download={`ayick-ai-${imageData.seed}.png`} className="w-full sm:w-auto flex-1 bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition"><Download size={16}/> Unduh</a> <button onClick={() => { navigator.clipboard.writeText(imageData.prompt); toast.success('Prompt disalin!'); }} className="w-full sm:w-auto flex-1 bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition"><Copy size={16}/> Salin Prompt</button> </div> </div> </div> </div> ); };

const DalleApiKeyModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (key: string) => void }) => {
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false); // State untuk show/hide API Key

    if (!isOpen) return null;

    const handleSave = () => {
        if (apiKey.trim()) { onSave(apiKey.trim()); } else { toast.error("API Key tidak boleh kosong."); }
    };
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-6 relative space-y-4" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"><X size={20} /></button>
                <div className="flex items-center gap-3"><KeyRound className="text-yellow-400" size={24}/><h3 className="text-xl font-bold text-white">Masukkan API Key OpenAI</h3></div>
                <p className="text-sm text-slate-400">Model DALL-E 3 memerlukan API Key OpenAI Anda sendiri untuk berfungsi. Key Anda hanya akan disimpan sementara di browser Anda untuk sesi ini.</p>
                {/* Input API Key dengan toggle show/hide */}
                <div className="relative w-full">
                    <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-slate-700 border-slate-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
                        aria-label={showApiKey ? 'Sembunyikan API Key' : 'Tampilkan API Key'}
                    >
                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">Bagaimana cara mendapatkan API Key? <ExternalLink size={14}/></a>
                <div className="flex justify-end gap-2 pt-2"><button onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Batal</button><button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Simpan & Lanjutkan</button></div>
            </div>
        </div>
    );
};


// --- Komponen Utama Halaman ---
function AISuitePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // 1. Inisialisasi prompt HANYA SEKALI dari URL menggunakan fungsi inisializer
    const [prompt, setPrompt] = useState(() => {
        const urlPrompt = searchParams.get('prompt');
        if (urlPrompt) {
            // Jika ada prompt di URL saat pertama kali dimuat, set prompt
            // dan langsung hapus dari URL untuk mencegah re-init pada refresh.
            // Gunakan router.replace dalam inisializer fungsi untuk efek samping pada mount.
            // Ini akan memastikan URL bersih dari prompt pada pemuatan awal.
            const newSearchParams = new URLSearchParams(searchParams.toString());
            newSearchParams.delete('prompt');
            // Pastikan ini hanya berjalan di sisi klien (browser)
            if (typeof window !== 'undefined') {
                router.replace(`?${newSearchParams.toString()}`, { scroll: false });
            }
            return urlPrompt;
        }
        return '';
    });

    // useRef untuk melacak apakah prompt telah dimodifikasi oleh pengguna
    // Ini penting agar prompt dari URL tidak mengesampingkan perubahan manual pengguna
    const isPromptUserModified = useRef(false);

    // Effect untuk menampilkan toast "Prompt dimuat!" (hanya sekali jika dari URL)
    useEffect(() => {
        // Cek apakah prompt awalnya dimuat dari URL dan belum dimodifikasi pengguna
        if (searchParams.get('prompt') && !isPromptUserModified.current) {
            toast.success('Prompt dari halaman utama dimuat!');
        }
    }, []); // Hanya berjalan sekali saat komponen di-mount


    // ... state lainnya ...
    const [imageGenModel, setImageGenModel] = useState<ImageGenModel>('flux');
    const [artStyle, setArtStyle] = useState<ArtStyle>('realistic');
    const [quality, setQuality] = useState<QualityOption>('standar');
    const [imageWidth, setImageWidth] = useState(1024);
    const [imageHeight, setImageHeight] = useState(1024);
    const [batchSize, setBatchSize] = useState<BatchSize>(1);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);
    const [historyImages, setHistoryImages] = useState<GeneratedImageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatorLoading, setIsCreatorLoading] = useState(false);
    const [creatorSubject, setCreatorSubject] = useState('');
    const [creatorDetails, setCreatorDetails] = useState('');
    const [createdPrompt, setCreatedPrompt] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageData, setSelectedImageData] = useState<GeneratedImageData | null>(null);
    const [isDalleModalOpen, setIsDalleModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

    // State, konstanta, dan fungsi terkait koin dan fitur admin dihapus.

    // --- Logika LocalStorage (hanya riwayat gambar) ---

    // 1. Muat riwayat gambar dari localStorage saat komponen pertama kali dimuat
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('ai_image_history');
            if (savedHistory) {
                const parsedHistory: GeneratedImageData[] = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory)) {
                    setHistoryImages(parsedHistory.filter(item => item && item.url && item.prompt));
                }
            }
        } catch (e) {
            console.error("Gagal memuat riwayat dari localStorage:", e);
            localStorage.removeItem('ai_image_history'); // Hapus data yang rusak
        }
    }, []);

    // 2. Simpan riwayat gambar ke localStorage setiap kali `historyImages` berubah
    useEffect(() => {
        if (historyImages.length > 0) {
            localStorage.setItem('ai_image_history', JSON.stringify(historyImages));
        } else {
            localStorage.removeItem('ai_image_history'); // Hapus jika riwayat kosong
        }
    }, [historyImages]);

    // Fungsi handleModelChange, handleSaveDalleKey, handleCloseDalleModal tetap sama
    const handleModelChange = (newModel: ImageGenModel) => { if (newModel === 'dall-e-3') { const savedKey = localStorage.getItem('openai_api_key'); if (!savedKey) { setIsDalleModalOpen(true); } else { setImageGenModel('dall-e-3'); } } else { setImageGenModel(newModel); } };
    const handleSaveDalleKey = (key: string) => { localStorage.setItem('openai_api_key', key); setIsDalleModalOpen(false); setImageGenModel('dall-e-3'); toast.success("API Key DALL-E 3 disimpan untuk sesi ini."); };
    const handleCloseDalleModal = () => { setIsDalleModalOpen(false); if (imageGenModel === 'dall-e-3') { setImageGenModel('flux'); } };
    
    const handleGenerateImage = useCallback(async () => {
        if (!prompt.trim()) return toast.error('Prompt tidak boleh kosong.');

        // Cek koin sebelum generasi (dihapus)
        // if (userCoins <= 0) {
        //     toast.error('Koin tidak cukup! Silakan reset koin atau minta admin untuk mengisi ulang.');
        //     return;
        // }

        // Revoke Object URLs dari gambar yang dihasilkan sebelumnya sebelum membersihkan state
        generatedImages.forEach(img => {
            if (img.url.startsWith('blob:')) {
                URL.revokeObjectURL(img.url);
            }
        });

        const finalPrompt = imageGenModel === 'dall-e-3' ? prompt : `${prompt}${artStyle !== 'realistic' ? `, in the style of ${artStyle.replace('-', ' ')}` : ''}${quality === 'hd' ? ', hd' : quality === 'ultrahd' ? ', 4k, photorealistic' : ''}`;
        setIsLoading(true); setGeneratedImages([]);
        setActiveTab('current');
        const toastId = toast.loading(`Menghasilkan gambar dengan ${imageGenModel}...`);
        
        try {
            let images: GeneratedImageData[] = [];
            const timestamp = Date.now();
            
            if (imageGenModel === 'dall-e-3') {
                const apiKey = localStorage.getItem('openai_api_key');
                if (!apiKey) { throw new Error("API Key DALL-E 3 tidak ditemukan."); }
                
                const response = await fetch('/api/dalle', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: finalPrompt, apiKey }) });
                if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error); }
                
                const data = await response.json();
                images = [{ url: data.imageUrl, prompt: finalPrompt, model: 'dall-e-3', artStyle, quality, width: 1024, height: 1024, seed: 'N/A', isDalle: true, timestamp }];
            
            } else {
                const promises = Array.from({ length: batchSize }, () => {
                    const seed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
                    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${imageWidth}&height=${imageHeight}&nologo=true&safe=true&model=${imageGenModel === 'gptimage' ? 'gpt3' : imageGenModel}&seed=${seed}&referrer=ariftirtana.my.id`;
                    
                    return fetch(imageUrl)
                        .then(res => res.ok ? res.blob() : Promise.reject(new Error('Failed to fetch image')))
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
                            return null;
                        });
                });
                
                const results = await Promise.all(promises);
                images = results.filter((img): img is GeneratedImageData => img !== null);
            }

            if (images.length > 0) {
                setGeneratedImages(images);
                setHistoryImages(prevHistory => [...images, ...prevHistory]); 
                // Kurangi koin dan perbarui timestamp penggunaan terakhir (dihapus)
                // setUserCoins(prevCoins => prevCoins - 1); 
                // setLastUsageTimestamp(Date.now()); 
                toast.success(`${images.length} gambar berhasil dibuat!`, { id: toastId }); // Pesan toast disederhanakan
            } else { throw new Error("Tidak ada gambar yang dihasilkan."); }

        } catch (error: any) {
            toast.error(error.message || 'Terjadi kesalahan tak terduga.', { id: toastId });
        } finally { setIsLoading(false); }
    }, [prompt, imageGenModel, artStyle, quality, imageWidth, imageHeight, batchSize, generatedImages]);
    
    // Fungsi handleClearPrompt, handlePromptChange, handleCreatePrompt, handleOpenModal,
    // handlePromptFromChat, handlePromptFromAnalysis, handleClearHistory tetap sama
    const handleClearPrompt = useCallback(() => {
        setPrompt('');
        isPromptUserModified.current = true; // Tandai bahwa prompt telah diubah oleh pengguna
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.delete('prompt');
        router.replace(`?${newSearchParams.toString()}`, { scroll: false });
        toast.success('Prompt dibersihkan.');
    }, [searchParams, router]);

    const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        isPromptUserModified.current = true; // Tandai bahwa prompt telah diubah oleh pengguna
    }, []);
    
    const handleCreatePrompt = async () => { if (!creatorSubject.trim()) return toast.error('Subjek di Prompt Creator tidak boleh kosong.'); setIsCreatorLoading(true); setCreatedPrompt(null); const toastId = toast.loading('AI sedang membuat prompt...'); try { const response = await fetch('/api/enhance-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: creatorSubject, details: creatorDetails }) }); if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || "Gagal membuat prompt dari AI."); } const data = await response.json(); setCreatedPrompt(data.prompt); toast.success('Prompt berhasil ditingkatkan!', { id: toastId }); } catch (error: any) { toast.error(error.message || "Gagal menghubungi AI.", { id: toastId }); } finally { setIsCreatorLoading(false); } };
    const handleOpenModal = (imageData: GeneratedImageData) => { setSelectedImageData(imageData); setIsModalOpen(true); };
    
    const handlePromptFromChat = useCallback((chatPrompt: string) => { 
        setPrompt(chatPrompt); 
        isPromptUserModified.current = true;
        toast.success('Pesan dari asisten digunakan!'); 
    }, []);

    const handlePromptFromAnalysis = useCallback((analysisPrompt: string) => { 
        setPrompt(analysisPrompt); 
        isPromptUserModified.current = true;
    }, []);

    const handleClearHistory = useCallback(() => {
        // Revoke object URLs from history images before clearing
        historyImages.forEach(img => {
            if (img.url.startsWith('blob:')) {
                URL.revokeObjectURL(img.url);
            }
        });
        localStorage.removeItem('ai_image_history'); // Hapus dari localStorage
        setHistoryImages([]); // Hapus dari state
        toast.success('Riwayat dihapus.');
    }, [historyImages]); 

    // Fungsi-fungsi terkait admin (handleAdminResetClick, handleConfirmAdminReset, dll.) dihapus sepenuhnya.
    
    return (
        <Fragment>
            <DalleApiKeyModal isOpen={isDalleModalOpen} onClose={handleCloseDalleModal} onSave={handleSaveDalleKey} />
            <ImageDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageData={selectedImageData} />
            {/* Modal admin dihapus */}
            <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#FFFFFFFF', border: '1px solid #334155' }}} />
            <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12"><h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">Image Suite</span></h1><p className="text-lg text-slate-400 max-w-2xl mx-auto">Setiap Piksel, Sebuah Kanvas Baru. Setiap Ide, Sebuah Kemungkinan Tak Terbatas.</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-2xl shadow-black/20 border border-slate-700 h-full flex flex-col space-y-6">
                            {/* Display Koin dengan Penghitung Mundur (dihapus) */}
                            {/* <div className="flex items-center justify-between p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-sm font-semibold text-white">
                                <span className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-yellow-400"/>Koin Anda:</span>
                                <span className="text-yellow-300 text-lg font-bold">{userCoins}</span>
                                {lastUsageTimestamp !== 0 && (
                                    <span className="text-xs text-slate-400 ml-4">{remainingTime}</span>
                                )}
                            </div> */}

                            <div><label htmlFor="prompt" className="block text-slate-300 mb-3 font-bold text-xl items-center"><Zap className="w-7 h-7 mr-3 text-cyan-400"/>Image Generation</label><div className="relative w-full"><textarea id="prompt" className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg p-4 pr-10 text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" rows={4} placeholder="Tuliskan imajinasi Anda di sini..." value={prompt} onChange={handlePromptChange} disabled={isLoading} />{prompt && <button onClick={handleClearPrompt} className="absolute top-3 right-3 text-slate-500 hover:text-white transition"><Eraser size={20}/></button>}</div></div>
                            <div className="mt-2"><button onClick={handleGenerateImage} disabled={isLoading || !prompt.trim()} className="w-full font-bold py-4 px-8 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20">{isLoading ? (<> <svg className="animate-spin h-6 w-6 text-current mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</>) : (<><Zap className="mr-2"/> Generate Image</>)}</button></div>
                            <div className="space-y-4 pt-6 border-t border-slate-700">
                                <Accordion title="Parameter" icon={<Settings size={16}/>}><div className="grid grid-cols-2 gap-4"><ParameterInput label="Model"><select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageGenModel} onChange={(e) => handleModelChange(e.target.value as ImageGenModel)}>{imageGenModels.map(m => <option key={m} value={m}>{m}</option>)}</select></ParameterInput><ParameterInput label="Gaya Seni">
                                    {/* Perbarui renderisasi select Gaya Seni */}
                                    <select
                                        className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2"
                                        value={artStyle}
                                        onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                                        disabled={imageGenModel === 'dall-e-3'}
                                    >
                                        {/* Mapping melalui artStylesGrouped untuk membuat optgroup dan option */}
                                        {artStylesGrouped.map((group, groupIndex) => (
                                            <optgroup key={group.label} label={group.label}>
                                                {group.options.map((option, optionIndex) => (
                                                    <option key={`${groupIndex}-${optionIndex}`} value={option.value}>
                                                        {option.text}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        ))}
                                    </select>
                                </ParameterInput><ParameterInput label="Kualitas"><select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={quality} onChange={(e) => setQuality(e.target.value as QualityOption)} disabled={imageGenModel === 'dall-e-3'}>{qualityOptions.map(q => <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>)}</select></ParameterInput><ParameterInput label="Jumlah"><select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value) as BatchSize)} disabled={imageGenModel === 'dall-e-3'}>{batchSizes.map(s => <option key={s} value={s}>{s}</option>)}</select></ParameterInput>
                                
                                {/* New Preset Size Selector */}
                                <div className="col-span-2"> {/* This div makes it span two columns */}
                                    <ParameterInput label="Ukuran Preset">
                                        <select
                                            className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2"
                                            value={`${imageWidth}x${imageHeight}`} // Derive selected value from current width/height
                                            onChange={(e) => {
                                                const [widthStr, heightStr] = e.target.value.split('x');
                                                setImageWidth(parseInt(widthStr));
                                                setImageHeight(parseInt(heightStr));
                                            }}
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

                                {/* Existing Width and Height inputs */}
                                <div className="col-span-2 grid grid-cols-2 gap-2">
                                    <ParameterInput label="Width">
                                        <input type="number" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageWidth} onChange={e => setImageWidth(parseInt(e.target.value))} disabled={imageGenModel === 'dall-e-3'}/></ParameterInput>
                                    <ParameterInput label="Height">
                                        <input type="number" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageHeight} onChange={e => setImageHeight(parseInt(e.target.value))} disabled={imageGenModel === 'dall-e-3'}/></ParameterInput>
                                </div>
                                </div></Accordion>

                                {/* Accordion untuk Manajemen Koin (dihapus) */}
                                {/* <Accordion title="Manajemen Koin" icon={<DollarSign size={16}/>} defaultOpen={true}>
                                    <div className="space-y-3">
                                        <p className="text-sm text-slate-400">Anda memiliki <span className="text-yellow-300 font-bold">{userCoins}</span> koin tersisa.</p>
                                        <button
                                            onClick={handleAdminResetClick}
                                            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition flex justify-center items-center gap-2"
                                        >
                                            <RefreshCw size={16}/> Reset Koin Admin (ke {DEFAULT_DAILY_COINS})
                                        </button>
                                        <button
                                            onClick={handleAdminRefillClick}
                                            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-purple-700 transition flex justify-center items-center gap-2"
                                        >
                                            <KeyRound size={16}/> Isi Ulang Koin Admin
                                        </button>
                                        <p className="text-xs text-slate-400">
                                            Fitur ini diperuntukkan bagi administrator. Akses dan fungsionalitas mungkin terbatas.
                                            Jika Anda seorang administrator dan mengalami masalah, mohon konfirmasi dengan tim dukungan melalui halaman kontak.
                                        </p>
                                    </div>
                                </Accordion> */}

                                <Accordion title="Prompt Creator" icon={<Wand2 size={16}/>}><div className="space-y-4"><div className="space-y-3"><input type="text" value={creatorSubject} onChange={e => setCreatorSubject(e.target.value)} placeholder="Subjek Utama..." className="w-full text-sm bg-slate-800 border-slate-600 rounded-md p-2" /><textarea value={creatorDetails} onChange={e => setCreatorDetails(e.target.value)} placeholder="Detail Tambahan..." rows={2} className="w-full text-sm bg-slate-800 border-slate-600 rounded-md p-2" /><button onClick={handleCreatePrompt} disabled={isCreatorLoading || !creatorSubject.trim()} className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-purple-700 transition disabled:opacity-50 flex justify-center items-center">{isCreatorLoading ? "Meningkatkan..." : 'Tingkatkan Prompt'}</button></div>{createdPrompt && ( <div className="border-t border-slate-700 pt-4 space-y-3"> <p className="text-xs font-semibold text-slate-400">Hasil dari AI:</p> <p className="text-sm bg-slate-900 p-3 rounded-md border border-slate-600">{createdPrompt}</p> <div className="flex gap-2"><button onClick={() => { setPrompt(createdPrompt); toast.success('Prompt digunakan!'); }} className="flex-1 bg-sky-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-sky-700 transition flex items-center justify-center gap-2"><CornerDownLeft size={14}/> Gunakan</button><button onClick={() => { navigator.clipboard.writeText(createdPrompt); toast.success('Prompt disalin!'); }} className="flex-1 bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition"><Copy size={14} /> Salin</button></div> </div> )}</div></Accordion>
                                <Accordion title="AI Assistant" icon={<MessageSquare size={16}/>}><ChatBox onPromptFromChat={handlePromptFromChat} /></Accordion>
                                <Accordion title="Image Analyze" icon={<ImageIcon size={16}/>} defaultOpen={false}><ImageAnalyzer onPromptFromAnalysis={handlePromptFromAnalysis} /></Accordion>
                                <Accordion title="Text to Audio" icon={<Volume2 size={16}/>} defaultOpen={false}><TextToAudioConverter /></Accordion>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <div className="bg-slate-800/20 backdrop-blur-sm p-4 rounded-2xl shadow-inner shadow-black/20 install border border-slate-700 h-full min-h-[400px] lg:min-h-[600px] flex flex-col">
                            {/* Tab untuk Hasil Generasi dan Riwayat */}
                            <div className="flex border-b border-slate-700 mb-4 flex-shrink-0">
                                <button onClick={() => setActiveTab('current')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'current' ? 'text-white border-b-2 border-cyan-500' : 'text-slate-400 hover:text-white'}`}>Hasil Generasi</button>
                                <button onClick={() => setActiveTab('history')} className={`py-2 px-4 text-sm font-semibold ${activeTab === 'history' ? 'text-white border-b-2 border-cyan-500' : 'text-slate-400 hover:text-white'}`}>Riwayat ({historyImages.length})</button>
                                {activeTab === 'history' && historyImages.length > 0 && (
                                    <button onClick={handleClearHistory} className="ml-auto py-2 px-4 text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
                                        <Trash2 size={16} /> Hapus Riwayat
                                    </button>
                                )}
                            </div>

                            <div className="flex-grow overflow-y-auto">
                                {isLoading ? (
                                    <div className="h-full flex items-center justify-center">
                                        <div className="m-auto text-center text-slate-400">
                                            <Sparkles className="mx-auto h-12 w-12 animate-pulse" />
                                            <p className="mt-4 font-semibold">Menciptakan keajaiban...</p>
                                        </div>
                                    </div>
                                ) : activeTab === 'current' ? (
                                    generatedImages.length > 0 ? (
                                        <div className="flex-grow">
                                            <h2 className="text-2xl font-bold mb-4 text-white">Hasil Generasi Terbaru</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {generatedImages.map((imageData, index) => (
                                                    <div key={index} className="relative rounded-lg overflow-hidden group aspect-square border-2 border-slate-700 cursor-pointer" onClick={() => handleOpenModal(imageData)}>
                                                        <Image src={imageData.url} alt="Generated AI Image" layout="fill" className="object-cover" unoptimized/>
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                            <p className="text-white font-bold">Lihat Detail</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="m-auto text-center text-slate-500">
                                                <ImageIcon size={64} className="mx-auto" />
                                                <p className="mt-4 font-semibold">Hasil gambar Anda akan muncul di sini</p>
                                                <p className="text-sm">Tulis prompt dan klik "Generate Image"</p>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    historyImages.length > 0 ? (
                                        <div className="flex-grow">
                                            <h2 className="text-2xl font-bold mb-4 text-white">Riwayat Generasi</h2>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {[...historyImages].sort((a, b) => b.timestamp - a.timestamp).map((imageData, index) => (
                                                    <div key={imageData.url + index} className="relative rounded-lg overflow-hidden group aspect-square border-2 border-slate-700 cursor-pointer" onClick={() => handleOpenModal(imageData)}>
                                                        {/* Menggunakan unoptimized karena ini adalah Data URL atau URL eksternal */}
                                                        <Image src={imageData.url} alt="Generated AI Image" layout="fill" className="object-cover" unoptimized/>
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                            <p className="text-white font-bold">Lihat Detail</p>
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                                            {new Date(imageData.timestamp).toLocaleString()}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="m-auto text-center text-slate-500">
                                                <History size={64} className="mx-auto" />
                                                <p className="mt-4 font-semibold">Riwayat generasi Anda akan muncul di sini</p>
                                                <p className="text-sm">Gambar yang Anda buat akan disimpan secara otomatis.</p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    );
}

// --- Wrapper & Ekspor Halaman ---
function AuthenticatedAISuiteWrapper() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xl">Memuat AI Suite...</div>}>
            <AISuitePageContent />
        </Suspense>
    );
}

// --- EKSPOR HALAMAN UTAMA ---
export default function AISuitePage() {
    return <AuthenticatedAISuiteWrapper />;
}
