'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (password === adminPassword) {
            localStorage.setItem('admin_session', 'true');
            // Force a hard navigation to ensure state is picked up if we rely on it elsewhere, 
            // but router.push is fine if components listen to storage or mount.
            // However, our protected layout isn't implemented yet. 
            // We will assume components check localStorage on mount.
            router.push('/admin');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg border border-stone-200">
                <h1 className="mb-6 text-center font-serif text-2xl font-bold text-stone-800">Admin Access</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        className="w-full rounded-md bg-stone-800 px-4 py-2 text-white hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 transition-colors"
                    >
                        Enter
                    </button>
                </form>
            </div>
        </div>
    );
}
