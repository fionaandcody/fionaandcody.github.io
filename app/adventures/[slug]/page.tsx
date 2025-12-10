import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
    const vacations = await prisma.vacation.findMany({
        where: { status: 'published' },
        select: { slug: true },
    });

    return vacations.map((v) => ({
        slug: v.slug,
    }));
}

export default async function AdventureDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const vacation = await prisma.vacation.findUnique({
        where: { slug: slug },
    });

    if (!vacation || vacation.status !== 'published') {
        notFound();
    }

    const gallery = vacation.gallery ? JSON.parse(vacation.gallery) : [];
    const tags = vacation.tags ? JSON.parse(vacation.tags) : [];

    return (
        <div className="pb-20">
            {/* Hero */}
            <div className="relative h-[70vh]">
                <img
                    src={vacation.coverImage}
                    alt={vacation.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="text-sm md:text-base font-medium tracking-widest uppercase mb-4 opacity-90">{vacation.destination} • {new Date(vacation.startDate).toLocaleDateString()} - {new Date(vacation.endDate).toLocaleDateString()}</div>
                            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{vacation.title}</h1>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((t: string) => (
                                    <span key={t} className="bg-white/20 hover:bg-white/30 backdrop-blur px-3 py-1 rounded-full text-sm transition-colors">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl py-16">
                <Link href="/adventures" className="inline-flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors">
                    &larr; Back to Adventures
                </Link>

                {/* Description */}
                <div className="prose prose-stone prose-lg max-w-none mb-16 font-serif">
                    {/* Simple whitespace rendering or markdown parser required? 
                User req: "Full description (use a textarea or rich text editor component, markdown is fine)."
                I'll render it as whitespace-pre-wrap for now or simple paragraphs.
                Better: Use a markdown library, but to keep deps low as requested "simple", I'll just use whitespace-pre-wrap.
            */}
                    <div className="whitespace-pre-wrap font-sans text-stone-700 leading-relaxed">
                        {vacation.description}
                    </div>
                </div>

                {/* Gallery */}
                {gallery.length > 0 && (
                    <div className="space-y-8">
                        <h2 className="text-3xl font-serif text-stone-800 text-center">Gallery</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {gallery.map((url: string, idx: number) => (
                                <div key={idx} className={`rounded-lg overflow-hidden bg-stone-100 ${idx % 3 === 0 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-square'}`}>
                                    <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
