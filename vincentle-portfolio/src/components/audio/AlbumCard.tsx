'use client';

import { Album } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play as PlayIcon, Pause as PauseIcon } from 'lucide-react';
import { usePlayer } from '@/components/audio/PlayerProvider';
import { useEffect, useState } from 'react';

const fmt = (s?: number) => {
    if (!s || s <= 0) return '--:--';
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${r.toString().padStart(2, '0')}`;
};

const HEADER_PX = 96;
const HEADER_DURATION = 0.32;

export default function AlbumCard({
        album,
        isOpen,
        isDimmed = false,
        onToggleAction,
        onPlayAction,
        onHoverStartAction,
        onHoverEndAction,
        onFocusAction,
        onBlurAction,
    }: {
        album: Album;
        isOpen: boolean;
        isDimmed: boolean;
        onToggleAction: () => void;
        onPlayAction: (trackIndex: number) => void;
        onHoverStartAction?: () => void;
        onHoverEndAction?: () => void;
        onFocusAction?: () => void;
        onBlurAction?: () => void;
    }) {
    const p = usePlayer();
    const currentTrackId = p.queue[p.index]?.id;

    // delay track list mount so the squash looks clean
    const [showList, setShowList] = useState(isOpen);
    useEffect(() => {
        if (isOpen) {
            const id = setTimeout(() => setShowList(true), HEADER_DURATION * 1000);
            return () => clearTimeout(id);
        } else {
            setShowList(false);
        }
    }, [isOpen]);

    return (
        <motion.div
            data-open={isOpen ? 'true' : 'false'}
            layout
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0F1016] 
                ring-2 ring-transparent hover:ring-[var(--brand)]
                ring-offset-2 ring-offset-[#0D0E11]
                transition-colors duration-300 ease-out"
            onMouseEnter={onHoverStartAction}
            onMouseLeave={onHoverEndAction}
            onFocus={onFocusAction}
            onBlur={onBlurAction}
        >
            {/* COVER WINDOW */}
            <motion.button
                type="button"
                onClick={onToggleAction}
                aria-expanded={isOpen}
                className="absolute inset-0 cursor-pointer"
                style={{ lineHeight: 0 }}
                animate={{
                    opacity: isDimmed ? 0.4 : 1,
                    filter: isDimmed ? 'grayscale(50%)' : 'none',
                }}
            >
                <motion.div
                    initial={false}
                    animate={{ height: isOpen ? HEADER_PX : '100%' }}
                    transition={{ duration: HEADER_DURATION, ease: 'easeInOut' }}
                    className="absolute left-0 right-0 top-0 overflow-hidden z-20"
                    style={{ willChange: 'height' }}
                >
                    <img src={album.cover} alt="" className="h-full w-full object-cover cover-img" />

                    {/* Bottom gradient on the unopened card so the title reads well */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

                    {/* Readability overlay between image and album name when open */}
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: HEADER_DURATION, ease: 'easeInOut' }}
                            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/45 to-transparent"
                        />
                    )}

                    {/* Animate title chip position & padding with the squash */}
                    <motion.div
                        initial={false}
                        animate={{
                            bottom: isOpen ? 4 : 12, // px
                            padding: isOpen ? 4 : 12, // px
                        }}
                        transition={{ duration: HEADER_DURATION, ease: 'easeInOut' }}
                        className="absolute left-3 font-semibold text-2xl"
                        style={{ lineHeight: 1.1 }}
                    >
                        {album.title}
                    </motion.div>
                </motion.div>
            </motion.button>

            {/* TRACK LIST */}
            <AnimatePresence initial={false}>
                {showList && (
                    <motion.div
                        key="tracks"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.24, ease: 'easeInOut' }}
                        className="absolute inset-x-0 bottom-0 z-10"
                        style={{ top: HEADER_PX }}
                    >
                        <div className="h-full bg-white/5 backdrop-blur-sm">
                            <div className="h-full overflow-y-auto modern-scrollbar scroll-overlay">
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
                                                if (isCurrent && p.playing) p.seek(0);
                                                else onPlayAction(i);
                                            }}
                                            style={{ height: 64 }}
                                        >
                                            {/* tiny cover */}
                                            <div className="pl-3">
                                                <div className="h-8 w-8 overflow-hidden rounded-md bg-white/10">
                                                    <img src={album.cover} alt="" className="h-full w-full object-cover" />
                                                </div>
                                            </div>

                                            {/* title */}
                                            <div className="flex-1 min-w-0 truncate text-sm px-3">{t.title}</div>

                                            {/* duration */}
                                            <div className="text-xs tabular-nums text-white/70 px-3">
                                                {fmt((t as any).duration)}
                                            </div>

                                            {/* play/pause toggle */}
                                            <button
                                                className="rounded-md p-1.5 mr-3 hover:bg-white/10 cursor-pointer"
                                                aria-label={isActive ? 'Pause' : 'Play'}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    isCurrent ? p.toggle() : onPlayAction(i);
                                                }}
                                            >
                                                <span className="sr-only">{isActive ? 'Pause' : 'Play'}</span>
                                                {isActive ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
