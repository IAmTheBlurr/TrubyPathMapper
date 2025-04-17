import React from 'react';
import type { Beat } from '@data/beats';

export interface BreadcrumbProps {
    /** Ordered path of visited beats. */
    path: readonly Beat[];
    /** Jump/cut to arbitrary index (soft‑undo). */
    onJump: (index: number) => void;
}

/**
 * Horizontally scrollable chip rail showing the traversal history.
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onJump }) => (
    <nav className="flex items-center gap-2 overflow-x-auto py-1">
        {path.map((b, i) => (
            <button
                key={b.id + '-' + i}
                type="button"
                onClick={() => onJump(i)}
                className="flex-shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
            >
                {b.id}
            </button>
        ))}
    </nav>
);

export default Breadcrumb;
