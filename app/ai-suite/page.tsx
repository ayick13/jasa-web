'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast, Toaster } from 'react-hot-toast';
import { 
    Download, Zap, Eraser, Sparkles, Wand2, MessageSquare, Bot, Send, Plus, Save, Settings, ChevronDown, ImageIcon, BrainCircuit
} from 'lucide-react';

// --- Tipe Data & Konstanta ---
const models = ['flux', 'turbo'] as const;
type Model = (typeof models)[number];
const artStyles = ['realistic', 'photographic', 'anime', 'manga', 'pixel-art', 'fantasy', 'sci-fi', 'steampunk', 'cyberpunk', 'cinematic'] as const;
type ArtStyle = (typeof artStyles)[number];
const qualityOptions = ['standar', 'hd', 'ultrahd'] as const;
type QualityOption = (typeof qualityOptions)[number];
const batchSizes = [1, 2, 3, 4] as const;
type BatchSize = (typeof batchSizes)[number];
interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; }

// --- Komponen UI ---
const ParameterInput = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
        {children}
    </div>
);

const Accordion = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="w-full">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between gap-2 p-3 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold">
                <div className="flex items-center gap-2">
                    {icon}
                    {title}
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="mt-3 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">{children}</div>}
        </div>
    );
};

const ChatBox = ({ onPromptFromChat }: { onPromptFromChat: (prompt: string) => void }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'init', role: 'assistant', content: 'Halo! Saya AI Assistant. Ada yang bisa saya bantu?' }]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    const handleNewChat = () => { setMessages([{ id: 'init-new', role: 'assistant', content: 'Percakapan baru dimulai.' }]); toast.success('Percakapan baru dimulai.'); };
    const handleSaveChat = () => toast.success('Fitur "Simpan Chat" sedang dalam pengembangan.');

    const handleSendMessage = async () => {
        if (!input.trim() || isThinking) return;
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsThinking(true);
        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: "..." }]);
        setTimeout(() => {
            const reply = `Ini adalah respons demonstrasi untuk: "${currentInput}". Fungsi chat sesungguhnya belum terhubung.`;
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: reply } : msg));
            setIsThinking(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[500px] bg-slate-900/50 rounded-lg">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                <h3 className="text-sm font-bold text-white flex items-center">AI Assistant</h3>
                <div className="flex items-center gap-2">
                    <button onClick={handleNewChat} title="Mulai Chat Baru" className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"><Plus size={16}/></button>
                    <button onClick={handleSaveChat} title="Simpan Percakapan" className="p-1 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white"><Save size={16}/></button>
                </div>
            </div>
            <div ref={messagesEndRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-cyan-900 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-cyan-400"/></div>}
                        <div className={`p-2.5 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-300 rounded-bl-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {msg.role === 'assistant' && !msg.content.includes("demonstrasi") && <button onClick={() => onPromptFromChat(msg.content)} className="mt-2 text-xs font-semibold text-cyan-400 hover:underline">Gunakan sebagai Prompt</button>}
                        </div>
                    </div>
                ))}
                {isThinking && <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse self-start ml-9"></div>}
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

// --- Halaman Utama AI Suite ---
export default function AISuitePage() {
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState<Model>('flux');
    const [artStyle, setArtStyle] = useState<ArtStyle>('realistic');
    const [quality, setQuality] = useState<QualityOption>('standar');
    const [imageWidth, setImageWidth] = useState(1024);
    const [imageHeight, setImageHeight] = useState(1024);
    const [batchSize, setBatchSize] = useState<BatchSize>(1);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [creatorSubject, setCreatorSubject] = useState('');
    const [creatorDetails, setCreatorDetails] = useState('');
    
    const handleClearPrompt = useCallback(() => { setPrompt(''); toast.success('Prompt dibersihkan.'); }, []);
    
    const handleUseCreatedPrompt = () => {
        if (!creatorSubject.trim()) return toast.error('Subjek di Prompt Creator tidak boleh kosong.');
        const finalPrompt = `${creatorSubject.trim()}${creatorDetails.trim() ? `, ${creatorDetails.trim()}` : ''}`;
        setPrompt(finalPrompt);
        toast.success('Prompt dari Creator digunakan.');
    };

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
            return fetch(imageUrl).then(res => res.ok ? res.blob().then(URL.createObjectURL) : Promise.resolve('')).catch(() => '');
        });
    
        const results = await Promise.all(promises);
        const validImages = results.filter(Boolean);
    
        if (validImages.length > 0) {
            setGeneratedImages(validImages);
            toast.success(`${validImages.length} gambar berhasil dibuat!`, { id: 'generating' }); 
        } else {
            toast.error('Gagal membuat gambar. Coba lagi.', { id: 'generating' }); 
        }
        setIsLoading(false);
    }, [prompt, model, artStyle, quality, imageWidth, imageHeight, batchSize]); 
    
    const handlePromptFromChat = useCallback((chatPrompt: string) => { setPrompt(chatPrompt); toast.success('Pesan dari asisten digunakan!'); }, []);

    return (
        <div className="font-sans text-slate-200">
            <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' }}} />
            <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* --- HEADING DAN TAGLINE DIKEMBALIKAN DI SINI --- */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white">
                        AI <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300">Image Suite</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Sebuah command center untuk mengubah imajinasi Anda menjadi kenyataan visual.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-800/40 backdrop-blur-md p-6 md:p-8 rounded-2xl shadow-2xl shadow-black/20 border border-slate-700 h-full flex flex-col space-y-6">
                        
                        <div>
                            <label htmlFor="prompt" className="block text-slate-300 mb-3 font-bold text-xl flex items-center"><Zap className="w-7 h-7 mr-3 text-cyan-400"/>Image Generation</label>
                            <div className="relative w-full">
                                <textarea id="prompt" className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg p-4 pr-10 text-slate-100 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition" rows={4} placeholder="Tuliskan imajinasi Anda di sini..." value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isLoading} />
                                {prompt && <button onClick={handleClearPrompt} className="absolute top-3 right-3 text-slate-500 hover:text-white transition"><Eraser size={20}/></button>}
                            </div>
                        </div>
                        
                        <div className="mt-2">
                            <button onClick={handleGenerateImage} disabled={isLoading || !prompt.trim()} className="w-full font-bold py-4 px-8 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white hover:opacity-90 transition-all duration-300 flex items-center justify-center text-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20">
                                {isLoading ? <><svg className="animate-spin h-6 w-6 text-current mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating...</> : <><Zap className="mr-2"/> Generate Image</>}
                            </button>
                        </div>
                        
                        <div className="space-y-4 pt-6 border-t border-slate-700">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Accordion title="Prompt Creator" icon={<Wand2 size={16}/>}>
                                    <div className="space-y-3">
                                        <input type="text" value={creatorSubject} onChange={e => setCreatorSubject(e.target.value)} placeholder="Subjek Utama..." className="w-full text-sm bg-slate-800 border-slate-600 rounded-md p-2" />
                                        <textarea value={creatorDetails} onChange={e => setCreatorDetails(e.target.value)} placeholder="Detail Tambahan..." rows={2} className="w-full text-sm bg-slate-800 border-slate-600 rounded-md p-2" />
                                        <button onClick={handleUseCreatedPrompt} disabled={isLoading || !creatorSubject.trim()} className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-purple-700 transition disabled:opacity-50">Gunakan & Ganti Prompt</button>
                                    </div>
                                </Accordion>
                                <Accordion title="Parameter" icon={<Settings size={16}/>}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <ParameterInput label="Model">
                                            <select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={model} onChange={(e) => setModel(e.target.value as Model)}>
                                                {models.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                                            </select>
                                        </ParameterInput>
                                        <ParameterInput label="Gaya Seni">
                                            <select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={artStyle} onChange={(e) => setArtStyle(e.target.value as ArtStyle)}>
                                                {artStyles.map(s => <option key={s} value={s}>{s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                                            </select>
                                        </ParameterInput>
                                        <ParameterInput label="Kualitas">
                                            <select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={quality} onChange={(e) => setQuality(e.target.value as QualityOption)}>
                                                {qualityOptions.map(q => <option key={q} value={q}>{q.charAt(0).toUpperCase() + q.slice(1)}</option>)}
                                            </select>
                                        </ParameterInput>
                                        <ParameterInput label="Jumlah">
                                            <select className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={batchSize} onChange={(e) => setBatchSize(Number(e.target.value) as BatchSize)}>
                                                {batchSizes.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </ParameterInput>
                                        <div className="col-span-2 grid grid-cols-2 gap-2">
                                            <ParameterInput label="Width">
                                                <input type="number" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageWidth} onChange={e => setImageWidth(parseInt(e.target.value))}/>
                                            </ParameterInput>
                                            <ParameterInput label="Height">
                                                <input type="number" className="w-full text-xs bg-slate-800 border-slate-600 rounded-md p-2" value={imageHeight} onChange={e => setImageHeight(parseInt(e.target.value))}/>
                                            </ParameterInput>
                                        </div>
                                    </div>
                                </Accordion>
                            </div>
                            <Accordion title="AI Assistant" icon={<MessageSquare size={16}/>}>
                                <ChatBox onPromptFromChat={handlePromptFromChat} />
                            </Accordion>
                            <Accordion title="Image Analyze" icon={<ImageIcon size={16}/>}>
                                <div className="text-center p-4">
                                    <p className="text-slate-400 text-sm">Fitur untuk mengubah gambar menjadi prompt sedang dalam pengembangan dan akan segera hadir.</p>
                                </div>
                            </Accordion>
                        </div>
                    </div>

                    {generatedImages.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-3xl font-bold text-center mb-8 text-white">Hasil Generasi</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {generatedImages.map((imageUrl) => (
                                    <div key={imageUrl} className="relative rounded-lg overflow-hidden group aspect-square border-2 border-slate-700">
                                        <Image src={imageUrl} alt="Generated AI Image" layout="fill" className="object-cover" unoptimized/>
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <a href={imageUrl} download={`ayick-ai-image-${Date.now()}.png`} className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30"><Download/></a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}