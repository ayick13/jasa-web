'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script'; // Untuk Cloudflare Turnstile
// PERBAIKAN: Tambahkan kembali X ke impor
import { ArrowLeft, Download, Zap, Eraser, History, User, Mail, Code, Briefcase, Tag, Star, Home, Layers, Rss, Github, Linkedin, Instagram, Facebook, ChevronDown, ChevronUp, Lightbulb, Image as ImageIcon, Upload, X } from 'lucide-react'; 
import { toast } from 'react-hot-toast'; // Untuk notifikasi

// --- Data & Tipe untuk AI Suite ---
const models = ['flux', 'turbo'] as const;
type Model = (typeof models)[number];
const batchSizes = [1, 2, 4];
const qualityOptions = ['standar', 'hd', 'ultrahd'] as const;
type QualityOption = (typeof qualityOptions)[number];

// Tipe untuk riwayat generasi
interface GenerationHistoryEntry {
  id: string;
  prompt: string;
  enhancedPrompt: string;
  model: Model;
  width: number;
  height: number;
  quality: QualityOption; 
  images: string[]; // URL objek gambar
  timestamp: Date;
}

// Komponen ZoomModal telah dihapus sepenuhnya (tidak ada di sini)


const AISuitePage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [model, setModel] = useState<Model>('flux');
  const [imageWidth, setImageWidth] = useState<number>(1024);
  const [imageHeight, setImageHeight] = useState<number>(1024);
  const [imageQuality, setImageQuality] = useState<QualityOption>('standar'); 
  const [batchSize, setBatchSize] = useState(1);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationHistory, setGenerationHistory] = useState<GenerationHistoryEntry[]>([]);

  // State untuk Prompt Creator
  const [subjectPrompt, setSubjectPrompt] = useState('');
  const [additionalDetailsPrompt, setAdditionalDetailsPrompt] = useState('');
  const [showPromptCreator, setShowPromptCreator] = useState(false); // Default false (tertutup)

  // State baru untuk Prompt Suggestions
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);

  // State baru untuk Image Analysis
  const [showImageAnalysisModal, setShowImageAnalysisModal] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  // State untuk Contact Form
  const [contactStatus, setContactStatus] = useState('');
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);


  // Fungsi untuk menghasilkan seed acak untuk gambar yang berbeda
  const generateSeed = useCallback(() => `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`, []);

  // Effect untuk membersihkan URL objek saat komponen unmount atau gambar diganti
  useEffect(() => {
    return () => {
      generatedImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [generatedImages]);

  // Muat riwayat dari localStorage saat pertama kali dimuat
  useEffect(() => {
    const savedHistory = localStorage.getItem('aiSuiteHistory');
    if (savedHistory) {
      setGenerationHistory(JSON.parse(savedHistory));
    }
    // Generate suggestions on initial load
    handleGenerateSuggestions();
  }, []);

  // Simpan riwayat ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem('aiSuiteHistory', JSON.stringify(generationHistory));
  }, [generationHistory]);

  // Fungsi untuk mendapatkan suffix prompt berdasarkan kualitas
  const getQualityPromptSuffix = (quality: QualityOption) => {
    switch (quality) {
      case 'hd': return ', high definition, detailed, sharp focus';
      case 'ultrahd': return ', ultra quality, 4K, highly detailed, cinematic lighting, photorealistic';
      case 'standar': default: return '';
    }
  };

  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error(`Prompt tidak boleh kosong untuk diperkaya.`); 
      return;
    }
    setIsLoading(true);
    setError(null);

    const qualitySuffix = getQualityPromptSuffix(imageQuality); // Ambil suffix kualitas

    try {
      // Panggil API route lokal untuk enhance prompt
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt + qualitySuffix }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Gagal memperkaya prompt:`, errorData); 
        toast.error(`Gagal memperkaya prompt dari AI: ${errorData.message || 'Terjadi kesalahan.'}`); 
        return;
      }

      const data = await response.json();
      if (data.enhancedPrompt) { 
        setEnhancedPrompt(data.enhancedPrompt); 
        toast.success(`Prompt berhasil diperkaya!`); 
      } else {
        toast.error(`Gagal mendapatkan prompt yang diperkaya.`); 
      }
    } catch (err: any) {
      console.error(`Error memperkaya prompt:`, err); 
      toast.error(`Terjadi kesalahan saat memperkaya prompt.`); 
    } finally {
      setIsLoading(false);
    }
  }, [prompt, imageQuality]);

  const handleGenerateImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    const qualitySuffix = getQualityPromptSuffix(imageQuality); 
    const finalPrompt = (enhancedPrompt || prompt) + qualitySuffix; 

    if (!finalPrompt.trim()) {
      setIsLoading(false);
      toast.error(`Prompt tidak boleh kosong.`); 
      return;
    }

    const promises: Promise<string>[] = [];
    for (let i = 0; i < batchSize; i++) {
      const seed = generateSeed();
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
        finalPrompt
      )}?width=${imageWidth}&height=${imageHeight}&nologo=true&safe=true&model=${model}&referrer=ariftirtana.my.id&seed=${seed}`;

      promises.push(
        fetch(imageUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load image from Pollinations.ai: ${response.status} ${response.statusText}`);
            }
            return response.blob();
          })
          .then(blob => URL.createObjectURL(blob))
          .catch(err => {
            console.error(`Error generating image ${i + 1}:`, err); 
            toast.error(`Gagal membuat gambar ${i + 1}.`); 
            return '';
          })
      );
    }

    const results = await Promise.all(promises);
    const validImages = results.filter(url => url !== '');

    if (validImages.length > 0) {
      setGeneratedImages(validImages);

      const newHistoryEntry: GenerationHistoryEntry = {
        id: `gen-${Date.now()}`,
        prompt: prompt,
        enhancedPrompt: enhancedPrompt,
        model: model,
        width: imageWidth,
        height: imageHeight,
        quality: imageQuality, 
        images: validImages,
        timestamp: new Date(),
      };
      setGenerationHistory(prevHistory => [newHistoryEntry, ...prevHistory]);

      toast.success(`${validImages.length} gambar berhasil dibuat!`); 
    } else {
      toast.error(`Gagal membuat gambar. Coba lagi.`); 
    }

    setIsLoading(false);
  }, [prompt, enhancedPrompt, model, imageWidth, imageHeight, imageQuality, batchSize, generateSeed]); 

  const handleDownload = useCallback((imageUrl: string) => {
    if (imageUrl.startsWith('blob:')) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `ai_image_${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Gambar berhasil diunduh!`); 
    } else {
        window.open(imageUrl, '_blank');
        toast.success(`Gambar dibuka di tab baru untuk diunduh.`); 
    }
  }, []);

  const handleClearPrompt = useCallback(() => {
    setPrompt('');
    setEnhancedPrompt('');
    toast('Prompt telah dibersihkan.', { icon: '✨' });
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Anda yakin ingin menghapus semua riwayat generasi? Tindakan ini tidak dapat dibatalkan.')) {
        setGenerationHistory([]);
        toast.success(`Riwayat telah dibersihkan!`); 
    }
  }, []); 

  const handlePresetSize = useCallback((width: number, height: number) => {
    setImageWidth(width);
    setImageHeight(height);
  }, []);

  // --- Prompt Creator Handlers ---
  const handleGenerateCombinedPromptText = useCallback(() => {
    if (!subjectPrompt.trim()) {
      return ''; 
    }
    return `${subjectPrompt.trim()}${additionalDetailsPrompt.trim() ? `, ${additionalDetailsPrompt.trim()}` : ''}`;
  }, [subjectPrompt, additionalDetailsPrompt]);

  const handleCopyPrompt = useCallback(() => {
    const combinedPrompt = handleGenerateCombinedPromptText();
    if (combinedPrompt) {
      navigator.clipboard.writeText(combinedPrompt)
        .then(() => toast.success(`Prompt berhasil disalin!`)) 
        .catch(() => toast.error(`Gagal menyalin prompt.`)); 
    } else {
      toast.error(`Subjek tidak boleh kosong untuk disalin.`); 
    }
  }, [handleGenerateCombinedPromptText]);

  const handleUsePrompt = useCallback(async () => {
    const combinedPrompt = handleGenerateCombinedPromptText();
    if (!combinedPrompt) {
      toast.error(`Subjek tidak boleh kosong untuk digunakan.`); 
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Panggil API route lokal untuk enhance prompt dari Prompt Creator
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal memperkaya prompt dari AI.`); 
      }

      const data = await response.json();
      if (data.enhancedPrompt) { 
        setPrompt(data.enhancedPrompt); 
        setEnhancedPrompt(data.enhancedPrompt); 
        toast.success(`Prompt diperkaya dan digunakan di generator!`); 
      } else {
        toast.error(`Gagal mendapatkan prompt yang diperkaya.`); 
      }
    } catch (err: any) {
      console.error(`Error menggunakan prompt creator:`, err); 
      toast.error(`Gagal memperkaya prompt: ${err.message || 'Terjadi kesalahan.'}`); 
    } finally {
      setIsLoading(false);
    }
  }, [handleGenerateCombinedPromptText, setPrompt, setEnhancedPrompt]);

  // --- Prompt Suggestions Handlers ---
  const handleGenerateSuggestions = useCallback(async (contextPrompt?: string) => {
    setIsGeneratingSuggestions(true);
    try {
      const response = await fetch('/api/suggest-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contextPrompt }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal mendapatkan saran prompt.`);
      }
      const data = await response.json();
      if (data.suggestions && Array.isArray(data.suggestions)) {
        setPromptSuggestions(data.suggestions);
        toast.success('Saran prompt baru berhasil dibuat!');
      } else {
        toast.error('Gagal mendapatkan saran prompt.');
      }
    } catch (err: any) {
      console.error('Error generating prompt suggestions:', err);
      toast.error(`Terjadi kesalahan saat mendapatkan saran prompt: ${err.message || 'Coba lagi.'}`);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, []);

  const handleUseSuggestion = useCallback((suggestion: string) => {
    setPrompt(suggestion);
    setEnhancedPrompt(''); // Reset enhanced prompt when using a suggestion
    toast.success('Saran prompt digunakan!');
  }, []);

  // --- Image Analysis Handlers ---
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simple compression/resizing logic for client-side (optional, for large images)
        const img = new (window as any).Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to JPEG for sending
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Adjust quality
          setUploadedImagePreview(dataUrl);
          setImageAnalysisResult(null); // Clear previous result
        };
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleAnalyzeImage = useCallback(async () => {
    if (!uploadedImagePreview) {
      toast.error('Mohon unggah gambar terlebih dahulu.');
      return;
    }
    setIsAnalyzingImage(true);
    setImageAnalysisResult(null);
    setError(null);

    try {
      const base64Image = uploadedImagePreview.split(',')[1]; // Dapatkan bagian base64
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menganalisis gambar.');
      }

      const data = await response.json();
      if (data.description) {
        setImageAnalysisResult(data.description);
        toast.success('Analisis gambar berhasil!');
      } else {
        toast.error('Gagal mendapatkan deskripsi gambar.');
      }
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      toast.error(`Terjadi kesalahan saat menganalisis gambar: ${err.message || 'Coba lagi.'}`);
    } finally {
      setIsAnalyzingImage(false);
    }
  }, [uploadedImagePreview]);

  const handleUseAnalysisAsPrompt = useCallback(() => {
    if (imageAnalysisResult) {
      setPrompt(imageAnalysisResult);
      setEnhancedPrompt('');
      setShowImageAnalysisModal(false); // Tutup modal setelah digunakan
      toast.success('Deskripsi gambar digunakan sebagai prompt!');
    }
  }, [imageAnalysisResult]);

  // Handler untuk Contact Form
  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Tambahkan logika Turnstile ke sini jika belum ada di API route
    setIsContactSubmitting(true);
    setContactStatus('');
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            setContactStatus('sukses');
            (event.target as HTMLFormElement).reset();
            toast.success('Pesan berhasil dikirim!'); 
        } else {
            setContactStatus('gagal');
            toast.error('Gagal mengirim pesan.'); 
        }
    } catch (error) {
        console.error('Error submitting contact form:', error);
        toast.error('Terjadi kesalahan saat mengirim pesan.'); 
        setContactStatus('gagal');
    } finally {
        setIsContactSubmitting(false);
    }
  };


  return (
    // Background tema konsisten
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <header className="bg-white dark:bg-slate-950 shadow-sm py-4"> {/* Header konsisten */}
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-cyan-500 hover:text-cyan-600 font-semibold transition-colors duration-200">
            <ArrowLeft className="mr-2" size={20} /> Kembali ke Beranda
          </Link>
          <nav className="flex space-x-4">
            <Link href="/blog" className="text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Blog</Link>
            <Link href="/#contact" className="text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">Kontak</Link>
            <Link href="#generate-section" className="bg-cyan-500 text-white px-3 py-1 rounded-full text-sm hover:bg-cyan-600 transition-colors">Coba Sekarang!</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 text-center md:text-left">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">AI</span> Suite
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 text-center md:text-left">
          Hasilkan gambar AI yang menakjubkan dan perkaya prompt Anda menggunakan Pollinations.ai.
        </p>

        {/* Saran Prompt dari AI */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                <Lightbulb className="mr-3 text-yellow-500"/> Saran Prompt AI
                <button 
                    onClick={() => handleGenerateSuggestions()} 
                    disabled={isGeneratingSuggestions || isLoading}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGeneratingSuggestions ? (
                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : 'Refresh Saran'}
                </button>
            </h2>
            {isGeneratingSuggestions && promptSuggestions.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 flex items-center"><svg className="animate-spin h-4 w-4 mr-2 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Membuat saran...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {promptSuggestions.map((suggestion, index) => (
                        <button 
                            key={index} 
                            onClick={() => handleUseSuggestion(suggestion)}
                            className="bg-slate-100 dark:bg-slate-700 text-left p-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            <p className="font-semibold text-cyan-600 dark:text-cyan-400 text-sm mb-1">Saran #{index + 1}</p>
                            <p className="text-slate-800 dark:text-slate-200 text-sm">{suggestion}</p>
                        </button>
                    ))}
                </div>
            )}
            {promptSuggestions.length === 0 && !isGeneratingSuggestions && (
                <p className="text-slate-500 dark:text-slate-400">Tidak ada saran prompt. Coba refresh!</p>
            )}
        </section>

        {/* Image Analysis Section */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                <ImageIcon className="mr-3 text-blue-500"/> Analisis Gambar
                <button 
                    onClick={() => setShowImageAnalysisModal(true)} 
                    disabled={isLoading}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Unggah & Analisis
                </button>
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
                Unggah gambar untuk mendapatkan deskripsi AI, yang bisa Anda gunakan sebagai prompt!
            </p>
        </section>

        {/* Modal Analisis Gambar */}
        {showImageAnalysisModal && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4" onClick={() => setShowImageAnalysisModal(false)}>
                <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setShowImageAnalysisModal(false)}
                        className="absolute top-3 right-3 text-white bg-red-600 hover:bg-red-700 rounded-full p-2 focus:outline-none z-10"
                    >
                        <X size={24} />
                    </button>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Analisis Gambar</h3>
                    
                    <div className="mb-4 text-center">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            id="image-upload-input" 
                        />
                        <label htmlFor="image-upload-input" className="cursor-pointer bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 inline-flex items-center">
                            <Upload className="mr-2" size={20} /> Pilih Gambar
                        </label>
                        {uploadedImagePreview && (
                            <div className="mt-4 max-h-64 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                                <Image src={uploadedImagePreview} alt="Preview" width={300} height={200} layout="responsive" objectFit="contain" />
                            </div>
                        )}
                    </div>
                    
                    {uploadedImagePreview && (
                        <div className="text-center mb-4">
                            <button
                                onClick={handleAnalyzeImage}
                                disabled={isAnalyzingImage || isLoading}
                                className="bg-cyan-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAnalyzingImage ? (
                                    <svg className="animate-spin h-5 w-5 text-current mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <ImageIcon className="mr-2" size={20} />
                                )}
                                {isAnalyzingImage ? 'Menganalisis...' : 'Analisis Gambar'}
                            </button>
                        </div>
                    )}

                    {imageAnalysisResult && (
                        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Hasil Analisis:</h4>
                            <p className="text-slate-800 dark:text-slate-200 text-sm mb-3">{imageAnalysisResult}</p>
                            <button
                                onClick={handleUseAnalysisAsPrompt}
                                className="bg-violet-500 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                Gunakan sebagai Prompt
                            </button>
                        </div>
                    )}
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            </div>
        )}

        <section id="generate-section" className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Generator Gambar AI</h2>
          
          <div className="mb-6">
            <label htmlFor="prompt" className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
              Prompt Akhir
            </label>
            <textarea
              id="prompt"
              className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows={4}
              placeholder="Prompt akhir yang akan digunakan untuk generasi gambar."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                type="button"
                className="inline-flex items-center bg-violet-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleEnhancePrompt} 
                disabled={isLoading}
              >
                <Zap className="mr-2" size={16} /> Enhance Prompt Lagi
              </button>
              <button
                type="button"
                className="inline-flex items-center bg-red-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleClearPrompt}
                disabled={isLoading}
              >
                <Eraser className="mr-2" size={16} /> Clear Prompt
              </button>
            </div>
          </div>

          {/* Prompt Creator Section - Dibungkus dalam Toggle dan dipindahkan ke bawah textarea prompt */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700 mb-6"> {/* Menambahkan jarak ke tombol generate */}
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowPromptCreator(!showPromptCreator)}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Prompt Creator</h3>
              {showPromptCreator ? <ChevronUp size={24} className="text-slate-600 dark:text-slate-300"/> : <ChevronDown size={24} className="text-slate-600 dark:text-slate-300"/>}
            </div>
            
            {showPromptCreator && (
              <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4"> 
                <div className="mb-4">
                  <label htmlFor="subjectPrompt" className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                    Subjek <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subjectPrompt"
                    className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Misalnya: robot di bulan"
                    value={subjectPrompt}
                    onChange={(e) => setSubjectPrompt(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="additionalDetailsPrompt" className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                    Detail Tambahan
                  </label>
                  <textarea
                    id="additionalDetailsPrompt"
                    className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                    placeholder="Tambahkan detail gaya, suasana, atau elemen lain..."
                    value={additionalDetailsPrompt}
                    onChange={(e) => setAdditionalDetailsPrompt(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold py-2 px-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleCopyPrompt}
                    disabled={isLoading || !subjectPrompt.trim()}
                  >
                    Copy Prompt
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center bg-cyan-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleUsePrompt} 
                    disabled={isLoading || !subjectPrompt.trim()}
                  >
                    Use Prompt & Enhance with AI
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Akhir Pemindahan Prompt Creator */}

          {/* Tombol Generate di sini, tepat di bawah prompt/Prompt Creator */}
          <button
            className={`w-full bg-cyan-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-wait' : ''
            }`}
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-current mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Membuat Gambar...
              </>
            ) : (
              'Generate Gambar'
            )}
          </button>


          {/* Pengaturan Model, Batch, Ukuran & Kualitas Gambar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Atur jarak ke tombol generate */}
            {/* ... Bagian pengaturan Model & Jumlah Gambar ... */}
            <div>
              <label htmlFor="model" className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                Model AI
              </label>
              <select
                id="model"
                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={model}
                onChange={(e) => setModel(e.target.value as Model)}
                disabled={isLoading}
              >
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="batchCount" className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">
                Jumlah Gambar
              </label>
              <select
                id="batchCount"
                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value))}
                disabled={isLoading}
              >
                {batchSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Ukuran & Kualitas Gambar</h3>
            
            {/* Preset Ukuran */}
            <div className="mb-4">
                <label className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-medium">Preset Ukuran</label>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                        imageWidth === 1024 && imageHeight === 1024
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                        onClick={() => handlePresetSize(1024, 1024)}
                        disabled={isLoading}
                    >
                        Square (1024x1024)
                    </button>
                    <button
                        type="button"
                        className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                        imageWidth === 1024 && imageHeight === 1792
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                        onClick={() => handlePresetSize(1024, 1792)}
                        disabled={isLoading}
                    >
                        Portrait (1024x1792)
                    </button>
                    <button
                        type="button"
                        className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                        imageWidth === 1792 && imageHeight === 1024
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                        onClick={() => handlePresetSize(1792, 1024)}
                        disabled={isLoading}
                    >
                        Landscape (1792x1024)
                    </button>
                </div>
            </div>

            {/* Input Kustom Ukuran */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="customWidth" className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-medium">
                  Width Kustom
                </label>
                <input
                  type="number"
                  id="customWidth"
                  className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={imageWidth}
                  onChange={(e) => setImageWidth(Math.max(16, Math.min(2048, parseInt(e.target.value) || 0)))}
                  min="16"
                  max="2048"
                  step="1"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label htmlFor="customHeight" className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-medium">
                  Height Kustom
                </label>
                <input
                  type="number"
                  id="customHeight"
                  className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={imageHeight}
                  onChange={(e) => setImageHeight(Math.max(16, Math.min(2048, parseInt(e.target.value) || 0)))}
                  min="16"
                  max="2048"
                  step="1"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Pilihan Kualitas */}
            <div>
              <label htmlFor="imageQuality" className="block text-slate-700 dark:text-slate-300 mb-2 text-sm font-medium">
                Kualitas Gambar
              </label>
              <select
                id="imageQuality"
                className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-2 px-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                value={imageQuality}
                onChange={(e) => setImageQuality(e.target.value as QualityOption)}
                disabled={isLoading}
              >
                {qualityOptions.map((q) => (
                  <option key={q} value={q}>
                    {q.charAt(0).toUpperCase() + q.slice(1)}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Kualitas gambar sangat dipengaruhi oleh prompt dan model AI. Fitur "Enhance Prompt" akan membantu!
              </p>
            </div>
          </div>
          {/* Akhir Pengaturan Ukuran & Kualitas Gambar */}


          {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">{error}</div>}

          {generatedImages.length > 0 && (
            <div className="mt-10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Hasil Gambar Anda</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedImages.map((imageUrl, index) => (
                  <div key={index} className="relative rounded-lg shadow-xl overflow-hidden group">
                    <Image
                      src={imageUrl}
                      alt={`Generated Image ${index + 1}`}
                      width={imageWidth}
                      height={imageHeight}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleDownload(imageUrl)}
                        className="bg-white text-slate-800 p-2 rounded-full hover:bg-slate-200"
                        title="Unduh"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Riwayat Generasi */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
            Riwayat Generasi
            {generationHistory.length > 0 && (
                <button
                    onClick={handleClearHistory}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center bg-slate-100 dark:bg-slate-700 py-2 px-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300"
                >
                    <Eraser size={16} className="mr-1" /> Bersihkan Riwayat
                </button>
            )}
          </h2>
          {generationHistory.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">Belum ada riwayat generasi.</p>
          ) : (
            <div className="space-y-8">
              {generationHistory.map((entry) => (
                <div key={entry.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      {entry.model.toUpperCase()} | {entry.width}x{entry.height} | {entry.quality.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-2">
                    <strong>Prompt Asli:</strong> {entry.prompt}
                  </p>
                  {entry.enhancedPrompt && (
                    <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm">
                      <strong>Prompt Diperkaya:</strong> {entry.enhancedPrompt}
                    </p>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {entry.images.map((imageUrl, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden group">
                        <Image
                          src={imageUrl}
                          alt={`History Image ${index + 1}`}
                          width={imageWidth}
                          height={imageHeight}
                          className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleDownload(imageUrl)}
                            className="bg-white text-slate-800 p-2 rounded-full hover:bg-slate-200"
                            title="Unduh"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Formulir Kontak */}
        <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Butuh Bantuan Lebih Lanjut?</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            Jika Anda memiliki pertanyaan atau butuh bantuan dengan proyek web Anda, jangan ragu untuk menghubungi kami melalui formulir di bawah ini.
          </p>
          <form onSubmit={handleContactSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="contactName" className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Nama</label>
                    <input type="text" id="contactName" name="name" required className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Nama Anda" />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Email</label>
                    <input type="email" id="contactEmail" name="email" required className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="email@contoh.com" />
                </div>
            </div>
            <div className="mb-6">
                <label htmlFor="contactMessage" className="block text-slate-700 dark:text-slate-300 mb-2 font-medium">Pesan</label>
                <textarea id="contactMessage" name="message" rows={5} required className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Jelaskan kebutuhan Anda..."></textarea>
            </div>
            
            {/* Cloudflare Turnstile Script dan Widget untuk Contact Form ini */}
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
            <div className="mb-6 flex justify-center">
                <div className="cf-turnstile" data-sitekey="0x4AAAAAABh0uR4HC9nKVVTQ"></div> {/* Site Key di sini */}
            </div>

            <div className="text-center">
                <button type="submit" disabled={isContactSubmitting} className="bg-cyan-500 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isContactSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
            </div>
          </form>
          {contactStatus === 'sukses' && <p className="text-center text-green-600 dark:text-green-400 mt-4">Pesan berhasil dikirim! Terima kasih telah menghubungi.</p>}
          {contactStatus === 'gagal' && <p className="text-center text-red-600 dark:text-red-400 mt-4">Maaf, terjadi kesalahan. Silakan coba lagi nanti.</p>}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-500 dark:text-slate-400">
            <div className="flex justify-center space-x-6 mb-4">
                <a href="https://github.com/ayick13" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  <Github className="w-6 h-6"/>
                </a>
                <a href="https://linkedin.com/in/ayick" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  <Linkedin className="w-6 h-6"/>
                </a>
                <a href="https://instagram.com/ayick.id" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  <Instagram className="w-6 h-6"/>
                </a>
                {/* Ikon Facebook dari Lucide */}
                <a href="https://facebook.com/your_facebook_page_id" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                  <Facebook className="w-6 h-6"/> 
                </a>
            </div>
            <p>&copy; {new Date().getFullYear()} Ayick.dev. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
};

export default AISuitePage;