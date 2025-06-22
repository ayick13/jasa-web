'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import { 
    Download, Zap, Eraser, Sparkles, Wand2, MessageSquare, Bot, Send, Plus, Save, Settings, 
    ChevronDown, ImageIcon, BrainCircuit, Upload, CheckCircle, Copy, CornerDownLeft, X
} from 'lucide-react';

// --- Tipe Data & Konstanta ---
const imageGenModels = ['flux', 'turbo'] as const;
type ImageGenModel = (typeof imageGenModels)[number];
const artStyles = ['realistic', 'photographic', 'anime', 'manga', 'pixel-art', 'fantasy', 'sci-fi', 'steampunk', 'cyberpunk', 'cinematic'] as const;
type ArtStyle = (typeof artStyles)[number];
const qualityOptions = ['standar', 'hd', 'ultrahd'] as const;
type QualityOption = (typeof qualityOptions)[number];
const batchSizes = [1, 2, 3, 4] as const;
type BatchSize = (typeof batchSizes)[number];
interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; }
interface GeneratedImageData {
    url: string;
    prompt: string;
    model: ImageGenModel;
    artStyle: ArtStyle;
    quality: QualityOption;
    width: number;
    height: number;
    seed: string;
}

// --- Komponen UI ---
const ParameterInput = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div><label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>{children}</div>
);
const Accordion = ({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="w-full">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between gap-2 p-3 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold">
                <div className="flex items-center gap-2">{icon}{title}</div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="mt-3 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">{children}</div>}
        </div>
    );
};

