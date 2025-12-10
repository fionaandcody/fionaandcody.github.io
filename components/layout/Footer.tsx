export default function Footer() {
    return (
        <footer className="bg-stone-50 border-t border-stone-100 py-12 mt-auto">
            <div className="container mx-auto px-4 text-center">
                <p className="font-serif text-lg text-stone-800 mb-4">Fiona & Cody</p>
                <p className="text-stone-500 text-sm">
                    &copy; {new Date().getFullYear()} Our Journey. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
