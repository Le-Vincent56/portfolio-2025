'use client';
import { useMemo, useState } from 'react';
import { Album } from '@/lib/types';
import AlbumCard from '@/components/audio/AlbumCard';
import { usePlayer } from '@/components/audio/PlayerProvider';
import { motion } from 'framer-motion';
import clsx from "clsx";

export default function AudioSection({ albums }: { albums: Album[] }) {
    const [expanded, setExpanded] = useState(false);
    const [openIds, setOpenIds] = useState<Set<string>>(new Set());
    const [hoveredID, setHoveredID] = useState<string | null>(null);
    const p = usePlayer();

    const visible = useMemo(() => expanded ? albums : albums.slice(0, 6), [expanded, albums]);

    const toggleOpen = (id: string) => {
        setOpenIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <section id="audio">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-semibold">AUDIO</h2>
                {expanded && (
                    <button className="text-sm text-text/80 hover:text-text" onClick={() => setExpanded(false)}>
                        Hide
                    </button>
                )}
            </div>

            <motion.div className={clsx(
                'grid gap-6', // space between cards
                'grid-cols-1', // mobile default
                'sm:grid-cols-2', // 2 columns for small screens
                'lg:grid-cols-3'  // 3 columns for large screens
            )}
            >
                {visible.map((a) => {
                        const isDimmed = !!hoveredID && hoveredID !== a.id;
                        return (
                            <AlbumCard
                                key={a.id}
                                album={a}
                                isOpen={openIds.has(a.id)}
                                isDimmed={isDimmed}
                                onToggleAction={() => toggleOpen(a.id)}
                                onPlayAction={(idx) => p.setQueue(
                                    a.tracks.map(t => ({...t, albumTitle: a.title, albumCover: a.cover})),
                                    idx
                                )}
                                onHoverStartAction={() => setHoveredID(a.id)}
                                onHoverEndAction={() => setHoveredID(null)}
                                onFocusAction={() => setHoveredID(a.id)}
                                onBlurAction={() => setHoveredID(null)}
                            />
                        )
                    }
                )}
            </motion.div>

            {!expanded && albums.length > 6 && (
                <div className="mt-4 flex justify-end">
                    <button className="text-sm text-text/80 hover:text-text" onClick={() => setExpanded(true)}>
                        View All
                    </button>
                </div>
            )}
        </section>
    );
}
