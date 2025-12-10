import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

// export const dynamic = 'force-dynamic'; // Removed for static export compatibility

export default async function AdventuresPage() {
    const vacations = await prisma.vacation.findMany({
        where: { status: 'published' },
        orderBy: { startDate: 'desc' },
    });

    return (
        <div className="pb-20">
            <div className="bg-stone-900 text-white py-20 px-4 text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif mb-4">Adventures</h1>
                <p className="text-stone-300 max-w-2xl mx-auto">A collection of our travels and favorite memories.</p>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vacations.map(vacation => (
                        <Link key={vacation.id} href={`/adventures/${vacation.slug}`} className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="aspect-[4/3] bg-stone-200 overflow-hidden relative">
                                {vacation.coverImage && (
                                    <img
                                        src={vacation.coverImage}
                                        alt={vacation.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {new Date(vacation.startDate).getFullYear()}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-2 text-stone-500 text-sm font-medium uppercase tracking-wide">{vacation.destination}</div>
                                <h2 className="text-xl font-serif font-bold text-stone-900 mb-2 group-hover:text-stone-600 transition-colors">{vacation.title}</h2>
                                <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">{vacation.shortSummary}</p>

                                {/* Tags */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {(() => {
                                        try {
                                            const tags = JSON.parse(vacation.tags || '[]');
                                            return tags.slice(0, 3).map((t: string) => (
                                                <span key={t} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">{t}</span>
                                            ));
                                        } catch (e) { return null; }
                                    })()}
                                </div>
                            </div>
                        </Link>
                    ))}

                    {vacations.length === 0 && (
                        <div className="col-span-full text-center py-20 text-stone-500">
                            <p>No adventures published yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
