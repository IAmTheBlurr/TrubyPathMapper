import React from 'react';
import type { Beat, CoreStep } from '@data/beats';

/**
 * Tailwind colour ring for the seven Core Steps. Centralised here so that
 * all components can map `step → hue` consistently.
 */
const STEP_COLOURS: Record<CoreStep, string> = {
    'Weakness & Need': 'indigo',
    Desire: 'sky',
    Opponent: 'rose',
    Plan: 'emerald',
    Battle: 'orange',
    ' Self Revelation': 'violet',
    'New Equilibrium': 'amber',
};

/**
 * Utility – given a step returns a Tailwind class string for bg / text hues.
 */
function colourClasses(step: CoreStep): string {
    const hue = STEP_COLOURS[step];
    return `bg-${hue}-100 dark:bg-${hue}-900 text-${hue}-800 dark:text-${hue}-200`;
}

export interface NextPaletteProps {
    /** pre‑filtered legal successors from the engine */
    options: Beat[];
    /** callback when user commits a beat selection */
    onSelect: (beat: Beat) => void;
}

/**
 * Sidebar list rendering all legal next beats.
 * Non‑scroll view; uses vertical auto scroll on overflow.
 */
export const NextPalette: React.FC<NextPaletteProps> = ({ options, onSelect }) => (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh_-_8rem)] pr-1">
        {options.map((b) => (
            <button
                key={b.id}
                type="button"
                onClick={() => onSelect(b)}
                className={`group w-full rounded-lg px-3 py-2 text-left shadow-sm hover:shadow-md transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600 ${colourClasses(b.step)}`}
            >
                <span className="font-medium mr-1">{b.id}.</span>
                {b.label}
                {b.repeatable && (
                    <span className="ml-2 inline-block text-xs opacity-70 group-hover:opacity-100">↻</span>
                )}
            </button>
        ))}
    </div>
);

export default NextPalette;
