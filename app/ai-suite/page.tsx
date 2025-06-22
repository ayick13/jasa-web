'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { 
    ArrowLeft, Download, Zap, Eraser, History, Lightbulb, 
    Image as ImageIcon, Upload, X, ChevronDown, ChevronUp, 
    Settings, Copy, Sparkles, Wand2, Search, MessageSquare, Bot, Send, Plus, Save
} from 'lucide-react';
import { Footer } from '../components';

// --- Tipe Data & Konstanta (LENGKAP) ---
const models = ['flux', 'turbo'] as const;
type Model = (typeof models)[number];

const artStyles = ['realistic', 'photographic', 'anime', 'manga', 'pixel-art', 'fantasy', 'sci-fi', 'steampunk', 'cyberpunk', 'cinematic'] as const;
type ArtStyle = (typeof artStyles)[number];

const qualityOptions = ['standar', 'hd', 'ultrahd'] as const;
type QualityOption = (typeof qualityOptions)[number];

const batchSizes = [1, 2, 3, 4] as const;
type BatchSize = (typeof batchSizes)[number];

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface GenerationHistoryEntry {
  id: string;
  prompt: string;
  images: string[];
  timestamp: Date;
}


// --- Komponen-Komponen UI Khusus (LENGKAP) ---

const SettingsAccordion = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="w-full">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-2 px-3 bg-slate-700/50 rounded-lg flex items-center justify-between font-semibold border border-slate-600 hover:bg-slate-700 transition-colors">
                <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2 text-slate-400"/>
                    <span>Pengaturan</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="mt-3 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">{children}</div>}
        </div>
    );
};

