import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Upsert: update if exists (id=1), otherwise create
        // Since we don't know the ID for sure, we can check count or just findFirst
        const existing = await prisma.wedding.findFirst();

        let wedding;
        if (existing) {
            wedding = await prisma.wedding.update({
                where: { id: existing.id },
                data: body,
            });
        } else {
            wedding = await prisma.wedding.create({
                data: body,
            });
        }

        return NextResponse.json(wedding);
    } catch (error) {
        console.error('Wedding Save Error:', error);
        return NextResponse.json({ error: 'Failed to save wedding data' }, { status: 500 });
    }
}
