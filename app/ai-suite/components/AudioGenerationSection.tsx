// File: app/ai-suite/components/AudioGenerationSection.tsx
'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Volume2, ChevronDown } from 'lucide-react';

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

export const AudioGenerationSection: React.FC = () => {
    const [text, setText] = useState('');
    const [voice, setVoice] = useState('alloy');
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleGenerateAudio = async () => {
        if (!text.trim()) return toast.error("Teks tidak boleh kosong.");

        setIsLoading(true);
        setAudioUrl(null); // Clear previous audio
        const toastId = toast.loading("Membuat audio...");

        try {
            const response = await fetch('/api/text-to-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, voice }),
            });

            if (!response.ok) {
                // Attempt to parse error message from response
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Gagal membuat audio.");
                } catch {
                    // If JSON parsing fails, use raw text
                    throw new Error(await response.text());
                }
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            toast.success("Audio berhasil dibuat!", { id: toastId });
        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Accordion title="Text to Audio" icon={<Volume2 size={16}/>} defaultOpen={false}>
            <div className="space-y-4">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Masukkan teks yang ingin diubah menjadi suara..."
                    rows={5}
                    className="w-full text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-white"
                />
                <div className="grid grid-cols-1 gap-4">
                    <ParameterInput label="Jenis Suara">
                        <select
                            value={voice}
                            onChange={e => setVoice(e.target.value)}
                            className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-md p-2 text-slate-800 dark:text-white"
                        >
                            <option value="alloy">Alloy</option>
                            <option value="echo">Echo</option>
                            <option value="fable">Fable</option>
                            <option value="onyx">Onyx</option>
                            <option value="nova">Nova</option>
                            <option value="shimmer">Shimmer</option>
                        </select>
                    </ParameterInput>
                </div>
                <button
                    onClick={handleGenerateAudio}
                    disabled={isLoading || !text.trim()}
                    className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition disabled:opacity-50 flex justify-center items-center"
                >
                    {isLoading ? "Membuat..." : "Buat Audio"}
                </button>
                {audioUrl && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                        <audio controls src={audioUrl} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>
        </Accordion>
    );
};