/*
 * Truby Beat Explorer – Beat Metadata
 * -----------------------------------
 * Single source‑of‑truth for the 22 Story Beats and their association with
 * the 7 Core Steps. All logic files import from here.
 */

/**
 * Enumeration of Truby’s immutable Core Steps in canonical order.
 */
export enum CoreStep {
    WeaknessNeed = "Weakness & Need",
    Desire = "Desire",
    Opponent = "Opponent",
    Plan = "Plan",
    Battle = "Battle",
    SelfRevelation = " Self Revelation",
    NewEquilibrium = "New Equilibrium",
}

/**
 * Structural metadata for a single Beat.
 */
export interface Beat {
    /** Serial index (1‑22) – stable reference ID. */
    readonly id: number;
    /** Short label rendered in UI. */
    readonly label: string;
    /** Host core step. */
    readonly step: CoreStep;
    /** Whether this beat may legally recur. */
    readonly repeatable?: boolean;
    /** Max repeats allowed if repeatable (undefined ⇒ infinite). */
    readonly maxRepeats?: number;
    /** Family tag used by guards to enforce escalation sequencing. */
    readonly familyId?: string;
    /** Array of beat IDs that must precede this one. */
    readonly preconditions?: readonly number[];
}

/**
 * Canonical 22‑beat array – **do not reorder**; guards rely on index.
 */
export const BEATS: readonly Beat[] = [
    { id: 1, label: "Self‑Rev. (foreshadow)", step: CoreStep.SelfRevelation },
    { id: 2, label: "Ghost & World", step: CoreStep.WeaknessNeed },
    { id: 3, label: "Weakness & Need", step: CoreStep.WeaknessNeed },
    { id: 4, label: "Inciting Event", step: CoreStep.Desire },
    { id: 5, label: "Desire Declared", step: CoreStep.Desire },
    { id: 6, label: "Ally Enters", step: CoreStep.Plan },
    { id: 7, label: "Opponent / Mystery", step: CoreStep.Opponent },
    { id: 8, label: "Fake‑Ally Opp.", step: CoreStep.Opponent },
    { id: 9, label: "1st Revelation", step: CoreStep.Desire, repeatable: true, familyId: "revelation", maxRepeats: 3 },
    { id: 10, label: "Plan Forged", step: CoreStep.Plan },
    { id: 11, label: "Opp. Counter‑Plan", step: CoreStep.Opponent, repeatable: true, familyId: "counter" },
    { id: 12, label: "Drive", step: CoreStep.Plan },
    { id: 13, label: "Ally Attacks", step: CoreStep.Opponent },
    { id: 14, label: "Apparent Defeat", step: CoreStep.Opponent },
    { id: 15, label: "2nd Revelation", step: CoreStep.Desire, repeatable: true, familyId: "revelation" },
    { id: 16, label: "Audience Revelation", step: CoreStep.SelfRevelation },
    { id: 17, label: "3rd Revelation", step: CoreStep.Desire, repeatable: true, familyId: "revelation" },
    { id: 18, label: "Gate / Gauntlet", step: CoreStep.Battle },
    { id: 19, label: "Battle", step: CoreStep.Battle },
    { id: 20, label: " Self Revelation", step: CoreStep.SelfRevelation },
    { id: 21, label: "Moral Decision", step: CoreStep.NewEquilibrium },
    { id: 22, label: "New Equilibrium", step: CoreStep.NewEquilibrium },
] as const;

/**
 * Lookup map: CoreStep → ordinal order (1‑7). Used by guards to enforce
 * step‑order invariant.
 */
export const STEP_ORDER: Readonly<Record<CoreStep, 1 | 2 | 3 | 4 | 5 | 6 | 7>> = {
    [CoreStep.WeaknessNeed]: 1,
    [CoreStep.Desire]: 2,
    [CoreStep.Opponent]: 3,
    [CoreStep.Plan]: 4,
    [CoreStep.Battle]: 5,
    [CoreStep.SelfRevelation]: 6,
    [CoreStep.NewEquilibrium]: 7,
} as const;
