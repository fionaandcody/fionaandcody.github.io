import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder - In real app, replace with actual image */}
        <div className="absolute inset-0 bg-stone-300">
          {/* If you have a real image, use next/image with layout fill object-cover */}
          <div className="w-full h-full bg-[url('https://www.fionaandcody.com/Wedding/Front.jpeg')] bg-cover bg-center opacity-90" />
          <div className="absolute inset-0 bg-black/20" /> {/* Overlay */}
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-md">
            Fiona & Cody
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto drop-shadow-sm">
            Exploring the world, one adventure at a time.
          </p>
          <Link
            href="/our-story"
            className="inline-block bg-white/90 text-stone-900 px-8 py-3 rounded-full font-medium hover:bg-white transition-colors"
          >
            Read Our Story
          </Link>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-serif mb-6 text-stone-800">Welcome to Our Journey</h2>
          <p className="text-stone-600 leading-relaxed text-lg">
            We are Fiona and Cody. This site is a collection of our memories, from the day we said "I do" to the many adventures we've shared since. We invite you to explore our photos, read about our travels, and join us as we continue to explore the world together.
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* <HighlightCard
              title="Our Story"
              image="https://www.fionaandcody.com/Wedding/WeddingSign.jpeg"
              link="/our-story"
              description="How we met and our journey to the altar."
            /> */}
            <HighlightCard
              title="The Wedding"
              image="https://www.fionaandcody.com/Wedding/DroneShot.jpeg"
              link="/wedding"
              description="Memories from our special day."
            />
            <HighlightCard
              title="Adventures"
              image="https://www.fionaandcody.com/Honeymoon/Snorkel.png"
              link="/adventures"
              description="Our travel diaries and photo galleries."
            />
          </div>
        </div>
      </section>

      {/* Featured (Static for now, meant to be dynamic later) */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-serif mb-8 text-stone-800">Latest Adventure</h2>
        <div className="inline-block relative group overflow-hidden rounded-xl max-w-4xl mx-auto shadow-xl">
          <img
            src="https://www.fionaandcody.com/Vacations/Aulani2024/cover.JPG"
            alt="Featured"
            className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-left">
            <span className="text-white/80 font-medium tracking-wider text-sm mb-2">LATEST TRIP</span>
            <h3 className="text-3xl font-bold text-white mb-2">Hawaii 2024</h3>
            <Link href="/adventures" className="text-white underline decoration-white/50 hover:decoration-white transition-all">
              View Gallery &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HighlightCard({ title, image, link, description }: { title: string, image: string, link: string, description: string }) {
  return (
    <Link href={link} className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-serif font-semibold mb-2 text-stone-900 group-hover:text-stone-600 transition-colors">{title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
