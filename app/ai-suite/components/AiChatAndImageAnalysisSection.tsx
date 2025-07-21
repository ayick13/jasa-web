// File: app/ai-suite/components/AiChatAndImageAnalysisSection.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { MessageSquare, Bot, Send, ImageIcon, BrainCircuit, Upload, CheckCircle, Copy, Paperclip, ChevronDown } from 'lucide-react';

interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; imageUrl?: string; }

interface AiChatAndImageAnalysisSectionProps {
    onPromptFromChat: (prompt: string) => void;
    onPromptFromAnalysis: (prompt: string) => void;
}

const CodeBlock = ({ language, code }: { language: string, code: string }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast.success("Kode disalin ke clipboard!");
    };
    return (
        <div className="bg-slate-100 dark:bg-slate-900/70 rounded-md my-2 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center px-4 py-1 bg-slate-200 dark:bg-slate-800/50 rounded-t-md">
                <span className="text-xs font-sans text-slate-500 dark:text-slate-400">{language}</span>
                <button onClick={handleCopy} className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1"><Copy size={14}/> Salin</button>
            </div>
            <pre className="p-4 text-sm overflow-x-auto text-slate-600 dark:text-slate-300"><code>{code}</code></pre>
        </div>
    );
};

const ChatBox = ({ onPromptFromChat }: { onPromptFromChat: (prompt: string) => void }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'init', role: 'assistant', content: 'Halo! Anda bisa mengirim teks atau gambar untuk dianalisa.' }]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [availableModels, setAvailableModels] = useState<Record<string, any>>({});
    const [selectedModel, setSelectedModel] = useState('openai');
    const imageInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('/api/get-models');
                if (!response.ok) throw new Error('Failed to fetch models');
                const data = await response.json();
                setAvailableModels(data);
            } catch (error) {
                toast.error("Gagal memuat daftar model AI.");
            }
        };
        fetchModels();
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async () => {
            const base64Image = (reader.result as string);
            const base64Data = base64Image.split(',')[1];

            const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: "Tolong analisa gambar ini.", imageUrl: base64Image };
            const newMessages = [...messages, userMessage];
            setMessages(newMessages);
            setIsThinking(true);

            const assistantMessageId = `assistant-${Date.now()}`;
            setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: "..." }]);

            try {
                const response = await fetch('/api/chat-vision', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Data, messages: newMessages }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }

                const data = await response.json();
                setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: data.reply } : msg ));
            } catch (error: any) {
                toast.error(error.message);
                setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId)); // Remove placeholder message on error
            } finally {
                setIsThinking(false);
            }
        };
        // Clear the file input value to allow re-uploading the same file
        if (event.target) event.target.value = '';
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isThinking) return;

        const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsThinking(true);

        const assistantMessageId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, { id: assistantMessageId, role: 'assistant', content: "..." }]); // Placeholder for assistant reply

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages, model: selectedModel }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal mendapatkan balasan dari AI.');
            }

            const data = await response.json();
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: data.reply } : msg ));
        } catch (error: any) {
            toast.error(error.message);
            setMessages(prev => prev.map(msg => msg.id === assistantMessageId ? { ...msg, content: "Maaf, terjadi kesalahan." } : msg )); // Update with error message
        } finally {
            setIsThinking(false);
        }
    };

    const renderMessageContent = (content: string) => {
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let lastIndex = 0;
        const parts = [];

        let match;
        while ((match = codeBlockRegex.exec(content)) !== null) {
            const [fullMatch, language, code] = match;
            const textBefore = content.substring(lastIndex, match.index);
            if (textBefore) {
                parts.push(<p key={lastIndex} className="whitespace-pre-wrap">{textBefore}</p>);
            }
            parts.push(<CodeBlock key={match.index} language={language || 'bash'} code={code.trim()} />);
            lastIndex = match.index + fullMatch.length;
        }

        const textAfter = content.substring(lastIndex);
        if (textAfter) {
            parts.push(<p key={lastIndex + 1} className="whitespace-pre-wrap">{textAfter}</p>);
        }

        return parts.length > 0 ? parts : <p className="whitespace-pre-wrap">{content}</p>;
    };

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <input type="file" ref={imageInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">AI Assistant</h3>
                <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-700 text-xs text-slate-800 dark:text-white rounded p-1 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-[150px]"
                >
                    {Object.keys(availableModels).length > 0 ? (
                        Object.entries(availableModels).map(([key, modelInfo]) => (
                            <option key={key} value={key}>
                                {(modelInfo as any).name || key}
                            </option>
                        ))
                    ) : (
                        <option value="openai">Memuat model...</option>
                    )}
                </select>
            </div>
            <div className="flex-grow p-4 space-y-4 overflow-y-auto text-slate-600 dark:text-slate-300">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 text-sm ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center flex-shrink-0"><Bot size={16} className="text-cyan-600 dark:text-cyan-400"/></div>}
                        <div className={`p-2.5 rounded-lg max-w-[85%] ${msg.role === 'user' ? 'bg-sky-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300 rounded-bl-none'}`}>
                            {msg.imageUrl && <Image src={msg.imageUrl} alt="User upload" width={200} height={200} className="rounded-md mb-2"/>}
                            {msg.content === "..." && isThinking ? <span className="animate-pulse">...</span> : renderMessageContent(msg.content)}
                            {msg.role === 'assistant' && msg.content && msg.content !== "..." && !msg.content.includes("kesalahan") && (
                                <button
                                    onClick={() => onPromptFromChat(msg.content)}
                                    className="mt-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                                >
                                    Gunakan sebagai Prompt
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Scroll to this element */}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => imageInputRef.current?.click()}
                        title="Upload Gambar"
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition"
                    >
                        <Paperclip size={20}/>
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Tanya sesuatu atau upload gambar..."
                        className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!input.trim() || isThinking}
                        className="p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600 disabled:bg-slate-400 dark:disabled:bg-slate-600 transition"
                    >
                        <Send size={20}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ImageAnalyzer = ({ onPromptFromAnalysis }: { onPromptFromAnalysis: (prompt: string) => void }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setAnalysisResult(null); // Clear previous analysis
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!imageFile) {
            return toast.error('Silakan unggah gambar terlebih dahulu.');
        }

        setIsAnalyzing(true);
        setAnalysisResult(null);
        const toastId = toast.loading('Menganalisis gambar...');

        const reader = new FileReader();
        reader.readAsDataURL(imageFile);

        reader.onload = async () => {
            try {
                // Extract base64 data (remove the data:image/jpeg;base64, prefix)
                const base64Image = (reader.result as string).split(',')[1];

                const response = await fetch('/api/analyze-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ image: base64Image }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Analisis gambar gagal.');
                }

                const data = await response.json();
                setAnalysisResult(data.description);
                toast.success('Analisis berhasil!', { id: toastId });
            } catch (error: any) {
                toast.error(error.message || 'Gagal menganalisis gambar.', { id: toastId });
            } finally {
                setIsAnalyzing(false);
            }
        };
    };

    const handleUseAsPrompt = () => {
        if (analysisResult) {
            onPromptFromAnalysis(analysisResult);
            toast.success('Hasil analisis digunakan sebagai prompt!');
        }
    };

    return (
        <div className="space-y-4">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
                <Upload size={18} /> Pilih Gambar
            </button>
            {imagePreview && (
                <div className="mt-4 space-y-4">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-600">
                    <Image 
                        src={imagePreview} 
                        alt="Pratinjau Gambar" 
                        fill 
                        sizes="50vw"
                        className="object-contain" 
                    />
                </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isAnalyzing ? "Menganalisis..." : 'Analisis Gambar Ini'}
                    </button>
                </div>
            )}
            {analysisResult && (
                <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-600 space-y-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">{analysisResult}</p>
                    <button
                        onClick={handleUseAsPrompt}
                        className="w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition text-sm flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={16}/> Gunakan sebagai Prompt
                    </button>
                </div>
            )}
        </div>
    );
};

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


export const AiChatAndImageAnalysisSection: React.FC<AiChatAndImageAnalysisSectionProps> = ({
    onPromptFromChat,
    onPromptFromAnalysis,
}) => {
    return (
        <div className="space-y-4"> {/* Container for these two accordions */}
            <Accordion title="AI Assistant" icon={<MessageSquare size={16}/>}>
                <ChatBox onPromptFromChat={onPromptFromChat} />
            </Accordion>
            <Accordion title="Image Analyze" icon={<ImageIcon size={16}/>} defaultOpen={false}>
                <ImageAnalyzer onPromptFromAnalysis={onPromptFromAnalysis} />
            </Accordion>
        </div>
    );
};