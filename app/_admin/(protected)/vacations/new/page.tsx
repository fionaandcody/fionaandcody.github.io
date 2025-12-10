'use client';

import VacationForm from '../_components/VacationForm';

export default function NewVacationPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="font-serif text-3xl font-bold text-stone-800 mb-8">Create New Vacation</h1>
            <VacationForm />
        </div>
    );
}
