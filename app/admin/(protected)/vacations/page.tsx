import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import DeleteButton from './_components/DeleteButton';

export default async function AdminVacationsPage() {
    const vacations = await prisma.vacation.findMany({
        orderBy: { startDate: 'desc' },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-serif text-3xl font-bold text-stone-800">Vacations</h1>
                <Link href="/admin/vacations/new" className="bg-stone-800 text-white px-4 py-2 rounded hover:bg-stone-700 transition-colors">
                    + New Vacation
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-stone-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-200">
                        {vacations.map((v) => (
                            <tr key={v.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-stone-900">{v.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-stone-500">{v.destination}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-stone-500">
                                    {new Date(v.startDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${v.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {v.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link href={`/admin/vacations/${v.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                    <DeleteButton id={v.id} />
                                </td>
                            </tr>
                        ))}
                        {vacations.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-stone-500">No vacations found. Create one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
