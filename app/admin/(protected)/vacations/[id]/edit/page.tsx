import { prisma } from '@/lib/prisma';
import { updateVacation } from '@/app/actions';
import VacationEditor from '../../editor/VacationEditor';
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
    const { id } = await params;
    const vacation = await prisma.vacation.findUnique({
        where: { id: parseInt(id) },
    });

    if (!vacation) return notFound();

    const updateWithId = updateVacation.bind(null, vacation.id);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-serif font-bold text-stone-800">Edit: {vacation.title}</h1>
            <VacationEditor initialData={vacation} action={updateWithId} />
        </div>
    );
}
