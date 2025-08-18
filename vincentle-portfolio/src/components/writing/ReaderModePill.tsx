'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ScrollText, MoreHorizontal } from 'lucide-react';

type Mode = 'scroll' | 'paged';

export default function ReaderModePill({
    targetId = 'reader-container',
    defaultMode = 'paged' as Mode,
}: { targetId?: string; defaultMode?: Mode }) {
    const [mode, setMode] = useState<Mode>(defaultMode);
    const [menuOpen, setMenuOpen] = useState(false);

    // Init from URL/localStorage
    useEffect(() => {
        const url = new URL(window.location.href);
        const fromUrl = (url.searchParams.get('mode') as Mode) || null;
        const fromStore = (localStorage.getItem('reader-mode') as Mode) || null;
        applyMode(fromUrl || fromStore || defaultMode, false);
    }, []);

    function applyMode(next: Mode, persist = true) {
        const host = document.getElementById(targetId);
        const paged = document.getElementById('reader-paged');
        const scroll = document.getElementById('reader-scroll');
        if (!host || !paged || !scroll) return;

        host.setAttribute('data-mode', next);
        paged.hidden = next !== 'paged';
        scroll.hidden = next !== 'scroll';

        setMode(next);
        if (persist) {
            const url = new URL(window.location.href);
            url.searchParams.set('mode', next);
            window.history.replaceState({}, '', url.toString());
            localStorage.setItem('reader-mode', next);
        }
    }

    return (
        <div className="fixed right-4 top-4 z-40">
            {/* Desktop pill */}
            <div className="hidden sm:block">
                <div className="relative rounded-full border border-white/10 bg-background/70 p-1 backdrop-blur">
                    <div className="relative flex items-center gap-1">
                        <button
                            aria-label="Paged mode"
                            onClick={() => applyMode('paged')}
                            className="relative grid h-9 w-9 place-items-center rounded-full text-text/80 
                            hover:bg-white/5 focus:outline-none"
                        >
                            {mode === 'paged' && (
                                <motion.span
                                    layoutId="modeDot"
                                    className="absolute inset-0 rounded-full bg-primary/40"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <BookOpen size={18} />
                        </button>

                        <button
                            aria-label="Scroll mode"
                            onClick={() => applyMode('scroll')}
                            className="relative grid h-9 w-9 place-items-center rounded-full text-text/80 
                            hover:bg-white/5 focus:outline-none"
                        >
                            {mode === 'scroll' && (
                                <motion.span
                                    layoutId="modeDot"
                                    className="absolute inset-0 rounded-full bg-primary/40"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <ScrollText size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile: “…” → small popover */}
            <div className="sm:hidden">
                <div className="relative">
                    <button
                        aria-label="Reader options"
                        onClick={() => setMenuOpen(v => !v)}
                        className="rounded-full border border-white/10 bg-background/70 p-2 
                        text-white/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/30"
                    >
                        <MoreHorizontal size={18} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-28 rounded-lg border border-white/10 bg-background/90 p-1 text-sm text-white/80 backdrop-blur">
                            <button
                                onClick={() => { applyMode('paged'); setMenuOpen(false); }}
                                className={`flex w-full items-center gap-2 rounded px-2 py-1 ${mode === 'paged' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
                            >
                                <BookOpen size={16} /> Paged
                            </button>
                            <button
                                onClick={() => { applyMode('scroll'); setMenuOpen(false); }}
                                className={`mt-1 flex w-full items-center gap-2 rounded px-2 py-1 ${mode === 'scroll' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
                            >
                                <ScrollText size={16} /> Scroll
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}