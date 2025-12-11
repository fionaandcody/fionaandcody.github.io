import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // For static export, we cannot use server-side cookies here.
    // Authentication is handled client-side or in the (protected) layout.

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {/* Simple Admin Header */}
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="font-serif text-xl font-bold">F&C Admin</h1>
                <nav className="flex gap-4 text-sm">
                    <Link href="/" className="hover:underline">View Site</Link>
                    <Link href="/admin/vacations" className="hover:underline">Vacations</Link>
                </nav>
            </header>
            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}
