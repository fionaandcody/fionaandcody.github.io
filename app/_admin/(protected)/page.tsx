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
                <div className="p-6 bg-white rounded-lg border border-stone-200 opacity-50">
                    <h3 className="font-semibold text-lg mb-2">Manage Story (Coming Soon)</h3>
                    <p className="text-stone-500 text-sm">Edit 'Our Story' content.</p>
                </div>
            </div>
        </div>
    );
}
