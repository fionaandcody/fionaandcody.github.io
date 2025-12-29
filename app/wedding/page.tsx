import { prisma } from '@/lib/prisma';
import LightboxGallery from '@/components/gallery/LightboxGallery';
import Image from 'next/image';

interface Highlight {
    time: string;
    title: string;
    description: string;
}

export default async function Wedding() {
    const wedding = await prisma.wedding.findFirst();

    // Defaults if no DB data
    const heroImage = wedding?.heroImage || "/images/site/wedding-hero.jpg";
    const heroTitle = wedding?.heroTitle || "The Wedding Day";
    const heroSubtitle = wedding?.heroSubtitle || "October 7, 2023 • Anaheim, CA";

    const highlights: Highlight[] = wedding?.highlights
        ? JSON.parse(wedding.highlights)
        : [
            { time: '4:00 PM', title: 'Ceremony', description: 'Steps of the vineyard' },
            { time: '6:00 PM', title: 'Dinner', description: 'Family style feast' },
            { time: '8:00 PM', title: 'Dancing', description: 'Under the stars' }
        ];

    const videoUrl = wedding?.videoUrl || "https://player.vimeo.com/video/894014279";

    // Convert gallery JSON to string array
    const galleryImages: string[] = wedding?.gallery ? JSON.parse(wedding.gallery) : [];

    return (
        <div className="pb-20">
            {/* Hero */}
            <div className="relative h-[60vh] flex items-center justify-center">
                <div className="absolute inset-0">
                    <Image
                        src={heroImage}
                        alt="Wedding Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{heroTitle}</h1>
                    <p className="text-xl tracking-widest uppercase">{heroSubtitle}</p>
                </div>
            </div>

            {/* Timeline */}
            <section className="py-20 bg-stone-50">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-serif mb-12 text-stone-800">Highlights</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {highlights.map((h, i) => (
                            <div key={i} className="p-6 bg-white rounded-lg shadow-sm">
                                <span className="block text-2xl font-bold text-stone-900 mb-2">{h.time}</span>
                                <h3 className="text-lg font-serif">{h.title}</h3>
                                <p className="text-stone-500 text-sm mt-2">{h.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video */}
            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <h2 className="text-3xl font-serif mb-8 text-center text-stone-800">The Film</h2>
                <div className="aspect-video bg-stone-200 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        className="w-full h-full"
                        src={videoUrl}
                        title="Wedding Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </section>

            {/* Gallery */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center mb-12 relative">
                        <h2 className="text-3xl font-serif text-stone-800">Gallery</h2>
                        {/* Note: LightboxGallery handles view toggles internally */}
                    </div>

                    {galleryImages.length > 0 ? (
                        <LightboxGallery images={galleryImages} />
                    ) : (
                        <p className="text-center text-stone-500 italic">Gallery coming soon...</p>
                    )}
                </div>
            </section>
        </div>
    );
}
