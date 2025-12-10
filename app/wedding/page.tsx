export default function Wedding() {
    return (
        <div className="pb-20">
            {/* Hero */}
            <div className="relative h-[60vh] flex items-center justify-center">
                <div className="absolute inset-0">
                    <img src="https://www.fionaandcody.com/Wedding/Front.jpeg" className="w-full h-full object-cover" alt="Wedding Hero" />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">The Wedding Day</h1>
                    <p className="text-xl tracking-widest uppercase">October 7, 2023 • Anaheim, CA</p>
                </div>
            </div>

            {/* Timeline */}
            <section className="py-20 bg-stone-50">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-serif mb-12 text-stone-800">Highlights</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <span className="block text-2xl font-bold text-stone-900 mb-2">4:00 PM</span>
                            <h3 className="text-lg font-serif">Ceremony</h3>
                            <p className="text-stone-500 text-sm mt-2">Steps of the vineyard</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <span className="block text-2xl font-bold text-stone-900 mb-2">6:00 PM</span>
                            <h3 className="text-lg font-serif">Dinner</h3>
                            <p className="text-stone-500 text-sm mt-2">Family style feast</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-sm">
                            <span className="block text-2xl font-bold text-stone-900 mb-2">8:00 PM</span>
                            <h3 className="text-lg font-serif">Dancing</h3>
                            <p className="text-stone-500 text-sm mt-2">Under the stars</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video */}
            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <h2 className="text-3xl font-serif mb-8 text-center text-stone-800">The Film</h2>
                <div className="aspect-video bg-stone-200 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        className="w-full h-full"
                        src="https://player.vimeo.com/video/894014279"
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
                    <h2 className="text-3xl font-serif mb-12 text-center text-stone-800">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="aspect-square bg-stone-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                <img
                                    src={`https://images.unsplash.com/photo-${1515934751635 + n}?q=80&w=800&auto=format&fit=crop`}
                                    alt="Wedding"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
