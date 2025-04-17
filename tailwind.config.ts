import type { Config } from 'tailwindcss';

/**
 * Tailwind configuration for **Truby Path Mapper**.
 * Adds custom colour palette keys matching Core Steps and enables dark mode via
 * class strategy (`.dark`).  Purge paths use Vite defaults.
 */
export default {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                step: {
                    weakness: {
                        DEFAULT: '#6366f1', // indigo‑500
                    },
                    desire: {
                        DEFAULT: '#0ea5e9', // sky‑500
                    },
                    opponent: {
                        DEFAULT: '#f43f5e', // rose‑500
                    },
                    plan: {
                        DEFAULT: '#10b981', // emerald‑500
                    },
                    battle: {
                        DEFAULT: '#fb923c', // orange‑500
                    },
                    revelation: {
                        DEFAULT: '#8b5cf6', // violet‑500
                    },
                    equilibrium: {
                        DEFAULT: '#f59e0b', // amber‑500
                    },
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
