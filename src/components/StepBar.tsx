import React from 'react';
import { CoreStep, STEP_ORDER } from '@data/beats';

/** Consistent hue mapping shared across components */
const STEP_COLOURS: Record<CoreStep, string> = {
    'Weakness & Need': 'indigo',
    Desire: 'sky',
    Opponent: 'rose',
    Plan: 'emerald',
    Battle: 'orange',
    ' Self Revelation': 'violet',
    'New Equilibrium': 'amber',
};

export interface StepBarProps {
    /** Set of steps that already have ≥1 beat executed. */
    fulfilled: ReadonlySet<CoreStep>;
    /** Current active step (highlighted). */
    current: CoreStep;
}

/**
 * Thin top bar segmented into seven equal flex children, colouring progress.
 */
export const StepBar: React.FC<StepBarProps> = ({ fulfilled, current }) => (
    <div className="flex w-full h-2 rounded overflow-hidden bg-slate-200 dark:bg-slate-700">
        {(Object.keys(STEP_ORDER) as CoreStep[])
            .sort((a, b) => STEP_ORDER[a] - STEP_ORDER[b])
            .map((step) => {
                const hue = STEP_COLOURS[step];
                const isDone = fulfilled.has(step);
                const isCurrent = step === current;
                let cls = '';
                if (isDone) cls = `bg-${hue}-500 dark:bg-${hue}-600`;
                if (isCurrent) cls = `bg-${hue}-700 dark:bg-${hue}-400`;
                return <div key={step} className={`flex-1 transition-colors ${cls}`} />;
            })}
    </div>
);

export default StepBar;
