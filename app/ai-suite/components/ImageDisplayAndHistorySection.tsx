// File: app/ai-suite/components/ImageDisplayAndHistorySection.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { Download, Sparkles, ImageIcon, History, KeyRound, ExternalLink, Trash2, X, Eye, EyeOff, Copy } from 'lucide-react';

// Import tipe GeneratedImageData dari page.tsx
import type { GeneratedImageData } from '../page'; // <--- PERUBAHAN UTAMA DI SINI

interface ImageDisplayAndHistorySectionProps {
    generatedImages: GeneratedImageData[];
    historyImages: GeneratedImageData[];
    isLoading: boolean;
    activeTab: 'current' | 'history';
    setActiveTab: (tab: 'current' | 'history') => void;
    handleClearHistory: () => void;
    handleOpenModal: (imageData: GeneratedImageData) => void;
    selectedImageData: GeneratedImageData | null;
    isModalOpen: boolean;
    setIsModalOpen: (isOpen: boolean) => void;
    isDalleModalOpen: boolean;
    handleCloseDalleModal: () => void;
    handleSaveDalleKey: (key: string) => void;
}

const ImageDetailModal = ({ isOpen, onClose, imageData }: { isOpen: boolean, onClose: () => void, imageData: GeneratedImageData | null }) => {
    if (!isOpen || !imageData) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col lg:flex-row gap-6 p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors z-10"><X size={24} /></button>
                <div className="flex-shrink-0 lg:w-1/2">
                    <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 rounded-md overflow-hidden">
                        <Image src={imageData.url} alt={imageData.prompt} fill sizes="50vw" className="object-contain" unoptimized/>
                    </div>
                </div>
                <div className="flex-grow lg:w-1/2 overflow-y-auto pr-2 space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Detail Generasi</h3>
                    <div><label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Prompt</label><p className="mt-1 text-base text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/50 p-3 rounded-md">{imageData.prompt}</p></div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><label className="font-semibold text-slate-500 dark:text-slate-400">Model</label><p className="text-slate-800 dark:text-slate-200">{imageData.model}</p></div>
                        <div><label className="font-semibold text-slate-500 dark:text-slate-400">Gaya Seni</label><p className="text-slate-800 dark:text-slate-200">{imageData.isDalle ? 'N/A' : imageData.artStyle}</p></div>
                        <div><label className="font-semibold text-slate-500 dark:text-slate-400">Kualitas</label><p className="text-slate-800 dark:text-slate-200">{imageData.isDalle ? 'N/A' : imageData.quality}</p></div>
                        <div><label className="font-semibold text-slate-500 dark:text-slate-400">Resolusi</label><p className="text-slate-800 dark:text-slate-200">{imageData.width} x {imageData.height}</p></div>
                        <div><label className="font-semibold text-slate-500 dark:text-slate-400">Seed</label><p className="text-slate-800 dark:text-slate-200 break-all">{imageData.seed}</p></div>
                        <div><label className="font-semibold text-slate-500 dark:text-slate-400">Waktu Generasi</label><p className="text-slate-800 dark:text-slate-200">{new Date(imageData.timestamp).toLocaleString()}</p></div>
                    </div>
                    <div className="pt-4 flex flex-col sm:flex-row gap-2">
                        <a href={imageData.url} download={`ayick-ai-${imageData.seed}.png`} className="w-full sm:w-auto flex-1 bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-cyan-700 transition"><Download size={16}/> Unduh</a>
                        <button onClick={() => { navigator.clipboard.writeText(imageData.prompt); toast.success('Prompt disalin!'); }} className="w-full sm:w-auto flex-1 bg-slate-500 dark:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-600 dark:hover:bg-slate-700 transition"><Copy size={16}/> Salin Prompt</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DalleApiKeyModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (key: string) => void }) => {
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    if (!isOpen) return null;
    const handleSave = () => { if (apiKey.trim()) { onSave(apiKey.trim()); } else { toast.error("API Key tidak boleh kosong."); } };
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg max-w-md w-full p-6 relative space-y-4" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors z-10"><X size={20} /></button>
                <div className="flex items-center gap-3"><KeyRound className="text-yellow-500 dark:text-yellow-400" size={24}/><h3 className="text-xl font-bold text-slate-900 dark:text-white">Masukkan API Key OpenAI</h3></div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Model DALL-E 3 memerlukan API Key OpenAI Anda sendiri untuk berfungsi. Key Anda hanya akan disimpan sementara di browser Anda untuk sesi ini.</p>
                <div className="relative w-full">
                    <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                    />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors" aria-label={showApiKey ? 'Sembunyikan API Key' : 'Tampilkan API Key'}>{showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">Bagaimana cara mendapatkan API Key? <ExternalLink size={14}/></a>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} className="bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-4 rounded-lg text-sm">Batal</button>
                    <button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Simpan & Lanjutkan</button>
                </div>
            </div>
        </div>
    );
};


