import Image from 'next/image';

export default function OurStory() {
    const milestones = [
        {
            year: '2016',
            title: 'The First Date',
            description: 'We met at a small coffee shop downtown. It was raining, but the conversation was bright. We talked for hours about travel, food, and our dreams.',
            image: 'https://images.unsplash.com/photo-1516570697223-28f0df286cb6?q=80&w=2940&auto=format&fit=crop',
        },
        {
            year: '2018',
            title: 'Moving In Together',
            description: 'After two years of adventures, we decided to make a home together. Our first apartment was tiny, but filled with love (and too many plants).',
            image: 'https://images.unsplash.com/photo-1574697816823-380d44b545d9?q=80&w=2938&auto=format&fit=crop',
        },
        {
            year: '2020',
            title: 'The Engagement',
            description: 'On a quiet hike overlooking the ocean, Cody got down on one knee. It was the easiest "Yes" Fiona ever said.',
            image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2940&auto=format&fit=crop',
        },
        {
            year: '2022',
            title: 'The Wedding',
            description: 'Surrounded by our friends and family, we promised forever. It was a magical day celebration of love and new beginnings.',
            image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop',
        },
    ];

    return (
        <div className="bg-white pb-20">
            {/* Hero */}
            <div className="bg-stone-100 py-20 px-4 text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif mb-4 text-stone-900">Our Story</h1>
                <p className="text-stone-600 max-w-2xl mx-auto">From a chance meeting to a lifetime of adventures.</p>
            </div>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="space-y-24">
                    {milestones.map((item, i) => (
                        <div key={i} className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 w-full relative aspect-[4/5] md:aspect-square rounded-lg overflow-hidden shadow-lg">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <span className="text-stone-400 font-serif text-2xl bg-stone-50 px-4 py-1 rounded-full inline-block">{item.year}</span>
                                <h2 className="text-3xl font-bold text-stone-800">{item.title}</h2>
                                <p className="text-stone-600 leading-relaxed text-lg">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