// --- Komponen ChatBox ---
const ChatBox = ({ onPromptFromChat }: { onPromptFromChat: (prompt: string) => void }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'init', role: 'assistant', content: 'Halo! Silakan pilih model di atas dan ajukan pertanyaan.' }]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [availableModels, setAvailableModels] = useState<Record<string, any>>({});
    const [selectedModel, setSelectedModel] = useState('openai');
    const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('/api/get-models');
                if (!response.ok) throw new Error('Failed to fetch models');
                const data = await response.json();
                setAvailableModels(data);
            } catch (error) { toast.error("Gagal memuat daftar model AI."); }
        };
        fetchModels();
    }, []);

    const handleSendMessage = async () => {
        if (!input.trim() || isThinking) return;
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);
        const assistantMessageId = `assistant-${Date.now()}`;
        setStreamingMessageId(assistantMessageId); 
        setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: "" }]);

        try {
            const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages, model: selectedModel }), });
            if (!response.ok || !response.body) { const errorData = await response.json(); throw new Error(errorData.error || 'Gagal memulai koneksi streaming.'); }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.startsWith('data:'));
                for (const line of lines) {
                    const dataStr = line.substring(5).trim();
                    if (dataStr === '[DONE]') break;
                    try {
                        const parsed = JSON.parse(dataStr);
                        const content = parsed.choices?.[0]?.delta?.content || "";
                        if (content) {
                            setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: msg.content + content } : msg ));
                        }
                    } catch (e) {}
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan saat streaming.");
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: "Maaf, terjadi kesalahan." } : msg ));
        } finally {
            setIsThinking(false);
            setStreamingMessageId(null); 
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-slate-900/50 rounded-lg">
            <div className="p-3 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                <h3 className="text-sm font-bold text-white flex items-center">AI Assistant</h3>
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="bg-slate-700 text-xs text-white rounded p-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[150px]">
                    {Object.keys(availableModels).length > 0 ? ( Object.entries(availableModels).map(([key, modelInfo]) => (<option key={key} value={key}>{modelInfo.name || key}</option>)) ) : ( <option value="openai">Memuat model...</option> )}
                </select>
            </div>
            <div ref={messagesEndRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-cyan-900 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-cyan-400"/></div>}
                        <div className={`p-2.5 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-300 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.content}{msg.id === streamingMessageId && isThinking && <span className="animate-pulse">▍</span>}</p>
                            {msg.role === 'assistant' && msg.content && !msg.content.includes("kesalahan") && <button onClick={() => onPromptFromChat(msg.content)} className="mt-2 text-xs font-semibold text-cyan-400 hover:underline">Gunakan sebagai Prompt</button>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Tanya sesuatu..." className="w-full bg-slate-700 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <button onClick={handleSendMessage} disabled={!input.trim() || isThinking} className="p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-slate-600 transition"><Send size={20}/></button>
                </div>
            </div>
        </div>
    );
};

// --- Komponen ImageAnalyzer ---
const ImageAnalyzer = ({ onPromptFromAnalysis }: { onPromptFromAnalysis: (prompt: string) => void }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { setImageFile(file); setAnalysisResult(null); const reader = new FileReader(); reader.onloadend = () => setImagePreview(reader.result as string); reader.readAsDataURL(file); } };
    const handleAnalyze = async () => {
        if (!imageFile) return toast.error('Silakan unggah gambar terlebih dahulu.');
        setIsAnalyzing(true); setAnalysisResult(null); const toastId = toast.loading('Menganalisis gambar...');
        const reader = new FileReader(); reader.readAsDataURL(imageFile);
        reader.onload = async () => {
            try {
                const base64Image = (reader.result as string).split(',')[1];
                const response = await fetch('/api/analyze-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64Image }) });
                if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || 'Analisis gambar gagal.'); }
                const data = await response.json(); setAnalysisResult(data.description);
                toast.success('Analisis berhasil!', { id: toastId });
            } catch (error: any) { toast.error(error.message || 'Gagal menganalisis gambar.', { id: toastId }); } finally { setIsAnalyzing(false); }
        };
    };
    const handleUseAsPrompt = () => { if (analysisResult) { onPromptFromAnalysis(analysisResult); toast.success('Hasil analisis digunakan sebagai prompt!'); } };
    return (
        <div className="space-y-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-600 transition"><Upload size={18} /> Pilih Gambar</button>
            {imagePreview && (
                <div className="mt-4 space-y-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-slate-600"><Image src={imagePreview} alt="Pratinjau Gambar" layout="fill" objectFit="contain" /></div>
                    <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2">{isAnalyzing ? "Menganalisis..." : 'Analisis Gambar Ini'}</button>
                </div>
            )}
            {analysisResult && (
                <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-600 space-y-3">
                    <p className="text-sm text-slate-300">{analysisResult}</p>
                    <button onClick={handleUseAsPrompt} className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition text-sm flex items-center justify-center gap-2"><CheckCircle size={16}/> Gunakan sebagai Prompt</button>
                </div>
            )}
        </div>
    );
};

// --- Komponen Modal ---
const ImageDetailModal = ({ isOpen, onClose, imageData }: { isOpen: boolean, onClose: () => void, imageData: GeneratedImageData | null }) => {
    if (!isOpen || !imageData) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col lg:flex-row gap-6 p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"><X size={24} /></button>
                <div className="flex-shrink-0 lg:w-1/2"><div className="relative aspect-square w-full bg-slate-900 rounded-md overflow-hidden"><Image src={imageData.url} alt={imageData.prompt} layout="fill" className="object-contain" /></div></div>
                <div className="flex-grow lg:w-1/2 overflow-y-auto pr-2 space-y-4">
                    <h3 className="text-2xl font-bold text-white">Detail Generasi</h3>
                    <div><label className="text-sm font-semibold text-slate-400">Prompt</label><p className="mt-1 text-base text-slate-200 bg-slate-700/50 p-3 rounded-md">{imageData.prompt}</p></div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><label className="font-semibold text-slate-400">Model</label><p className="text-slate-200">{imageData.model}</p></div>
                        <div><label className="font-semibold text-slate-400">Gaya Seni</label><p className="text-slate-200">{imageData.artStyle}</p></div>
                        <div><label className="font-semibold text-slate-400">Kualitas</label><p className="text-slate-200">{imageData.quality}</p></div>
                        <div><label className="font-semibold text-slate-400">Resolusi</label><p className="text-slate-200">{imageData.width} x {imageData.height}</p></div>
                        <div><label className="font-semibold text-slate-400">Seed</label><p className="text-slate-200 break-all">{imageData.seed}</p></div>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row gap-2">
                        <a href={imageData.url} download={`ayick-ai-${imageData.seed}.png`} className="w-full sm:w-auto flex-1 bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition"><Download size={16}/> Unduh</a>
                        <button onClick={() => { navigator.clipboard.writeText(imageData.prompt); toast.success('Prompt disalin!'); }} className="w-full sm:w-auto flex-1 bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-700 transition"><Copy size={16}/> Salin Prompt</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Komponen Utama Halaman ---
function AISuitePageContent() {
    const searchParams = useSearchParams();
    const [prompt, setPrompt] = useState(searchParams.get('prompt') || '');
    const [imageGenModel, setImageGenModel] = useState<ImageGenModel>('flux');
    const [artStyle, setArtStyle] = useState<ArtStyle>('realistic');
    const [quality, setQuality] = useState<QualityOption>('standar');
    const [imageWidth, setImageWidth] = useState(1024);
    const [imageHeight, setImageHeight] = useState(1024);
    const [batchSize, setBatchSize] = useState<BatchSize>(1);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatorLoading, setIsCreatorLoading] = useState(false);
    const [creatorSubject, setCreatorSubject] = useState('');
    const [creatorDetails, setCreatorDetails] = useState('');
    const [createdPrompt, setCreatedPrompt] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageData, setSelectedImageData] = useState<GeneratedImageData | null>(null);

    useEffect(() => { const urlPrompt = searchParams.get('prompt'); if (urlPrompt && urlPrompt !== prompt) { setPrompt(urlPrompt); toast.success('Prompt dari halaman utama dimuat!'); } }, [searchParams, prompt]);
    const handleClearPrompt = useCallback(() => { setPrompt(''); toast.success('Prompt dibersihkan.'); }, []);
    
    const handleCreatePrompt = async () => {
        if (!creatorSubject.trim()) return toast.error('Subjek di Prompt Creator tidak boleh kosong.');
        setIsCreatorLoading(true); setCreatedPrompt(null);
        const toastId = toast.loading('AI sedang membuat prompt...');
        try {
            const response = await fetch('/api/enhance-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: creatorSubject, details: creatorDetails }) });
            if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.message || "Gagal membuat prompt dari AI."); }
            const data = await response.json();
            setCreatedPrompt(data.prompt); 
            toast.success('Prompt berhasil ditingkatkan!', { id: toastId });
        } catch (error: any) { toast.error(error.message || "Gagal menghubungi AI.", { id: toastId }); } finally { setIsCreatorLoading(false); }
    };

    const handleGenerateImage = useCallback(async () => {
        if (!prompt.trim()) return toast.error('Prompt tidak boleh kosong.');
        setIsLoading(true); setGeneratedImages([]);
        toast.loading(`Menghasilkan ${batchSize} gambar...`, { id: 'generating', duration: Infinity });
        const styleSuffix = artStyle !== 'realistic' ? `, in the style of ${artStyle.replace('-', ' ')}` : '';
        const qualitySuffix = quality === 'hd' ? ', hd' : quality === 'ultrahd' ? ', 4k, photorealistic' : '';
        const finalPrompt = `${prompt}${styleSuffix}${qualitySuffix}`;
        const promises = Array.from({ length: batchSize }, () => {
            const seed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${imageWidth}&height=${imageHeight}&nologo=true&safe=true&model=${imageGenModel}&seed=${seed}`;
            return fetch(imageUrl)
                .then(res => res.ok ? res.blob().then(URL.createObjectURL) : Promise.resolve(null))
                .then(blobUrl => blobUrl ? ({ url: blobUrl, prompt: finalPrompt, model: imageGenModel, artStyle: artStyle, quality: quality, width: imageWidth, height: imageHeight, seed: seed }) : null)
                .catch(() => null);
        });
        const results = await Promise.all(promises);
        const validImages = results.filter((img): img is GeneratedImageData => img !== null);
        if (validImages.length > 0) { setGeneratedImages(validImages); toast.success(`${validImages.length} gambar berhasil dibuat!`, { id: 'generating' }); } else { toast.error('Gagal membuat gambar. Coba lagi.', { id: 'generating' }); }
        setIsLoading(false);
    }, [prompt, imageGenModel, artStyle, quality, imageWidth, imageHeight, batchSize]);

    const handleOpenModal = (imageData: GeneratedImageData) => { setSelectedImageData(imageData); setIsModalOpen(true); };
    const handlePromptFromChat = useCallback((chatPrompt: string) => { setPrompt(chatPrompt); toast.success('Pesan dari asisten digunakan!'); }, []);
    const handlePromptFromAnalysis = useCallback((analysisPrompt: string) => { setPrompt(analysisPrompt); }, []);
    
    return (
        <Fragment>
            <ImageDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageData={selectedImageData} />
            <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}} />
            <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12"><h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">Image Suite</span></h1><p className="text-lg text-slate-400 max-w-2xl mx-auto">Sebuah command center untuk mengubah imajinasi Anda menjadi kenyataan visual.</p></div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Kolom Kiri - Kontrol */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-2xl shadow-2xl shadow-black/20 border border-slate-700 h-full flex flex-col space-y-6">
                            <div>
                                <label htmlFor="prompt" className="block text-slate-300 mb-3 font-bold text-xl flex items-center"><Zap className="w-7 h-7 mr-3 text-cyan-400"/>Image Generation</label>
                                <div className="relative w-full">
                                    <textarea id="prompt" className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg p-4 pr-10 text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" rows={4} placeholder="Tuliskan imajinasi Anda di sini..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isLoading} />
                                    {prompt && <button onClick={handleClearPrompt} className="absolute top-3 right-3 text-slate-500 hover:text-white transition"><Eraser size={20}/></button>}
                                </div>
                            </div>
                            <div className="mt-2"><button onClick={handleGenerateImage} disabled={isLoading || !prompt.trim()} className="w-full font-bold py-4 px-8 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20">{isLoading ? (<> <svg className="animate-spin h-6 w-6 text-current mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</>) : (<><Zap className="mr-2"/> Generate Image</>)}</button></div>
                            <div className="space-y-4 pt-6 border-t border-slate-700">
                                <Accordion title="Prompt Creator" icon={<Wand2 size={16}/>}>
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            <input type="text" value={creatorSubject} onChange={e => setCreatorSubject(e.target.value)} placeholder="Subjek Utama..." className="w-full text-sm bg-slate-800 border-slate-600 rounded-md p-2" />
                                            <textarea value={creatorDetails} onChange={e => setCreatorDetails(e.target.value)} placeholder="Detail Tambahan..." rows={2} className="w-full text-sm bg-slate-800 border-slate-600 rounded-md p-2" />
                                            <button onClick={handleCreatePrompt} disabled={isCreatorLoading || !creatorSubject.trim()} className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-purple-700 transition disabled:opacity-50 flex justify-center items-center">{isCreatorLoading ? "Meningkatkan..." : 'Tingkatkan Prompt'}</button>
                                        </div>
                                        {createdPrompt && (
                                            <div className="border-t border-slate-700 pt-4 space-y-3">
                                                <p className="text-xs font-semibold text-slate-400">Hasil dari AI:</p>
                                                <p className="text-sm bg-slate-900 p-3 rounded-md border border-slate-600">{createdPrompt}</p>
                                                <div className="flex gap-2">
                                                    <button onClick={() => { setPrompt(createdPrompt); toast.success('Prompt digunakan!'); }} className="flex-1 bg-sky-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-sky-700 transition flex items-center justify-center gap-2"><CornerDownLeft size={14}/> Gunakan</button>
                                                    <button onClick={() => { navigator.clipboard.writeText(createdPrompt); toast.success('Prompt disalin!'); }} className="flex-1 bg-slate-600 text-white py-2 rounded-lg font-semibold text-xs hover:bg-slate-700 transition flex items-center justify-center gap-2"><Copy size={14} /> Salin</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Accordion>
                                <Accordion title="Parameter" icon={<Settings size={16}/>}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ParameterInput label="Model"><select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageGenModel} onChange={(e) => setImageGenModel(e.target.value as ImageGenModel)}>{imageGenModels.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}</select></ParameterInput>
                                        <ParameterInput label="Gaya Seni"><select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={artStyle} onChange={(e) => setArtStyle(e.target.value as ArtStyle)}>{artStyles.map(s => <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}</select></ParameterInput>
                                        <ParameterInput label="Kualitas"><select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={quality} onChange={(e) => setQuality(e.target.value as QualityOption)}>{qualityOptions.map(q => <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>)}</select></ParameterInput>
                                        <ParameterInput label="Jumlah"><select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value) as BatchSize)}>{batchSizes.map(s => <option key={s} value={s}>{s}</option>)}</select></ParameterInput>
                                        <div className="col-span-2 grid grid-cols-2 gap-2"><ParameterInput label="Width"><input type="number" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageWidth} onChange={e => setImageWidth(parseInt(e.target.value))}/></ParameterInput><ParameterInput label="Height"><input type="number" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageHeight} onChange={e => setImageHeight(parseInt(e.target.value))}/></ParameterInput></div>
                                    </div>
                                </Accordion>
                                <Accordion title="AI Assistant" icon={<MessageSquare size={16}/>}><ChatBox onPromptFromChat={handlePromptFromChat} /></Accordion>
                                <Accordion title="Image Analyze" icon={<ImageIcon size={16}/>} defaultOpen={false}><ImageAnalyzer onPromptFromAnalysis={handlePromptFromAnalysis} /></Accordion>
                            </div>
                        </div>
                    </div>
                    
                    {/* === PERBAIKAN UTAMA: Kolom Kanan dengan Frame/Placeholder === */}
                    <div className="lg:col-span-3">
                        <div className="bg-slate-800/20 backdrop-blur-sm p-4 rounded-2xl shadow-inner shadow-black/20 border border-slate-700 h-full min-h-[400px] lg:min-h-0 flex flex-col">
                            {isLoading ? (
                                <div className="m-auto text-center text-slate-400">
                                   <Sparkles className="mx-auto h-12 w-12 animate-pulse" />
                                   <p className="mt-4 font-semibold">Menciptakan keajaiban...</p>
                                </div>
                            ) : generatedImages.length > 0 ? (
                                <div className="flex-grow">
                                    <h2 className="text-2xl font-bold mb-4 text-white">Hasil Generasi</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {generatedImages.map((imageData) => (
                                            <div key={imageData.url} className="relative rounded-lg overflow-hidden group aspect-square border-2 border-slate-700 cursor-pointer" onClick={() => handleOpenModal(imageData)}>
                                                <Image src={imageData.url} alt={imageData.prompt} layout="fill" className="object-cover" unoptimized/>
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><p className="text-white font-bold">Lihat Detail</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="m-auto text-center text-slate-500">
                                    <ImageIcon size={64} className="mx-auto" />
                                    <p className="mt-4 font-semibold">Hasil gambar Anda akan muncul di sini</p>
                                    <p className="text-sm">Tulis prompt dan klik "Generate Image"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    );
}

// --- Wrapper & Ekspor Halaman ---
export default function AISuitePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xl">Memuat AI Suite...</div>}>
            <AISuitePageContent />
        </Suspense>
    );
}