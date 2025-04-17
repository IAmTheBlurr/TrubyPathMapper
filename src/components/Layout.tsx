import React, { useMemo, useEffect } from 'react';
import { useActorRef, useSelector } from '@xstate/react';
import { storyMachine, legalSuccessors } from '@logic/machine';
import { persistStory, loadStory } from '@logic/store';
import { usePrefs } from '@logic/store';
import BeatCard from './BeatCard';
import NextPalette from './NextPalette';
import Breadcrumb from './Breadcrumb';
import StepBar from './StepBar';
import GraphDrawer from './GraphDrawer';
import CommandPalette from './CommandPalette';
import { BEATS, CoreStep } from '@data/beats';

/**
 * Root layout grid that wires engine, UI components, prefs and persistence.
 */
export const Layout: React.FC = () => {
    /* ----------------------------------------------------------- Engine init */
    const service = useActorRef(storyMachine, {
        input: loadStory(),
    });

    /** hot‑persist on transition */
    useEffect(() => {
        const sub = service.subscribe((snapshot) => {
            persistStory(snapshot.context);
        });
        return () => sub.unsubscribe();
    }, [service]);

    /* ----------------------------------------------------------- Selectors */
    const ctx = useSelector(service, (s) => s.context);
    const currentBeatId = ctx.path[ctx.path.length - 1] ?? 2; // default Ghost
    const currentBeat = useMemo(() => BEATS.find((b) => b.id === currentBeatId)!, [currentBeatId]);
    const successors = useMemo(() => legalSuccessors(ctx), [ctx]);

    const fulfilledSteps = useMemo(() => new Set(ctx.path.map((id) => BEATS[id - 1].step)), [ctx.path]);

    /* ----------------------------------------------------------- Prefs */
    const prefs = usePrefs();
    // dark‑mode side‑effect
    useEffect(() => {
        const root = document.documentElement;
        const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const wantsDark = prefs.theme === 'dark' || (prefs.theme === 'system' && sysDark);
        root.classList.toggle('dark', wantsDark);
    }, [prefs.theme]);

    /* ----------------------------------------------------------- Handlers */
    const advance = (beatId: number) => service.send({ type: 'ADVANCE', beatId });
    const undoTo = (index: number) => {
        while (ctx.path.length - 1 >= index) service.send({ type: 'UNDO' });
    };

    /* ----------------------------------------------------------- Render */
    return (
        <CommandPalette onSelectBeat={(b) => advance(b.id)} onExport={() => {/* TODO export */}}>
            <div className="min-h-screen flex flex-col">
                {/* Step bar */}
                <div className="p-2"><StepBar fulfilled={fulfilledSteps} current={currentBeat.step as CoreStep} /></div>

                {/* Breadcrumb */}
                <div className="px-4"><Breadcrumb path={ctx.path.map((i) => BEATS[i - 1])} onJump={undoTo} /></div>

                {/* Main grid */}
                <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-6 p-4">
                    <BeatCard beat={currentBeat} />
                    <NextPalette options={successors} onSelect={(b) => advance(b.id)} />
                </main>

                {/* Graph drawer and toggle via prefs */}
                {prefs.showGraph && <GraphDrawer path={ctx.path.map((i) => BEATS[i - 1])} />}
            </div>
        </CommandPalette>
    );
};

export default Layout;
