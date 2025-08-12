'use client';

import { Album } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play as PlayIcon, Pause as PauseIcon } from 'lucide-react';
import { usePlayer } from '@/components/audio/PlayerProvider';

const fmt = (s?: number) => {
    if (!s || s <= 0) return '--:--';
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2,'0')}`;
};

const HEADER_PX = 96;

export default function AlbumCard({
        album,
        isOpen,
        onToggleAction,
        onPlayAction,
    }: {
        album: Album;
        isOpen: boolean;
        onToggleAction: () => void;
        onPlayAction: (trackIndex: number) => void;
    }) {
    const p = usePlayer();
    const currentTrackId = p.queue[p.index]?.id;

    return (
        <motion.div
            data-open={isOpen ? 'true' : 'false'}
            layout
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0F1016]"
            style={{
                width: "var(--album-card-size)",
                height: "var(--album-card-size)",
            }}
        >
            {/* Cover window: its height animates, image inside stays centered and unsquashed */}
            <motion.button
                type="button"
                onClick={onToggleAction}
                aria-expanded={isOpen}
                aria-label={isOpen ? `Collapse ${album.title}` : `Expand ${album.title}`}
                className="absolute inset-0 cursor-pointer"
                style={{ lineHeight: 0 }}
            >
                <motion.div
                    layout
                    transition={{ duration: 0.32, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 overflow-hidden z-20"
                    style={{ top: 0, height: isOpen ? HEADER_PX : '100%' }}
                >
                    <img
                        src={album.cover}
                        alt=""
                        className="cover-img h-full w-full object-cover"
                    />
                    {!isOpen && <div className="absolute inset-0 bg-black/20" />}
                    <div className="absolute left-3 bottom-3 p-3 font-semibold text-2xl">
                        {album.title}
                    </div>
                </motion.div>
            </motion.button>

            {/* Track list: fills the remaining area INSIDE the same square */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="tracks"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="absolute inset-x-0 bottom-0 z-10"
                        style={{ top: HEADER_PX }}
                    >
                        <div
                            className="h-full overflow-y-auto modern-scrollbar bg-white/5 backdrop-blur-sm"
                            style={{ scrollbarGutter: 'stable both-edges' }}
                        >
                            {album.tracks.map((t, i) => {
                                const isCurrent = currentTrackId === t.id;
                                const isActive = isCurrent && p.playing;

                                return (
                                    <div
                                        key={t.id}
                                        role="option"
                                        aria-selected={isActive}
                                        className={`flex w-full items-center ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
                                        onDoubleClick={() => {
                                            // double‑click: restart if current+playing, else play this row
                                            if (isCurrent && p.playing) p.seek(0);
                                            else onPlayAction(i);
                                        }}
                                    >
                                        <div className="pl-3 py-2">
                                            <div className="h-8 w-8 overflow-hidden rounded-md bg-white/10">
                                                <img src={album.cover} alt="" className="h-full w-full object-cover" />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 truncate text-sm px-3 py-2">{t.title}</div>

                                        <div className="text-xs tabular-nums text-white/70 px-3 py-2">
                                            {fmt((t as any).duration)}
                                        </div>

                                        <button
                                            className="rounded-md p-1.5 mr-3 my-1 hover:bg-white/10"
                                            aria-label={isActive ? 'Pause' : 'Play'}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isCurrent) {
                                                    p.toggle();        // toggle play/pause on the current track
                                                } else {
                                                    onPlayAction(i);         // replace queue with this album and start at i
                                                }
                                            }}
                                        >
                                            {/* swap for your icons */}
                                            {isActive ? '⏸' : '▶'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
