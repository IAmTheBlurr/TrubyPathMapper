/**
 * Finite‑state engine driving traversal logic for Truby Beat Explorer.
 * Uses **XState**; everything outside UI should interact through the exported
 * machine or the helper `legalSuccessors` utility.
 */

import { createMachine, assign, StateFrom } from 'xstate';
import { BEATS, STEP_ORDER, CoreStep, Beat } from '@data/beats';

/**
 * ----- Types -----
 */
export interface StoryContext {
    /** Ordered list of visited beat IDs. */
    readonly path: number[];
    /** Runtime repeat counts keyed by beat ID. */
    readonly repeatCounts: Record<number, number>;
    /** True once Gate (18) has been reached – locks funnel. */
    readonly gateReached: boolean;
}

export type StoryEvent =
    | { type: 'ADVANCE'; beatId: number }
    | { type: 'UNDO' };

/**
 * ----- Helpers -----
 */
const beatById = (id: number): Beat => {
    const b = BEATS.find((beat) => beat.id === id);
    if (!b) throw new Error(`Unknown beat id ${id}`);
    return b;
};

const currentBeat = (ctx: StoryContext): Beat | null =>
    ctx.path.length ? beatById(ctx.path[ctx.path.length - 1]) : null;

/**
 * Transition guard enforcing Step order, repeat, preconditions and Gate funnel.
 */
export function canTransition(ctx: StoryContext, targetId: number): boolean {
    const target = beatById(targetId);

    /* Gate funnel: once Gate (18) triggered, only 19→20→21→22 allowed */
    if (ctx.gateReached && targetId < 19) return false;

    const cur = currentBeat(ctx);
    if (cur) {
        // Step order invariant
        if (STEP_ORDER[target.step] < STEP_ORDER[cur.step]) return false;
    }

    // Repeat rules
    const count = ctx.repeatCounts[targetId] ?? 0;
    if (!target.repeatable && count > 0) return false;
    if (target.maxRepeats && count >= target.maxRepeats) return false;

    // Explicit pre‑conditions
    if (target.preconditions && !target.preconditions.every((id) => ctx.path.includes(id))) {
        return false;
    }

    return true;
}

/**
 * Compute list of legal next beats given current context.
 */
export const legalSuccessors = (ctx: StoryContext): Beat[] =>
    BEATS.filter((b) => canTransition(ctx, b.id));

/**
 * ----- Machine definition -----
 */
export const storyMachine = createMachine<StoryContext, StoryEvent>(
    {
        id: 'story',
        // schema: { context: {} as StoryContext, events: {} as StoryEvent },
        context: { path: [], repeatCounts: {}, gateReached: false } as StoryContext,
        // predictableActionArguments: true,
        // tsTypes: {} as import('./machine.typegen').Typegen0,
        initial: 'running',
        states: {
            running: {
                on: {
                    ADVANCE: {
                        guard: (ctx, ev) => canTransition(ctx, ev.beatId),
                        actions: 'advance',
                    },
                    UNDO: {
                        guard: (ctx) => ctx.path.length > 0,
                        actions: 'undo',
                    },
                },
            },
        },
    },
    {
        actions: {
            /**
             * Push target beat ID, update repeat counts and gate flag.
             */
            advance: assign((ctx, ev): Partial<StoryContext> => {
                const beatId = ev.beatId;
                const nextCounts = { ...ctx.repeatCounts, [beatId]: (ctx.repeatCounts[beatId] ?? 0) + 1 };
                return {
                    path: [...ctx.path, beatId],
                    repeatCounts: nextCounts,
                    gateReached: ctx.gateReached || beatId === 18,
                };
            }),

            /**
             * Remove most‑recent beat; adjust repeat counts and gate flag.
             */
            undo: assign((ctx): Partial<StoryContext> => {
                const newPath = ctx.path.slice(0, -1);
                const last = ctx.path[ctx.path.length - 1];
                const counts = { ...ctx.repeatCounts, [last]: ctx.repeatCounts[last] - 1 };
                if (counts[last] === 0) delete counts[last];
                const gateStill = newPath.includes(18);
                return { path: newPath, repeatCounts: counts, gateReached: gateStill };
            }),
        },
    },
);

/**
 * Convenience hook wrapper (react‑xstate) exports expected by UI layer.
 * Consumers import `useStory()` rather than dealing with xstate directly.
 */
export type StoryState = StateFrom<typeof storyMachine>;
