import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Convert date strings back to Date objects
        const startDate = new Date(body.startDate);
        const endDate = new Date(body.endDate);

        const vacation = await prisma.vacation.create({
            data: {
                ...body,
                startDate,
                endDate,
            },
        });

        return NextResponse.json(vacation);
    } catch (error) {
        console.error('Create error:', error);
        return NextResponse.json({ error: 'Failed to create vacation' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        const vacation = await prisma.vacation.update({
            where: { id },
            data: {
                ...data,
                startDate,
                endDate,
            },
        });

        return NextResponse.json(vacation);
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Failed to update vacation' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
        }

        await prisma.vacation.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
