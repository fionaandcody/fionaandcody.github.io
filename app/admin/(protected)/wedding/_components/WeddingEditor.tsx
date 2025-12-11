'use client';

import { useState } from 'react';
import { Loader2, Upload, X, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Highlight {
    time: string;
    title: string;
    description: string;
}

interface WeddingEditorProps {
    initialData?: any;
}

export default function WeddingEditor({ initialData }: WeddingEditorProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form State - Initialize from props
    const [heroImage, setHeroImage] = useState(initialData?.heroImage || '');
    const [heroTitle, setHeroTitle] = useState(initialData?.heroTitle || 'The Wedding Day');
    const [heroSubtitle, setHeroSubtitle] = useState(initialData?.heroSubtitle || 'October 7, 2023 • Anaheim, CA');
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || 'https://player.vimeo.com/video/894014279');

    // Parse JSON fields safely
    const initialHighlights = initialData?.highlights ? JSON.parse(initialData.highlights) : [
        { time: '4:00 PM', title: 'Ceremony', description: 'Steps of the vineyard' },
        { time: '6:00 PM', title: 'Dinner', description: 'Family style feast' },
        { time: '8:00 PM', title: 'Dancing', description: 'Under the stars' }
    ];
    const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);

    const initialGallery = initialData?.gallery ? JSON.parse(initialData.gallery) : [];
    const [gallery, setGallery] = useState<string[]>(initialGallery);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        return data.url;
    };

    const handleDrop = async (e: React.DragEvent, type: 'hero' | 'gallery') => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (!files.length) return;

        setIsUploading(true);
        try {
            for (const file of files) {
                const url = await handleUpload(file);
                if (type === 'hero') setHeroImage(url);
                else setGallery(prev => [...prev, url]);
            }
        } catch (e) {
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                heroImage,
                heroTitle,
                heroSubtitle,
                videoUrl,
                highlights: JSON.stringify(highlights),
                gallery: JSON.stringify(gallery),
            };
            const res = await fetch('/api/wedding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Saved successfully!');
                router.refresh();
            } else {
                alert('Failed to save');
            }
        } catch (e) {
            alert('Error saving');
        } finally {
            setIsSaving(false);
        }
    };

    const updateHighlight = (index: number, field: keyof Highlight, value: string) => {
        const newHighlights = [...highlights];
        newHighlights[index] = { ...newHighlights[index], [field]: value };
        setHighlights(newHighlights);
    };

    const removeHighlight = (index: number) => {
        setHighlights(prev => prev.filter((_, i) => i !== index));
    };

    const addHighlight = () => {
        setHighlights([...highlights, { time: '12:00 PM', title: 'New Event', description: 'Description' }]);
    };

    return (
        <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border">

            {/* Hero Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-stone-700">Hero Section</h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full rounded-md border-stone-300" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Subtitle (Date/Location)</label>
                        <input value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className="w-full rounded-md border-stone-300" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Hero Image</label>
                    <div
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => handleDrop(e, 'hero')}
                        className="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:bg-stone-50 transition"
                    >
                        {heroImage ? (
                            <div className="relative h-48 w-full">
                                <img src={heroImage} className="h-full w-full object-cover rounded" alt="Hero" />
                                <button type="button" onClick={() => setHeroImage('')} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-600"><X size={16} /></button>
                            </div>
                        ) : (
                            <div className="text-stone-500 flex flex-col items-center">
                                <Upload className="mb-2" /> <span>Drag hero image here</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Highlights */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-bold text-stone-700">Timeline Highlights</h2>
                    <button type="button" onClick={addHighlight} className="text-sm bg-stone-100 px-3 py-1 rounded hover:bg-stone-200 flex items-center gap-1"><Plus size={14} /> Add</button>
                </div>

                <div className="space-y-4">
                    {highlights.map((h, i) => (
                        <div key={i} className="flex gap-4 items-start bg-stone-50 p-4 rounded-lg">
                            <div className="flex-1 grid md:grid-cols-3 gap-2">
                                <input value={h.time} onChange={e => updateHighlight(i, 'time', e.target.value)} placeholder="Time" className="rounded border-stone-300" />
                                <input value={h.title} onChange={e => updateHighlight(i, 'title', e.target.value)} placeholder="Title" className="rounded border-stone-300" />
                                <input value={h.description} onChange={e => updateHighlight(i, 'description', e.target.value)} placeholder="Description" className="rounded border-stone-300" />
                            </div>
                            <button type="button" onClick={() => removeHighlight(i)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Video */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-stone-700">Video</h2>
                <div>
                    <label className="block text-sm font-medium mb-1">Vimeo/Youtube Embed URL</label>
                    <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full rounded-md border-stone-300" placeholder="https://player.vimeo.com/..." />
                    <p className="text-xs text-stone-500 mt-1">Make sure to use the "Embed" URL, not the watch URL.</p>
                </div>
            </section>

            {/* Gallery */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold border-b pb-2 text-stone-700">Gallery</h2>

                <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => handleDrop(e, 'gallery')}
                    className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:bg-stone-50 transition"
                >
                    <div className="text-stone-500 flex flex-col items-center">
                        {isUploading ? <Loader2 className="animate-spin mb-2" /> : <Upload className="mb-2" />}
                        <span>Drag multiple photos here</span>
                    </div>
                </div>

                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {gallery.map((url, i) => (
                        <div key={i} className="relative group aspect-square bg-stone-100 rounded overflow-hidden">
                            <img src={url} className="w-full h-full object-cover" alt="Gallery" />
                            <button type="button" onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
                        </div>
                    ))}
                </div>
            </section>

            <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isUploading || isSaving} className="bg-stone-800 text-white px-8 py-3 rounded-lg hover:bg-stone-700 disabled:opacity-50">
                    {isSaving ? 'Saving...' : 'Save Wedding Page'}
                </button>
            </div>
        </form>
    );
}
