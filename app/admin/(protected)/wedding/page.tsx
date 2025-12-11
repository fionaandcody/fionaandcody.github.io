import { prisma } from '@/lib/prisma';
import WeddingEditor from './_components/WeddingEditor';

export default async function WeddingAdminPage() {
    const wedding = await prisma.wedding.findFirst();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-serif font-bold text-stone-800">Edit Wedding Page</h1>
            <WeddingEditor initialData={wedding || undefined} />
        </div>
    );
}
