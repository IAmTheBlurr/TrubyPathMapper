import React, { useState } from 'react';
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandGroup,
    CommandEmpty,
} from 'cmdk';
import type { Beat } from '@data/beats';

export interface CommandPaletteProps {
    /** callback invoked when user selects a beat (ADVANCE). */
    onSelectBeat: (beat: Beat) => void;
    /** export handler returns void (e.g., triggers download). */
    onExport: () => void;
}

/**
 * Custom command palette using cmdk (⌘K).
 */
export const CommandPalette: React.FC<CommandPaletteProps & { children: React.ReactNode }> = ({ children, onSelectBeat, onExport }) => {
    const [open, setOpen] = useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        window.addEventListener('keydown', down);
        return () => window.removeEventListener('keydown', down);
    }, []);

    const actions = [
        {
            id: 'toggle',
            label: 'Export story JSON',
            action: () => onExport(),
        },
        ...Array.from({ length: 22 }, (_, i) => ({
            id: `beat-${i + 1}`,
            label: `Jump to beat ${i + 1}`,
            action: () => onSelectBeat({ id: i + 1 } as Beat),
        })),
    ];

    return (
      <>
          {children}
          {open && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
                <div className="w-full max-w-xl mx-auto mt-40 rounded-xl bg-white dark:bg-slate-800 shadow-xl">
                    <Command loop shouldFilter defaultValue="">
                        <CommandInput
                          autoFocus
                          placeholder="Type a command or beat number…"
                          className="w-full p-4 text-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                        <CommandList className="max-h-80 overflow-y-auto">
                            <CommandEmpty className="p-4 text-sm text-slate-500 dark:text-slate-400">
                                No results
                            </CommandEmpty>
                            <CommandGroup heading="Beats">
                                {actions.map((item) => (
                                  <CommandItem
                                    key={item.id}
                                    value={item.label}
                                    onSelect={() => {
                                        item.action();
                                        setOpen(false);
                                    }}
                                    className="px-4 py-3 cursor-pointer text-sm hover:bg-indigo-600 hover:text-white"
                                  >
                                      {item.label}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            </div>
          )}
      </>
    );
};

export default CommandPalette;
