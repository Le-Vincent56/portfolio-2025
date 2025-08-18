'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Hotkeys() {
    const router = useRouter();
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const tag = (e.target as HTMLElement)?.tagName;
            const enteringText = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
            if (enteringText) return;
            if (e.key === 'Escape') router.back();
            if (e.key.toLowerCase() === 't') window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [router]);
    return null;
}