'use client';

import { createVacation } from '@/app/actions';
import VacationEditor from '../editor/VacationEditor';

export default function NewVacationPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-serif font-bold text-stone-800">New Adventure</h1>
            <VacationEditor action={createVacation} />
        </div>
    );
}
