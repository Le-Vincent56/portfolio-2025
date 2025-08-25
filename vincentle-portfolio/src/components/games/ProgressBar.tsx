"use client";

import { useEffect, useState } from "react";

export default function ProgressBar() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const h = document.documentElement;
            const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
            setProgress(Math.max(0, Math.min(1, scrolled)));
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div className="fixed inset-x-0 top-0 z-40 h-0.5 bg-transparent pointer-events-none">
            <div
                className="h-full bg-primary transition-[width] duration-200 ease-in-out"
                style={{ width: `${progress * 100}%` }}
                aria-hidden
            />
        </div>
    );
}