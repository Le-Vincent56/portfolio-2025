'use client';
import { useEffect, useState } from 'react';

export default function CompactMetaBar({
    title,
    author,
    minutes,
    sentinelId = 'hero-meta-sentinel',
}: {
    title: string;
    author?: string;
    minutes: number;
    sentinelId?: string;
}) {
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState<'scroll' | 'paged'>('paged');

    useEffect(() => {
        const host = document.getElementById('reader-container');
        if (!host) return;
        const obs = new MutationObserver(() => {
            setMode((host.getAttribute('data-mode') as 'scroll' | 'paged') ?? 'paged');
        });
        setMode((host.getAttribute('data-mode') as 'scroll' | 'paged') ?? 'paged');
        obs.observe(host, { attributes: true, attributeFilter: ['data-mode'] });
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const sentinel = document.getElementById(sentinelId);
        if (!sentinel) return;
        const io = new IntersectionObserver(
            (entries) => setShow(!entries[0].isIntersecting),
            { threshold: 0.01 }
        );
        io.observe(sentinel);
        return () => io.disconnect();
    }, [sentinelId]);

    if (!(show && mode === 'scroll')) return null;

    return (
        <div className="fixed left-0 right-0 top-2 z-40 flex justify-center px-3">
            <div className="max-w-3xl flex-1 rounded-xl border border-white/10 bg-background/80 px-3 py-2 text-sm text-white/80 backdrop-blur">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="truncate">{title}</div>
                    {author && <div className="opacity-70 truncate">• {author}</div>}
                    <div className="opacity-70">• {minutes} min</div>
                </div>
            </div>
        </div>
    );
}