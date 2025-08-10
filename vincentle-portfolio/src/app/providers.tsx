'use client'
import React, {createContext, useContext, useEffect, useMemo, useRef, useState} from 'react';

export type Track = { id: string; title: string; src: string; album: string }

type PlayerCtx = {
    queue: Track[],
    index: number,
    playing: boolean,
    volume: number,
    setQueue: (q:Track[], startIndex?: number) => void,
    toggle: () => void,
    next: () => void,
    prev: () => void,
    setVolume: (v: number) => void,
}

const C = createContext<PlayerCtx | null>(null);

export const usePlayer = () => {
    const ctx = useContext(C);
    if(!ctx) throw new Error('usePlayer outside provider');
    return ctx;
}

export default function Providers({ children } : { children: React.ReactNode }) {
    const audio = useRef<HTMLAudioElement | null>(null);
    const [queue, setQ] = useState<Track[]>([]);
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [volume, setV] = useState(0.5);
    
    const setQueue = (q: Track[], startIndex = 0) => {
        setQ(q);
        setIndex(startIndex);
        setPlaying(true);
    }
    
    const next = () => setIndex(i => (i + 1 < queue.length ? i + 1 : 0));
    const prev = () => setIndex(i => (i - 1  >= 0 ? i - 1 : queue.length - 1));
    const toggle = () => setPlaying(p => !p);
    const setVolume = (v: number) => { 
        setV(v);
        if(!audio.current) return;
        audio.current.volume = v;
    }
    
    const value = useMemo(() => (
        { queue, index, playing, volume, setQueue, toggle, next, prev, setVolume }), 
        [queue, index, playing, volume]
    );

    let current = queue[index]
    
    // Add lock-screen controls
    useEffect(() => {
        current = queue[index]
        if ('mediaSession' in navigator && current) {
            navigator.mediaSession.metadata = new MediaMetadata({ title: current.title, artist: 'Vincent Le', album: current.album })
            navigator.mediaSession.setActionHandler('play', () => audio.current?.play())
            navigator.mediaSession.setActionHandler('pause', () => audio.current?.pause())
            navigator.mediaSession.setActionHandler('previoustrack', prev)
            navigator.mediaSession.setActionHandler('nexttrack', next)
        }
    }, [queue, index])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
            if (e.code === 'Space') { e.preventDefault(); toggle() }
            if (e.code === 'ArrowRight') next()
            if (e.code === 'ArrowLeft') prev()
            if (e.code === 'ArrowUp') setVolume(Math.min(1, volume + 0.05))
            if (e.code === 'ArrowDown') setVolume(Math.max(0, volume - 0.05))
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [toggle,next,prev,volume])
    
    return (
        <C.Provider value={value}>
            {children}
            {/* Sticky Player */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/70 backdrop-blur">
                <div className="mx-auto max-w-6xl h-20 px-6 flex items-center justify-between">
                    <div className="min-w-0">
                        <div className="font-medium truncate">{current?.title ?? 'Select a track'}</div>
                        <div className="text-xs text-white/60 truncate">{current?.album ?? '—'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={prev}>⏮</button>
                        <button onClick={toggle}>{playing ? '⏸' : '▶'}</button>
                        <button onClick={next}>⏭</button>
                        <input aria-label="volume" type="range" min={0} max={1} step={0.01} value={volume} onChange={e=>setVolume(parseFloat(e.target.value))}/>
                    </div>
                </div>
            </div>
            <audio
                ref={audio}
                src={current?.src}
                autoPlay={playing}
                onEnded={next}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
            />
        </C.Provider>
    )
}