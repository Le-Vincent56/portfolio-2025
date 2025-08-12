'use client';
import { useMemo, useState } from 'react';
import { Album } from '@/lib/types';
import AlbumCard from '@/components/audio/AlbumCard';
import { usePlayer } from '@/components/audio/PlayerProvider';
import { motion } from 'framer-motion';

export default function AudioSection({ albums }: { albums: Album[] }) {
    const [expanded, setExpanded] = useState(false);
    const [openIds, setOpenIds] = useState<Set<string>>(new Set());
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
                <h2 className="text-3xl font-semibold">Audio</h2>
                {expanded && (
                    <button className="text-sm text-white/80 hover:text-white" onClick={() => setExpanded(false)}>
                        Hide
                    </button>
                )}
            </div>

            <motion.div layout className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,3fr))] gap-6">
                {visible.map((a) => (
                    <AlbumCard
                        key={a.id}
                        album={a}
                        isOpen={openIds.has(a.id)}
                        onToggleAction={() => toggleOpen(a.id)}
                        onPlayAction={(idx) => p.setQueue(a.tracks, idx)}
                    />
                ))}
            </motion.div>

            {!expanded && albums.length > 6 && (
                <div className="mt-4 flex justify-end">
                    <button className="text-sm text-white/80 hover:text-white" onClick={() => setExpanded(true)}>
                        View All
                    </button>
                </div>
            )}
        </section>
    );
}
