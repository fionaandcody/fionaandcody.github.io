'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ id }: { id: number }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this vacation?')) return;
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/vacations?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
        >
            {isDeleting ? '...' : 'Delete'}
        </button>
    );
}
