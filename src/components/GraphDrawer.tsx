import React, { useEffect, useRef } from 'react';
import cytoscape, { Core } from 'cytoscape';
import { BEATS, STEP_ORDER, CoreStep } from '@data/beats';
import { usePrefs } from '@logic/store';
import type { Beat } from '@data/beats';

/** same hue table – keep in sync */
const STEP_COLOURS: Record<CoreStep, string> = {
    'Weakness & Need': '#6366f1',
    Desire: '#0ea5e9',
    Opponent: '#f43f5e',
    Plan: '#10b981',
    Battle: '#fb923c',
    ' Self Revelation': '#8b5cf6',
    'New Equilibrium': '#f59e0b',
};

export interface GraphDrawerProps {
    /** visited path */
    path: readonly Beat[];
}

/**
 * Lazy‑initialised Cytoscape mini‑map
 */
export const GraphDrawer: React.FC<GraphDrawerProps> = ({ path }) => {
    const { showGraph, toggleGraph } = usePrefs();
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<Core | null>(null);

    /** build cy instance once */
    useEffect(() => {
        if (!showGraph || !containerRef.current || cyRef.current) return;

        cyRef.current = cytoscape({
            container: containerRef.current,
            boxSelectionEnabled: false,
            style: [
                {
                    selector: 'node',
                    css: {
                        'background-color': 'data(color)',
                        label: 'data(label)',
                        'font-size': 8,
                        color: '#fff',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        width: 24,
                        height: 24,
                    },
                },
                { selector: 'edge', style: { width: 1, 'line-color': '#94a3b8' } },
                { selector: '.visited', style: { 'border-width': 3, 'border-color': '#fde047' } },
            ],
            elements: buildElements([]),
            layout: {
                name: 'breadthfirst',
                directed: true,
                spacingFactor: 1.8,
            },
        });
    }, [showGraph]);

    /** update visited class when path changes */
    useEffect(() => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.batch(() => {
            cy.nodes('.visited').removeClass('visited');
            path.forEach((b) => cy.$id(String(b.id)).addClass('visited'));
        });
    }, [path]);

    return (
        <aside
            className={`fixed inset-y-0 left-0 w-64 bg-slate-50 dark:bg-slate-900 shadow-lg transform transition-transform duration-300 ${
                showGraph ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <header className="p-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-sm font-semibold">Structure</h2>
                <button
                    type="button"
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-100"
                    onClick={toggleGraph}
                >
                    ✕
                </button>
            </header>
            <div ref={containerRef} className="h-full" />
        </aside>
    );
};

export default GraphDrawer;

/** helper to build cytoscape elements */
function buildElements(_: any): cytoscape.ElementDefinition[] {
    const nodes = BEATS.map((b) => ({
        data: {
            id: String(b.id),
            label: b.id,
            color: STEP_COLOURS[b.step],
        },
    }));
    const edges = BEATS.slice(0, -1).map((b, i) => ({
        data: { id: `e${b.id}`, source: String(b.id), target: String(BEATS[i + 1].id) },
    }));
    return [...nodes, ...edges];
}
