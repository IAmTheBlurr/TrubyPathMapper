import React, { useState } from 'react';
import type { Beat, CoreStep } from '@data/beats';

/** Shared step‑to‑colour mapping (should match NextPalette). */
const STEP_COLOURS: Record<CoreStep, string> = {
    'Weakness & Need': 'indigo',
    Desire: 'sky',
    Opponent: 'rose',
    Plan: 'emerald',
    Battle: 'orange',
    ' Self Revelation': 'violet',
    'New Equilibrium': 'amber',
};

function stepTag(step: CoreStep): JSX.Element {
    const hue = STEP_COLOURS[step];
    return (
        <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide bg-${hue}-200 dark:bg-${hue}-800 text-${hue}-900 dark:text-${hue}-100`}
        >
      {step}
    </span>
    );
}

export interface BeatCardProps {
    beat: Beat;
    /** Persisted note text for this beat */
    note?: string;
    onNoteChange?: (note: string) => void;
}

/**
 * Central panel showing current beat details + note‑taking field.
 */
export const BeatCard: React.FC<BeatCardProps> = ({ beat, note = '', onNoteChange }) => {
    const [draft, setDraft] = useState(note);

    // immediate local state; propagate upward debounced if consumer passes handler
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setDraft(val);
        onNoteChange?.(val);
    };

    return (
        <article className="rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-6 flex flex-col gap-4 max-w-xl">
            <header className="flex items-center gap-3">
                {stepTag(beat.step)}
                <h1 className="text-2xl font-bold leading-tight">
                    {beat.id}. {beat.label}
                </h1>
            </header>

            {/* Placeholder for future definition / tips */}
            <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                *(Definition forthcoming)*
            </p>

            <section className="flex flex-col gap-2">
                <label htmlFor="note" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Your Notes
                </label>
                <textarea
                    id="note"
                    className="w-full rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-2 resize-y min-h-[6rem] focus:ring-indigo-500 focus:border-indigo-500"
                    value={draft}
                    onChange={handleChange}
                    placeholder="Thoughts, scene ideas, conflicts…"
                />
            </section>
        </article>
    );
};

export default BeatCard;
