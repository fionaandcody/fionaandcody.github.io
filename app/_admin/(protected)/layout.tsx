import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
        redirect('/admin/login');
    }

    return <>{children}</>;
}
