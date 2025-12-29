'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createVacation, updateVacation } from '@/app/actions';

interface Vacation {
    id?: number;
    title: string;
    slug: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    shortSummary: string;
    description: string;
    coverImage: string;
    gallery: string; // JSON
    tags: string; // JSON or comma separated
    status: string;
    featured: boolean;
}

export default function VacationForm({ initialData }: { initialData?: Vacation }) {
    const router = useRouter();
    const [galleryUrls, setGalleryUrls] = useState<string[]>(
        initialData?.gallery ? JSON.parse(initialData.gallery) : []
    );

    // Tags managed as comma-separated string for simplicity in UI, handled as array/JSON in logic if needed 
    // but simpler to just keep it as text input "Beach, Disney" and split on submit? 
    // The server action expects "tags" as string. 
    // DB stores string (as per quick schema decision). 
    // Plan said: "tags String[] // list of tags" in plan, but actual schema I wrote: "tags String".
    // So I'll treat it as JSON stringified array.

    const [tagsInput, setTagsInput] = useState<string>(
        initialData?.tags ? JSON.parse(initialData.tags).join(', ') : ''
    );

    const handleSubmit = async (formData: FormData) => {
        // Process gallery and tags to JSON strings before submitting?
        // FormData is read-only. We can append to a NEW FormData or just use hidden inputs.
        // Easier: Use hidden inputs in the form that bind to state.

        // We already have hidden inputs for gallery and tags below.

        if (initialData?.id) {
            await updateVacation(initialData.id, formData);
        } else {
            await createVacation(formData);
        }
    };

    const addGalleryUrl = () => setGalleryUrls([...galleryUrls, '']);
    const updateGalleryUrl = (index: number, val: string) => {
        const newUrls = [...galleryUrls];
        newUrls[index] = val;
        setGalleryUrls(newUrls);
    };
    const removeGalleryUrl = (index: number) => {
        setGalleryUrls(galleryUrls.filter((_, i) => i !== index));
    };

    // Pre-process dates for Input Date (YYYY-MM-DD)
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    return (
        <form action={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-sm border border-stone-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Title</label>
                    <input name="title" required defaultValue={initialData?.title} className="w-full border p-2 rounded" placeholder="E.g. Aulani 2024" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Slug</label>
                    <input name="slug" required defaultValue={initialData?.slug} className="w-full border p-2 rounded" placeholder="aulani-2024" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Destination</label>
                    <input name="destination" required defaultValue={initialData?.destination} className="w-full border p-2 rounded" placeholder="Kapolei, HI" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Status</label>
                    <select name="status" defaultValue={initialData?.status || 'draft'} className="w-full border p-2 rounded">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">Start Date</label>
                    <input type="date" name="startDate" required defaultValue={initialData?.startDate ? formatDate(new Date(initialData.startDate)) : ''} className="w-full border p-2 rounded" />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700">End Date</label>
                    <input type="date" name="endDate" required defaultValue={initialData?.endDate ? formatDate(new Date(initialData.endDate)) : ''} className="w-full border p-2 rounded" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Short Summary</label>
                <textarea name="shortSummary" required defaultValue={initialData?.shortSummary} className="w-full border p-2 rounded h-20" placeholder="Brief teaser..." />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Full Description (Markdown)</label>
                <textarea name="description" required defaultValue={initialData?.description} className="w-full border p-2 rounded h-60 font-mono text-sm" placeholder="# Our Trip..." />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Cover Image URL</label>
                <input name="coverImage" required defaultValue={initialData?.coverImage} className="w-full border p-2 rounded" placeholder="https://..." />
            </div>

            {/* Tags */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">Tags (comma separated)</label>
                <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="Beach, Hiking, Disney"
                />
                {/* Hidden input to convert tags to JSON string for server */}
                <input type="hidden" name="tags" value={JSON.stringify(tagsInput.split(',').map(s => s.trim()).filter(Boolean))} />
            </div>

            {/* Gallery Manager */}
            <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-stone-700">Gallery Images</label>
                    <button type="button" onClick={addGalleryUrl} className="text-sm bg-stone-100 px-3 py-1 rounded hover:bg-stone-200">+ Add Image</button>
                </div>
                {galleryUrls.map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                        <input
                            value={url}
                            onChange={(e) => updateGalleryUrl(idx, e.target.value)}
                            className="flex-1 border p-2 rounded text-sm"
                            placeholder="Image URL"
                        />
                        <button type="button" onClick={() => removeGalleryUrl(idx)} className="text-red-500 px-2">&times;</button>
                    </div>
                ))}
                <input type="hidden" name="gallery" value={JSON.stringify(galleryUrls.filter(Boolean))} />
            </div>

            <div className="pt-4 flex items-center gap-2">
                <input type="checkbox" name="featured" id="featured" defaultChecked={initialData?.featured} className="w-4 h-4" />
                <label htmlFor="featured" className="text-sm font-medium text-stone-700">Featured Vacation</label>
            </div>

            <div className="flex gap-4 pt-4">
                <button type="submit" className="bg-stone-800 text-white px-6 py-2 rounded hover:bg-stone-700 transition-colors">
                    {initialData ? 'Update Vacation' : 'Create Vacation'}
                </button>
                <button type="button" onClick={() => router.back()} className="bg-white border border-stone-300 text-stone-700 px-6 py-2 rounded hover:bg-stone-50 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    );
}
