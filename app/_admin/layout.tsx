import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    // If not authenticated, redirect to login
    if (!isAdmin) {
        // We shouldn't redirect in layout if it's the login page being rendered,
        // but layout wraps pages. So we check route?
        // Actually, layouts wrap specific segments.
        // If this is app/admin/layout.tsx, it wraps /admin/*
        // So /admin/login IS inside /admin.
        // We need to move login page OUT of this layout OR check path.
        // Easier: Make /admin/login a sibling or check path?
        // Layouts run on server. "headers" can get path?
        // No, standard way using middleware or route groups.
        // I plan to putting login at /admin/login, so it IS wrapped.
        // Fix: Move login to /login or separate route group (admin)/(pages)...
        // Or just do the check in page.tsx of dashboard?
        // Better: use middleware. But plan didn't mention middleware.
        // I will try to be robust. 
        // I will use a separate layout for the protected area.
        // Let's reorganize app structure:
        // app/(admin-auth)/admin/login/page.tsx
        // app/(admin-protected)/admin/dashboard/page.tsx etc.
        // But user asked for /admin/login inside /admin structure.
        // I will simpler solution:
        // Put "AdminLayout" in `app/admin/layout.tsx`.
        // It will check cookies. 
        // BUT we need to EXCLUDE /admin/login.
        // Since we can't easily exclude in layout, I'll use a Route Group:
        // app/admin/(auth)/login/page.tsx
        // app/admin/(dashboard)/layout.tsx <- protection here
        // app/admin/(dashboard)/page.tsx
        // This keeps URLs clean: /admin/login, /admin
    }

    // Assuming I can't reorganize easily without rethinking paths,
    // I'll stick to the plan: /admin/layout.tsx.
    // I will check if headers().get('next-url') or something works, but unreliable.
    // Best approach without middleware: check in each protected page or use a layout that only wraps protected pages.
    // I will create `app/admin/(protected)/layout.tsx` for the protection.
    // And move dashboard pages into `app/admin/(protected)/`.
    // And login page at `app/admin/login/page.tsx` (outside protected group).
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

// I will create the protected layout separately.
