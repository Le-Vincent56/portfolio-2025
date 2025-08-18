'use client';
import { useEffect, useState } from 'react';

export default function BackToTop() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 480);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!show) return null;
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 rounded-full border 
            border-white/10 bg-background/80 px-3 py-2 text-sm 
            text-text/80 shadow backdrop-blur hover:bg-primary focus:outline-none focus:ring-2 focus:ring-text"
        >
            ↑ Top
        </button>
    );
}