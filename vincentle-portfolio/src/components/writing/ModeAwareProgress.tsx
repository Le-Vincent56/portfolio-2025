'use client';
import { useEffect, useState } from 'react';
import ReadingProgress from '@/components/writing/ReadingProgress';

export default function ModeAwareProgress({ targetId }: { targetId: string }) {
    const [mode, setMode] = useState<'scroll'|'paged'>('paged');
    useEffect(() => {
        const el = document.getElementById('reader-container');
        if (!el) return;
        const obs = new MutationObserver(() => {
            setMode((el.getAttribute('data-mode') as 'scroll'|'paged') ?? 'paged');
        });
        setMode((el.getAttribute('data-mode') as 'scroll'|'paged') ?? 'paged');
        obs.observe(el, { attributes: true, attributeFilter: ['data-mode'] });
        return () => obs.disconnect();
    }, []);
    if (mode !== 'scroll') return null;
    return <ReadingProgress targetId={targetId} />;
}