export const ImageDisplayAndHistorySection: React.FC<ImageDisplayAndHistorySectionProps> = ({
    generatedImages,
    historyImages,
    isLoading,
    activeTab,
    setActiveTab,
    handleClearHistory,
    handleOpenModal,
    selectedImageData,
    isModalOpen,
    setIsModalOpen,
    isDalleModalOpen,
    handleCloseDalleModal,
    handleSaveDalleKey,
}) => {
    return (
        <div className="bg-white dark:bg-slate-800/20 backdrop-blur-sm p-4 rounded-2xl shadow-inner dark:shadow-black/20 border border-slate-200 dark:border-slate-700 h-full min-h-[400px] lg:min-h-[600px] flex flex-col">
            <DalleApiKeyModal isOpen={isDalleModalOpen} onClose={handleCloseDalleModal} onSave={handleSaveDalleKey} />
            <ImageDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageData={selectedImageData} />

            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('current')}
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === 'current' ? 'text-slate-900 dark:text-white border-b-2 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Hasil Generasi
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`py-2 px-4 text-sm font-semibold ${activeTab === 'history' ? 'text-slate-900 dark:text-white border-b-2 border-cyan-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    Riwayat ({historyImages.length})
                </button>
                {activeTab === 'history' && historyImages.length > 0 && (
                    <button onClick={handleClearHistory} className="ml-auto py-2 px-4 text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1">
                        <Trash2 size={16} /> Hapus Riwayat
                    </button>
                )}
            </div>
            <div className="flex-grow overflow-y-auto">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                            <Sparkles className="mx-auto h-12 w-12 animate-pulse text-cyan-500" />
                            <p className="mt-4 font-semibold">Menciptakan keajaiban...</p>
                        </div>
                    </div>
                ) : activeTab === 'current' ? (
                    generatedImages.length > 0 ? (
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Hasil Generasi Terbaru</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {generatedImages.map((imageData, index) => (
                                    <div
                                        key={index} // Consider a more stable key if possible, though index is fine here if images are replaced entirely
                                        className="relative rounded-lg overflow-hidden group aspect-square border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                                        onClick={() => handleOpenModal(imageData)}
                                    >
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
                            <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                                <ImageIcon size={64} className="mx-auto" />
                                <p className="mt-4 font-semibold">Hasil gambar Anda akan muncul di sini</p>
                                <p className="text-sm">Tulis prompt dan klik "Generate Image"</p>
                            </div>
                        </div>
                    )
                ) : ( // History tab
                    historyImages.length > 0 ? (
                        <div className="flex-grow">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Riwayat Generasi</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Sort history by timestamp descending (newest first) */}
                                {[...historyImages].sort((a, b) => b.timestamp - a.timestamp).map((imageData, index) => (
                                    <div
                                        key={imageData.url + index} // Use a combination for unique key if URLs can repeat
                                        className="relative rounded-lg overflow-hidden group aspect-square border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                                        onClick={() => handleOpenModal(imageData)}
                                    >
                                        <Image src={imageData.url} alt="Generated AI Image" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" unoptimized/>
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">{new Date(imageData.timestamp).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <div className="m-auto text-center text-slate-500 dark:text-slate-400">
                                <History size={64} className="mx-auto" />
                                <p className="mt-4 font-semibold">Riwayat generasi Anda akan muncul di sini</p>
                                <p className="text-sm">Gambar yang Anda buat akan disimpan secara otomatis.</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};