const ChatBox = ({ onPromptFromChat }: { onPromptFromChat: (prompt: string) => void }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleNewChat = () => {
        setMessages([]);
        toast.success('Percakapan baru dimulai.');
    };

    const handleSaveChat = () => {
        if (messages.length === 0) return toast.error('Tidak ada percakapan untuk disimpan.');
        const chatHistory = JSON.stringify(messages, null, 2);
        const blob = new Blob([chatHistory], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Riwayat percakapan disimpan!');
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isThinking) return;
        
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsThinking(true);
        
        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: "..." }]);

        try {
            const response = await fetch('/api/enhance-prompt', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: input }),
            });
            if (!response.ok) throw new Error((await response.json()).message || 'Gagal merespons.');
            const data = await response.json();
            const assistantReply = data.enhancedPrompt || "Maaf, saya tidak dapat memproses permintaan Anda saat ini.";
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: assistantReply } : msg));
        } catch (error: any) {
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: `Terjadi kesalahan: ${error.message}` } : msg));
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-800/40 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl shadow-black/20">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center">
                    <MessageSquare className="w-6 h-6 mr-3 text-cyan-400"/>
                    <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleNewChat} title="Mulai Chat Baru" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition"><Plus size={18}/></button>
                    <button onClick={handleSaveChat} title="Simpan Percakapan" className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition"><Save size={18}/></button>
                </div>
            </div>
            <div ref={messagesEndRef} className="flex-grow p-4 space-y-4 overflow-y-auto h-96">
                {messages.length === 0 && <div className="text-center text-slate-500 h-full flex flex-col justify-center items-center"><Bot size={40} className="mb-4"/><p>Mulai percakapan di bawah.</p></div>}
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center flex-shrink-0"><Bot size={18} className="text-cyan-400"/></div>}
                        <div className={`p-3 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-300 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {msg.role === 'assistant' && msg.content && !isThinking && msg.content !== "..." && (
                                <button onClick={() => onPromptFromChat(msg.content)} className="mt-2 text-xs font-semibold text-cyan-400 hover:underline">Gunakan sebagai Prompt</button>
                            )}
                        </div>
                    </div>
                ))}
                {isThinking && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse self-start ml-11"></div>}
            </div>
            <div className="p-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Tanya sesuatu..." className="w-full bg-slate-700 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    <button onClick={handleSendMessage} disabled={!input.trim() || isThinking} className="p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-slate-600 transition">
                        <Send size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Halaman Utama AI Suite ---
export default function AISuitePage() {
    // --- STATE LENGKAP ---
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState<Model>('flux');
    const [artStyle, setArtStyle] = useState<ArtStyle>('realistic');
    const [quality, setQuality] = useState<QualityOption>('standar');
    const [imageWidth, setImageWidth] = useState(1024);
    const [imageHeight, setImageHeight] = useState(1024);
    const [batchSize, setBatchSize] = useState<BatchSize>(1);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [generationHistory, setGenerationHistory] = useState<GenerationHistoryEntry[]>([]);
    const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    
    // --- FUNGSI HANDLER LENGKAP ---

    const handleClearPrompt = useCallback(() => {
        setPrompt('');
        toast.success('Prompt telah dibersihkan.');
    }, []);

    const handleEnhancePrompt = useCallback(async () => {
        if (!prompt.trim()) return toast.error('Silakan isi prompt terlebih dahulu.');
        setIsLoading(true);
        toast.loading('Memperkaya prompt...', { id: 'enhancing' });
        try {
            const response = await fetch('/api/enhance-prompt', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }),
            });
            if (!response.ok) throw new Error((await response.json()).message || 'Gagal memperkaya prompt.');
            const data = await response.json();
            setPrompt(data.enhancedPrompt);
            toast.success('Prompt berhasil diperkaya!', { id: 'enhancing' });
        } catch (err: any) {
            toast.error(err.message, { id: 'enhancing' });
        } finally {
            setIsLoading(false);
        }
    }, [prompt]);

    const handleGenerateImage = useCallback(async () => {
        if (!prompt.trim()) return toast.error('Prompt tidak boleh kosong.');
        setIsLoading(true);
        setGeneratedImages([]);
        toast.loading(`Menghasilkan ${batchSize} gambar...`, { id: 'generating', duration: Infinity });
        
        const styleSuffix = artStyle !== 'realistic' ? `, in the style of ${artStyle.replace('-', ' ')}` : '';
        const qualitySuffix = quality === 'hd' ? ', hd' : quality === 'ultrahd' ? ', 4k, photorealistic' : '';
        const finalPrompt = `${prompt}${styleSuffix}${qualitySuffix}`;
    
        const promises = Array.from({ length: batchSize }, () => {
            const seed = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${imageWidth}&height=${imageHeight}&nologo=true&safe=true&model=${model}&seed=${seed}`;
            
            return fetch(imageUrl)
                .then(res => res.ok ? res.blob().then(URL.createObjectURL) : Promise.resolve(''))
                .catch(err => {
                    console.error('Error generating image:', err);
                    return '';
                });
        });
    
        const results = await Promise.all(promises);
        const validImages = results.filter(Boolean);
    
        if (validImages.length > 0) {
            setGeneratedImages(validImages);
            const newHistoryEntry: GenerationHistoryEntry = {
                id: `gen-${Date.now()}`, prompt: finalPrompt, images: validImages, timestamp: new Date()
            };
            setGenerationHistory(prev => [newHistoryEntry, ...prev]);
            toast.success(`${validImages.length} gambar berhasil dibuat!`, { id: 'generating' }); 
        } else {
            toast.error('Gagal membuat gambar. Coba lagi.', { id: 'generating' }); 
        }
        setIsLoading(false);
    }, [prompt, model, artStyle, quality, imageWidth, imageHeight, batchSize]); 
    
    const handleGenerateSuggestions = useCallback(async () => {
        if (isGeneratingSuggestions) return;
        setIsGeneratingSuggestions(true);
        try {
            const response = await fetch('/api/suggest-prompt', { method: 'POST' });
            if (!response.ok) throw new Error((await response.json()).message);
            const data = await response.json();
            setPromptSuggestions(data.suggestions.slice(0, 3));
        } catch (err) {
            setPromptSuggestions([]);
        } finally {
            setIsGeneratingSuggestions(false);
        }
    }, [isGeneratingSuggestions]);

    const handleUseSuggestion = useCallback((suggestion: string) => {
        setPrompt(suggestion);
        toast.success('Saran digunakan sebagai prompt!');
    }, []);
    
    const handlePromptFromChat = useCallback((chatPrompt: string) => {
        setPrompt(chatPrompt);
        toast.success('Pesan dari asisten digunakan!');
    }, []);
    
    useEffect(() => {
        handleGenerateSuggestions();
    }, [handleGenerateSuggestions]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans" style={{ backgroundImage: `radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.1), transparent 30%), radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.1), transparent 30%)`}}>
            <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}} />
            
            <header className="bg-transparent backdrop-blur-sm sticky top-0 z-50 border-b border-slate-800">
                <div className="container mx-auto px-4 flex justify-between items-center h-20">
                    <Link href="/" className="inline-flex items-center text-slate-300 hover:text-cyan-400 font-semibold transition-colors duration-200">
                        <ArrowLeft className="mr-2" size={20} /> Kembali ke Beranda
                    </Link>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    
                    <div className="lg:col-span-3">
                        <div className="bg-slate-800/40 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl shadow-black/20 border border-slate-700 h-full flex flex-col">
                            <div className="flex-grow">
                                <label htmlFor="prompt" className="block text-slate-300 mb-3 font-bold text-lg flex items-center">
                                    <Wand2 className="w-6 h-6 mr-2 text-cyan-400"/>
                                    Creative Command
                                </label>
                                <textarea id="prompt" className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg p-4 text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" rows={6} placeholder="Contoh: lukisan cyberpunk kota di malam hari..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isLoading} />
                                
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button onClick={handleEnhancePrompt} disabled={isLoading || !prompt.trim()} className="flex items-center justify-center gap-2 p-3 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 text-sm font-semibold"><Sparkles size={16}/> Enhance Prompt</button>
                                    <button onClick={handleClearPrompt} disabled={isLoading} className="flex items-center justify-center gap-2 p-3 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50 text-sm font-semibold"><Eraser size={16}/> Clear</button>
                                </div>

                                <div className="mt-6">
                                    <h4 className="text-sm font-bold text-slate-400 mb-2 flex items-center"><Lightbulb size={16} className="mr-2"/> Butuh Ide?</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        {isGeneratingSuggestions ? <p className="text-xs text-slate-500 animate-pulse">Memuat saran...</p> : 
                                            promptSuggestions.map((s, i) => (
                                                <button key={i} onClick={() => handleUseSuggestion(s)} className="text-xs px-3 py-1 bg-slate-700 rounded-full hover:bg-cyan-600 transition-colors">
                                                    Suggest {i + 1}
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-slate-700">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="md:col-span-1">
                                        <SettingsAccordion>
                                            <div className="space-y-3">
                                                <div>
                                                    <label htmlFor="model" className="block text-xs font-medium mb-1">Model</label>
                                                    <select id="model" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2 focus:ring-cyan-500" value={model} onChange={(e) => setModel(e.target.value as Model)} disabled={isLoading}>
                                                        {models.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="artStyle" className="block text-xs font-medium mb-1">Gaya Seni</label>
                                                    <select id="artStyle" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={artStyle} onChange={(e) => setArtStyle(e.target.value as ArtStyle)} disabled={isLoading}>
                                                        {artStyles.map(s => <option key={s} value={s}>{s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="quality" className="block text-xs font-medium mb-1">Kualitas</label>
                                                    <select id="quality" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={quality} onChange={(e) => setQuality(e.target.value as QualityOption)} disabled={isLoading}>
                                                        {qualityOptions.map(q => <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label htmlFor="batchSize" className="block text-xs font-medium mb-1">Jumlah</label>
                                                    <select id="batchSize" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value) as BatchSize)} disabled={isLoading}>
                                                        {batchSizes.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                  <label className="block text-xs font-medium mb-1">Ukuran</label>
                                                  <div className="flex gap-2">
                                                    <input type="number" placeholder="Width" className="w-1/2 text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageWidth} onChange={e => setImageWidth(parseInt(e.target.value))} disabled={isLoading}/>
                                                    <input type="number" placeholder="Height" className="w-1/2 text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageHeight} onChange={e => setImageHeight(parseInt(e.target.value))} disabled={isLoading}/>
                                                  </div>
                                                </div>
                                            </div>
                                        </SettingsAccordion>
                                    </div>
                                    <div className="md:col-span-2">
                                        <button onClick={handleGenerateImage} disabled={isLoading || !prompt.trim()} className="w-full font-bold py-4 px-8 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20">
                                            {isLoading ? <><svg className="animate-spin h-6 w-6 text-current mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</> : <><Zap className="mr-2"/> Generate</>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <ChatBox onPromptFromChat={handlePromptFromChat} />
                    </div>
                </div>

                {generatedImages.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Hasil Generasi Terbaru</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {generatedImages.map((imageUrl, index) => (
                                <div key={imageUrl} className="relative rounded-lg overflow-hidden group aspect-square border-2 border-slate-700">
                                    <Image src={imageUrl} alt={`Generated Image ${index + 1}`} layout="fill" className="object-cover" unoptimized/>
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <a href={imageUrl} download={`ayick-ai-image-${Date.now()}.png`} className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30"><Download/></a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            
            <Footer />
        </div>
    );
}