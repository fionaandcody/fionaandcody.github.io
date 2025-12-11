import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="font-serif text-3xl font-bold text-stone-800">Dashboard</h1>
            <p className="text-stone-600">Welcome back! Manage your vacations and content here.</p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <a href="/admin/vacations" className="block p-6 bg-white rounded-lg border border-stone-200 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-lg mb-2">Manage Vacations</h3>
                    <p className="text-stone-500 text-sm">Add, edit, or remove adventure posts.</p>
                </a>
                <Link href="/admin/wedding" className="p-6 bg-white rounded-xl shadow-sm border border-stone-200 hover:border-stone-400 transition group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                        </div>
                        <span className="text-stone-400 group-hover:text-stone-600">Edit &rarr;</span>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800">Wedding Page</h3>
                    <p className="text-stone-500 text-sm mt-2">Update hero, timeline, video, and gallery.</p>
                </Link>
                <div className="p-6 bg-white rounded-lg border border-stone-200 opacity-50">
                    <h3 className="font-semibold text-lg mb-2">Manage Story (Coming Soon)</h3>
                    <p className="text-stone-500 text-sm">Edit 'Our Story' content.</p>
                </div>
            </div>
        </div>
    );
}
