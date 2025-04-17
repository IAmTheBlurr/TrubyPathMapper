/**
 * Zustand global store – UI preferences + helper utilities for persisting
 * the **StoryContext** produced by the XState engine.
 *
 * This file intentionally remains UI‑agnostic; React components consume the
 * hooks exported here, keeping state management decoupled from presentation.
 */

import { create } from 'zustand';
// import { persist, subscribeWithSelector } from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import type { StoryContext } from './machine';

/* ------------------------------------------------------------------------- *
 * UI Preferences
 * ------------------------------------------------------------------------- */

export type ThemeMode = 'system' | 'light' | 'dark';

interface PrefsState {
    /** Whether Cytoscape drawer is open. */
    showGraph: boolean;
    toggleGraph: () => void;

    /** Dark‑mode preference. */
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
}

/**
 * `usePrefs` – consumed by layout components for responsive behaviour.
 */
export const usePrefs = create<PrefsState>()(
    persist(
        (set) => ({
            showGraph: false,
            toggleGraph: () => set((s) => ({ showGraph: !s.showGraph })),
            theme: 'system',
            setTheme: (mode) => set({ theme: mode }),
        }),
        { name: 'tpm-prefs' },
    ),
);

/* ------------------------------------------------------------------------- *
 * Story Path Persistence Utilities
 * ------------------------------------------------------------------------- */

const STORY_KEY = 'tpm-story';

/**
 * Persist current **StoryContext** to `localStorage`.
 */
export function persistStory(ctx: StoryContext): void {
    try {
        localStorage.setItem(STORY_KEY, JSON.stringify(ctx));
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to persist story', err);
    }
}

/**
 * Retrieve last saved StoryContext, or undefined if none.
 */
export function loadStory(): StoryContext | undefined {
    try {
        const raw = localStorage.getItem(STORY_KEY);
        return raw ? (JSON.parse(raw) as StoryContext) : undefined;
    } catch {
        return undefined;
    }
}

/**
 * Helper that wires persistence to any XState service – call once in root.
 *
 * ```ts
 * const service = useInterpret(storyMachine, { context: loadStory() });
 * subscribeStoryPersistence(service);
 * ```
 */
// export function subscribeStoryPersistence(service: { subscribe: any; state: any }): void {
//     // Use zustand's subscribeWithSelector‑style immediate callback.
//     return subscribeWithSelector(() => service.state, () => {
//         persistStory(service.state.context as StoryContext);
//     });
// }
