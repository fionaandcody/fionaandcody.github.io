import { prisma } from '@/lib/prisma';
import VacationForm from '../../_components/VacationForm';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    const vacations = await prisma.vacation.findMany({
        select: { id: true },
    });

    return vacations.map((v) => ({
        id: v.id.toString(),
    }));
}

export default async function EditVacationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    if (isNaN(id)) notFound();

    const vacation = await prisma.vacation.findUnique({
        where: { id },
    });

    if (!vacation) notFound();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl font-bold text-stone-800 mb-8">Edit Vacation</h1>
            <VacationForm initialData={vacation} />
        </div>
    );
}
