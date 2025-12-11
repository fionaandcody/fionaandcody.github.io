'use client';

import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VacationEditorProps {
    initialData?: any;
    // No explicit action prop needed anymore, we handle internally or pass ID/Status
}

export default function VacationEditor({ initialData }: VacationEditorProps) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
    const [gallery, setGallery] = useState<string[]>(initialData?.gallery ? JSON.parse(initialData.gallery) : []);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return data.url;
    };

    // Drag & Drop handlers
    const handleDrop = async (e: React.DragEvent, type: 'cover' | 'gallery') => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            for (const file of files) {
                const url = await handleUpload(file);
                if (type === 'cover') {
                    setCoverImage(url);
                } else {
                    setGallery(prev => [...prev, url]);
                }
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed. See console.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveGalleryImage = (index: number) => {
        setGallery(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData(e.currentTarget);
        const payload = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            destination: formData.get('destination'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            shortSummary: formData.get('shortSummary'),
            description: formData.get('description'),
            coverImage: coverImage, // State
            gallery: JSON.stringify(gallery), // State
            tags: formData.get('tags'),
            status: formData.get('status'),
            featured: formData.get('featured') === 'on',
            id: initialData?.id, // For update
        };

        try {
            const method = initialData ? 'PUT' : 'POST';
            const res = await fetch('/api/vacations', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to save');

            router.push('/admin/vacations');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to save vacation');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                    <input name="title" defaultValue={initialData?.title} required className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Slug (URL)</label>
                    <input name="slug" defaultValue={initialData?.slug} required className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Destination</label>
                    <input name="destination" defaultValue={initialData?.destination} required className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">Start Date</label>
                        <input type="date" name="startDate" defaultValue={initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : ''} required className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-1">End Date</label>
                        <input type="date" name="endDate" defaultValue={initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : ''} required className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500" />
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Cover Image</label>
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'cover')}
                    className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-stone-400 transition-colors bg-stone-50 cursor-pointer"
                >
                    {coverImage ? (
                        <div className="relative aspect-video w-full max-w-md mx-auto">
                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover rounded-md" />
                            <button type="button" onClick={() => setCoverImage('')} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-600 hover:bg-white"><X size={16} /></button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-stone-500">
                            {isUploading ? <Loader2 className="animate-spin mb-2" /> : <Upload className="mb-2" />}
                            <span className="text-sm">Drag & Drop cover image here</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery Upload */}
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Gallery Photos (Drag & Drop multiple)</label>
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'gallery')}
                    className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center hover:border-stone-400 transition-colors bg-stone-50 mb-4"
                >
                    <div className="flex flex-col items-center text-stone-500">
                        {isUploading ? <Loader2 className="animate-spin mb-2" /> : <Upload className="mb-2" />}
                        <span className="text-sm">Drag & Drop gallery photos here</span>
                    </div>
                </div>

                {/* Gallery Grid */}
                {gallery.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {gallery.map((url, idx) => (
                            <div key={idx} className="relative group aspect-square bg-stone-100 rounded-md overflow-hidden">
                                <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(idx)}
                                    className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Text Content */}
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Short Summary (for cards)</label>
                <textarea name="shortSummary" defaultValue={initialData?.shortSummary} rows={2} className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Description</label>
                <textarea name="description" defaultValue={initialData?.description} rows={10} className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500 font-serif" />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Tags (JSON or comma separated)</label>
                    <input name="tags" defaultValue={initialData?.tags} placeholder='["hiking", "beach"]' className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
                    <select name="status" defaultValue={initialData?.status || 'draft'} className="w-full rounded-md border-stone-300 shadow-sm focus:border-stone-500 focus:ring-stone-500">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" id="featured" defaultChecked={initialData?.featured} className="rounded border-stone-300 text-stone-600 focus:ring-stone-500" />
                <label htmlFor="featured" className="text-sm font-medium text-stone-700">Featured on Homepage</label>
            </div>

            <div className="pt-4 border-t flex justify-end">
                <button
                    type="submit"
                    disabled={isUploading || isSaving}
                    className="bg-stone-800 text-white px-6 py-2 rounded-md hover:bg-stone-700 transition-colors disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : (initialData ? 'Update Vacation' : 'Create Vacation')}
                </button>
            </div>
        </form>
    );
}
