'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadFile(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');

    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', 'images', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    return `/images/uploads/${filename}`;
}

export async function createVacation(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const destination = formData.get('destination') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const shortSummary = formData.get('shortSummary') as string;
    const description = formData.get('description') as string;
    const coverImage = formData.get('coverImage') as string;
    // Gallery strings joined by newline or comma? Or JSON?
    // Form will send a hidden input or multiple inputs?
    // Let's assume the form handles JSON stringification or we parse text area.
    const gallery = formData.get('gallery') as string;
    const tags = formData.get('tags') as string; // expecting comma separated or JSON
    const status = formData.get('status') as string;
    const featured = formData.get('featured') === 'on';

    try {
        await prisma.vacation.create({
            data: {
                title,
                slug,
                destination,
                startDate,
                endDate,
                shortSummary,
                description,
                coverImage,
                gallery, // Already stringified in form
                tags,    // Already stringified or comma separated.
                status,
                featured,
            },
        });
    } catch (e) {
        console.error(e);
        return { error: 'Failed to create vacation. Slug might be taken.' };
    }

    revalidatePath('/admin/vacations');
    revalidatePath('/adventures');
    redirect('/admin/vacations');
}

export async function updateVacation(id: number, formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const destination = formData.get('destination') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const shortSummary = formData.get('shortSummary') as string;
    const description = formData.get('description') as string;
    const coverImage = formData.get('coverImage') as string;
    const gallery = formData.get('gallery') as string;
    const tags = formData.get('tags') as string;
    const status = formData.get('status') as string;
    const featured = formData.get('featured') === 'on';

    try {
        await prisma.vacation.update({
            where: { id },
            data: {
                title,
                slug,
                destination,
                startDate,
                endDate,
                shortSummary,
                description,
                coverImage,
                gallery,
                tags,
                status,
                featured,
            },
        });
    } catch (e) {
        console.error(e);
        return { error: 'Failed to update vacation.' };
    }

    revalidatePath('/admin/vacations');
    revalidatePath('/adventures');
    revalidatePath(`/adventures/${slug}`);
    redirect('/admin/vacations');
}

export async function deleteVacation(id: number) {
    await prisma.vacation.delete({ where: { id } });
    revalidatePath('/admin/vacations');
    revalidatePath('/adventures');
}
